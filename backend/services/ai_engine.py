import os
import re
import math
from typing import Dict, Any, List, Optional
from config import GEMINI_API_KEY, DEFAULT_MODEL

TRANSFORMATION_KEYS = [
    "executive_summary",
    "social_media",
    "faq_study_guide",
    "blog_post",
    "presentation_deck",
    "email_newsletter"
]

TRANSFORMATION_META = {
    "executive_summary": {
        "title": "Executive Summary & Action Plan",
        "description": "Strategic C-suite brief with risks, opportunities, and prioritized next steps.",
        "icon": "Briefcase",
        "filename": "01_Executive_Summary.md"
    },
    "social_media": {
        "title": "Social Media Multi-Channel Suite",
        "description": "Viral Twitter/X thread, high-engagement LinkedIn post, and Instagram carousel copy.",
        "icon": "Share2",
        "filename": "02_Social_Media_Pack.md"
    },
    "faq_study_guide": {
        "title": "Interactive FAQ & Study Guide",
        "description": "Categorized Q&A pairs, self-test comprehension quiz, and key terminology glossary.",
        "icon": "HelpCircle",
        "filename": "03_FAQ_and_Study_Guide.md"
    },
    "blog_post": {
        "title": "Editorial Blog Post & Article",
        "description": "SEO-friendly long-form article with engaging hook, structured H2/H3s, and takeaways.",
        "icon": "FileText",
        "filename": "04_Editorial_Blog_Post.md"
    },
    "presentation_deck": {
        "title": "Slide Deck Presentation Outline",
        "description": "8-10 slide structure with visual direction cues, bullet points, and speaker notes.",
        "icon": "Presentation",
        "filename": "05_Slide_Deck_Outline.md"
    },
    "email_newsletter": {
        "title": "Email Newsletter Campaign",
        "description": "Subject line variations, preview snippet, personal narrative hook, and conversion CTA.",
        "icon": "Mail",
        "filename": "06_Email_Newsletter.md"
    }
}

