export interface ValidationCheck {
  label: string;
  passed: boolean;
  status: "success" | "warning" | "error";
  message: string;
}

export interface ValidationDetails {
  checks?: Record<string, { status: string; score?: number }>;
  notes?: string[];
}

export interface OutputItem {
  id?: number;
  format_type: string;
  title: string;
  content: string;
  quality_score: number;
  consistency_score: number;
  completeness_score: number;
  formatting_score: number;
  tone_score: number;
  validation_checks: ValidationCheck[];
  validation_details?: ValidationDetails;
  word_count: number;
  char_count: number;
  created_at?: string;
}

export interface Transformation {
  id: number;
  title: string;
  source_type: string;
  selected_outputs: string[];
  audience: string;
  tone: string;
  language: string;
  detail_level: string;
  ai_model: string;
  is_demo_mode: boolean;
  status: string;
  execution_duration_sec: number;
  overall_quality_score: number;
  validation_summary?: {
    stages?: string[];
    source_metadata?: Record<string, any>;
    content_analysis?: Record<string, any>;
  };
  outputs: OutputItem[];
  created_at: string;
}

export interface TransformationListItem {
  id: number;
  title: string;
  source_type: string;
  selected_outputs: string[];
  output_count: number;
  ai_model: string;
  is_demo_mode: boolean;
  status: string;
  overall_quality_score: number;
  created_at: string;
}

export interface DocumentUploadResult {
  filename: string;
  file_type: string;
  file_size_bytes: number;
  character_count: number;
  word_count: number;
  content: string;
  preview: string;
}

export interface TemplateItem {
  id: number;
  title: string;
  category: string;
  description: string;
  sample_content: string;
  recommended_outputs: string[];
  word_count: number;
  char_count: number;
}

export interface FormatMetadata {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
}

export interface HealthStatus {
  status: string;
  timestamp: string;
  database: {
    status: string;
    type: string;
    url?: string;
  };
  redis: {
    status: string;
    type: string;
    notice?: string;
  };
  ai_engine: {
    configured: boolean;
    model: string;
    api_key_set: boolean;
  };
}
