import { Transformation, TransformationListItem } from "@/types";
import { buildCompleteTransformation } from "./generator";

const STORAGE_KEY = "transformai_transformations_v2";

const CYBER_SAMPLE = `INCIDENT POST-MORTEM & TECHNICAL INVESTIGATION REPORT
INCIDENT IDENTIFIER: INC-2026-APEX-8841
CLASSIFICATION: TLP:AMBER | CRITICAL INFRASTRUCTURE INCIDENT
DATE OF DETECTION: March 14, 2026 - 02:47:11 UTC
ORGANIZATION: ApexCloud Global Financial Infrastructure & Payment Gateway

1. EXECUTIVE SUMMARY
At 02:47 UTC on March 14, 2026, the ApexCloud Security Operations Center (SOC) identified anomalous telemetry originating from an internal authentication microservice (auth-gateway-prod-04). Subsequent investigation confirmed that an advanced persistent threat group gained unauthorized access by exploiting a zero-day vulnerability in a legacy cryptographic library (CVE-2026-30114, CVSS 9.8). Immediate perimeter isolation was achieved within 85 minutes, and master HSM payment keys remained completely protected.`;

const FINANCIAL_SAMPLE = `Quarterly Financial & Strategic Operations Review
ApexCloud achieved $42.8M ARR in Q3 2026 with 38% YoY revenue growth. Net retention rate remained strong at 124%, and gross margins expanded to 78.4%. Operating EBITDA reached $6.2M. Key expansion vectors in EU and APAC drove 340 enterprise customer wins. Total operating expenses were optimized by 14% through AI automation.`;

export function getInitialSeedTransformations(): Transformation[] {
  const seed1 = buildCompleteTransformation({
    content: CYBER_SAMPLE,
    source_type: "incident_report",
    selected_outputs: ["executive_summary", "security_advisory", "social_media", "video_script", "presentation"],
    audience: "Executive",
    tone: "Professional",
    language: "English",
    detail_level: "Detailed"
  });
  seed1.id = 101;
  seed1.title = "ApexShield-2026: Critical Infrastructure Cybersecurity Incident";
  seed1.created_at = new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(); // 3 hrs ago
  seed1.overall_quality_score = 96.4;

  const seed2 = buildCompleteTransformation({
    content: FINANCIAL_SAMPLE,
    source_type: "financial_report",
    selected_outputs: ["executive_summary", "presentation", "key_points", "press_release"],
    audience: "Leadership & Investors",
    tone: "Authoritative",
    language: "English",
    detail_level: "Comprehensive"
  });
  seed2.id = 102;
  seed2.title = "Quarterly Financial & Strategic Operations Review";
  seed2.created_at = new Date(Date.now() - 1000 * 60 * 60 * 22).toISOString(); // 22 hrs ago
  seed2.overall_quality_score = 95.8;

  return [seed1, seed2];
}

export function getStoredTransformations(): Transformation[] {
  if (typeof window === "undefined") {
    return getInitialSeedTransformations();
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = getInitialSeedTransformations();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    const initial = getInitialSeedTransformations();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    return initial;
  } catch (err) {
    console.warn("[TransformAI Storage] Failed to read localStorage:", err);
    return getInitialSeedTransformations();
  }
}

export function getStoredTransformationListItems(): TransformationListItem[] {
  const items = getStoredTransformations();
  return items.map((t) => ({
    id: t.id,
    title: t.title,
    source_type: t.source_type || "text",
    selected_outputs: t.selected_outputs || [],
    output_count: t.outputs ? t.outputs.length : 0,
    ai_model: t.ai_model || "LangGraph + Zero-Friction Fallback",
    is_demo_mode: t.is_demo_mode ?? true,
    status: t.status || "completed",
    overall_quality_score: t.overall_quality_score || 95.0,
    created_at: t.created_at || new Date().toISOString()
  }));
}

export function getStoredTransformationById(id: number): Transformation | null {
  const list = getStoredTransformations();
  const found = list.find((t) => t.id === Number(id));
  return found || null;
}

export function saveTransformationToStorage(transformation: Transformation): void {
  if (typeof window === "undefined") return;
  try {
    const existing = getStoredTransformations();
    const filtered = existing.filter((t) => t.id !== transformation.id);
    const updated = [transformation, ...filtered];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error("[TransformAI Storage] Failed to persist transformation:", err);
  }
}

export function deleteStoredTransformation(id: number): boolean {
  if (typeof window === "undefined") return true;
  try {
    const existing = getStoredTransformations();
    const updated = existing.filter((t) => t.id !== Number(id));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return true;
  } catch (err) {
    console.error("[TransformAI Storage] Failed to delete transformation:", err);
    return false;
  }
}

export function triggerClientDownloadBundle(transformation: Transformation): void {
  if (typeof window === "undefined") return;

  const manifest = `# TransformAI Deliverable Pack
Title: ${transformation.title}
Generated: ${new Date(transformation.created_at).toLocaleString()}
Overall Quality Score: ${transformation.overall_quality_score}%
Deliverables Count: ${transformation.outputs.length}
AI Model: ${transformation.ai_model}

================================================================================
TABLE OF CONTENTS
================================================================================
${transformation.outputs.map((o, idx) => `${idx + 1}. [${o.format_type}] ${o.title} (${o.word_count} words)`).join("\n")}

================================================================================
DELIVERABLES CONTENT
================================================================================

${transformation.outputs.map((o, idx) => `
# ------------------------------------------------------------------------------
# DELIVERABLE ${idx + 1}: ${o.title} (${o.format_type})
# Quality Score: ${o.quality_score}% | Consistency: ${o.consistency_score}%
# ------------------------------------------------------------------------------

${o.content}
`).join("\n\n")}`;

  const blob = new Blob([manifest], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `TransformAI_Pack_${transformation.id}_${transformation.title.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 30)}.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