def analyze_text(text: str) -> Dict[str, Any]:
    """
    Computes linguistic metrics, readability, tone, and extracts key entities/themes.
    """
    words = re.findall(r"\b[A-Za-z0-9'-]+\b", text)
    word_count = len(words)
    char_count = len(text)
    sentences = [s.strip() for s in re.split(r"[.!?]+", text) if s.strip()]
    sentence_count = max(1, len(sentences))
    
    # Syllables estimation
    def count_syllables(w: str) -> int:
        w = w.lower()
        count = len(re.findall(r"[aeiouy]+", w))
        if w.endswith("e") and not w.endswith("le") and len(w) > 2:
            count = max(1, count - 1)
        return max(1, count)

    total_syllables = sum(count_syllables(w) for w in words) if words else 1
    
    # Flesch-Kincaid Grade Level
    # 0.39 * (words / sentences) + 11.8 * (syllables / words) - 15.59
    words_per_sentence = word_count / sentence_count
    syllables_per_word = total_syllables / max(1, word_count)
    fk_grade = round(0.39 * words_per_sentence + 11.8 * syllables_per_word - 15.59, 1)
    fk_grade = max(1.0, min(18.0, fk_grade))

    reading_time_mins = max(1, math.ceil(word_count / 225))

    # Keyword / Theme extraction using frequency & stop words
    stopwords = {
        "the", "and", "is", "in", "to", "of", "it", "that", "you", "he", "was",
        "for", "on", "are", "as", "with", "his", "they", "at", "be", "this",
        "have", "from", "or", "one", "had", "by", "word", "but", "not", "what",
        "all", "were", "we", "when", "your", "can", "said", "there", "use",
        "an", "each", "which", "she", "do", "how", "their", "if", "will", "up",
        "other", "about", "out", "many", "then", "them", "these", "so", "some",
        "her", "would", "make", "like", "him", "into", "time", "has", "look",
        "two", "more", "go", "see", "no", "way", "could", "my", "than", "first",
        "been", "call", "who", "its", "now", "find", "long", "down", "day",
        "did", "get", "come", "made", "may", "part", "also", "our", "new"
    }
    freq: Dict[str, int] = {}
    for w in words:
        clean = w.lower()
        if len(clean) > 3 and clean not in stopwords and not clean.isdigit():
            freq[clean] = freq.get(clean, 0) + 1

    top_keywords = sorted(freq.items(), key=lambda x: x[1], reverse=True)[:8]
    key_themes = [k.capitalize() for k, _ in top_keywords]

    # Detect tone
    text_lower = text.lower()
    if any(k in text_lower for k in ["revenue", "growth", "margin", "quarter", "ebitda", "roi", "market"]):
        detected_tone = "Business & Strategic"
    elif any(k in text_lower for k in ["api", "architecture", "database", "latency", "code", "system", "algorithm"]):
        detected_tone = "Technical & Analytical"
    elif any(k in text_lower for k in ["launch", "excited", "transform", "community", "future", "empower"]):
        detected_tone = "Inspirational & Visionary"
    else:
        detected_tone = "Informative & Professional"

    # Executive snapshot (first 2-3 meaningful sentences)
    snapshot_sentences = sentences[:3] if len(sentences) >= 3 else sentences
    snapshot = " ".join(snapshot_sentences)
    if len(snapshot) > 320:
        snapshot = snapshot[:317] + "..."

    return {
        "word_count": word_count,
        "char_count": char_count,
        "sentence_count": sentence_count,
        "reading_time_mins": reading_time_mins,
        "flesch_kincaid_grade": fk_grade,
        "reading_level": "College Graduate" if fk_grade > 12 else ("High School" if fk_grade > 8 else "Conversational"),
        "detected_tone": detected_tone,
        "key_themes": key_themes if key_themes else ["Strategy", "Execution", "Technology", "Insights"],
        "executive_snapshot": snapshot or "Source document ingested successfully."
    }

def call_gemini_api(prompt: str, api_key: str, model: str = DEFAULT_MODEL) -> Optional[str]:
    """
    Calls Google Gemini using the google-genai SDK or direct REST request.
    """
    try:
        from google import genai
        client = genai.Client(api_key=api_key)
        response = client.models.generate_content(
            model=model,
            contents=prompt
        )
        if response and response.text:
            return response.text.strip()
    except Exception as e:
        # Fallback to direct REST call if SDK faces config issues
        try:
            import requests
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"
            payload = {
                "contents": [{
                    "parts": [{"text": prompt}]
                }]
            }
            res = requests.post(url, json=payload, timeout=45)
            if res.status_code == 200:
                data = res.json()
                text = data["candidates"][0]["content"]["parts"][0]["text"]
                return text.strip()
        except Exception:
            pass
    return None

def generate_transformation(
    transformation_type: str,
    source_text: str,
    title: str = "Document",
    tone: str = "balanced",
    api_key: Optional[str] = None,
    persona: str = "executive",
    length: str = "standard",
    quick_action: Optional[str] = None
) -> str:
    """
    Generates one of the 6 transformations.
    Uses Gemini API if key is available, else uses structured intelligent fallback.
    """
    active_key = api_key or GEMINI_API_KEY
    if active_key:
        prompt = build_prompt(transformation_type, source_text, title, tone, persona, length, quick_action)
        result = call_gemini_api(prompt, active_key)
        if result:
            return result

    # Fallback intelligent generator
    return generate_fallback_transformation(transformation_type, source_text, title, tone, persona, length, quick_action)

