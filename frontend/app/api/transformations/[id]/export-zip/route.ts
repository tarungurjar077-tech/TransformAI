import { NextResponse } from "next/server";
import { getInitialSeedTransformations } from "@/lib/storage";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  const seeds = getInitialSeedTransformations();
  const item = seeds.find(s => s.id === id) || seeds[0];

  const content = `# TransformAI Deliverable Pack
Title: ${item.title}
Generated At: ${item.created_at}
Overall Quality Score: ${item.overall_quality_score}%

${item.outputs.map((o, idx) => `
================================================================================
DELIVERABLE ${idx + 1}: ${o.title} (${o.format_type})
Quality Score: ${o.quality_score}%
================================================================================

${o.content}
`).join("\n\n")}`;

  return new NextResponse(content, {
    status: 200,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Content-Disposition": `attachment; filename="TransformAI_Export_${id}.md"`
    }
  });
}
