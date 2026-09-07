from typing import Dict, Any

FORMAT_METADATA = {
    "executive_summary": {
        "name": "Executive Summary",
        "description": "Strategic C-suite briefing with contextual background, risk/opportunity assessment, and actionable next steps.",
        "icon": "Briefcase",
        "category": "Leadership"
    },
    "security_advisory": {
        "name": "Security Advisory",
        "description": "Technical cybersecurity alert with vulnerability analysis, impact scope, IoCs, and urgent containment protocol.",
        "icon": "ShieldAlert",
        "category": "Technical"
    },
    "social_media": {
        "name": "Social Media Suite",
        "description": "Cross-platform campaign including X/Twitter thread, LinkedIn thought-leadership article, and Instagram carousel copy.",
        "icon": "Share2",
        "category": "Marketing"
    },
    "video_script": {
        "name": "Video Script",
        "description": "Broadcast-ready production script with timestamped segments, visual camera cues, and verbatim presenter narration.",
        "icon": "Video",
        "category": "Media"
    },
    "presentation": {
        "name": "Presentation Content",
        "description": "Comprehensive slide deck blueprint (8-10 slides) featuring visual suggestions, bullets, and speaker notes.",
        "icon": "Layout",
        "category": "Communication"
    },
    "infographic": {
        "name": "Infographic Blueprint",
        "description": "Visual data hierarchy, key callout statistics, iconography recommendations, and section-by-section layout.",
        "icon": "BarChart3",
        "category": "Design"
    },
    "press_release": {
        "name": "Press Release",
        "description": "AP-standard official announcement with dateline, headline, leadership quotes, and media boilerplate.",
        "icon": "Newspaper",
        "category": "PR"
    },
    "key_points": {
        "name": "Key Takeaways",
        "description": "High-density scannable digest highlighting critical facts, metrics, decisions, and immediate milestones.",
        "icon": "CheckSquare",
        "category": "Productivity"
    },
    "faq": {
        "name": "Interactive FAQ",
        "description": "Structured Q&A categorized from foundational concepts to advanced operational and compliance questions.",
        "icon": "HelpCircle",
        "category": "Education"
    },
    "custom_output": {
        "name": "Custom Transformation",
        "description": "Tailored format adhering strictly to user-defined specialized instructions and structure.",
        "icon": "Sparkles",
        "category": "Custom"
    }
}

AUDIENCE_GUIDELINES = {
    "General Public": "Use universally accessible language, avoid unnecessary jargon, explain technical terms simply, and emphasize direct human relevance.",
    "Technical": "Use precise domain terminology, technical parameters, engineering specifications, architectural implications, and clear technical accuracy.",
    "Executive": "Focus on high-level business impact, strategic ROI, resource allocation, risk mitigation, and executive decision frameworks.",
    "Government": "Employ formal public policy phrasing, compliance considerations, regulatory standards, public safety implications, and official clarity.",
    "Students": "Prioritize clarity, pedagogical analogies, step-by-step conceptual breakdowns, and active learning takeaways.",
    "Media": "Highlight the human hook, newsworthiness, notable quotations, factual chronologies, and easily quotable soundbites."
}

TONE_GUIDELINES = {
    "Professional": "Balanced, objective, polished, authoritative, and respectful.",
    "Formal": "Dignified, structured, academic, official, and rigorous.",
    "Simple": "Direct, plain-spoken, crisp, short sentences, and immediately understandable.",
    "Technical": "Deeply analytical, rigorous, precise, systematic, and data-focused.",
    "Conversational": "Warm, engaging, approachable, natural, and persuasive."
}

LANGUAGE_GUIDELINES = {
    "English": "Compose entirely in clear, modern, articulate English.",
    "Hindi": "Compose in standard, formal, polished Hindi (Devanagari script) with natural phrasing.",
    "Hinglish": "Compose in natural, engaging Hinglish (conversational Hindi-English blend written in Roman script), popular in modern Indian tech and media communication."
}

