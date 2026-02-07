const Anthropic = require('@anthropic-ai/sdk');
const config = require('./config');

let anthropicClient = null;

function getClient() {
  if (!anthropicClient) {
    anthropicClient = new Anthropic({ apiKey: config.anthropic.apiKey });
  }
  return anthropicClient;
}

// Research a prospect company using Claude with web search
async function researchProspect({ companyName, leadName, integrations, salesforceUrl }) {
  const client = getClient();

  const prompt = `You are a sales intelligence assistant for Tenzo, a restaurant analytics platform.

Research this prospect company using web search and return a JSON object with your findings.

Company: ${companyName}
Lead Name: ${leadName}
Known Integrations: ${integrations.join(', ')}
${salesforceUrl ? `Salesforce: ${salesforceUrl}` : ''}

Search the web for information about "${companyName}" to determine:
- What type of restaurant/hospitality business they are
- Where they are located (country, city)
- How many locations they have
- Any tech stack or integration info

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

  try {
    // Use Claude with web search tool for live research
    const response = await client.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 1024,
      tools: [{ type: 'web_search_20250305' }],
      messages: [{ role: 'user', content: prompt }],
    });

    // Extract the text response (may come after tool use blocks)
    const textBlock = response.content.find((block) => block.type === 'text');
    if (!textBlock) {
      throw new Error('No text response from Claude');
    }

    const text = textBlock.text.trim();
    return parseJsonResponse(text, { companyName, leadName, integrations });
  } catch (err) {
    console.warn('Web search research failed, falling back to basic research:', err.message);
    return researchWithoutSearch({ companyName, leadName, integrations, salesforceUrl });
  }
}

// Fallback: research using Claude's training knowledge only (no web search)
async function researchWithoutSearch({ companyName, leadName, integrations, salesforceUrl }) {
  const client = getClient();

  const prompt = `You are a sales intelligence assistant for Tenzo, a restaurant analytics platform.

Based on your knowledge, research this prospect and return a JSON object.

Company: ${companyName}
Lead Name: ${leadName}
Known Integrations: ${integrations.join(', ')}
${salesforceUrl ? `Salesforce: ${salesforceUrl}` : ''}

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
  return parseJsonResponse(text, { companyName, leadName, integrations });
}

function parseJsonResponse(text, { companyName, leadName, integrations }) {
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

module.exports = { researchProspect };