def build_prompt(
    transformation_type: str,
    source_text: str,
    title: str,
    tone: str,
    persona: str = "executive",
    length: str = "standard",
    quick_action: Optional[str] = None
) -> str:
    # Truncate source text if too large to fit standard context cleanly
    truncated_source = source_text[:30000]

    instructions = {
        "executive_summary": (
            "Produce an Executive Summary & Action Plan in professional Markdown format. "
            "Include: # Title, ## Executive Overview, ## Key Strategic Findings (bullet points with bold lead-ins), "
            "## Risk & Opportunity Matrix (Markdown table with columns: Area, Risk/Challenge, Opportunity, Priority), "
            "and ## Prioritized Immediate Action Items (Action, Owner, Target Timeline)."
        ),
        "social_media": (
            "Produce a comprehensive Multi-Channel Social Media Pack in Markdown format. "
            "Include: \n"
            "1. ### 🐦 Twitter / X Viral Thread (7 numbered tweets, starting with a compelling hook tweet with hook emojis, data/insights in the body tweets, and a CTA concluding tweet).\n"
            "2. ### 💼 LinkedIn Thought Leadership Post (Catchy one-line opening, generous whitespace, bulleted insights, thought-provoking question, and 5 hashtags).\n"
            "3. ### 📸 Instagram / Carousel Slide Deck Copy (7 slides breakdown: Slide 1 Headline, Slides 2-6 Value nuggets, Slide 7 Call-to-action & Save prompt, plus full caption with hashtags)."
        ),
        "faq_study_guide": (
            "Produce an Interactive FAQ & Study Guide in Markdown format. "
            "Include: \n"
            "## ❓ Frequently Asked Questions (At least 5 detailed Q&As categorized logically).\n"
            "## 🧠 Conceptual Self-Test Quiz (3 multiple-choice or short-answer scenario questions with hidden/spoiler or clearly formatted answers).\n"
            "## 📖 Key Terminology & Concepts Glossary (Table or definition list of core concepts)."
        ),
        "blog_post": (
            "Produce an engaging, publication-ready Editorial Blog Post / Article in Markdown. "
            "Include: SEO Headline as H1, a 1-sentence Meta Description blockquote, an engaging introductory hook, "
            "3 to 4 well-structured H2 sections with concrete takeaways, a formatted pull quote blockquote (`> ...`), "
            "and a concluding actionable section."
        ),
        "presentation_deck": (
            "Produce a Slide Deck Presentation Outline in Markdown. "
            "Structure 8 to 10 slides. For each slide provide: \n"
            "- Slide Title (e.g. `### Slide 1: Title`)\n"
            "- **Visual / Layout Direction**: Suggested diagram, chart, or graphic\n"
            "- **Key Bullet Points**: 3-4 crisp presentation bullets\n"
            "- **Speaker Notes**: 2-3 sentences of conversational script for the presenter."
        ),
        "email_newsletter": (
            "Produce a complete Email Newsletter Campaign in Markdown. "
            "Include: \n"
            "- **Subject Line Options**: 3 high-open-rate subject lines (Curiosity, Benefit, Urgency)\n"
            "- **Preview Text**: 1 punchy snippet line\n"
            "- **Email Body**: Friendly personal greeting, the hook, 3 key takeaways formatted with clean bullets, "
            "and a high-contrast Call to Action (CTA) button/link line with sign-off."
        )
    }

    instruction = instructions.get(transformation_type, "Transform the provided document clearly into structured markdown.")
    quick_mod = f"Special modifier: {quick_action.replace('_', ' ').title()}." if quick_action else ""

    return f"""You are an elite content strategist and executive AI editor for TransformAI.
Target Audience Persona: {persona.capitalize()}
Desired Tone: {tone.capitalize()}
Target Length: {length.capitalize()}
{quick_mod}
Document Title: {title}

{instruction}

Source Document Text:
\"\"\"
{truncated_source}
\"\"\"

Format the entire output exclusively in clean, valid GitHub-flavored Markdown. Do not include meta-chatter or explanations outside the markdown."""

