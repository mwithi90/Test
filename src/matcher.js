const Anthropic = require('@anthropic-ai/sdk');
const config = require('./config');
const { CASE_STUDIES } = require('./caseStudies');

let anthropicClient = null;

function getClient() {
  if (!anthropicClient) {
    anthropicClient = new Anthropic({ apiKey: config.anthropic.apiKey });
  }
  return anthropicClient;
}

// Use Claude to analyze the sheet data and find the best reference customers
async function findReferences({ prospect, sheetData }) {
  const client = getClient();

  const caseStudySummary = CASE_STUDIES.map(
    (cs) => `- ${cs.customer} (${cs.type}, ${cs.geography.country}${cs.geography.region ? '/' + cs.geography.region : ''}): ${cs.keyResult} | Integrations: ${cs.integrations.join(', ') || 'N/A'} | URL: ${cs.url}`
  ).join('\n');

  const prompt = `You are a sales intelligence assistant for Tenzo, a restaurant analytics platform.

A sales rep is researching a prospect and needs to know which existing Tenzo customers would be the best references to mention in their sales conversation.

## PROSPECT PROFILE
Company: ${prospect.company_name}
Lead: ${prospect.lead_name}
Restaurant Type: ${prospect.restaurant_type || 'Unknown'}
Geography: ${prospect.geography?.region ? prospect.geography.region + ', ' : ''}${prospect.geography?.country || 'Unknown'}
Estimated Locations: ${prospect.estimated_locations || 'Unknown'}
Integrations: ${prospect.integrations?.join(', ') || 'None specified'}
Summary: ${prospect.research_summary || 'N/A'}

## CURRENT TENZO CUSTOMERS (from our internal database)
${sheetData}

## TENZO CASE STUDIES (from gotenzo.com)
${caseStudySummary}

## YOUR TASK

Analyze the customer database above and recommend the **best 5 customers** (maximum) to use as references when speaking to this prospect. Consider:

1. **Tech Stack Match** — Do they share the same POS, labour scheduling, inventory, or other integrations? This is the strongest signal.
2. **Restaurant Type** — Similar types of restaurant/hospitality businesses are more compelling references.
3. **Geography** — Same country or region makes the reference more relevant.
4. **Prestige** — Well-known brands carry more weight as references. Favor recognizable names.
5. **Size/Scale** — Similar number of locations makes the reference more relatable.

Also identify any **relevant case studies** from the list above (maximum 3).

Return ONLY valid JSON (no markdown, no code fences) with this structure:
{
  "references": [
    {
      "name": "Customer Name (exactly as it appears in the data)",
      "score": 85,
      "type": "their restaurant/business type",
      "geography": "their location",
      "shared_integrations": ["list of integrations they share with the prospect"],
      "why": "1-2 sentence explanation of why this is a good reference for this specific prospect"
    }
  ],
  "case_studies": [
    {
      "customer": "Case study customer name",
      "key_result": "The headline result",
      "url": "the case study URL",
      "why": "Why this case study is relevant to the prospect"
    }
  ]
}

Score each reference from 0-100 based on overall relevance. Only include customers that are genuinely relevant (score > 30). If fewer than 5 are relevant, return fewer. Sort by score descending.

Important: Look at ALL columns in the data to understand each customer. The column names may vary — use whatever information is available (company names, integrations, POS systems, locations, geography, etc.)`;

  const response = await client.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 2048,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = response.content[0].text.trim();

  try {
    return JSON.parse(text);
  } catch {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return { references: [], case_studies: [] };
  }
}

module.exports = { findReferences };
