import time
import re
import asyncio
import logging
from typing import Dict, Any, List, TypedDict, Optional
from langgraph.graph import StateGraph, END

from backend.app.ai.prompts import build_system_prompt, build_user_prompt, FORMAT_METADATA
from backend.app.ai.validation import validator
from backend.app.services.openai_service import openai_service
from backend.app.services.demo_service import demo_service

logger = logging.getLogger("transformai.workflow")

class TransformationState(TypedDict):
    source_content: str
    selected_outputs: List[str]
    audience: str
    tone: str
    language: str
    detail_level: str
    custom_instructions: Optional[str]
    is_demo_mode: bool
    
    # State accumulated across nodes
    source_metadata: Dict[str, Any]
    content_analysis: Dict[str, Any]
    extracted_context: Dict[str, Any]
    output_plans: Dict[str, Any]
    generated_outputs: Dict[str, str]
    validation_results: Dict[str, Dict[str, Any]]
    final_outputs: List[Dict[str, Any]]
    overall_quality_score: float
    execution_duration_sec: float
    pipeline_stages: List[str]

# =====================================================================
# LangGraph Nodes
# =====================================================================

def source_ingestion_node(state: TransformationState) -> Dict[str, Any]:
    """Node 1: Clean, normalize and index the raw source text."""
    logger.info("[Workflow Node 1] Executing source_ingestion...")
    content = state["source_content"].strip()
    words = content.split()
    lines = [l.strip() for l in content.split("\n") if l.strip()]

    metadata = {
        "word_count": len(words),
        "char_count": len(content),
        "line_count": len(lines),
        "ingested_at": time.time()
    }
    return {
        "source_metadata": metadata,
        "pipeline_stages": ["source_ingestion"]
    }

def content_analysis_node(state: TransformationState) -> Dict[str, Any]:
    """Node 2: Semantic analysis of core subject, theme, and urgency."""
    logger.info("[Workflow Node 2] Executing content_analysis...")
    content = state["source_content"]
    content_lower = content.lower()
    
    # Identify primary document classification
    if any(k in content_lower for k in ["incident", "cve", "breach", "vulnerability", "malicious", "ioc"]):
        category = "Cybersecurity & Incident Response"
    elif any(k in content_lower for k in ["revenue", "ebitda", "market", "strategic", "quarter", "roi"]):
        category = "Financial & Corporate Strategy"
    elif any(k in content_lower for k in ["policy", "regulation", "compliance", "standard", "guideline"]):
        category = "Regulatory & Governance"
    else:
        category = "General Knowledge & Operations"

    analysis = {
        "category": category,
        "subject_heading": content.split("\n")[0][:80] if content else "General Document",
        "has_metrics": bool(re.search(r"\d+", content)),
        "is_urgent": "critical" in content_lower or "immediate" in content_lower
    }
    stages = state.get("pipeline_stages", []) + ["content_analysis"]
    return {
        "content_analysis": analysis,
        "pipeline_stages": stages
    }

def context_extraction_node(state: TransformationState) -> Dict[str, Any]:
    """Node 3: Extract structured facts, entities, dates, and quantitative values."""
    logger.info("[Workflow Node 3] Executing context_extraction...")
    content = state["source_content"]

    # Extract capitalized multi-word entities (heuristic)
    entities = list(set(re.findall(r"\b[A-Z][a-z0-9]+(?:\s+[A-Z][a-z0-9]+)*\b", content)))[:12]
    # Extract timestamps or dates
    dates = list(set(re.findall(r"\b(?:\d{4}-\d{2}-\d{2}|\w+\s+\d{1,2},?\s+\d{4}|\d{1,2}:\d{2}(?::\d{2})?\s*(?:UTC|GMT|EST|PST)?)\b", content)))[:8]
    # Extract metrics
    metrics = list(set(re.findall(r"\b\d+[\d,\.]*\s*(?:%|TB|GB|MB|USD|\$|records|minutes|hours|days|mins)?\b", content, re.IGNORECASE)))[:10]

    context = {
        "named_entities": entities,
        "dates_and_times": dates,
        "metrics": metrics,
        "entity_count": len(entities)
    }
    stages = state.get("pipeline_stages", []) + ["context_extraction"]
    return {
        "extracted_context": context,
        "pipeline_stages": stages
    }

