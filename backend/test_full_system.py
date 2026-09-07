import os
import sys

# Ensure UTF-8 output encoding on Windows consoles
sys.stdout.reconfigure(encoding='utf-8')

# Ensure root paths
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
if parent_dir not in sys.path:
    sys.path.insert(0, parent_dir)
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

from fastapi.testclient import TestClient
from backend.app.main import app
from backend.app.database.connection import init_db

def run_system_tests():
    print("==================================================================")
    print("[TEST] Running Comprehensive TransformAI System Verification Tests")
    print("==================================================================")

    # Ensure tables exist
    init_db()

    client = TestClient(app)

    # 1. Test Root
    print("\n[Test 1] Testing Root Endpoint (GET /)...")
    res = client.get("/")
    assert res.status_code == 200, f"Expected 200, got {res.status_code}"
    data = res.json()
    assert data["project"] == "TransformAI"
    print("PASSED: Root endpoint returned valid project metadata.")

    # 2. Test Health
    print("\n[Test 2] Testing Health Endpoint (GET /api/health)...")
    res = client.get("/api/health")
    assert res.status_code == 200, f"Expected 200, got {res.status_code}"
    health = res.json()
    print(f"PASSED: Health Check: DB={health['database']['type']} ({health['database']['status']}), Cache={health['redis']['type']}, AI={health['ai_engine']['model']}")

    # 3. Test Formats
    print("\n[Test 3] Testing Formats Endpoint (GET /api/formats)...")
    res = client.get("/api/formats")
    assert res.status_code == 200
    formats = res.json()
    assert len(formats) >= 10, f"Expected at least 10 formats, got {len(formats)}"
    print(f"PASSED: Retrieved {len(formats)} supported output formats successfully.")

    # 4. Test Templates
    print("\n[Test 4] Testing Templates (GET /api/templates)...")
    res = client.get("/api/templates")
    assert res.status_code == 200
    templates = res.json()
    assert len(templates) >= 1
    print(f"PASSED: Retrieved {len(templates)} preloaded template scenarios.")

    # 5. Test Cybersecurity Preset
    print("\n[Test 5] Testing Cybersecurity Preset (GET /api/templates/cybersecurity)...")
    res = client.get("/api/templates/cybersecurity")
    assert res.status_code == 200
    cyber = res.json()
    assert "INC-2026-APEX" in cyber["content"]
    print("PASSED: Successfully retrieved sample cybersecurity incident report.")

    # 6. Test File Upload (Synthetic TXT file)
    print("\n[Test 6] Testing File Upload (POST /api/upload)...")
    sample_text = "CONFIDENTIAL INTERNAL STRATEGY MEMO\nPROJECT: APEX-QUANTUM-2026\nAll parameters tested successfully."
    res = client.post(
        "/api/upload",
        files={"file": ("memo.txt", sample_text.encode("utf-8"), "text/plain")}
    )
    assert res.status_code == 200, f"Upload failed: {res.text}"
    upload_res = res.json()
    assert upload_res["filename"] == "memo.txt"
    assert upload_res["word_count"] > 0
    print(f"PASSED: File upload processed: {upload_res['word_count']} words extracted.")

    # 7. Test Transformation Pipeline Execution (7-stage LangGraph)
    print("\n[Test 7] Testing LangGraph Transformation Pipeline (POST /api/transform)...")
    payload = {
        "content": cyber["content"],
        "title": "Automated Verification Test Incident",
        "source_type": "template",
        "selected_outputs": ["executive_summary", "security_advisory", "social_media", "key_points"],
        "audience": "Executive",
        "tone": "Professional",
        "language": "English",
        "detail_level": "Detailed",
        "force_demo": True
    }
    res = client.post("/api/transform", json=payload)
    assert res.status_code == 200, f"Transform failed: {res.text}"
    transform_res = res.json()
    assert transform_res["id"] is not None
    assert len(transform_res["outputs"]) == 4
    assert transform_res["overall_quality_score"] > 80.0
    print(f"PASSED: Transformation #{transform_res['id']} completed successfully with {len(transform_res['outputs'])} deliverables.")
    print(f"PASSED: Quality Score: {transform_res['overall_quality_score']}% | Duration: {transform_res['execution_duration_sec']}s")

    # 8. Test History Persistence (GET /api/transformations)
    print("\n[Test 8] Testing History Persistence (GET /api/transformations)...")
    res = client.get("/api/transformations")
    assert res.status_code == 200
    history = res.json()
    assert any(item["id"] == transform_res["id"] for item in history)
    print(f"PASSED: Transformation persisted and listed in history (Total stored: {len(history)}).")

    # 9. Test ZIP Pack Export (GET /api/transformations/{id}/export-zip)
    print("\n[Test 9] Testing ZIP Pack Export (GET /api/transformations/{id}/export-zip)...")
    res = client.get(f"/api/transformations/{transform_res['id']}/export-zip")
    assert res.status_code == 200
    assert res.headers["content-type"] == "application/zip"
    assert len(res.content) > 500
    print(f"PASSED: ZIP bundle compiled and streamed ({len(res.content)} bytes).")

    print("\n==================================================================")
    print("SUCCESS: ALL 9 SYSTEM VERIFICATION TESTS PASSED PERFECTLY!")
    print("==================================================================")

if __name__ == "__main__":
    run_system_tests()
