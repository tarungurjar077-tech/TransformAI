import sqlite3
import json
from datetime import datetime
from typing import Optional, Dict, Any, List
from config import DATABASE_PATH

def get_db():
    conn = sqlite3.connect(DATABASE_PATH, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS documents (
                id TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                filename TEXT,
                source_text TEXT NOT NULL,
                word_count INTEGER NOT NULL,
                created_at TEXT NOT NULL,
                analysis_json TEXT,
                transformations_json TEXT
            )
        """)
        conn.commit()

def save_document(
    doc_id: str,
    title: str,
    filename: Optional[str],
    source_text: str,
    word_count: int,
    analysis: Optional[Dict[str, Any]] = None,
    transformations: Optional[Dict[str, Any]] = None
):
    with get_db() as conn:
        cursor = conn.cursor()
        created_at = datetime.utcnow().isoformat() + "Z"
        cursor.execute("""
            INSERT INTO documents (
                id, title, filename, source_text, word_count, created_at, analysis_json, transformations_json
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET
                title=excluded.title,
                source_text=excluded.source_text,
                word_count=excluded.word_count,
                analysis_json=coalesce(excluded.analysis_json, documents.analysis_json),
                transformations_json=coalesce(excluded.transformations_json, documents.transformations_json)
        """, (
            doc_id,
            title,
            filename or "",
            source_text,
            word_count,
            created_at,
            json.dumps(analysis) if analysis else None,
            json.dumps(transformations) if transformations else None
        ))
        conn.commit()

def update_document_analysis(doc_id: str, analysis: Dict[str, Any]):
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            UPDATE documents SET analysis_json = ? WHERE id = ?
        """, (json.dumps(analysis), doc_id))
        conn.commit()

def update_document_transformations(doc_id: str, transformations: Dict[str, Any]):
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            UPDATE documents SET transformations_json = ? WHERE id = ?
        """, (json.dumps(transformations), doc_id))
        conn.commit()

def get_all_documents() -> List[Dict[str, Any]]:
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT id, title, filename, word_count, created_at,
                   length(source_text) as char_count,
                   CASE WHEN analysis_json IS NOT NULL THEN 1 ELSE 0 END as has_analysis,
                   CASE WHEN transformations_json IS NOT NULL THEN 1 ELSE 0 END as has_transformations
            FROM documents
            ORDER BY created_at DESC
        """)
        rows = cursor.fetchall()
        return [dict(row) for row in rows]

def get_document_by_id(doc_id: str) -> Optional[Dict[str, Any]]:
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM documents WHERE id = ?", (doc_id,))
        row = cursor.fetchone()
        if not row:
            return None
        doc = dict(row)
        if doc.get("analysis_json"):
            doc["analysis"] = json.loads(doc["analysis_json"])
        else:
            doc["analysis"] = None
        if doc.get("transformations_json"):
            doc["transformations"] = json.loads(doc["transformations_json"])
        else:
            doc["transformations"] = {}
        return doc

def delete_document(doc_id: str) -> bool:
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM documents WHERE id = ?", (doc_id,))
        conn.commit()
        return cursor.rowcount > 0