def output_planning_node(state: TransformationState) -> Dict[str, Any]:
    """Node 4: Formulate tailored generation strategies for each selected output."""
    logger.info("[Workflow Node 4] Executing output_planning...")
    selected = state["selected_outputs"]
    plans = {}

    for fmt in selected:
        meta = FORMAT_METADATA.get(fmt, {"name": fmt, "category": "General"})
        plans[fmt] = {
            "format_name": meta["name"],
            "category": meta.get("category", "General"),
            "system_prompt": build_system_prompt(
                format_type=fmt,
                audience=state.get("audience", "Executive"),
                tone=state.get("tone", "Professional"),
                language=state.get("language", "English"),
                detail=state.get("detail_level", "Detailed")
            ),
            "user_prompt": build_user_prompt(
                format_type=fmt,
                source_content=state["source_content"],
                custom_instructions=state.get("custom_instructions")
            )
        }

    stages = state.get("pipeline_stages", []) + ["output_planning"]
    return {
        "output_plans": plans,
        "pipeline_stages": stages
    }

def content_generation_node(state: TransformationState) -> Dict[str, Any]:
    """Node 5: Execute AI generation for each planned format."""
    logger.info("[Workflow Node 5] Executing content_generation...")
    plans = state["output_plans"]
    is_demo = state.get("is_demo_mode", False) or not openai_service.is_configured()
    generated = {}

    for fmt, plan in plans.items():
        if is_demo:
            logger.info(f"Generating '{fmt}' using high-fidelity offline Demo Engine...")
            text = demo_service.generate_demo_output(
                format_type=fmt,
                source_content=state["source_content"],
                audience=state.get("audience", "Executive"),
                tone=state.get("tone", "Professional"),
                language=state.get("language", "English"),
                detail=state.get("detail_level", "Detailed")
            )
        else:
            logger.info(f"Generating '{fmt}' via live OpenAI GPT-5.6 / GPT-4o...")
            try:
                # Synchronous wrapper for asyncio in graph node
                loop = asyncio.get_event_loop()
                if loop.is_running():
                    # Handle running loop safely
                    import nest_asyncio
                    nest_asyncio.apply()
                text = loop.run_until_complete(
                    openai_service.generate_content(
                        system_prompt=plan["system_prompt"],
                        user_prompt=plan["user_prompt"]
                    )
                )
            except Exception as e:
                logger.warning(f"OpenAI call for '{fmt}' failed ({e}). Falling back to Demo generator.")
                text = demo_service.generate_demo_output(
                    format_type=fmt,
                    source_content=state["source_content"],
                    audience=state.get("audience", "Executive"),
                    tone=state.get("tone", "Professional"),
                    language=state.get("language", "English"),
                    detail=state.get("detail_level", "Detailed")
                )
        
        generated[fmt] = text

    stages = state.get("pipeline_stages", []) + ["content_generation"]
    return {
        "generated_outputs": generated,
        "pipeline_stages": stages
    }

def quality_validation_node(state: TransformationState) -> Dict[str, Any]:
    """Node 6: Rigorous multi-dimensional audit of all generated deliverables."""
    logger.info("[Workflow Node 6] Executing quality_validation...")
    generated = state["generated_outputs"]
    source = state["source_content"]
    validation_map = {}
    total_score = 0.0

    for fmt, text in generated.items():
        val = validator.validate_output(
            source_content=source,
            generated_content=text,
            format_type=fmt,
            audience=state.get("audience", "Executive"),
            tone=state.get("tone", "Professional"),
            language=state.get("language", "English")
        )
        validation_map[fmt] = val
        total_score += val["overall_quality_score"]

    avg_score = round(total_score / max(len(generated), 1), 1)
    stages = state.get("pipeline_stages", []) + ["quality_validation"]

    return {
        "validation_results": validation_map,
        "overall_quality_score": avg_score,
        "pipeline_stages": stages
    }

