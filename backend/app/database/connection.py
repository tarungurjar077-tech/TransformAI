import os
import logging
from sqlalchemy import create_engine, text
from sqlalchemy.orm import declarative_base, sessionmaker
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger("transformai.database")
logging.basicConfig(level=logging.INFO)

DATABASE_URL = os.getenv(
    "DATABASE_URL", 
    "sqlite:///./transformai.db"
)

# In-memory or file-based SQLite fallback
SQLITE_FALLBACK_URL = "sqlite:///./transformai.db"

engine = None
active_db_type = "sqlite"

try:
    if DATABASE_URL.startswith("postgresql"):
        # Test connecting with a short timeout
        test_engine = create_engine(
            DATABASE_URL, 
            connect_args={"connect_timeout": 3} if "psycopg2" in DATABASE_URL or "postgresql://" in DATABASE_URL else {},
            pool_pre_ping=True
        )
        with test_engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        engine = test_engine
        active_db_type = "postgresql"
        logger.info("[Database] Connected successfully to PostgreSQL instance.")
    else:
        engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
        active_db_type = "custom"
        logger.info(f"[Database] Using configured database: {DATABASE_URL}")
except Exception as e:
    logger.warning(
        f"[Database] Could not connect to configured database ({e}). "
        f"Gracefully falling back to local SQLite at {SQLITE_FALLBACK_URL} for zero-friction setup."
    )
    engine = create_engine(SQLITE_FALLBACK_URL, connect_args={"check_same_thread": False})
    active_db_type = "sqlite_fallback"

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    """FastAPI database session dependency"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    """Initialize database tables after importing all declarative models"""
    from backend.app.models.database import User, Project, Document, Transformation, Output, Template
    Base.metadata.create_all(bind=engine)
    logger.info(f"[Database] All database tables verified/created on {active_db_type}.")

def get_db_status() -> dict:
    """Returns runtime database health status"""
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        return {
            "status": "healthy",
            "type": active_db_type,
            "url": str(engine.url).split("@")[-1] if "@" in str(engine.url) else str(engine.url)
        }
    except Exception as exc:
        return {
            "status": "unhealthy",
            "type": active_db_type,
            "error": str(exc)
        }
