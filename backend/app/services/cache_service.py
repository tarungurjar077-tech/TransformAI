import os
import json
import time
import logging
from typing import Optional, Any
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger("transformai.cache")

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")

class InMemoryCache:
    """Thread-safe fallback in-memory cache with TTL support"""
    def __init__(self):
        self._store = {}
        self._expiry = {}

    def set(self, key: str, value: Any, expire_seconds: int = 3600):
        self._store[key] = value
        self._expiry[key] = time.time() + expire_seconds

    def get(self, key: str) -> Optional[Any]:
        if key not in self._store:
            return None
        if time.time() > self._expiry.get(key, 0):
            self.delete(key)
            return None
        return self._store.get(key)

    def delete(self, key: str):
        self._store.pop(key, None)
        self._expiry.pop(key, None)

    def keys(self):
        # Purge expired
        now = time.time()
        expired = [k for k, exp in self._expiry.items() if now > exp]
        for k in expired:
            self.delete(k)
        return list(self._store.keys())

class CacheService:
    def __init__(self):
        self.redis_client = None
        self.is_redis_active = False
        self.in_memory = InMemoryCache()
        self._init_redis()

    def _init_redis(self):
        try:
            import redis
            client = redis.Redis.from_url(
                REDIS_URL,
                socket_timeout=2,
                socket_connect_timeout=2,
                decode_responses=True
            )
            # Test ping
            client.ping()
            self.redis_client = client
            self.is_redis_active = True
            logger.info(f"[Cache] Successfully connected to Redis instance at {REDIS_URL}")
        except Exception as e:
            self.is_redis_active = False
            self.redis_client = None
            logger.warning(
                f"[Cache] Redis not available at {REDIS_URL} ({e}). "
                "Using in-memory TTL task/state manager fallback."
            )

    def set(self, key: str, value: Any, expire_seconds: int = 3600):
        serialized = json.dumps(value) if not isinstance(value, str) else value
        if self.is_redis_active and self.redis_client:
            try:
                self.redis_client.setex(key, expire_seconds, serialized)
                return
            except Exception as exc:
                logger.warning(f"[Cache] Redis write error, falling back to memory: {exc}")
        self.in_memory.set(key, serialized, expire_seconds)

    def get(self, key: str) -> Optional[Any]:
        if self.is_redis_active and self.redis_client:
            try:
                val = self.redis_client.get(key)
                if val is not None:
                    try:
                        return json.loads(val)
                    except Exception:
                        return val
            except Exception as exc:
                logger.warning(f"[Cache] Redis read error, checking memory: {exc}")
        
        mem_val = self.in_memory.get(key)
        if mem_val is not None:
            try:
                return json.loads(mem_val)
            except Exception:
                return mem_val
        return None

    def delete(self, key: str):
        if self.is_redis_active and self.redis_client:
            try:
                self.redis_client.delete(key)
            except Exception:
                pass
        self.in_memory.delete(key)

    def get_status(self) -> dict:
        if self.is_redis_active and self.redis_client:
            try:
                self.redis_client.ping()
                return {
                    "status": "connected",
                    "type": "redis",
                    "url": REDIS_URL.split("@")[-1] if "@" in REDIS_URL else REDIS_URL
                }
            except Exception as e:
                return {
                    "status": "degraded",
                    "type": "in_memory_fallback",
                    "notice": f"Redis ping failed: {e}. In-memory fallback active."
                }
        return {
            "status": "in_memory_fallback",
            "type": "in_memory",
            "notice": "Redis is not running. In-memory TTL cache active."
        }

# Global singleton
cache_service = CacheService()
