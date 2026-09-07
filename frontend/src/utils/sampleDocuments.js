export const SAMPLE_DOCUMENTS = [
  {
    id: "preset-1",
    title: "Q3 2026 AI Product Strategy Memo",
    category: "Corporate Strategy",
    description: "Executive strategic roadmap covering autonomous agent pipelines and platform scaling.",
    text: `CONFIDENTIAL: EXECUTIVE STRATEGY MEMO
DATE: September 4, 2026
SUBJECT: Accelerating Autonomous Agent Integration & Multi-Channel Content Workflows
FROM: Office of the Chief Product Officer
TO: Executive Leadership Team & Senior Engineering Directors

1. Executive Overview
Over the past two quarters, our content and engineering teams have faced severe operational bottlenecks in synthesizing and repurposing complex internal research, whitepapers, and operational transcripts into downstream assets. Today, our cross-functional teams expend an estimated 24 hours per week manually formatting source materials into executive summaries, social briefings, client enablement FAQs, and investor updates.

With the advent of high-speed generative orchestration engines and multi-agent reasoning systems, we possess an unprecedented opportunity to compress this cycle time by over 80%. This memo outlines our Q3 strategic initiative to deploy TransformAI—an autonomous document transformation pipeline designed to ingest enterprise documents and immediately synthesize six high-value channel deliverables concurrently.

2. Market & Competitive Analysis
Competitors who continue relying on ad-hoc manual repurposing suffer from prolonged distribution lag (average 7.4 days from research completion to multi-channel publication). In contrast, firms leveraging automated transformation workflows achieve near-instantaneous content velocity, maintaining thought leadership dominance across LinkedIn, technical blogs, and investor newsletters.

Our primary competitive moat will not be model weights alone, but rather our structured transformation architecture, standardized knowledge schemas, and persistent metadata tracking.

3. Key Strategic Pillars
- Pillar 1: Unified Document Ingestion
  Enable friction-free document ingestion across PDF, DOCX, Markdown, and raw transcripts. The parser must isolate signal from noise, extract structured outlines, and determine reading level metrics.
- Pillar 2: Concurrent Multi-Channel Synthesis
  Rather than linear cascading prompts, our AI engine will generate the 6 core transformation packs in parallel: Executive Summary, Multi-Channel Social Suite, Interactive FAQ & Study Guide, Editorial Blog Post, Presentation Deck Outline, and Email Newsletter.
- Pillar 3: Human-in-the-Loop Refinement Studio
  Empower knowledge workers with instant side-by-side split comparison, tone modulation (Executive, Conversational, Technical, Punchy), and inline Markdown editing prior to batch ZIP export.

4. Risk & Mitigation Matrix
- Risk 1: Prompt drift and hallucination across numerical metrics.
  Mitigation: Ground prompts strictly on extracted source document tokens, enforce extractive grounding, and highlight uncertainty.
- Risk 2: Adoption friction among non-technical marketing leads.
  Mitigation: Deliver an intuitive, zero-configuration web interface with pre-loaded presets and 1-click ZIP package exports.

5. Immediate Action Plan & Timeline
- Week 1-2: Complete FastAPI backend integration and deploy SQLite persistent storage.
- Week 3: Finalize React + Tailwind interactive workbench and output pack comparison studio.
- Week 4: Alpha rollout across Product Marketing and Developer Relations teams. Target milestone: 5,000 transformed documents processed in month one.`
  },
  {
    id: "preset-2",
    title: "Autonomous Agent Swarm Architecture Whitepaper",
    category: "Technical Architecture",
    description: "Deep dive into distributed multi-agent systems, message passing, and consensus protocols.",
    text: `TECHNICAL WHITEPAPER: Distributed Multi-Agent Consensus & Hierarchical Swarms
VERSION: 3.2 | AUTONOMOUS SYSTEMS LAB

Abstract:
Modern software engineering requires autonomous systems capable of delegating, decomposing, and verifying complex multi-step objectives without continuous human intervention. This paper introduces the Hierarchical Agent Coordinator (HAC) protocol, an asynchronous orchestration pattern that combines specialized agent roles, isolated scratchpads, and deterministic verification gates.

1. System Architecture & Component Breakdown
The HAC architecture is divided into three primary tiers:
- Tier 1: Planner & Decomposer Agent
  The Planner receives the top-level user objective and partitions it into a Directed Acyclic Graph (DAG) of discrete tasks. Each node in the DAG represents an atomic operation with explicit input and output schemas.
- Tier 2: Specialized Worker Swarm
  Individual workers are ephemeral containers equipped with domain-specific tool definitions (e.g., Code Search, Static Analysis, Unit Test Runner, and Git Sync). Workers execute concurrently and communicate exclusively via structured JSON messages.
- Tier 3: Verification & Reconciliation Arbiter
  Before any state transition is committed to the shared codebase or external API, the Arbiter executes a rigorous battery of automated tests, linter checks, and semantic diff validations.

2. Benchmark Performance & Empirical Results
In our evaluation across 1,200 software engineering benchmark tasks:
- Task Completion Rate increased from 61.4% (single-agent zero-shot) to 89.7% (HAC swarm).
- Error Recovery Latency dropped from 4.2 iterations to 1.1 iterations due to real-time Arbiter feedback.
- Context Window Consumption was reduced by 64% by offloading detailed tool interaction logs to external storage and passing only condensed summaries back to the Planner.

3. Engineering Recommendations for Enterprise Adoption
Organizations looking to adopt multi-agent frameworks should prioritize idempotent tool design, enforce rate-limiting guardrails, and mandate persistent audit trails for all autonomous modifications.`
  },
  {
    id: "preset-3",
    title: "SaaS Series B Investment Pitch & Metrics",
    category: "Investor Relations",
    description: "Financial performance summary, Net Revenue Retention, and ARR expansion forecast.",
    text: `INVESTOR BRIEFING: SERIES B CAPITALIZATION & PERFORMANCE HIGHLIGHTS
COMPANY: CloudPulse Systems Inc.
FISCAL YEAR: 2026 | TARGET RAISE: $35,000,000

1. Company Traction & Growth Metrics
CloudPulse has experienced exponential growth over the trailing 12 months, scaling Annual Recurring Revenue (ARR) from $4.2M to $16.8M (a 300% year-over-year increase). Our customer base now includes 28 Fortune 500 enterprises with zero logo churn in the top quartile.
- Current ARR: $16.8M (ARR Run Rate: $19.2M)
- Net Revenue Retention (NRR): 142%
- Gross Margin: 81.4% (up 320 bps YoY due to infrastructure optimization)
- Customer Acquisition Cost (CAC) Payback: 7.2 months
- Magic Number (Sales Efficiency): 1.65

2. Market Opportunity
The Global Observability and Developer Operations market is projected to reach $48.5B by 2028, growing at a 22.4% CAGR. Legacy APM solutions suffer from excessive telemetry storage costs and alert fatigue. CloudPulse uses edge-sampling machine learning to compress telemetry ingestion costs by 70% while improving incident detection speed by 5x.

3. Use of Proceeds
The $35M Series B funding will be allocated across three strategic growth initiatives:
- 50% ($17.5M): Global Sales & Enterprise Go-To-Market expansion into EMEA and APAC.
- 35% ($12.25M): R&D investments to accelerate automated root-cause remediation agents.
- 15% ($5.25M): Working capital, compliance certifications (FedRAMP High, SOC2 Type II), and strategic partnerships.`
  },
  {
    id: "preset-4",
    title: "Remote Engineering Handbook & Onboarding Culture",
    category: "Operations & HR",
    description: "Guidelines on asynchronous communication, documentation culture, and engineering velocity.",
    text: `GLOBAL TEAM HANDBOOK: The Async-First Engineering Culture
INTERNAL EDITION: 2026 | PEOPLE & OPERATIONS

1. Core Philosophy: Default to Open, Default to Asynchronous
In a global team spanning 14 time zones, synchronous meetings are our most expensive tool. While live conversations are invaluable for social connection and complex debates, all standard status updates, design proposals, and decision logs must happen asynchronously.
- Rule 1: If it's not written down, it didn't happen.
- Rule 2: Prefer structured RFCs (Requests for Comments) over ad-hoc Slack threads.
- Rule 3: Respect quiet focus blocks; continuous interruptions degrade deep engineering flow.

2. The RFC (Request for Comments) Lifecycle
Before any major architectural change or dependency addition is merged:
1. Author drafts an RFC outlining the Problem, Proposed Design, Alternatives Considered, and Security Considerations.
2. The team receives a mandatory 72-hour review window for asynchronous feedback and inline questions.
3. The designated Tech Lead makes the final decision and records the rationale in the permanent architectural decision log.

3. Health, Wellness, and Sustainable Velocity
Sustained velocity requires psychological safety and proactive burnout prevention:
- Unlimited PTO with a mandatory minimum of 20 days off per calendar year.
- Ergonomic home office stipend ($1,500 setup grant + $50/month internet reimbursement).
- Bi-annual in-person company retreats for team bonding and strategic vision alignment.`
  }
];
