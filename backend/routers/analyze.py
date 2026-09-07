from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from database import get_document_by_id, update_document_analysis
from services.ai_engine import analyze_text

router = APIRouter(prefix="/api/analyze", tags=["analyze"])

class AnalyzeRequest(BaseModel):
    doc_id: Optional[str] = None
    text: Optional[str] = None

@router.post("")
async def analyze_document(payload: AnalyzeRequest):
    source_text = ""
    doc_id = payload.doc_id

    if doc_id:
        doc = get_document_by_id(doc_id)
        if not doc:
            raise HTTPException(status_code=404, detail="Document not found.")
        source_text = doc["source_text"]
    elif payload.text:
        source_text = payload.text
    else:
        raise HTTPException(status_code=400, detail="Must provide either doc_id or text.")

    if not source_text.strip():
        raise HTTPException(status_code=400, detail="Source text is empty.")

    analysis = analyze_text(source_text)

    if doc_id:
        update_document_analysis(doc_id, analysis)

    return {
        "doc_id": doc_id,
        "analysis": analysis
    }
