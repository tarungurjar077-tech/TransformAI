import os
import sys
import logging
from contextlib import asynccontextmanager

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from dotenv import load_dotenv

from backend.app.database.connection import init_db, get_db_status
from backend.app.services.cache_service import cache_service
from backend.app.services.openai_service import openai_service
from backend.app.api.routes import router

load_dotenv()

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("transformai.main")

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("==================================================================")
    logger.info("[TransformAI] Starting Autonomous Multi-Output Backend Engine...")
    logger.info("==================================================================")
    
    # 1. Initialize Database Tables
    try:
        init_db()
        db_stat = get_db_status()
        logger.info(f"[Startup] Database active: {db_stat['type']} ({db_stat['status']})")
    except Exception as e:
        logger.error(f"[Startup] Database initialization error: {e}")

    # 2. Verify Cache & Redis
    cache_stat = cache_service.get_status()
    logger.info(f"[Startup] Cache system: {cache_stat['type']} ({cache_stat['status']})")

    # 3. Verify AI Engine
    ai_stat = openai_service.get_status()
    if ai_stat["configured"]:
        logger.info(f"[Startup] OpenAI Engine configured with model: {ai_stat['model']}")
    else:
        logger.info("[Startup] OpenAI key not provided. High-fidelity Demo Mode activated.")

    logger.info("==================================================================")
    logger.info("[READY] TransformAI Backend ready on http://localhost:8000")
    logger.info("==================================================================")
    yield
    logger.info("[TransformAI] Shutting down TransformAI Backend...")

app = FastAPI(
    title="TransformAI API",
    description="GenAI-Powered Autonomous Content Transformation Platform for SIH 2026 PS 26154",
    version="2.0.0",
    lifespan=lifespan
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API router
app.include_router(router)

@app.get("/")
def root():
    return {
        "project": "TransformAI",
        "tagline": "One Source. Multiple Intelligent Outputs.",
        "status": "online",
        "version": "2.0.0",
        "documentation": "/docs",
        "health_check": "/api/health"
    }

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled server exception on {request.url.path}: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal Server Error",
            "detail": str(exc) if "HTTPException" in str(type(exc)) else "An unexpected error occurred during processing."
        }
    )

if __name__ == "__main__":
    import uvicorn
    host = os.getenv("BACKEND_HOST", "0.0.0.0")
    port = int(os.getenv("PORT", os.getenv("BACKEND_PORT", 8000)))
    uvicorn.run("backend.app.main:app", host=host, port=port, reload=True)
