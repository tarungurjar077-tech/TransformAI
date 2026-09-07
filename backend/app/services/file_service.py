import io
import os
import re
from typing import Tuple, Dict, Any
from fastapi import UploadFile, HTTPException

MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024  # 15 MB

class FileProcessingService:
    @staticmethod
    def _sanitize_text(text: str) -> str:
        # Normalize carriage returns and excessive whitespace
        text = text.replace("\r\n", "\n").replace("\r", "\n")
        # Remove null bytes
        text = text.replace("\x00", "")
        # Collapse >3 consecutive line breaks into 2
        text = re.sub(r"\n{3,}", "\n\n", text)
        return text.strip()

    @classmethod
    async def process_uploaded_file(cls, file: UploadFile) -> Dict[str, Any]:
        """
        Reads and extracts text from TXT, PDF, or DOCX files.
        Validates size, type, and content viability.
        """
        filename = file.filename or "unknown_file"
        extension = filename.split(".")[-1].lower() if "." in filename else ""

        if extension not in ["txt", "pdf", "docx", "md"]:
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported file type: .{extension}. TransformAI supports TXT, PDF, DOCX, and MD files."
            )

        content_bytes = await file.read()
        file_size = len(content_bytes)

        if file_size == 0:
            raise HTTPException(status_code=400, detail="The uploaded file is empty.")

        if file_size > MAX_FILE_SIZE_BYTES:
            raise HTTPException(
                status_code=400, 
                detail=f"File exceeds maximum allowed size of 15MB (File size: {file_size / (1024*1024):.2f}MB)."
            )

        extracted_text = ""

        try:
            if extension in ["txt", "md"]:
                # Try UTF-8 first, fallback to Latin-1
                try:
                    extracted_text = content_bytes.decode("utf-8")
                except UnicodeDecodeError:
                    extracted_text = content_bytes.decode("latin-1", errors="replace")

            elif extension == "pdf":
                try:
                    import pypdf
                    reader = pypdf.PdfReader(io.BytesIO(content_bytes))
                    if len(reader.pages) == 0:
                        raise HTTPException(status_code=400, detail="The PDF file contains no pages.")
                    
                    page_texts = []
                    for idx, page in enumerate(reader.pages):
                        page_text = page.extract_text()
                        if page_text:
                            page_texts.append(page_text)
                    
                    extracted_text = "\n\n".join(page_texts)
                except Exception as pdf_err:
                    raise HTTPException(
                        status_code=400, 
                        detail=f"Could not parse PDF content. The file may be corrupt or password protected: {str(pdf_err)}"
                    )

            elif extension == "docx":
                try:
                    import docx
                    doc = docx.Document(io.BytesIO(content_bytes))
                    paragraphs = [p.text for p in doc.paragraphs if p.text.strip()]
                    # Also extract text inside tables
                    table_texts = []
                    for table in doc.tables:
                        for row in table.rows:
                            row_cells = [cell.text.strip() for cell in row.cells if cell.text.strip()]
                            if row_cells:
                                table_texts.append(" | ".join(row_cells))
                    
                    extracted_text = "\n\n".join(paragraphs + table_texts)
                except Exception as docx_err:
                    raise HTTPException(
                        status_code=400, 
                        detail=f"Could not parse DOCX content: {str(docx_err)}"
                    )

        except HTTPException:
            raise
        except Exception as exc:
            raise HTTPException(
                status_code=500,
                detail=f"Failed to process file '{filename}': {str(exc)}"
            )

        cleaned_text = cls._sanitize_text(extracted_text)

        if not cleaned_text or len(cleaned_text.strip()) < 10:
            raise HTTPException(
                status_code=400, 
                detail="Extracted content is too short or empty. Please ensure the document contains readable text."
            )

        words = cleaned_text.split()
        word_count = len(words)
        char_count = len(cleaned_text)
        preview = cleaned_text[:300] + ("..." if char_count > 300 else "")

        return {
            "filename": filename,
            "file_type": extension,
            "file_size_bytes": file_size,
            "character_count": char_count,
            "word_count": word_count,
            "content": cleaned_text,
            "preview": preview
        }

file_service = FileProcessingService()
