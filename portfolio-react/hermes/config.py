"""
Hermes Chat Backend Configuration
All sensitive values from environment variables.
"""
import os
from pathlib import Path
from dotenv import load_dotenv

# Load .env from parent directory (portfolio-react/.env)
_env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(_env_path)

# DeepSeek API
DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY", "")
DEEPSEEK_BASE_URL = os.getenv("DEEPSEEK_BASE_URL", "https://api.deepseek.com")
DEEPSEEK_MODEL = os.getenv("DEEPSEEK_MODEL", "deepseek-chat")

# Feishu (Lark) Webhook
FEISHU_WEBHOOK_URL = os.getenv("FEISHU_WEBHOOK_URL", "")

# PushPlus (WeChat push)
PUSHPLUS_TOKEN = os.getenv("PUSHPLUS_TOKEN", "")

# Notification settings
SUMMARY_SCHEDULE_HOURS = [int(h) for h in os.getenv("SUMMARY_SCHEDULE_HOURS", "8,12,17").split(",")]
URGENT_KEYWORDS = os.getenv("URGENT_KEYWORDS", "人工,联系本人,真人,urgent,human,person").split(",")

# Database
DATABASE_PATH = os.getenv("DATABASE_PATH", "hermes.db")

# CORS
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://localhost:5174,http://localhost:8000").split(",")

# System prompt for the AI agent
SYSTEM_PROMPT = os.getenv("SYSTEM_PROMPT", """你是刘明青的AI助理 Hermes，正在他的个人作品集网站上为访客提供帮助。

关于刘明青：
- 4年新能源锂电行业数据开发经验
- 主导过 ETL 平台、自动化报告系统、私有化大模型部署与 AI 应用落地
- 长期深度使用 Claude Code、Codex 等 AI 编码工具
- 沉淀 2 项发明专利，累计落地 10+ 套标准化数据处理系统
- 核心技能：Python, Kettle, DolphinScheduler, Docker, Ollama, Dify, RAG, LangGraph, FastAPI
- 目前在江苏天合储能担任软件开发工程师

你的职责：
1. 友善地回答访客关于刘明青技术能力和项目经验的问题
2. 帮助访客了解刘明青的技术栈和项目详情
3. 如果访客想联系刘明青本人，引导他们留下联系方式和留言内容
4. 使用中文回复（除非访客用英文提问）

语气：专业但友好，简洁有料，避免过度推销。""")
