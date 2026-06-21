"""
Hermes Chat API — FastAPI entry point.
Handles visitor chat, SSE streaming, and background notification tasks.
"""
import asyncio
import json
import time
import uuid

from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, Request, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from config import CORS_ORIGINS, URGENT_KEYWORDS, SUMMARY_SCHEDULE_HOURS
from models import (
    init_db, create_conversation, get_conversation,
    add_message, get_conversation_messages, mark_urgent
)
from llm import get_response_stream, chat_completion
from notify import send_urgent_notification, send_periodic_summary, check_urgent_keywords, send_realtime_notification


# ── Background task for scheduled summaries ──

def _seconds_until_next_hour(target_hours: list[int]) -> float:
    """Calculate seconds until the next scheduled hour."""
    from datetime import datetime, timedelta
    now = datetime.now()
    next_times = []
    for h in target_hours:
        target = now.replace(hour=h, minute=0, second=0, microsecond=0)
        if target <= now:
            target += timedelta(days=1)
        next_times.append(target)
    nearest = min(next_times)
    return (nearest - now).total_seconds()


async def scheduled_summary_loop():
    """Background task: send summaries at fixed hours (e.g. 8:00, 12:00, 17:00)."""
    while True:
        wait = _seconds_until_next_hour(SUMMARY_SCHEDULE_HOURS)
        print(f"[hermes] Next summary in {wait/60:.0f} min (schedule: {SUMMARY_SCHEDULE_HOURS})")
        await asyncio.sleep(wait)
        try:
            await send_periodic_summary()
        except Exception as e:
            print(f"[summary-loop] Error: {e}")


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    print("[hermes] Database initialized.")

    # Start background summary task
    summary_task = asyncio.create_task(scheduled_summary_loop())
    print(f"[hermes] Scheduled summary task started (hours: {SUMMARY_SCHEDULE_HOURS}).")

    yield

    summary_task.cancel()
    try:
        await summary_task
    except asyncio.CancelledError:
        pass


app = FastAPI(title="Hermes Chat API", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=False if CORS_ORIGINS == ["*"] else True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Request/Response Models ──

class ChatRequest(BaseModel):
    conversation_id: str | None = None
    message: str
    visitor_name: str | None = None


class ChatResponse(BaseModel):
    conversation_id: str
    message_id: str
    reply: str


# ── API Endpoints ──

@app.get("/api/health")
async def health():
    return {"status": "ok", "service": "hermes"}


@app.post("/api/chat", response_model=ChatResponse)
async def chat(req: ChatRequest, background_tasks: BackgroundTasks):
    """
    Non-streaming chat endpoint.
    Receives visitor message, gets AI reply, stores conversation.
    """
    # Get or create conversation
    conv_id = req.conversation_id
    if not conv_id:
        visitor_id = str(uuid.uuid4())[:8]
        conv_id = create_conversation(visitor_id, req.visitor_name)

    conv = get_conversation(conv_id)
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found")

    # Store visitor message
    msg_id = add_message(conv_id, "visitor", req.message)

    # Check for urgent keywords
    is_urgent = check_urgent_keywords(req.message, URGENT_KEYWORDS)
    if is_urgent:
        mark_urgent(conv_id)
        # Fire-and-forget urgent notification
        asyncio.create_task(send_urgent_notification(conv_id, req.message))

    # Build message history for LLM
    history = get_conversation_messages(conv_id, limit=20)
    llm_messages = [{"role": m["role"], "content": m["content"]} for m in history]

    # Get AI response
    reply = await chat_completion(llm_messages, stream=False)

    # Store AI response
    add_message(conv_id, "assistant", reply)

    # Send realtime notification (await directly for reliability)
    try:
        await send_realtime_notification(conv_id, req.message, reply)
    except Exception as e:
        print(f"[chat] Notification error: {e}")

    return ChatResponse(conversation_id=conv_id, message_id=msg_id, reply=reply)


@app.post("/api/chat/stream")
async def chat_stream(req: ChatRequest, background_tasks: BackgroundTasks):
    """
    Streaming chat endpoint using SSE.
    Streams AI response token-by-token.
    """
    # Get or create conversation
    conv_id = req.conversation_id
    if not conv_id:
        visitor_id = str(uuid.uuid4())[:8]
        conv_id = create_conversation(visitor_id, req.visitor_name)

    conv = get_conversation(conv_id)
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found")

    # Store visitor message
    add_message(conv_id, "visitor", req.message)

    # Check urgent keywords
    is_urgent = check_urgent_keywords(req.message, URGENT_KEYWORDS)
    if is_urgent:
        mark_urgent(conv_id)
        asyncio.create_task(send_urgent_notification(conv_id, req.message))

    # Build message history
    history = get_conversation_messages(conv_id, limit=20)
    llm_messages = [{"role": m["role"], "content": m["content"]} for m in history]

    async def event_generator():
        yield f"data: {json.dumps({'type': 'conv_id', 'conversation_id': conv_id})}\n\n"

        full_reply = ""
        async for chunk in get_response_stream(llm_messages):
            full_reply += chunk
            yield f"data: {json.dumps({'type': 'chunk', 'content': chunk})}\n\n"

        # Save full reply to DB
        add_message(conv_id, "assistant", full_reply)

        yield f"data: {json.dumps({'type': 'done'})}\n\n"

        # Send realtime notification (event loop is active during streaming)
        try:
            await send_realtime_notification(conv_id, req.message, full_reply)
        except Exception as e:
            print(f"[stream-notify] Error: {e}")

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )


@app.get("/api/conversations/{conv_id}/messages")
async def get_messages(conv_id: str):
    """Get all messages in a conversation."""
    conv = get_conversation(conv_id)
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found")
    messages = get_conversation_messages(conv_id)
    return {"conversation_id": conv_id, "messages": messages}


@app.post("/api/notify/test")
async def test_notification():
    """Manually trigger a test notification to verify Feishu/PushPlus setup."""
    from notify import send_feishu, send_pushplus
    title = "🧪 Hermes 通知测试"
    content = "如果你看到这条消息，说明飞书通知配置正确！\n\n— Hermes AI 助理"
    await send_feishu(title, content)
    await send_pushplus(title, content)
    return {"status": "sent", "message": "Test notification dispatched"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
