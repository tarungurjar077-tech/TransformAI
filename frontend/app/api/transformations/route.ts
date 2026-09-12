import { NextResponse } from "next/server";
import { getInitialSeedTransformations } from "@/lib/storage";
import { Transformation } from "@/types";

// In-memory store for serverless environment
let serverMemoryTransformations: Transformation[] = getInitialSeedTransformations();

export async function GET() {
  try {
    const list = serverMemoryTransformations.map(t => ({
      id: t.id,
      title: t.title,
      source_type: t.source_type || "text",
      selected_outputs: t.selected_outputs || [],
      output_count: t.outputs ? t.outputs.length : 0,
      ai_model: t.ai_model || "LangGraph + Serverless Fallback",
      is_demo_mode: t.is_demo_mode ?? true,
      status: t.status || "completed",
      overall_quality_score: t.overall_quality_score || 95.0,
      created_at: t.created_at || new Date().toISOString()
    }));

    return NextResponse.json(list);
  } catch (error: any) {
    return NextResponse.json(
      { detail: error.message || "Failed to fetch transformation list" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const item: Transformation = await req.json();
    if (!item || !item.id) {
      return NextResponse.json({ detail: "Invalid transformation payload" }, { status: 400 });
    }
    serverMemoryTransformations = [item, ...serverMemoryTransformations.filter(t => t.id !== item.id)];
    return NextResponse.json(item, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { detail: error.message || "Failed to store transformation" },
      { status: 500 }
    );
  }
}
