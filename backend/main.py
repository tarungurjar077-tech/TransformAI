from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import init_db
from routers import upload, analyze, transform, history, download

app = FastAPI(
    title="TransformAI API",
    description="Autonomous Multi-Format Document Transformation Platform",
    version="1.0.0"
)

# Allow CORS for React frontend (Vite default is 5173, plus localhost variants)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_event():
    init_db()

@app.get("/")
def root():
    return {
        "status": "online",
        "service": "TransformAI API",
        "version": "1.0.0",
        "endpoints": [
            "/api/upload/file",
            "/api/upload/text",
            "/api/analyze",
            "/api/transform/meta",
            "/api/transform/single",
            "/api/transform/batch",
            "/api/history",
            "/api/download/pack/{doc_id}"
        ]
    }

# Include modular API routers
app.include_router(upload.router)
app.include_router(analyze.router)
app.include_router(transform.router)
app.include_router(history.router)
app.include_router(download.router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
