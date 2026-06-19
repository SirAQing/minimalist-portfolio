"""
SQLite database models and operations for Hermes Chat.
Uses raw sqlite3 for simplicity - no ORM needed for this scale.
"""
import sqlite3
import json
import time
import uuid
from contextlib import contextmanager
from config import DATABASE_PATH


def get_connection():
    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    conn.execute("PRAGMA foreign_keys=ON")
    return conn


@contextmanager
def get_db():
    conn = get_connection()
    try:
        yield conn
        conn.commit()
    finally:
        conn.close()


def init_db():
    """Create tables if they don't exist."""
    with get_db() as conn:
        conn.executescript("""
            CREATE TABLE IF NOT EXISTS conversations (
                id TEXT PRIMARY KEY,
                visitor_id TEXT NOT NULL,
                visitor_name TEXT,
                started_at REAL NOT NULL,
                last_active REAL NOT NULL,
                summary TEXT,
                is_urgent INTEGER DEFAULT 0,
                notified_at REAL DEFAULT 0,
                message_count INTEGER DEFAULT 0
            );

            CREATE TABLE IF NOT EXISTS messages (
                id TEXT PRIMARY KEY,
                conversation_id TEXT NOT NULL,
                role TEXT NOT NULL CHECK(role IN ('visitor', 'assistant')),
                content TEXT NOT NULL,
                created_at REAL NOT NULL,
                FOREIGN KEY (conversation_id) REFERENCES conversations(id)
            );

            CREATE INDEX IF NOT EXISTS idx_messages_conversation
                ON messages(conversation_id, created_at);
            CREATE INDEX IF NOT EXISTS idx_conversations_active
                ON conversations(last_active);
        """)


def create_conversation(visitor_id: str, visitor_name: str = None) -> str:
    """Create a new conversation and return its ID."""
    conv_id = str(uuid.uuid4())[:8]
    now = time.time()
    with get_db() as conn:
        conn.execute(
            "INSERT INTO conversations (id, visitor_id, visitor_name, started_at, last_active) VALUES (?, ?, ?, ?, ?)",
            (conv_id, visitor_id, visitor_name, now, now)
        )
    return conv_id


def get_conversation(conv_id: str) -> dict | None:
    """Get conversation by ID."""
    with get_db() as conn:
        row = conn.execute("SELECT * FROM conversations WHERE id = ?", (conv_id,)).fetchone()
        return dict(row) if row else None


def add_message(conv_id: str, role: str, content: str) -> str:
    """Add a message to a conversation."""
    msg_id = str(uuid.uuid4())[:8]
    now = time.time()
    with get_db() as conn:
        conn.execute(
            "INSERT INTO messages (id, conversation_id, role, content, created_at) VALUES (?, ?, ?, ?, ?)",
            (msg_id, conv_id, role, content, now)
        )
        conn.execute(
            "UPDATE conversations SET last_active = ?, message_count = message_count + 1 WHERE id = ?",
            (now, conv_id)
        )
    return msg_id


def get_conversation_messages(conv_id: str, limit: int = 50) -> list[dict]:
    """Get messages in a conversation."""
    with get_db() as conn:
        rows = conn.execute(
            "SELECT * FROM messages WHERE conversation_id = ? ORDER BY created_at ASC LIMIT ?",
            (conv_id, limit)
        ).fetchall()
        return [dict(r) for r in rows]


def get_unnotified_messages(since: float) -> list[dict]:
    """Get conversations with new messages since a given timestamp."""
    with get_db() as conn:
        rows = conn.execute("""
            SELECT c.id, c.visitor_id, c.visitor_name, c.started_at, c.last_active,
                   c.message_count, c.is_urgent
            FROM conversations c
            WHERE c.last_active > ? AND c.notified_at < c.last_active
            ORDER BY c.last_active DESC
        """, (since,)).fetchall()

        result = []
        for row in rows:
            conv = dict(row)
            msgs = conn.execute("""
                SELECT role, content, created_at
                FROM messages
                WHERE conversation_id = ? AND created_at > ?
                ORDER BY created_at ASC
            """, (conv['id'], since)).fetchall()
            conv['new_messages'] = [dict(m) for m in msgs]
            result.append(conv)

        return result


def mark_notified(conv_ids: list[str]):
    """Mark conversations as notified."""
    if not conv_ids:
        return
    now = time.time()
    with get_db() as conn:
        placeholders = ','.join('?' * len(conv_ids))
        conn.execute(
            f"UPDATE conversations SET notified_at = ? WHERE id IN ({placeholders})",
            [now] + conv_ids
        )


def mark_urgent(conv_id: str):
    """Mark a conversation as urgent."""
    with get_db() as conn:
        conn.execute("UPDATE conversations SET is_urgent = 1 WHERE id = ?", (conv_id,))
