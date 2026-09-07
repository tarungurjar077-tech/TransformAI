from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List, Dict
from database import get_document_by_id, update_document_transformations
from services.ai_engine import (
    TRANSFORMATION_KEYS,
    TRANSFORMATION_META,
    generate_transformation
)

router = APIRouter(prefix="/api/transform", tags=["transform"])

class SingleTransformRequest(BaseModel):
    doc_id: str
    transformation_type: str
    tone: Optional[str] = "balanced"
    api_key: Optional[str] = None
    persona: Optional[str] = "executive"
    length: Optional[str] = "standard"
    quick_action: Optional[str] = None

class BatchTransformRequest(BaseModel):
    doc_id: str
    types: Optional[List[str]] = None
    tone: Optional[str] = "balanced"
    api_key: Optional[str] = None
    persona: Optional[str] = "executive"
    length: Optional[str] = "standard"
    quick_action: Optional[str] = None

class SaveTransformRequest(BaseModel):
    doc_id: str
    transformation_type: str
    content: str

@router.get("/meta")
async def get_transformations_meta():
    return {
        "keys": TRANSFORMATION_KEYS,
        "details": TRANSFORMATION_META
    }

@router.post("/single")
async def transform_single(payload: SingleTransformRequest):
    doc = get_document_by_id(payload.doc_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found.")

    if payload.transformation_type not in TRANSFORMATION_KEYS:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid transformation type. Valid types are: {', '.join(TRANSFORMATION_KEYS)}"
        )

    output = generate_transformation(
        transformation_type=payload.transformation_type,
        source_text=doc["source_text"],
        title=doc.get("title") or "Document",
        tone=payload.tone or "balanced",
        api_key=payload.api_key,
        persona=payload.persona or "executive",
        length=payload.length or "standard",
        quick_action=payload.quick_action
    )

    current_transformations = doc.get("transformations") or {}
    current_transformations[payload.transformation_type] = output
    update_document_transformations(payload.doc_id, current_transformations)

    return {
        "doc_id": payload.doc_id,
        "transformation_type": payload.transformation_type,
        "content": output,
        "meta": TRANSFORMATION_META.get(payload.transformation_type)
    }

@router.post("/batch")
async def transform_batch(payload: BatchTransformRequest):
    doc = get_document_by_id(payload.doc_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found.")

    target_types = payload.types if payload.types else TRANSFORMATION_KEYS
    invalid_types = [t for t in target_types if t not in TRANSFORMATION_KEYS]
    if invalid_types:
        raise HTTPException(status_code=400, detail=f"Invalid types: {invalid_types}")

    current_transformations = doc.get("transformations") or {}

    for t_type in target_types:
        output = generate_transformation(
            transformation_type=t_type,
            source_text=doc["source_text"],
            title=doc.get("title") or "Document",
            tone=payload.tone or "balanced",
            api_key=payload.api_key,
            persona=payload.persona or "executive",
            length=payload.length or "standard",
            quick_action=payload.quick_action
        )
        current_transformations[t_type] = output

    update_document_transformations(payload.doc_id, current_transformations)

    return {
        "doc_id": payload.doc_id,
        "transformations": current_transformations,
        "count": len(current_transformations)
    }

@router.post("/save")
async def save_user_edit(payload: SaveTransformRequest):
    doc = get_document_by_id(payload.doc_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found.")

    current_transformations = doc.get("transformations") or {}
    current_transformations[payload.transformation_type] = payload.content
    update_document_transformations(payload.doc_id, current_transformations)

    return {
        "status": "saved",
        "doc_id": payload.doc_id,
        "transformation_type": payload.transformation_type
    }
