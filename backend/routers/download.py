from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse, Response
from database import get_document_by_id
from services.pack_generator import create_output_pack_zip
from services.ai_engine import TRANSFORMATION_META

router = APIRouter(prefix="/api/download", tags=["download"])

@router.get("/pack/{doc_id}")
async def download_pack(doc_id: str):
    doc = get_document_by_id(doc_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found.")

    analysis = doc.get("analysis") or {}
    transformations = doc.get("transformations") or {}

    if not transformations:
        raise HTTPException(status_code=400, detail="No transformations available to download.")

    title = doc.get("title") or "Document"
    safe_slug = "".join(c if c.isalnum() else "_" for c in title).strip("_") or "Output_Pack"

    zip_buffer = create_output_pack_zip(
        title=title,
        source_text=doc.get("source_text", ""),
        analysis=analysis,
        transformations=transformations
    )

    filename = f"{safe_slug}_TransformAI_Pack.zip"
    headers = {
        "Content-Disposition": f'attachment; filename="{filename}"'
    }

    return StreamingResponse(
        zip_buffer,
        media_type="application/zip",
        headers=headers
    )

@router.get("/single/{doc_id}/{transformation_type}")
async def download_single_file(doc_id: str, transformation_type: str):
    doc = get_document_by_id(doc_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found.")

    transformations = doc.get("transformations") or {}
    content = transformations.get(transformation_type)
    if not content:
        raise HTTPException(status_code=404, detail="Transformation not found or not yet generated.")

    meta = TRANSFORMATION_META.get(transformation_type, {})
    filename = meta.get("filename", f"{transformation_type}.md")

    headers = {
        "Content-Disposition": f'attachment; filename="{filename}"'
    }

    return Response(
        content=content,
        media_type="text/markdown",
        headers=headers
    )
