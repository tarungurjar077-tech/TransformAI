import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class OutputFormatConfig(BaseModel):
    id: str
    name: str
    description: str
    icon: str
    category: str

class ValidationCheckItem(BaseModel):
    label: str
    passed: bool
    status: str = "success"  # success, warning, error
    message: str

class OutputItemSchema(BaseModel):
    id: Optional[int] = None
    format_type: str
    title: str
    content: str
    quality_score: float = 94.0
    consistency_score: float = 95.0
    completeness_score: float = 93.0
    formatting_score: float = 98.0
    tone_score: float = 94.0
    validation_checks: List[ValidationCheckItem] = []
    word_count: int = 0
    char_count: int = 0
    created_at: Optional[datetime.datetime] = None

    class Config:
        from_attributes = True

class TransformationCreateRequest(BaseModel):
    content: str = Field(..., min_length=10, description="Source raw text or extracted file content")
    title: Optional[str] = Field(None, description="Optional title for the transformation")
    source_type: Optional[str] = Field("text", description="Source modality: text, file_upload, template")
    selected_outputs: List[str] = Field(..., min_items=1, description="List of format IDs to generate")
    audience: Optional[str] = Field("Executive", description="Target audience tier")
    tone: Optional[str] = Field("Professional", description="Writing tone")
    language: Optional[str] = Field("English", description="Target language (English, Hindi, Hinglish)")
    detail_level: Optional[str] = Field("Detailed", description="Depth level: Short, Medium, Detailed")
    custom_instructions: Optional[str] = Field(None, description="Additional custom instructions")
    force_demo: Optional[bool] = Field(False, description="Explicitly force offline demo mode generation")

class TransformationResponse(BaseModel):
    id: int
    title: str
    source_type: str
    selected_outputs: List[str]
    audience: str
    tone: str
    language: str
    detail_level: str
    ai_model: str
    is_demo_mode: bool
    status: str
    execution_duration_sec: float
    overall_quality_score: float
    validation_summary: Optional[Dict[str, Any]] = None
    outputs: List[OutputItemSchema]
    created_at: datetime.datetime

    class Config:
        from_attributes = True

class TransformationListItem(BaseModel):
    id: int
    title: str
    source_type: str
    selected_outputs: List[str]
    output_count: int
    ai_model: str
    is_demo_mode: bool
    status: str
    overall_quality_score: float
    created_at: datetime.datetime

    class Config:
        from_attributes = True

class DocumentUploadResponse(BaseModel):
    filename: str
    file_type: str
    file_size_bytes: int
    character_count: int
    word_count: int
    content: str
    preview: str

class RegenerateRequest(BaseModel):
    format_type: str
    custom_instructions: Optional[str] = None
    audience: Optional[str] = None
    tone: Optional[str] = None
    language: Optional[str] = None

class TemplateResponse(BaseModel):
    id: int
    title: str
    category: str
    description: str
    sample_content: str
    recommended_outputs: List[str]
    word_count: int
    char_count: int

class HealthResponse(BaseModel):
    status: str
    timestamp: str
    database: Dict[str, Any]
    redis: Dict[str, Any]
    ai_engine: Dict[str, Any]
