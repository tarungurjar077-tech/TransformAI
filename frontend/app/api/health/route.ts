import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    database: { status: "healthy", type: "serverless_state" },
    redis: { status: "healthy", type: "memory_cache" },
    ai_engine: {
      configured: Boolean(process.env.OPENAI_API_KEY),
      model: process.env.OPENAI_MODEL || "GPT-4o / Autonomous LangGraph",
      api_key_set: Boolean(process.env.OPENAI_API_KEY)
    }
  });
}
