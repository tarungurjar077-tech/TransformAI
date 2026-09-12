import { NextResponse } from "next/server";
import { buildCompleteTransformation } from "@/lib/generator";

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    
    if (!payload.content || payload.content.trim().length < 10) {
      return NextResponse.json(
        { detail: "Source content is required (minimum 10 characters)." },
        { status: 400 }
      );
    }

    const selected = Array.isArray(payload.selected_outputs) && payload.selected_outputs.length > 0
      ? payload.selected_outputs
      : ["executive_summary", "security_advisory"];

    const transformation = buildCompleteTransformation({
      content: payload.content,
      source_type: payload.source_type || "text",
      selected_outputs: selected,
      audience: payload.audience || "Executive",
      tone: payload.tone || "Professional",
      language: payload.language || "English",
      detail_level: payload.detail_level || "Detailed",
      custom_instructions: payload.custom_instructions
    });

    return NextResponse.json(transformation);
  } catch (error: any) {
    console.error("[Next.js API Transform Error]", error);
    return NextResponse.json(
      { detail: error.message || "Failed to execute transformation pipeline." },
      { status: 500 }
    );
  }
}
