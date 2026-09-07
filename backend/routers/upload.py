import uuid
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from pydantic import BaseModel
from typing import Optional
from services.document_parser import parse_file
from database import save_document

router = APIRouter(prefix="/api/upload", tags=["upload"])

class TextUploadRequest(BaseModel):
    title: Optional[str] = "Pasted Document"
    text: str

@router.post("/file")
async def upload_file(file: UploadFile = File(...)):
    try:
        content = await file.read()
        if not content:
            raise HTTPException(status_code=400, detail="Uploaded file is empty.")
        
        extracted_text, detected_title = parse_file(file.filename or "document.txt", content)
        doc_id = str(uuid.uuid4())
        words = len(extracted_text.split())
        
        save_document(
            doc_id=doc_id,
            title=detected_title,
            filename=file.filename,
            source_text=extracted_text,
            word_count=words
        )

        return {
            "id": doc_id,
            "title": detected_title,
            "filename": file.filename,
            "source_text": extracted_text,
            "word_count": words
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/text")
async def upload_text(payload: TextUploadRequest):
    clean_text = payload.text.strip()
    if not clean_text:
        raise HTTPException(status_code=400, detail="Text cannot be empty.")
    
    doc_id = str(uuid.uuid4())
    words = len(clean_text.split())
    title = (payload.title or "").strip() or "Untitled Document"

    save_document(
        doc_id=doc_id,
        title=title,
        filename=None,
        source_text=clean_text,
        word_count=words
    )

    return {
        "id": doc_id,
        "title": title,
        "filename": None,
        "source_text": clean_text,
        "word_count": words
    }
