from fastapi import APIRouter, HTTPException
from database import get_all_documents, get_document_by_id, delete_document

router = APIRouter(prefix="/api/history", tags=["history"])

@router.get("")
async def list_history():
    documents = get_all_documents()
    return {
        "total": len(documents),
        "documents": documents
    }

@router.get("/{doc_id}")
async def get_history_detail(doc_id: str):
    doc = get_document_by_id(doc_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found.")
    return doc

@router.delete("/{doc_id}")
async def delete_history_item(doc_id: str):
    success = delete_document(doc_id)
    if not success:
        raise HTTPException(status_code=404, detail="Document not found or already deleted.")
    return {
        "status": "deleted",
        "doc_id": doc_id
    }
