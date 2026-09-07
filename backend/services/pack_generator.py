import io
import zipfile
import json
from datetime import datetime
from typing import Dict, Any
from services.ai_engine import TRANSFORMATION_META

def create_output_pack_zip(
    title: str,
    source_text: str,
    analysis: Dict[str, Any],
    transformations: Dict[str, str]
) -> io.BytesIO:
    """
    Creates an in-memory ZIP archive containing:
    - All 6 generated markdown transformations
    - analysis_report.json
    - README.md manifest
    """
    zip_buffer = io.BytesIO()
    timestamp = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC")
    clean_title = title or "Document"
    safe_slug = "".join(c if c.isalnum() else "_" for c in clean_title).strip("_")

    with zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED) as zip_file:
        # 1. Write the 6 transformation markdown files
        total_output_words = 0
        file_manifest = []

        for key, meta in TRANSFORMATION_META.items():
            filename = meta["filename"]
            content = transformations.get(key, "")
            if not content:
                content = f"# {meta['title']}\n\n*Transformation not yet generated.*"
            
            words = len(content.split())
            total_output_words += words
            file_manifest.append(f"- **`{filename}`** — {meta['title']} ({words} words)")
            
            # Add to ZIP under pack folder
            zip_file.writestr(f"{safe_slug}_Pack/{filename}", content)

        # 2. Write analysis report JSON
        analysis_payload = {
            "title": clean_title,
            "generated_at": timestamp,
            "source_metrics": {
                "word_count": analysis.get("word_count", len(source_text.split())),
                "char_count": analysis.get("char_count", len(source_text)),
                "reading_time_mins": analysis.get("reading_time_mins", 1),
                "flesch_kincaid_grade": analysis.get("flesch_kincaid_grade", 10.0),
                "detected_tone": analysis.get("detected_tone", "Professional"),
                "key_themes": analysis.get("key_themes", [])
            },
            "output_metrics": {
                "transformations_count": len(transformations),
                "total_output_words": total_output_words
            }
        }
        zip_file.writestr(
            f"{safe_slug}_Pack/analysis_report.json",
            json.dumps(analysis_payload, indent=2)
        )

        # 3. Write README manifest
        manifest_md = f"""# 📦 TransformAI Output Pack: {clean_title}

**Generated with TransformAI**
- **Date**: {timestamp}
- **Source Word Count**: {analysis.get('word_count', 0):,} words
- **Total Repurposed Words**: {total_output_words:,} words
- **Detected Tone**: {analysis.get('detected_tone', 'Professional')}
- **Reading Level**: {analysis.get('reading_level', 'High School')}

---

## 📂 Included Transformations

{chr(10).join(file_manifest)}
- **`analysis_report.json`** — Machine-readable linguistic & performance metrics

---

## 🚀 Quick Usage Guide

1. **Executive Briefing**: Paste into team Notion / Confluence / Slack memo.
2. **Social Media**: Schedule Twitter/X thread via Typefully/Buffer; publish LinkedIn post directly.
3. **FAQ & Study Guide**: Embed into customer knowledge base or team onboarding wiki.
4. **Editorial Blog Post**: Publish to CMS (WordPress, Ghost, Substack, Medium).
5. **Slide Deck Outline**: Import outline into Google Slides, PowerPoint, or Gamma.
6. **Email Newsletter**: Paste HTML/Markdown directly into Mailchimp, ConvertKit, or Substack.

---
*Created by TransformAI — Autonomous Document Transformation Platform*
"""
        zip_file.writestr(f"{safe_slug}_Pack/README.md", manifest_md)

    zip_buffer.seek(0)
    return zip_buffer
