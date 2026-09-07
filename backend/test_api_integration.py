import io
import zipfile
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_full_pipeline():
    print("=== Testing TransformAI End-to-End API Pipeline ===")

    # 1. Health check
    res = client.get("/")
    assert res.status_code == 200
    print("1. Root health check: OK")

    # 2. Upload text document
    sample_text = """
    Autonomous AI agents represent a generational leap in software architecture. 
    By decomposing monolithic tasks into specialized worker swarms, organizations 
    can automate end-to-end workflows from document synthesis to multi-channel publishing.
    Key pillars include deterministic verification, persistent session memory, and standardized 
    schemas. In Q3 2026, forward-thinking enterprises are standardizing on continuous 
    transformation pipelines to unlock 5x operational leverage.
    """
    upload_res = client.post("/api/upload/text", json={
        "title": "Autonomous Agent Swarms 2026",
        "text": sample_text
    })
    assert upload_res.status_code == 200
    doc_data = upload_res.json()
    doc_id = doc_data["id"]
    print(f"2. Upload Text: OK (doc_id={doc_id}, words={doc_data['word_count']})")

    # 3. Analyze document
    analyze_res = client.post("/api/analyze", json={"doc_id": doc_id})
    assert analyze_res.status_code == 200
    analysis_data = analyze_res.json()
    analysis = analysis_data["analysis"]
    print(f"3. Analyze: OK (tone={analysis['detected_tone']}, FK-grade={analysis['flesch_kincaid_grade']})")

    # 4. Get Transformations Meta
    meta_res = client.get("/api/transform/meta")
    assert meta_res.status_code == 200
    keys = meta_res.json()["keys"]
    assert len(keys) == 6
    print(f"4. Transform Meta: OK (6 transformations supported)")

    # 5. Batch generate all 6 transformations
    batch_res = client.post("/api/transform/batch", json={
        "doc_id": doc_id,
        "tone": "executive"
    })
    assert batch_res.status_code == 200
    transformations = batch_res.json()["transformations"]
    assert len(transformations) == 6
    for k in keys:
        assert k in transformations
        print(f"   -> {k}: {len(transformations[k].split())} words")
    print("5. Batch 6-Transformation Generation: OK")

    # 6. Save inline edit
    modified_text = transformations["executive_summary"] + "\n\n*Updated by User Review.*"
    save_res = client.post("/api/transform/save", json={
        "doc_id": doc_id,
        "transformation_type": "executive_summary",
        "content": modified_text
    })
    assert save_res.status_code == 200
    print("6. Save Inline Edit: OK")

    # 7. Check History
    history_res = client.get("/api/history")
    assert history_res.status_code == 200
    docs = history_res.json()["documents"]
    assert any(d["id"] == doc_id for d in docs)
    print(f"7. History Listing: OK ({len(docs)} saved documents)")

    # 8. Download ZIP Output Pack
    zip_res = client.get(f"/api/download/pack/{doc_id}")
    assert zip_res.status_code == 200
    assert zip_res.headers["content-type"] == "application/zip"
    
    zip_buffer = io.BytesIO(zip_res.content)
    with zipfile.ZipFile(zip_buffer, "r") as zf:
        namelist = zf.namelist()
        print(f"8. ZIP Output Pack: OK (contains {len(namelist)} items)")
        assert any("01_Executive_Summary.md" in n for n in namelist)
        assert any("02_Social_Media_Pack.md" in n for n in namelist)
        assert any("03_FAQ_and_Study_Guide.md" in n for n in namelist)
        assert any("04_Editorial_Blog_Post.md" in n for n in namelist)
        assert any("05_Slide_Deck_Outline.md" in n for n in namelist)
        assert any("06_Email_Newsletter.md" in n for n in namelist)
        assert any("analysis_report.json" in n for n in namelist)
        assert any("README.md" in n for n in namelist)

    # 9. Download single markdown file
    single_res = client.get(f"/api/download/single/{doc_id}/executive_summary")
    assert single_res.status_code == 200
    assert "*Updated by User Review.*" in single_res.text
    print("9. Single File Download: OK")

    print("\n=== ALL END-TO-END TESTS PASSED WITH 100% SUCCESS! ===")

if __name__ == "__main__":
    test_full_pipeline()
