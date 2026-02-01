// Core analysis types
export interface TranscriptAnalysis {
  clientContext: ClientContext;
  painPoints: PainPoint[];
  tenzoSolutions: TenzoSolution[];
  demoAreas: DemoArea[];
  competitors: CompetitorMention[];
}

export interface ClientContext {
  companyName: string;
  restaurantType: string;
  locations: number;
  currentTools: string[];
  additionalContext?: string;
}

export interface PainPoint {
  pain: string;
  category: TenzoPillar;
  severity: "high" | "medium" | "low";
  quote?: string;
}

export interface TenzoSolution {
  pain: string;
  solution: string;
  features: string[];
  benefit: string;
  pillar: TenzoPillar;
}

export interface DemoArea {
  area: string;
  priority: number;
  reason: string;
  features: string[];
}

export interface CompetitorMention {
  tool: string;
  limitation: string;
  tenzoAdvantage: string;
}

// Tenzo product types
export type TenzoPillar =
  | "Data Aggregation"
  | "BI Tool"
  | "Decision Enablement"
  | "Demand Forecasting";

export interface TenzoFeature {
  name: string;
  pillar: TenzoPillar;
  description: string;
  benefits: string[];
  useCases: string[];
}

export interface TenzoIntegration {
  name: string;
  category: string;
  limitations?: string;
}

export interface Competitor {
  name: string;
  type: "Excel" | "All-in-One" | "Traditional BI" | "Direct BI Competitor";
  strengths: string[];
  weaknesses: string[];
  tenzoAdvantages: string[];
}

// API request/response types
export interface AnalyzeTranscriptRequest {
  transcript: string;
}

export interface AnalyzeTranscriptResponse {
  success: boolean;
  analysis?: TranscriptAnalysis;
  error?: string;
}

export interface GenerateSlidesRequest {
  analysis: TranscriptAnalysis;
}

export interface GenerateSlidesResponse {
  success: boolean;
  presentationUrl?: string;
  presentationId?: string;
  error?: string;
}