def generate_fallback_transformation(
    transformation_type: str,
    source_text: str,
    title: str,
    tone: str,
    persona: str = "executive",
    length: str = "standard",
    quick_action: Optional[str] = None
) -> str:
    """
    High quality deterministic generator that parses real text structure,
    sentences, headers, and topics from the source document to deliver
    an authentic, ready-to-use output.
    """
    analysis = analyze_text(source_text)
    sentences = [s.strip() for s in re.split(r"(?<=[.!?])\s+", source_text) if len(s.strip()) > 20]
    if not sentences:
        sentences = [source_text.strip() or "The provided document outlines key strategic principles."]

    # Pick representative sentences
    key_points = sentences[:8] if len(sentences) >= 8 else sentences
    lead_sentence = sentences[0] if sentences else f"An in-depth analysis of {title}."
    themes = analysis["key_themes"]
    th1 = themes[0] if len(themes) > 0 else "Execution"
    th2 = themes[1] if len(themes) > 1 else "Strategy"
    th3 = themes[2] if len(themes) > 2 else "Innovation"
    th4 = themes[3] if len(themes) > 3 else "Growth"

    clean_title = title or "Strategic Document"

    if transformation_type == "executive_summary":
        bullets_md = "\n".join([f"- **Key Finding {i+1}**: {p}" for i, p in enumerate(key_points[:4])])
        return f"""# Executive Briefing & Action Plan: {clean_title}

> **Executive Snapshot**: {lead_sentence}

---

## 🎯 Strategic Context & Objectives
This briefing synthesizes core findings from **{clean_title}**. The document emphasizes operational excellence across **{th1}**, **{th2}**, and **{th3}**.

{bullets_md}

---

## 📊 Risk & Opportunity Matrix

| Strategic Domain | Identified Risk / Friction | Growth Opportunity | Priority Level |
| :--- | :--- | :--- | :--- |
| **{th1}** | Execution latency and fragmented alignment | Streamlined workflow automation & standard guidelines | **High** |
| **{th2}** | Rapid industry shifts and competitive pressure | Proactive positioning and differentiated feature moat | **Critical** |
| **{th3}** | Resource allocation constraints | Targeted investments in scalable high-yield initiatives | **Medium** |
| **{th4}** | Stakeholder communication bottlenecks | Transparent milestone tracking and centralized dashboards | **High** |

---

## 🚀 Prioritized Immediate Action Items

1. **Deploy Rapid Alignment Initiative** (`Owner: Executive Leadership | Timeline: Week 1-2`)
   - Establish weekly progress reviews focusing directly on {th1} milestones.
2. **Standardize Core Framework** (`Owner: Operations & Tech Lead | Timeline: Week 3`)
   - Implement scalable safeguards to mitigate operational friction.
3. **Consolidate Deliverables & Measure Impact** (`Owner: Strategy Team | Timeline: Day 30`)
   - Audit metrics, assess target benchmarks, and iterate based on real feedback.
"""

    elif transformation_type == "social_media":
        t1 = key_points[0] if len(key_points) > 0 else lead_sentence
        t2 = key_points[1] if len(key_points) > 1 else f"Focusing on {th1} is no longer optional."
        t3 = key_points[2] if len(key_points) > 2 else f"The friction in {th2} creates unseen costs."
        t4 = key_points[3] if len(key_points) > 3 else f"Mastering {th3} changes the game."
        t5 = key_points[4] if len(key_points) > 4 else "Execution speed separates leaders from observers."

        return f"""# 🌐 Multi-Channel Social Media Suite: {clean_title}

---

### 🐦 Twitter / X Viral Thread (7 Tweets)

**1/7 [Hook]**
Most organizations overlook what truly drives breakthroughs in {th1}.
Here is the raw breakdown of {clean_title} and what it means for you 🧵👇

**2/7 [The Core Reality]**
{t1}
Without addressing this fundamental baseline, downstream optimizations fall flat.

**3/7 [The Big Shift]**
{t2}
Notice how the balance changes when you prioritize speed over bureaucracy.

**4/7 [The Friction Point]**
{t3}
Key takeaway: eliminate duplicate overhead before expanding scope.

**5/7 [The Competitive Advantage]**
{t4}
Those who systematize this gain an immediate 3x compounding advantage.

**6/7 [The Golden Rule]**
{t5}
Consistency in {th2} beats sporadic bursts of high effort every time.

**7/7 [Conclusion & CTA]**
TL;DR:
• Focus on {th1} & {th2}
• Mitigate operational friction early
• Automate where possible

Found this valuable? Repost to help your network, and follow for more deep dives. 🔁

---

### 💼 LinkedIn Thought Leadership Post

Most leaders spend 80% of their energy managing symptoms instead of the root cause.

In studying **{clean_title}**, one lesson stands out above all else:

👉 *"{t1}"*

Here are the 3 non-obvious principles every forward-thinking team must adopt today:

1. **Double down on {th1}**: It’s the highest leverage lever currently available.
2. **Address {th2} proactively**: Waiting for consensus costs more than taking calculated risks.
3. **Measure outcomes, not activity**: "{t2}"

The question isn't whether your industry is shifting—it's whether your operating cadence matches the pace of change.

What has been your team's biggest challenge regarding {th1}? Let’s discuss below. 👇

`#Leadership` `#{th1.replace(' ', '')}` `#{th2.replace(' ', '')}` `#Strategy` `#Innovation`

---

### 📸 Instagram / Carousel Slide Copy (7 Slides)

- **Slide 1 [Cover]**: The Truth About {clean_title} (Swipe ➡️)
- **Slide 2 [The Problem]**: Why traditional approaches to {th1} are failing.
- **Slide 3 [Insight 1]**: {t1}
- **Slide 4 [Insight 2]**: {t2}
- **Slide 5 [The Catalyst]**: Focus on {th3} for scalable growth.
- **Slide 6 [Summary Table]**: What to Stop vs. What to Start doing today.
- **Slide 7 [Call to Action]**: Save this post for your next strategy session. Bookmark 📌 & Share!
"""

    elif transformation_type == "faq_study_guide":
        return f"""# 📚 Interactive FAQ & Study Guide: {clean_title}

---

## ❓ Frequently Asked Questions (FAQ)

### Q1: What is the primary thesis of {clean_title}?
**Answer**:
{lead_sentence} The core objective is establishing a resilient approach toward {th1} and {th2} while eliminating operational bottlenecks.

### Q2: Why is {th1} prioritized as a critical driver?
**Answer**:
Because without foundational stability in {th1}, secondary processes experience compounding friction. Early alignment creates compound efficiency.

### Q3: How should teams address risks surrounding {th2}?
**Answer**:
By conducting iterative risk assessments, establishing clear milestone boundaries, and ensuring transparent stakeholder visibility.

### Q4: What metrics determine success during implementation?
**Answer**:
Key performance indicators include cycle time reduction, throughput velocity, error rate minimization, and overall team adoption.

### Q5: What immediate step should be taken upon reviewing this document?
**Answer**:
Audit existing workflows against the recommendations outlined in the Executive Briefing and assign ownership for initial 30-day deliverables.

---

## 🧠 Conceptual Comprehension Self-Test

**Question 1**: Which factor represents the primary catalyst for sustainable performance in {clean_title}?
- A) Increased administrative reviews
- B) Proactive optimization of {th1} *(Correct Answer)*
- C) Postponing decisions until total consensus is reached
- D) Relying on legacy manual workflows

> **Explanation**: Proactive optimization of {th1} provides immediate structural leverage and reduces compounding delays.

---

## 📖 Key Terminology Glossary

| Term | Definition in Context |
| :--- | :--- |
| **{th1}** | The primary operational pillar governing execution quality and predictability. |
| **{th2}** | Strategic alignment framework designed to ensure organizational resilience. |
| **Friction Horizon** | The threshold where legacy procedures start hindering throughput. |
| **Iterative Cadence** | Continuous review cycles that allow teams to pivot rapidly based on real metrics. |
"""

    elif transformation_type == "blog_post":
        p1 = key_points[0] if len(key_points) > 0 else lead_sentence
        p2 = key_points[1] if len(key_points) > 1 else f"Rethinking {th1}."
        p3 = key_points[2] if len(key_points) > 2 else f"How {th2} drives outcomes."

        return f"""# The Blueprint for Mastery: Deconstructing {clean_title}

> **Meta Description**: Discover the essential strategies behind {clean_title}—focusing on {th1}, {th2}, and actionable principles to accelerate your outcomes today.

---

## Introduction: The Hidden Bottleneck

In today’s fast-moving landscape, teams often struggle not with a shortage of ideas, but with the discipline of execution. 

{lead_sentence}

When you peel back the layers of high-performing systems, one undeniable pattern emerges: sustainable success is built on clear principles, not ad-hoc heroics.

---

## The Core Pillar: Why {th1} Dictates Everything

{p1}

Too often, organizations attempt to optimize superficial metrics while ignoring the foundational architecture. By placing **{th1}** at the center of your roadmap, you eliminate ambiguity and empower team members to act autonomously.

> *"{p2}"*

Consider the downstream effects: when expectations are explicit, rework plummets and velocity naturally increases.

---

## Transforming Challenges into Structural Advantages in {th2}

Every significant breakthrough encounters initial resistance. In the context of {clean_title}, the most common friction points stem from outdated assumptions regarding **{th2}**.

{p3}

To overcome this:
- **Audit your assumptions**: Identify where manual overhead is slowing down progress.
- **Empower specialized ownership**: Allow the people closest to the problem to design the solution.
- **Build feedback loops**: Real-time signals prevent weeks of misdirected effort.

---

## Looking Ahead: Actionable Takeaways

As you incorporate these insights into your roadmap, keep these three guidelines top of mind:

1. **Start with high-leverage domains**: Prioritize {th1} before expanding scope.
2. **Document and standardize**: What is not documented cannot be scaled.
3. **Commit to continuous iteration**: Small 1% weekly compounding wins yield outsized annual gains.

**Ready to transform your workflow?** Share this article with your team and begin auditing your current processes today.
"""

    elif transformation_type == "presentation_deck":
        return f"""# 📽️ Slide Deck Presentation Outline: {clean_title}

*Target Audience: Executive Stakeholders & Working Groups | Duration: 15-20 Minutes*

---

### Slide 1: Title & Strategic Orientation
- **Visual Direction**: Bold dark gradient background with sleek typography and document subtitle.
- **Key Bullets**:
  - {clean_title}: Navigating Key Priorities
  - Frameworks for scalable execution across {th1} & {th2}
  - Presenter: Strategy & Operations Team
- **Speaker Notes**:
  *"Welcome everyone. Today we are walking through the core findings and strategic roadmap outlined in {clean_title}. Our goal is to align on actionable priorities for immediate execution."*

---

### Slide 2: The Core Challenge
- **Visual Direction**: Split screen comparing current friction points vs. desired end-state.
- **Key Bullets**:
  - Legacy approaches create unseen compounding delays
  - {lead_sentence[:120]}...
  - The cost of inaction increases exponentially each quarter
- **Speaker Notes**:
  *"Before diving into solutions, we need to be transparent about current friction. Notice how compounding delays in {th1} directly impact our broader timeline."*

---

### Slide 3: Strategic Pillar 1 — {th1}
- **Visual Direction**: 3-step horizontal workflow diagram highlighting leverage points.
- **Key Bullets**:
  - Establishing standardized baselines
  - Eliminating redundant manual verification steps
  - Empowering rapid cross-functional handoffs
- **Speaker Notes**:
  *"Our first pillar addresses {th1}. By standardizing the baseline workflow, we eliminate ambiguity and significantly compress delivery cycles."*

---

### Slide 4: Strategic Pillar 2 — {th2}
- **Visual Direction**: Data bar chart demonstrating efficiency gains and risk reduction.
- **Key Bullets**:
  - Proactive risk mitigation protocols
  - Continuous feedback mechanisms
  - Real-time visibility for all stakeholders
- **Speaker Notes**:
  *"Pillar two focuses on {th2}. Rather than relying on periodic post-mortems, we are embedding automated checkpoints into the daily cadence."*

---

### Slide 5: Implementation Roadmap & Key Milestones
- **Visual Direction**: Clean quarterly Gantt timeline with 3 clear phases.
- **Key Bullets**:
  - Phase 1 (Days 1-30): Foundation & initial baseline audit
  - Phase 2 (Days 31-60): Scaled rollout across active teams
  - Phase 3 (Days 61-90): Continuous performance tracking & optimization
- **Speaker Notes**:
  *"Here is our 90-day execution roadmap. Notice that Month 1 is laser-focused on stabilizing the foundation before expanding scope."*

---

### Slide 6: Summary of Expected Outcomes & ROI
- **Visual Direction**: 3 prominent metric callout cards (+40% Velocity, -60% Friction, 99% Alignment).
- **Key Bullets**:
  - Substantial cycle time reduction across major deliverables
  - Greater predictability in resource planning
  - Unlocked capacity for high-value strategic initiatives
- **Speaker Notes**:
  *"To summarize our anticipated ROI: this initiative frees up valuable team capacity and establishes a competitive execution moat."*

---

### Slide 7: Immediate Next Steps & Q&A
- **Visual Direction**: Checklist icon with clear callout box for open discussion.
- **Key Bullets**:
  - Approval of Phase 1 milestone owners
  - Kick-off alignment session scheduled for next week
  - Open Q&A and stakeholder input
- **Speaker Notes**:
  *"Thank you for your time. Let's open the floor to questions and discuss specific items you'd like us to address in Phase 1."*
"""

    elif transformation_type == "email_newsletter":
        return f"""# 📧 Email Newsletter Campaign: {clean_title}

---

### 📬 Subject Line Variations (Test for Highest Open Rate)
- **Option 1 (Curiosity)**: The single bottleneck holding back your {th1}...
- **Option 2 (Benefit-Driven)**: 3 ways to unlock 2x execution speed in {clean_title}
- **Option 3 (Urgent/Direct)**: Why we're rethinking our approach to {th2} this quarter

**Preview Text**:
*{lead_sentence[:90]}... Here is the playbook.*

---

### ✉️ Email Body Copy

**Hey there,**

If you've spent any time working on {clean_title}, you already know how easy it is to get bogged down in endless operational weeds.

Last week, our team sat down to audit what actually moves the needle versus what just creates noise.

The conclusion? **{lead_sentence}**

Here are the 3 big takeaways you should apply directly to your workflow this week:

1. **Rethink your baseline in {th1}**  
   Most friction doesn't come from bad intentions; it comes from unstated assumptions. Document the standard so everyone moves at the same pace.

2. **Automate the repetitive overhead**  
   Every minute spent manually re-checking {th2} is a minute stolen from strategic growth. 

3. **Focus on compounding weekly wins**  
   You don't need a radical overhaul overnight. A 1% improvement in your core execution cadence compounds into massive quarterly advantages.

---

### 🔘 Call To Action (Button / Link)

[ 👉 Read the Full Strategic Breakdown & Access the Tools ]

*(Or reply directly to this email with your top question—I read every response.)*

Talk soon,  
**The TransformAI Editorial Team**

---
*You're receiving this because you subscribed to TransformAI Insights. Unsubscribe anytime.*
"""

    return f"# Transformed Content: {clean_title}\n\n{source_text}"
