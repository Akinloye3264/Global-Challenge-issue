export interface User {
  id: string;
  name: string;
  email: string;
  organization?: string;
  isVerified: boolean;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface PredictionInput {
  cases: number;
  deaths: number;
  region: string;
  cfr: number;
  sendEmail?: boolean;
}

export interface CasePrediction {
  min: number;
  max: number;
  likely: number;
}

export interface PredictionResult {
  severity: 'Critical' | 'High' | 'Moderate' | 'Low';
  severity_score: number;
  summary: string;
  predictions: {
    day_7: CasePrediction;
    day_14: CasePrediction;
    day_30: CasePrediction;
  };
  risk_factors: string[];
  ngo_actions: {
    immediate_48h: string[];
    wash_interventions: string[];
    community_engagement: string[];
    logistics: string[];
  };
  resources_needed: {
    medical_supplies: string[];
    personnel: string[];
    estimated_budget_usd: number;
  };
  who_guidance: string;
  success_metrics: string[];
}
