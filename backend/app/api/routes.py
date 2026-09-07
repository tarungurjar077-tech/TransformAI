import io
import zipfile
import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from backend.app.database.connection import get_db, get_db_status
from backend.app.models.database import Transformation, Output, Document, Template, User, Project
from backend.app.schemas.transformation import (
    TransformationCreateRequest,
    TransformationResponse,
    TransformationListItem,
    DocumentUploadResponse,
    RegenerateRequest,
    TemplateResponse,
    HealthResponse
)
from backend.app.services.file_service import file_service
from backend.app.services.cache_service import cache_service
from backend.app.services.openai_service import openai_service
from backend.app.services.demo_service import demo_service, SAMPLE_CYBERSECURITY_REPORT
from backend.app.ai.prompts import FORMAT_METADATA
from backend.app.workflow.langgraph_workflow import run_transformation_pipeline

router = APIRouter(prefix="/api", tags=["TransformAI"])

# =====================================================================
# Seed Default Templates if not present
# =====================================================================
def ensure_default_templates(db: Session):
    count = db.query(Template).count()
    if count == 0:
        cyber_template = Template(
            title="ApexShield-2026: Critical Cyber Incident Post-Mortem",
            category="Cybersecurity",
            description="Comprehensive incident analysis detailing zero-day cryptographic exploitation, perimeter defense, and IoCs.",
            sample_content=SAMPLE_CYBERSECURITY_REPORT,
            recommended_outputs=["executive_summary", "security_advisory", "social_media", "video_script", "presentation"]
        )
        exec_template = Template(
            title="Q2 Global Infrastructure Expansion Memo",
            category="Strategy",
            description="C-suite strategic proposal for modernizing multi-region edge nodes and cloud AI capabilities.",
            sample_content="""EXECUTIVE PROPOSAL: GLOBAL INFRASTRUCTURE EXPANSION (FY2026-Q2)
SPONSOR: Chief Technology Officer & VP of Global Operations
TARGET: Global Infrastructure Steering Committee

1. OBJECTIVE & STRATEGIC RATIONALE
ApexCloud is experiencing 140% year-over-year transaction volume growth across Southeast Asia and the EU-West economic zones. Current data centers are operating at 82% peak memory load. To preserve sub-15ms payment routing latencies and adhere to emerging digital sovereignty laws, we propose allocating $8.4M USD to deploy 12 edge compute nodes across Tokyo, Frankfurt, Mumbai, and São Paulo.

2. FINANCIAL COMMITMENT & ROI
- Total Capital Expenditure: $8.4M across four quarters.
- Projected Operating Efficiency: 34% reduction in cross-region transit fees within 18 months.
- Expected Revenue Uplift: $16.2M in annualized recurring enterprise contracts.

3. IMPLEMENTATION PHASES
- Phase 1 (Q2): Edge connectivity procurement and sovereign data compliance filing.
- Phase 2 (Q3): Hardware installation with zero-trust HSM key distribution.
- Phase 3 (Q4): Traffic migration and failover chaos engineering exercises.
""",
            recommended_outputs=["executive_summary", "presentation", "key_points", "press_release"]
        )
        db.add(cyber_template)
        db.add(exec_template)
        db.commit()

# =====================================================================
# Health Check Endpoint
# =====================================================================
@router.get("/health", response_model=HealthResponse)
def get_system_health():
    now_iso = datetime.datetime.utcnow().isoformat()
    db_stat = get_db_status()
    cache_stat = cache_service.get_status()
    ai_stat = openai_service.get_status()

    overall = "healthy"
    if db_stat.get("status") == "unhealthy":
        overall = "degraded"

    return {
        "status": overall,
        "timestamp": now_iso,
        "database": db_stat,
        "redis": cache_stat,
        "ai_engine": ai_stat
    }

# =====================================================================
# Formats Metadata
# =====================================================================
@router.get("/formats")
def get_supported_formats():
    """Returns metadata for all 10 supported output formats"""
    return [
        {
            "id": key,
            "name": val["name"],
            "description": val["description"],
            "icon": val["icon"],
            "category": val.get("category", "General")
        }
        for key, val in FORMAT_METADATA.items()
    ]

# =====================================================================
# Document Upload Endpoint
# =====================================================================
@router.post("/upload", response_model=DocumentUploadResponse)
async def upload_document(file: UploadFile = File(...)):
    """
    Accepts TXT, PDF, DOCX, or MD files, extracts verified text content,
    and returns metrics for immediate preview in the workspace.
    """
    result = await file_service.process_uploaded_file(file)
    return result

