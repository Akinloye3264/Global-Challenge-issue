const Anthropic = require('@anthropic-ai/sdk');

const client = new Anthropic({ apiKey: process.env.CLAUDE_API });

async function generatePrediction({ cases, deaths, region, cfr }) {
  const prompt = `You are Afyia Shield, an expert epidemiological AI for cholera outbreak response in South Sudan and sub-Saharan Africa. You must respond ONLY with valid JSON — no markdown, no code blocks, no extra text.

Analyze this cholera data and return this exact JSON structure:

{
  "severity": "Critical",
  "severity_score": 85,
  "summary": "2-3 sentence professional epidemiological overview",
  "predictions": {
    "day_7": { "min": 0, "max": 0, "likely": 0 },
    "day_14": { "min": 0, "max": 0, "likely": 0 },
    "day_30": { "min": 0, "max": 0, "likely": 0 }
  },
  "risk_factors": ["factor 1", "factor 2", "factor 3"],
  "ngo_actions": {
    "immediate_48h": ["action 1", "action 2", "action 3"],
    "wash_interventions": ["action 1", "action 2", "action 3"],
    "community_engagement": ["action 1", "action 2", "action 3"],
    "logistics": ["action 1", "action 2", "action 3"]
  },
  "resources_needed": {
    "medical_supplies": ["item 1", "item 2", "item 3"],
    "personnel": ["role 1", "role 2", "role 3"],
    "estimated_budget_usd": 50000
  },
  "who_guidance": "Specific WHO GTFCC protocol guidance for this outbreak scenario",
  "success_metrics": ["metric 1", "metric 2", "metric 3"]
}

Severity scale: Low (<1% CFR, <100 cases), Moderate (1-2% CFR, 100-500 cases), High (2-3% CFR or >500 cases), Critical (>3% CFR or >1000 cases or rapid spread).

Current Outbreak Data:
- Active Cases: ${cases}
- Deaths Reported: ${deaths}
- WHO Region: ${region}
- Case Fatality Rate (CFR): ${cfr}%

Base predictions on WHO cholera exponential growth models for South Sudan's healthcare infrastructure, rainy season patterns, population displacement factors, and evidence-based NGO response protocols. Make all recommendations specific, actionable, and calibrated to the severity level.`;

  const message = await client.messages.create({
    model: 'claude-opus-4-7',
    max_tokens: 2048,
    messages: [{ role: 'user', content: prompt }]
  });

  const text = message.content[0].text.trim();
  return JSON.parse(text);
}

module.exports = { generatePrediction };
