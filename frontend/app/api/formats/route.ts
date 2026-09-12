import { NextResponse } from "next/server";

export async function GET() {
  const formats = [
    {
      id: "executive_summary",
      name: "Executive Summary",
      description: "Strategic C-suite briefing with contextual background, risk/opportunity assessment, and actionable next steps.",
      icon: "Briefcase",
      category: "Leadership"
    },
    {
      id: "security_advisory",
      name: "Security Advisory",
      description: "Technical cybersecurity alert with vulnerability analysis, impact scope, IoCs, and urgent containment protocol.",
      icon: "ShieldAlert",
      category: "Technical"
    },
    {
      id: "social_media",
      name: "Social Media Suite",
      description: "Cross-platform campaign including X/Twitter thread, LinkedIn thought-leadership article, and Instagram carousel copy.",
      icon: "Share2",
      category: "Marketing"
    },
    {
      id: "video_script",
      name: "Video Script",
      description: "Broadcast-ready production script with timestamped segments, visual camera cues, and verbatim presenter narration.",
      icon: "Video",
      category: "Media"
    },
    {
      id: "presentation",
      name: "Presentation Content",
      description: "Comprehensive slide deck blueprint (8-10 slides) featuring visual suggestions, bullets, and speaker notes.",
      icon: "Layout",
      category: "Communication"
    },
    {
      id: "infographic",
      name: "Infographic Blueprint",
      description: "Visual data hierarchy, key callout statistics, iconography recommendations, and section-by-section layout.",
      icon: "BarChart3",
      category: "Design"
    },
    {
      id: "press_release",
      name: "Press Release",
      description: "AP-standard official announcement with dateline, headline, leadership quotes, and media boilerplate.",
      icon: "Newspaper",
      category: "PR"
    },
    {
      id: "key_points",
      name: "Key Takeaways",
      description: "High-density scannable digest highlighting critical facts, metrics, decisions, and immediate milestones.",
      icon: "CheckSquare",
      category: "Productivity"
    },
    {
      id: "faq",
      name: "Interactive FAQ",
      description: "Structured Q&A categorized from foundational concepts to advanced operational and compliance questions.",
      icon: "HelpCircle",
      category: "Education"
    },
    {
      id: "custom_output",
      name: "Custom Transformation",
      description: "Tailored format adhering strictly to user-defined specialized instructions and structure.",
      icon: "Sliders",
      category: "Custom"
    }
  ];

  return NextResponse.json(formats);
}