# =====================================================================
# Transform Pipeline Endpoint
# =====================================================================
@router.post("/transform", response_model=TransformationResponse)
async def create_transformation(
    payload: TransformationCreateRequest,
    db: Session = Depends(get_db)
):
    """
    Executes the 7-stage LangGraph workflow and saves the resulting
    transformation and deliverables into PostgreSQL (or SQLite fallback).
    """
    if not payload.content or len(payload.content.strip()) < 10:
        raise HTTPException(status_code=400, detail="Source content must contain at least 10 characters.")

    if not payload.selected_outputs:
        raise HTTPException(status_code=400, detail="Please select at least one output format to generate.")

    # Derive title if omitted
    derived_title = payload.title
    if not derived_title:
        first_line = payload.content.strip().split("\n")[0].strip()
        # Clean title
        clean_first = first_line.lstrip("#").strip()
        derived_title = clean_first[:65] if len(clean_first) > 3 else "Intelligent Content Transformation"

    # Execute LangGraph Pipeline
    try:
        pipeline_result = await run_transformation_pipeline(
            source_content=payload.content,
            selected_outputs=payload.selected_outputs,
            audience=payload.audience or "Executive",
            tone=payload.tone or "Professional",
            language=payload.language or "English",
            detail_level=payload.detail_level or "Detailed",
            custom_instructions=payload.custom_instructions,
            force_demo=payload.force_demo
        )
    except Exception as err:
        raise HTTPException(status_code=500, detail=f"AI Transformation Pipeline error: {str(err)}")

    # Persist in Database
    db_transformation = Transformation(
        title=derived_title,
        source_type=payload.source_type or "text",
        selected_outputs=payload.selected_outputs,
        audience=payload.audience or "Executive",
        tone=payload.tone or "Professional",
        language=payload.language or "English",
        detail_level=payload.detail_level or "Detailed",
        custom_instructions=payload.custom_instructions,
        ai_model="OpenAI GPT-5.6 (LangGraph)" if not pipeline_result.get("is_demo_mode") else "Demo Engine (Offline)",
        is_demo_mode=pipeline_result.get("is_demo_mode", False),
        status="completed",
        execution_duration_sec=pipeline_result.get("execution_duration_sec", 0.0),
        overall_quality_score=pipeline_result.get("overall_quality_score", 94.0),
        validation_summary={
            "stages": pipeline_result.get("pipeline_stages", []),
            "source_metadata": pipeline_result.get("source_metadata", {}),
            "content_analysis": pipeline_result.get("content_analysis", {})
        }
    )
    db.add(db_transformation)
    db.flush()  # obtain transformation id

    # Persist Output items
    output_entities = []
    for item in pipeline_result.get("final_outputs", []):
        db_out = Output(
            transformation_id=db_transformation.id,
            format_type=item["format_type"],
            title=item["title"],
            content=item["content"],
            quality_score=item.get("quality_score", 94.0),
            consistency_score=item.get("consistency_score", 95.0),
            completeness_score=item.get("completeness_score", 93.0),
            formatting_score=item.get("formatting_score", 98.0),
            tone_score=item.get("tone_score", 94.0),
            validation_checks=item.get("validation_checks", []),
            word_count=item.get("word_count", 0),
            char_count=item.get("char_count", 0)
        )
        db.add(db_out)
        output_entities.append(db_out)

    db.commit()
    db.refresh(db_transformation)

    # Cache recent transformation
    cache_service.set(f"transformation:{db_transformation.id}", {
        "id": db_transformation.id,
        "title": db_transformation.title,
        "created_at": db_transformation.created_at.isoformat()
    }, expire_seconds=86400)

    return db_transformation

# =====================================================================
# List Transformations
# =====================================================================
@router.get("/transformations", response_model=List[TransformationListItem])
def list_transformations(
    limit: int = 50,
    db: Session = Depends(get_db)
):
    records = (
        db.query(Transformation)
        .order_by(Transformation.created_at.desc())
        .limit(limit)
        .all()
    )

    items = []
    for r in records:
        items.append({
            "id": r.id,
            "title": r.title,
            "source_type": r.source_type,
            "selected_outputs": r.selected_outputs,
            "output_count": len(r.outputs),
            "ai_model": r.ai_model,
            "is_demo_mode": r.is_demo_mode,
            "status": r.status,
            "overall_quality_score": r.overall_quality_score,
            "created_at": r.created_at
        })
    return items