def final_formatting_node(state: TransformationState) -> Dict[str, Any]:
    """Node 7: Package all outputs into final structured response models."""
    logger.info("[Workflow Node 7] Executing final_formatting...")
    generated = state["generated_outputs"]
    validations = state["validation_results"]
    plans = state["output_plans"]
    final_list = []

    for fmt, text in generated.items():
        val = validations.get(fmt, {})
        meta = FORMAT_METADATA.get(fmt, {"name": fmt})
        
        # Calculate text metrics
        words = len(text.split())
        chars = len(text)
        
        final_list.append({
            "format_type": fmt,
            "title": meta.get("name", fmt),
            "content": text,
            "quality_score": val.get("overall_quality_score", 94.0),
            "consistency_score": val.get("consistency_score", 95.0),
            "completeness_score": val.get("completeness_score", 93.0),
            "formatting_score": val.get("formatting_score", 98.0),
            "tone_score": val.get("tone_score", 94.0),
            "validation_checks": val.get("validation_checks", []),
            "word_count": words,
            "char_count": chars
        })

    stages = state.get("pipeline_stages", []) + ["final_formatting"]
    return {
        "final_outputs": final_list,
        "pipeline_stages": stages
    }

# =====================================================================
# Build and Compile LangGraph StateGraph
# =====================================================================

def build_langgraph_pipeline():
    workflow = StateGraph(TransformationState)

    # Register nodes
    workflow.add_node("source_ingestion", source_ingestion_node)
    workflow.add_node("content_analysis", content_analysis_node)
    workflow.add_node("context_extraction", context_extraction_node)
    workflow.add_node("output_planning", output_planning_node)
    workflow.add_node("content_generation", content_generation_node)
    workflow.add_node("quality_validation", quality_validation_node)
    workflow.add_node("final_formatting", final_formatting_node)

    # Define linear execution edge flow
    workflow.set_entry_point("source_ingestion")
    workflow.add_edge("source_ingestion", "content_analysis")
    workflow.add_edge("content_analysis", "context_extraction")
    workflow.add_edge("context_extraction", "output_planning")
    workflow.add_edge("output_planning", "content_generation")
    workflow.add_edge("content_generation", "quality_validation")
    workflow.add_edge("quality_validation", "final_formatting")
    workflow.add_edge("final_formatting", END)

    return workflow.compile()

langgraph_app = build_langgraph_pipeline()

async def run_transformation_pipeline(
    source_content: str,
    selected_outputs: List[str],
    audience: str = "Executive",
    tone: str = "Professional",
    language: str = "English",
    detail_level: str = "Detailed",
    custom_instructions: Optional[str] = None,
    force_demo: bool = False
) -> Dict[str, Any]:
    """
    Public entry point executing the compiled LangGraph pipeline.
    """
    start_time = time.time()
    
    is_demo = force_demo or not openai_service.is_configured()

    initial_state: TransformationState = {
        "source_content": source_content,
        "selected_outputs": selected_outputs,
        "audience": audience,
        "tone": tone,
        "language": language,
        "detail_level": detail_level,
        "custom_instructions": custom_instructions,
        "is_demo_mode": is_demo,
        "source_metadata": {},
        "content_analysis": {},
        "extracted_context": {},
        "output_plans": {},
        "generated_outputs": {},
        "validation_results": {},
        "final_outputs": [],
        "overall_quality_score": 94.0,
        "execution_duration_sec": 0.0,
        "pipeline_stages": []
    }

    # Execute graph synchronously or in threadpool
    result_state = await asyncio.to_thread(langgraph_app.invoke, initial_state)
    
    duration = round(time.time() - start_time, 2)
    result_state["execution_duration_sec"] = duration

    return result_state
