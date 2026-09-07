import sys
import json
import zipfile
from database import init_db, get_all_documents, get_document_by_id
from services.ai_engine import analyze_text, generate_transformation, TRANSFORMATION_KEYS
from services.pack_generator import create_output_pack_zip

def test_all():
    print("1. Testing DB Initialization...")
    init_db()
    print("   -> DB initialized successfully.")

    print("2. Testing Source Text Analysis...")
    sample_text = """
    Artificial Intelligence is fundamentally altering enterprise workflows. In Q3 2026, 
    organizations that adopted autonomous agentic pipelines achieved a 42% decrease in 
    document turnaround times and reduced manual content drafting hours from 18 hours 
    weekly to under 3 hours. Key strategic pillars for modern leaders include establishing 
    clear guardrails, standardizing knowledge schemas, and automating multi-channel 
    distribution across executive briefings, marketing collateral, and customer enablement docs.
    However, challenges remain around data governance, team training, and prompt calibration.
    Executive leadership must establish cross-functional AI oversight committees by next month.
    """
    analysis = analyze_text(sample_text)
    assert analysis["word_count"] > 20, "Word count calculation failed"
    assert "detected_tone" in analysis, "Tone detection missing"
    assert len(analysis["key_themes"]) > 0, "Key themes missing"
    print(f"   -> Words: {analysis['word_count']}, Flesch-Kincaid: {analysis['flesch_kincaid_grade']}, Tone: {analysis['detected_tone']}")
    print(f"   -> Themes: {', '.join(analysis['key_themes'])}")

    print("3. Testing the 6 Transformations (Deterministic Offline Engine)...")
    transformations = {}
    for key in TRANSFORMATION_KEYS:
        out = generate_transformation(key, sample_text, title="AI Enterprise Transformation 2026", tone="balanced")
        assert len(out) > 100, f"Transformation {key} output was too short!"
        transformations[key] = out
        print(f"   -> Generated {key} ({len(out.split())} words, {len(out)} chars)")

    print("4. Testing Output Pack ZIP Generation...")
    zip_buf = create_output_pack_zip(
        title="AI Enterprise Transformation 2026",
        source_text=sample_text,
        analysis=analysis,
        transformations=transformations
    )
    assert zip_buf.getbuffer().nbytes > 1000, "ZIP buffer empty or too small"
    
    # Inspect zip contents
    with zipfile.ZipFile(zip_buf, "r") as zf:
        file_list = zf.namelist()
        print(f"   -> ZIP contains {len(file_list)} files: {file_list}")
        assert any("README.md" in f for f in file_list), "README manifest missing in ZIP"
        assert any("analysis_report.json" in f for f in file_list), "Analysis JSON missing in ZIP"
        assert any("01_Executive_Summary.md" in f for f in file_list), "Executive summary missing"

    print("\nALL BACKEND CORE TESTS PASSED SUCCESSFULLY! [OK]")

if __name__ == "__main__":
    test_all()
