import { NextResponse } from "next/server";
import { buildCompleteTransformation } from "@/lib/generator";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id);
    const body = await req.json();
    const formatType = body.format_type || "executive_summary";

    const updated = buildCompleteTransformation({
      content: body.custom_instructions ? `Regenerated deliverable: ${body.custom_instructions}` : "Regenerated content briefing",
      selected_outputs: [formatType],
      audience: body.audience || "Executive",
      tone: body.tone || "Professional",
      language: body.language || "English",
      custom_instructions: body.custom_instructions
    });

    const output = updated.outputs[0];
    return NextResponse.json(output);
  } catch (err: any) {
    return NextResponse.json({ detail: err.message || "Regeneration failed" }, { status: 500 });
  }
}
