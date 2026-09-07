import {
  Transformation,
  TransformationListItem,
  DocumentUploadResult,
  TemplateItem,
  FormatMetadata,
  HealthStatus
} from "@/types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function fetchHealth(): Promise<HealthStatus> {
  try {
    const res = await fetch(`${API_BASE}/api/health`, { cache: "no-store" });
    if (!res.ok) throw new Error("Health check failed");
    return await res.json();
  } catch (err) {
    return {
      status: "offline",
      timestamp: new Date().toISOString(),
      database: { status: "unknown", type: "offline" },
      redis: { status: "unknown", type: "offline" },
      ai_engine: { configured: false, model: "Demo Mode", api_key_set: false }
    };
  }
}

export async function fetchFormats(): Promise<FormatMetadata[]> {
  const res = await fetch(`${API_BASE}/api/formats`, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error("Failed to load formats");
  return res.json();
}

export async function uploadFile(file: File): Promise<DocumentUploadResult> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_BASE}/api/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ detail: "File upload failed" }));
    throw new Error(errorData.detail || "File processing error");
  }

  return res.json();
}

export interface TransformPayload {
  content: string;
  title?: string;
  source_type?: string;
  selected_outputs: string[];
  audience?: string;
  tone?: string;
  language?: string;
  detail_level?: string;
  custom_instructions?: string;
  force_demo?: boolean;
}

export async function runTransformation(payload: TransformPayload): Promise<Transformation> {
  const res = await fetch(`${API_BASE}/api/transform`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ detail: "Transformation execution failed" }));
    throw new Error(errorData.detail || "Server error during transformation");
  }

  return res.json();
}

export async function fetchTransformations(): Promise<TransformationListItem[]> {
  const res = await fetch(`${API_BASE}/api/transformations`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch transformation history");
  return res.json();
}

export async function fetchTransformation(id: number): Promise<Transformation> {
  const res = await fetch(`${API_BASE}/api/transformations/${id}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Transformation #${id} not found`);
  return res.json();
}

export async function deleteTransformation(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/api/transformations/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete transformation");
}

export async function regenerateOutput(
  transformationId: number,
  formatType: string,
  options?: { audience?: string; tone?: string; language?: string; custom_instructions?: string }
) {
  const res = await fetch(`${API_BASE}/api/transformations/${transformationId}/regenerate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      format_type: formatType,
      ...options,
    }),
  });

  if (!res.ok) throw new Error("Failed to regenerate deliverable");
  return res.json();
}

export async function fetchTemplates(): Promise<TemplateItem[]> {
  const res = await fetch(`${API_BASE}/api/templates`, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error("Failed to fetch templates");
  return res.json();
}

export async function fetchCybersecuritySample(): Promise<{
  title: string;
  category: string;
  recommended_outputs: string[];
  content: string;
}> {
  const res = await fetch(`${API_BASE}/api/templates/cybersecurity`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch cybersecurity sample");
  return res.json();
}

export function getZipExportUrl(transformationId: number): string {
  return `${API_BASE}/api/transformations/${transformationId}/export-zip`;
}