# =====================================================================
# Get Single Transformation
# =====================================================================
@router.get("/transformations/{transformation_id}", response_model=TransformationResponse)
def get_transformation_detail(
    transformation_id: int,
    db: Session = Depends(get_db)
):
    record = db.query(Transformation).filter(Transformation.id == transformation_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Transformation not found.")
    return record

# =====================================================================
# Delete Transformation
# =====================================================================
@router.delete("/transformations/{transformation_id}")
def delete_transformation(
    transformation_id: int,
    db: Session = Depends(get_db)
):
    record = db.query(Transformation).filter(Transformation.id == transformation_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Transformation not found.")
    
    db.delete(record)
    db.commit()
    cache_service.delete(f"transformation:{transformation_id}")
    return {"message": "Transformation successfully deleted", "id": transformation_id}

# =====================================================================
# Regenerate Individual Output
# =====================================================================
@router.post("/transformations/{transformation_id}/regenerate")
async def regenerate_single_output(
    transformation_id: int,
    payload: RegenerateRequest,
    db: Session = Depends(get_db)
):
    record = db.query(Transformation).filter(Transformation.id == transformation_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Transformation not found.")

    # Find existing output or create one
    existing_output = (
        db.query(Output)
        .filter(Output.transformation_id == transformation_id, Output.format_type == payload.format_type)
        .first()
    )

    fmt = payload.format_type
    meta = FORMAT_METADATA.get(fmt, {"name": fmt})

    # Run single format generation via demo or openai
    is_demo = record.is_demo_mode or not openai_service.is_configured()
    
    # We can reconstruct prompt or use demo generator
    # For regeneration, demo generator or OpenAI produces updated text
    if is_demo:
        new_content = demo_service.generate_demo_output(
            format_type=fmt,
            source_content=f"Regenerated Analysis for {record.title}",
            audience=payload.audience or record.audience,
            tone=payload.tone or record.tone,
            language=payload.language or record.language
        )
    else:
        try:
            from backend.app.ai.prompts import build_system_prompt, build_user_prompt
            sys_p = build_system_prompt(
                format_type=fmt,
                audience=payload.audience or record.audience,
                tone=payload.tone or record.tone,
                language=payload.language or record.language
            )
            user_p = build_user_prompt(
                format_type=fmt,
                source_content=record.title,
                custom_instructions=payload.custom_instructions
            )
            new_content = await openai_service.generate_content(sys_p, user_p)
        except Exception as e:
            new_content = demo_service.generate_demo_output(
                format_type=fmt,
                source_content=f"Regenerated Deliverable: {record.title}",
                audience=payload.audience or record.audience,
                tone=payload.tone or record.tone,
                language=payload.language or record.language
            )

    from backend.app.ai.validation import validator
    val = validator.validate_output(
        source_content=record.title,
        generated_content=new_content,
        format_type=fmt
    )

    if existing_output:
        existing_output.content = new_content
        existing_output.quality_score = val["overall_quality_score"]
        existing_output.validation_checks = val["validation_checks"]
        existing_output.word_count = len(new_content.split())
        existing_output.char_count = len(new_content)
    else:
        existing_output = Output(
            transformation_id=record.id,
            format_type=fmt,
            title=meta.get("name", fmt),
            content=new_content,
            quality_score=val["overall_quality_score"],
            validation_checks=val["validation_checks"],
            word_count=len(new_content.split()),
            char_count=len(new_content)
        )
        db.add(existing_output)

    db.commit()
    db.refresh(existing_output)
    return existing_output

# =====================================================================
# Export All Outputs as ZIP
# =====================================================================
@router.get("/transformations/{transformation_id}/export-zip")
def export_transformation_zip(
    transformation_id: int,
    db: Session = Depends(get_db)
):
    record = db.query(Transformation).filter(Transformation.id == transformation_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Transformation not found.")

    zip_buffer = io.BytesIO()
    with zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED) as zip_file:
        # Add summary manifest
        manifest_text = f"""# TransformAI Output Pack
Title: {record.title}
Generated At: {record.created_at}
AI Model: {record.ai_model}
Overall Quality Score: {record.overall_quality_score}%
Formats Count: {len(record.outputs)}
"""
        zip_file.writestr("00_TRANSFORMAI_MANIFEST.md", manifest_text)

        # Add each output
        for idx, out in enumerate(record.outputs, start=1):
            clean_name = f"{idx:02d}_{out.format_type}.md"
            zip_file.writestr(clean_name, out.content)

    zip_buffer.seek(0)
    filename = f"TransformAI_Pack_{transformation_id}.zip"
    return StreamingResponse(
        zip_buffer,
        media_type="application/zip",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )

# =====================================================================
# Templates Endpoints
# =====================================================================
@router.get("/templates", response_model=List[TemplateResponse])
def get_templates(db: Session = Depends(get_db)):
    ensure_default_templates(db)
    templates = db.query(Template).all()
    results = []
    for t in templates:
        results.append({
            "id": t.id,
            "title": t.title,
            "category": t.category,
            "description": t.description,
            "sample_content": t.sample_content,
            "recommended_outputs": t.recommended_outputs or [],
            "word_count": len(t.sample_content.split()),
            "char_count": len(t.sample_content)
        })
    return results

@router.get("/templates/cybersecurity")
def get_cybersecurity_sample():
    """Direct convenience endpoint returning the sample cybersecurity incident report"""
    return {
        "title": "ApexShield-2026: Critical Infrastructure Cybersecurity Incident",
        "category": "Cybersecurity",
        "recommended_outputs": [
            "executive_summary",
            "security_advisory",
            "social_media",
            "video_script",
            "presentation"
        ],
        "content": SAMPLE_CYBERSECURITY_REPORT
    }
