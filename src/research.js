const Anthropic = require('@anthropic-ai/sdk');
const config = require('./config');

let anthropicClient = null;

function getClient() {
  if (!anthropicClient) {
    anthropicClient = new Anthropic({ apiKey: config.anthropic.apiKey });
  }
  return anthropicClient;
}

// Research a prospect company using Claude + optional web search context
async function researchProspect({ companyName, leadName, integrations, salesforceUrl }) {
  const client = getClient();

  // If Tavily API key is available, do a web search first
  let webContext = '';
  if (config.tavily.apiKey) {
    try {
      webContext = await searchWeb(companyName);
    } catch (err) {
      console.warn('Web search failed, proceeding without:', err.message);
    }
  }

  const prompt = `You are a sales intelligence assistant for Tenzo, a restaurant analytics platform.

Research this prospect and return a JSON object with your findings.

Company: ${companyName}
Lead Name: ${leadName}
Known Integrations: ${integrations.join(', ')}
${salesforceUrl ? `Salesforce: ${salesforceUrl}` : ''}

${webContext ? `Web search results about this company:\n${webContext}\n` : ''}

Return ONLY valid JSON (no markdown, no code fences) with this structure:
{
  "company_name": "${companyName}",
  "lead_name": "${leadName}",
  "integrations": [${integrations.map((i) => `"${i}"`).join(', ')}],
  "restaurant_type": "one of: qsr, casual_dining, fine_dining, coffee_cafe, pub_bar, hotel, multi_unit, independent, hospitality, ghost_kitchen, bakery",
  "geography": {
    "country": "country name or best guess",
    "region": "city or region if known"
  },
  "estimated_locations": number or 0 if unknown,
  "research_summary": "2-3 sentence summary of the company relevant to a Tenzo sales conversation"
}

If you can't determine something, use your best judgment based on the company name and integrations. Default country to "UK" if unclear since most Tenzo prospects are UK-based.`;

  const response = await client.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 1024,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = response.content[0].text.trim();

  try {
    return JSON.parse(text);
  } catch {
    // If Claude returns markdown-wrapped JSON, try to extract it
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    // Fallback to a minimal profile
    return {
      company_name: companyName,
      lead_name: leadName,
      integrations,
      restaurant_type: 'restaurant',
      geography: { country: 'UK', region: '' },
      estimated_locations: 0,
      research_summary: `Could not automatically research ${companyName}. Manual review recommended.`,
    };
  }
}

// Optional: search the web via Tavily for company info
async function searchWeb(companyName) {
  const response = await fetch('https://api.tavily.com/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      api_key: config.tavily.apiKey,
      query: `${companyName} restaurant hospitality`,
      max_results: 5,
      include_answer: true,
    }),
  });

  if (!response.ok) {
    throw new Error(`Tavily API returned ${response.status}`);
  }

  const data = await response.json();
  let context = '';
  if (data.answer) {
    context += `Summary: ${data.answer}\n\n`;
  }
  if (data.results) {
    for (const result of data.results.slice(0, 3)) {
      context += `- ${result.title}: ${result.content?.slice(0, 200)}\n`;
    }
  }
  return context;
}

module.exports = { researchProspect };
