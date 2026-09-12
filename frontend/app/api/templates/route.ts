import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json([
    {
      id: 1,
      title: "ApexShield-2026: Critical Infrastructure Incident",
      category: "Cybersecurity",
      description: "Technical post-mortem detailing a zero-day vulnerability, unauthorized lateral movement, and mitigation protocol.",
      recommended_outputs: ["executive_summary", "security_advisory", "social_media", "video_script", "presentation"],
      word_count: 512,
      char_count: 3680
    },
    {
      id: 2,
      title: "Quarterly Financial & Strategic Performance Review",
      category: "Finance & Corporate",
      description: "Comprehensive financial overview covering ARR expansion, gross margins, EBITDA, and global market penetration.",
      recommended_outputs: ["executive_summary", "presentation", "key_points", "press_release"],
      word_count: 420,
      char_count: 2950
    },
    {
      id: 3,
      title: "Enterprise AI Safety & Governance Blueprint",
      category: "Policy & Governance",
      description: "Standard operating guidelines for LLM deployment, algorithmic fairness, automated red-teaming, and EU AI Act compliance.",
      recommended_outputs: ["executive_summary", "faq", "key_points", "custom_output"],
      word_count: 460,
      char_count: 3200
    }
  ]);
}