DETAIL_GUIDELINES = {
    "Short": "Be extremely concise, high-density, and scannable. Limit to essential points only (under 300 words).",
    "Medium": "Deliver a well-rounded, balanced treatment with sufficient context, evidence, and elaboration (400-800 words).",
    "Detailed": "Provide an exhaustive, thorough, deep-dive output covering nuances, methodologies, edge cases, and complete guidance (900-1500+ words)."
}

def build_system_prompt(
    format_type: str,
    audience: str = "Executive",
    tone: str = "Professional",
    language: str = "English",
    detail: str = "Detailed"
) -> str:
    format_info = FORMAT_METADATA.get(format_type, {"name": format_type, "description": "Custom transformed output"})
    aud_rule = AUDIENCE_GUIDELINES.get(audience, AUDIENCE_GUIDELINES["Executive"])
    tone_rule = TONE_GUIDELINES.get(tone, TONE_GUIDELINES["Professional"])
    lang_rule = LANGUAGE_GUIDELINES.get(language, LANGUAGE_GUIDELINES["English"])
    detail_rule = DETAIL_GUIDELINES.get(detail, DETAIL_GUIDELINES["Detailed"])

    return f"""You are TransformAI's specialized GenAI content architect for '{format_info['name']}'.
Your task is to transform the provided source content into an exceptional, publication-ready '{format_info['name']}'.

TARGET PARAMETERS:
- Format: {format_info['name']} ({format_info['description']})
- Target Audience: {audience} -> {aud_rule}
- Writing Tone: {tone} -> {tone_rule}
- Target Language: {language} -> {lang_rule}
- Detail Level: {detail} -> {detail_rule}

STRICT GROUNDING & QUALITY RULES:
1. Source Grounding: All facts, numbers, dates, incident names, and claims MUST be grounded in the provided source content. Do NOT hallucinate unstated external events or fabricated metrics.
2. Structure & Markdown: Output richly formatted, clean Markdown with clear headings (##, ###), bullet points, tables where relevant, and bold callouts.
3. Completeness: Do not truncate or use placeholders like "[Insert more here]". Deliver the finished deliverable.
4. Audience-Tailored Delivery: Ensure the language and complexity precisely match the {audience} audience and {tone} tone.
"""

