# TransformAI 🚀
### "One Source. Multiple Intelligent Outputs."
**Smart India Hackathon 2026 Prototype • Problem Statement PS 26154**

TransformAI is an enterprise-grade GenAI content transformation platform. Enter or upload raw source content once (PDF, Word DOCX, or text), and TransformAI autonomously deconstructs, contextualizes, plans, generates, and validates **10 audience-tailored publication-ready deliverables simultaneously** via an orchestrated **7-stage LangGraph workflow** and **OpenAI GPT-5.6 / GPT-4o**.

Designed with an editorial luxury aesthetic inspired by **clear-path** styling (editorial serif typography, deep obsidian & emerald/sage glassmorphism, flowing curved vector accents, and interactive validation cards).

---

## 📑 Table of Contents
1. [Key Features](#-key-features)
2. [Supported Output Formats (10 Deliverables)](#-10-supported-output-formats)
3. [Architecture & LangGraph Workflow](#-system-architecture)
4. [Tech Stack](#-tech-stack)
5. [Prerequisites](#-prerequisites)
6. [Beginner Quickstart (1-Click Run)](#-beginner-quickstart-1-click-run)
7. [Manual Step-by-Step Setup (Terminal by Terminal)](#-manual-step-by-step-setup)
8. [Database (PostgreSQL & SQLite Dual Mode)](#-database-architecture)
9. [Cache & State (Redis & In-Memory Fallback)](#-caching--task-management)
10. [AI Modes (Live GPT-5.6 vs Offline Demo Mode)](#-ai-engine--demo-mode)
11. [Live SIH Demo Walkthrough](#-live-sih-demo-walkthrough)
12. [API Reference](#-api-endpoints)
13. [Project Structure](#-project-structure)
14. [Troubleshooting](#-troubleshooting)
15. [SIH Viva Questions & Talking Points](#-sih-2026-viva-talking-points)

---

## 🌟 Key Features

* **One Source → 10 Intelligent Deliverables**: Turn any technical memo, cyber incident post-mortem, or strategic paper into executive summaries, advisories, social packs, scripts, slide decks, and FAQs simultaneously.
* **7-Stage LangGraph Orchestration**:
  `source_ingestion` ➔ `content_analysis` ➔ `context_extraction` ➔ `output_planning` ➔ `content_generation` ➔ `quality_validation` ➔ `final_formatting`.
* **Automated AI Quality Score & Anti-Hallucination Audit**: Evaluates Source Consistency, Fact Completeness, Structural Formatting, Tone Adherence, and Hallucination Risk with an itemized checklist.
* **Dual-Mode Zero-Friction Architecture**:
  * Runs with **PostgreSQL 16** and **Redis 7** via Docker Compose.
  * Automatically falls back to **local SQLite** and **in-memory TTL caching** with zero crashes if Docker/Postgres is offline.
* **Live OpenAI GPT-5.6 / GPT-4o + Offline Demo Mode**:
  * Set `OPENAI_API_KEY` for live multi-agent reasoning.
  * Toggle **Demo Mode** to test realistic high-fidelity scenarios (e.g. ApexShield-2026 Incident) without an API key.
* **Real File Extraction**: Extracts text, metadata, word/character counts from **PDF**, **DOCX**, and **TXT** files.
* **Complete Output Pack Bundling**: Download individual Markdown/Text files or a 1-click **ZIP Output Pack** complete with manifest.
* **Live In-Line Editor**: Switch between rendered Markdown view and live text editor with instant copy and regeneration controls.

---

## 📦 10 Supported Output Formats

1. **Executive Summary & Action Matrix**: Strategic C-suite briefing, risk/opportunity assessment, and prioritized milestones.
2. **Security Incident Advisory**: CVSS-style vulnerability analysis, perimeter scope, indicators of compromise (IoCs), and containment steps.
3. **Multi-Channel Social Media Suite**: 7-tweet X thread, LinkedIn thought-leadership article, and 7-slide Instagram carousel copy.
4. **Broadcast Video Production Script**: Timestamped runtime cues, visual/B-roll directions, and presenter dialogue.
5. **Slide Deck Presentation Outline**: 8-10 slides with slide titles, visual layout blueprints, and verbatim speaker notes.
6. **Infographic Design Blueprint**: Visual data hierarchy, key callout statistics, and process flow layout.
7. **AP-Standard Press Release**: FOR IMMEDIATE RELEASE, dateline, executive quotes, media contact, and boilerplate.
8. **Executive Key Takeaways**: 90-second high-density digest highlighting metrics, critical decisions, and deadlines.
9. **Interactive 3-Tier FAQ**: Categorized foundational, technical/operational, and governance Q&As.
10. **Custom Transformation**: Dynamic user-instructed output adhering to custom operational prompts.

---

## 🏛️ System Architecture

```
User Browser
    │
    ▼
Frontend (Next.js 14 + TypeScript + Tailwind CSS + Lucide React)
    │  REST API Calls (/api/*)
    ▼
Backend Gateway (FastAPI + Pydantic + Uvicorn)
    │
    ├── File Processing Engine (pypdf, python-docx, text normalizer)
    │
    ├── LangGraph 7-Stage Multi-Agent Orchestrator
    │     ├── 1. source_ingestion      (cleans text, computes word/char indexes)
    │     ├── 2. content_analysis      (semantic categorization & thesis isolation)
    │     ├── 3. context_extraction    (extracts entities, dates, numbers & IoCs)
    │     ├── 4. output_planning       (formulates format-specific prompt strategies)
    │     ├── 5. content_generation    (OpenAI GPT-5.6 / GPT-4o or Demo Engine)
    │     ├── 6. quality_validation    (fact consistency & hallucination audit)
    │     └── 7. final_formatting     (markdown packaging & ZIP manifest compiler)
    │
    ├── Database Layer (PostgreSQL 16 via SQLAlchemy with SQLite Auto-Fallback)
    │     └── Tables: users, projects, documents, transformations, outputs, templates
    │
    └── Task & State Cache (Redis 7 via redis-py with In-Memory TTL Fallback)
```

---

## 🛠️ Tech Stack

* **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, Lucide React Icons, Canvas Confetti.
* **Backend**: Python 3.10+, FastAPI, Pydantic v2, Uvicorn, Python-Multipart.
* **AI & Workflow**: OpenAI SDK (`gpt-4o` / `gpt-5.6`), LangGraph (`StateGraph`), LangChain Core.
* **File Ingestion**: PyPDF, python-docx.
* **Database**: PostgreSQL 16 (production) with SQLAlchemy 2.0 ORM + automatic SQLite fallback (`transformai.db`).
* **Caching**: Redis 7 with automatic thread-safe in-memory cache fallback.
* **Containerization**: Docker Compose (`docker-compose.yml` for Postgres & Redis).

---

## 💻 Prerequisites

Ensure you have the following installed on your machine:
* **Python 3.10+** (verified up to Python 3.14)
* **Node.js 18+** (verified up to Node v24)
* **npm** (included with Node.js)
* *(Optional)* **Docker Desktop** (if you want to run PostgreSQL and Redis in Docker containers)

---

## ⚡ Beginner Quickstart (1-Click Run)

If you are on Windows, you can launch everything in one click!

### Option A: Using PowerShell
1. Open PowerShell.
2. Navigate to the project directory:
   ```powershell
   cd C:\Users\tanis\.gemini\antigravity\scratch\TransformAI
   ```
3. Run the launch script:
   ```powershell
   .\run.ps1
   ```
   *This automatically verifies the Python environment, checks frontend dependencies, starts the FastAPI backend on port 8000, and starts the Next.js frontend on port 3000.*

### Option B: Using Command Prompt (CMD)
1. Double click `run.bat` or run in CMD:
   ```cmd
   cd C:\Users\tanis\.gemini\antigravity\scratch\TransformAI
   run.bat
   ```

Open your browser at: **`http://localhost:3000`**

---

## 📖 Manual Step-by-Step Setup

If you prefer to start each service in separate terminal windows:

### Terminal 1: (Optional) Start PostgreSQL & Redis with Docker
If you have Docker Desktop installed and want to run PostgreSQL & Redis:
```bash
cd TransformAI
docker compose up -d
```
*(Note: If you do not have Docker, skip this step! TransformAI automatically uses local SQLite and in-memory caching).*

---

### Terminal 2: Start the FastAPI Backend
1. Open a terminal and enter the `backend` folder:
   ```powershell
   cd C:\Users\tanis\.gemini\antigravity\scratch\TransformAI\backend
   ```
2. Activate or verify the Python virtual environment:
   ```powershell
   # Windows PowerShell:
   .\venv\Scripts\Activate.ps1
   # (Or if using CMD: venv\Scripts\activate.bat)
   ```
3. Install dependencies:
   ```powershell
   pip install -r requirements.txt
   ```
4. Start the FastAPI server:
   ```powershell
   python run_backend.py
   ```
   *Backend is live at `http://localhost:8000` (Interactive API Docs at `http://localhost:8000/docs`).*

---

### Terminal 3: Start the Next.js Frontend
1. Open another terminal and enter the `frontend` folder:
   ```powershell
   cd C:\Users\tanis\.gemini\antigravity\scratch\TransformAI\frontend
   ```
2. Install node dependencies:
   ```powershell
   npm.cmd install --legacy-peer-deps
   ```
3. Start the Next.js development server:
   ```powershell
   npm.cmd run dev
   ```
4. Open **`http://localhost:3000`** in your browser!

---

## ⚙️ Environment Variables (`.env`)

A sample `.env.example` file is provided in the project root. Copy it to `.env`:

```env
# 1. AI Engine Configuration
# Leave blank to automatically use high-fidelity Demo Mode,
# or supply your key to activate live OpenAI GPT-5.6 / GPT-4o.
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o

# 2. Database Configuration
# Uses PostgreSQL by default; falls back to local SQLite if offline.
DATABASE_URL=postgresql://transformai:transformai_secret@localhost:5432/transformai

# 3. Cache & Queue
# Uses Redis by default; falls back to in-memory TTL store if offline.
REDIS_URL=redis://localhost:6379/0

# 4. Frontend API URL
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## 🎯 Live SIH Demo Walkthrough

Follow these steps for an impressive, flawless SIH presentation:

1. **Open the App**: Navigate to `http://localhost:3000`.
2. **Showcase Landing Page**:
   - Highlight the **clear-path** editorial luxury aesthetic, serif typography, and glowing metrics.
   - Point out the interactive **LangGraph 7-Stage Workflow Diagram**.
3. **Open Workspace**:
   - Click **"Start Transforming"** or navigate to `/workspace`.
4. **Load Sample Cybersecurity Incident**:
   - Click the amber button: **"Try Sample Cybersecurity Report"**.
   - Notice how 1,400+ words of real incident post-mortem data (CVE-2026-30114, timestamps, IoCs) are loaded into the editor with instant word and character counts.
5. **Select Outputs**:
   - Click **"Configure Outputs"** to reach Step 2.
   - Select 5 deliverables: Executive Summary, Security Advisory, Social Media Post, Video Script, and Presentation Content.
   - Set Audience to **"Executive"**, Tone to **"Professional"**, Language to **"English"**, Detail to **"Detailed"**.
6. **Execute Transformation**:
   - Click **"Transform with AI"**.
   - Watch the animated **LangGraph StateGraph** advance through each stage in real time:
     `Ingesting` ➔ `Analyzing` ➔ `Extracting` ➔ `Planning` ➔ `Generating` ➔ `Validating` ➔ `Packaging`.
7. **Inspect Verified Results**:
   - Switch between tabs (Executive Summary, Security Advisory, Social Media, etc.).
   - Review the **AI Quality Score Card** (e.g. 94.5%) and itemized validation checklist.
   - Demonstrate the **Inline Editor**, **Copy to Clipboard** with toast, and **Download File**.
   - Click **"Download All (ZIP Pack)"** to demonstrate full bundle export.
8. **Check History & Dashboard**:
   - Go to `/history` to prove persistent storage in PostgreSQL/SQLite.
   - Go to `/architecture` to walk the judges through the technical viva explanation.

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Platform metadata and online status |
| `GET` | `/api/health` | Comprehensive health check (DB, Redis, AI engine) |
| `GET` | `/api/formats` | List 10 supported deliverable formats with metadata |
| `POST` | `/api/upload` | Upload & extract text from PDF, DOCX, or TXT |
| `POST` | `/api/transform` | Execute 7-stage LangGraph workflow and persist outputs |
| `GET` | `/api/transformations` | List all historical transformations |
| `GET` | `/api/transformations/{id}` | Retrieve complete transformation record and outputs |
| `DELETE` | `/api/transformations/{id}` | Delete a transformation record |
| `POST` | `/api/transformations/{id}/regenerate` | Regenerate a single specific deliverable format |
| `GET` | `/api/transformations/{id}/export-zip` | Download complete output pack as a zipped bundle |
| `GET` | `/api/templates` | List preloaded enterprise domain scenarios |
| `GET` | `/api/templates/cybersecurity` | Retrieve sample cybersecurity incident report |

---

## 📂 Project Structure

```
TransformAI/
├── docker-compose.yml          # PostgreSQL 16 & Redis 7 container orchestration
├── .env.example                # Documented configuration template
├── .env                        # Active environment variables
├── run.ps1                     # 1-click Windows PowerShell launch script
├── run.bat                     # 1-click Windows Command Prompt launcher
├── README.md                   # Complete beginner guide & documentation
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── __init__.py
│   │   │   └── routes.py       # FastAPI REST endpoints & ZIP pack generator
│   │   ├── database/
│   │   │   ├── __init__.py
│   │   │   └── connection.py   # PostgreSQL connection + SQLite auto-fallback
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   └── database.py     # SQLAlchemy models (Transformation, Output, Document, etc.)
│   │   ├── schemas/
│   │   │   ├── __init__.py
│   │   │   └── transformation.py # Pydantic v2 request/response schemas
│   │   ├── services/
│   │   │   ├── cache_service.py # Redis client with in-memory TTL fallback
│   │   │   ├── file_service.py  # TXT, PDF, DOCX extraction & sanitization
│   │   │   ├── openai_service.py # OpenAI GPT-5.6 / GPT-4o client
│   │   │   └── demo_service.py  # High-fidelity offline simulation generator
│   │   ├── ai/
│   │   │   ├── prompts.py      # Prompts for 10 formats, 6 audiences, 5 tones
│   │   │   └── validation.py   # Anti-hallucination & quality scoring engine
│   │   ├── workflow/
│   │   │   └── langgraph_workflow.py # LangGraph 7-stage StateGraph pipeline
│   │   └── main.py             # FastAPI app initialization, CORS & lifespan
│   ├── run_backend.py          # Dedicated backend runner with sys.path management
│   ├── test_full_system.py     # Comprehensive automated test suite (9 tests)
│   ├── requirements.txt        # Backend Python dependencies
│   └── venv/                   # Python virtual environment
│
└── frontend/
    ├── app/
    │   ├── layout.tsx          # Root layout with navbar, footer & fonts
    │   ├── globals.css         # Tailwind directives & glassmorphism utilities
    │   ├── page.tsx            # Modern luxury landing page
    │   ├── workspace/
    │   │   └── page.tsx        # 3-step Transformation Workspace
    │   ├── dashboard/
    │   │   └── page.tsx        # Main operations dashboard & metrics
    │   ├── history/
    │   │   └── page.tsx        # Searchable transformation audit log
    │   ├── templates/
    │   │   └── page.tsx        # Preloaded enterprise scenario library
    │   └── architecture/
    │       └── page.tsx        # SIH 2026 presentation & viva hub
    ├── components/
    │   ├── Navbar.tsx          # Brand header with demo mode toggle
    │   ├── Footer.tsx          # Brand footer with architecture badges
    │   ├── OutputFormatCard.tsx # Selectable format cards
    │   ├── WorkflowVisualizer.tsx # LangGraph node visualizer
    │   └── ResultsView.tsx     # Multi-tab viewer, inline editor & export
    ├── lib/
    │   └── api.ts              # REST client wrapper
    ├── types/
    │   └── index.ts            # TypeScript interface definitions
    ├── package.json
    ├── tsconfig.json
    ├── tailwind.config.js
    └── next.config.mjs
```

---

## 🔧 Troubleshooting

### 1. "Cannot run scripts because execution policies are restricted"
In Windows PowerShell, script execution may be disabled by default.
Run:
```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```
Then rerun `.\run.ps1`.

### 2. "Docker is not running / cannot connect to PostgreSQL"
You don't need Docker! TransformAI detects when PostgreSQL is offline and **automatically switches to local SQLite (`transformai.db`)** and in-memory caching. Everything will work out-of-the-box.

### 3. "OpenAI API Key is missing"
You don't need an API key to test! If `OPENAI_API_KEY` is not set, TransformAI runs in **high-fidelity Demo Mode**, delivering realistic cybersecurity and strategic transformations across all 10 formats. When you have a key, simply add it to `.env`.

### 4. "Port 8000 or 3000 already in use"
To close any lingering processes:
```powershell
# In PowerShell:
Get-Process python -ErrorAction SilentlyContinue | Stop-Process -Force
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
```

---

## 🎓 SIH 2026 Viva Talking Points

When presenting to SIH judges, emphasize these 5 pillars:

1. **Innovation (PS 26154)**:
   > *"Most generative AI tools act as simple wrappers around a single prompt. TransformAI breaks the source document down into semantic premises and uses a 7-stage LangGraph StateGraph to generate 10 audience-specific formats in parallel."*

2. **Factual Grounding & Anti-Hallucination**:
   > *"To prevent hallucinations in high-stakes domains like cybersecurity incident advisories, our Quality Validation Node evaluates token and entity overlap, ensuring that every claim, IP, and CVE matches the source document before it reaches the user."*

3. **Multi-Modal Document Processing**:
   > *"TransformAI extracts and parses real PDF, DOCX, and TXT files, verifying text density and structural sections rather than relying on mock files."*

4. **Feasibility & Resilience**:
   > *"The application is production-ready with Next.js 14, FastAPI, PostgreSQL, and Redis, yet features dual-mode architecture with automatic SQLite fallback so it never crashes even in low-resource deployment environments."*

5. **Security**:
   > *"All API credentials remain strictly isolated on the backend server. File uploads are validated with 15MB limits, sanitized filenames, and strict MIME-type guards."*

---

**TransformAI Team** • Smart India Hackathon 2026 • Problem Statement PS 26154