def build_user_prompt(
    format_type: str,
    source_content: str,
    custom_instructions: str = None
) -> str:
    instructions_block = f"\nADDITIONAL CUSTOM INSTRUCTIONS:\n{custom_instructions}\n" if custom_instructions else ""

    format_specific_instructions = {
        "executive_summary": """
Structure the Executive Summary with:
# Executive Briefing: [Descriptive Title]
## 1. Strategic Context & Background
## 2. Key Findings & Critical Facts
## 3. Risk & Opportunity Assessment (Matrix / Table)
## 4. Resource & Timeline Implications
## 5. Recommended Strategic Action Items (Prioritized Immediate / Short-term / Long-term)
""",
        "security_advisory": """
Structure the Security Advisory with:
# SECURITY ADVISORY: [Incident / Threat Title]
**Advisory ID**: TAI-SEC-{YYYY}-01 | **Severity Rating**: HIGH / CRITICAL | **Target**: All System Operators
## 1. Overview & Threat Vector
## 2. Affected Infrastructure & Systems
## 3. Observed Indicators of Compromise (IoCs) (IPs, Hashes, Signatures if mentioned)
## 4. Immediate Containment Protocols (Step-by-step checklist)
## 5. Remediation & Hardening Roadmap
## 6. Incident Reporting & Escalation Points
""",
        "social_media": """
Structure as a multi-channel social package:
# Multi-Channel Social Media Campaign Pack

### Part 1: Twitter / X Thread (7-8 Tweets)
- Tweet 1: High-converting Hook
- Tweet 2-6: Value nuggets, key insights, surprising facts
- Tweet 7: Summary & actionable takeaway
- Tweet 8: Call to Action + Relevant Hashtags

### Part 2: LinkedIn Thought Leadership Article
- Compelling storytelling opening
- Deep context & leadership perspective
- 3 key organizational takeaways
- Concluding discussion question + 5 targeted hashtags

### Part 3: Instagram / Carousel Deck (6-7 Slides)
- Slide 1: Cover Hook Title
- Slide 2: The Core Problem
- Slides 3-5: The Breakthrough Points
- Slide 6: Action Checklist
- Slide 7: Save & Share CTA
""",
        "video_script": """
Structure as a professional video production script:
# Production Video Script: [Topic Title]
**Estimated Runtime**: 3-4 Minutes | **Tone & Delivery**: Engaging, Authoritative

| Timestamp | Visual Direction / B-Roll Cue | Audio Narration / Presenter Dialogue |
|---|---|---|
| [00:00 - 00:25] | [Camera opens on presenter...] | "Hook dialogue..." |
| [00:25 - 01:10] | [Graphic overlay showing...] | "Context narration..." |
| [01:10 - 02:20] | [Split screen with data...] | "Core breakdown..." |
| [02:20 - 03:15] | [Action checklist animation] | "Takeaways & next steps..." |
| [03:15 - 03:45] | [Lower-third CTA graphic] | "Concluding sign-off..." |

## Director & Presenter Production Notes:
- Pacing, inflection, key emphasis words.
""",
        "presentation": """
Structure as an 8-10 Slide Deck Outline:
# Presentation Deck: [Topic Title]
## Slide 1: Title Slide
- **Headline**: ...
- **Sub-headline**: ...
- **Visual Suggestion**: ...
- **Speaker Notes**: ...

## Slide 2: Executive Context & Current Landscape
- **Bullet Points**: ...
- **Visual Suggestion**: ...
- **Speaker Notes**: ...

(Continue through 8-10 logically structured slides covering Challenge, Data, Strategy, Solution, Implementation, and Conclusion)
""",
        "infographic": """
Structure as an Infographic Content Wireframe:
# Infographic Design Blueprint: [Topic Title]
## Header Banner
- Headline & Subtitle
## Section 1: The Big Metric (Key Stat Callouts in large font)
## Section 2: Core Dynamics (3-column comparison / iconography)
## Section 3: Step-by-step Process Flow (Timeline or roadmap)
## Section 4: Critical Warnings / Checklist
## Footer: Data Sources & Organization Attribution
""",
        "press_release": """
Structure according to AP Press Release standards:
# FOR IMMEDIATE RELEASE
**Dateline**: [City, State] — [Current Date]
**Headline**: [Strong, Newsworthy Title]
**Sub-headline**: [Complementary Context]

**Body Paragraphs**:
- Lead paragraph answering Who, What, Where, When, Why
- Background & significance
- Executive Leadership Quote: "[Quote reflecting vision & impact]"
- Operational or technical context
- Stakeholder / Partner Quote
- Concluding call-to-action

### About the Organization (Boilerplate)
### Media Contact Information
""",
        "key_points": """
Structure as an Executive Fast-Read Sheet:
# Key Takeaways & Action Summary: [Topic]
## ⚡ Top 5 Crucial Insights
## 📊 Quantitative Data & Metrics Highlights
## 🎯 Decisions Required Immediately
## ⚠️ Risk & Vulnerability Matrix
## 📅 Milestone Timeline & Deadlines
""",
        "faq": """
Structure as a 3-Tier Categorized FAQ:
# Frequently Asked Questions: [Topic]

## Category A: Foundational & Overview Questions (3 Q&As)
**Q1**: ...
*Answer*: ...

## Category B: Technical, Implementation & Operational Questions (4 Q&As)
**Q1**: ...
*Answer*: ...

## Category C: Strategic, Policy & Governance Questions (3 Q&As)
**Q1**: ...
*Answer*: ...
""",
        "custom_output": """
Structure dynamically according to the custom instructions while maintaining professional Markdown formatting:
"""
    }

    selected_format_prompt = format_specific_instructions.get(format_type, "Transform the source thoroughly into the requested format.")

    return f"""SOURCE CONTENT:
\"\"\"
{source_content}
\"\"\"
{instructions_block}

TASK REQUIREMENTS:
{selected_format_prompt}

Generate the complete, high-quality output now in valid Markdown:"""
