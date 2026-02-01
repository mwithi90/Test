import Anthropic from "@anthropic-ai/sdk";
import type { TranscriptAnalysis } from "@/types";
import { getTranscriptAnalysisPrompt, getTranscriptUserPrompt } from "./prompts";

/**
 * Initialize the Anthropic client
 */
function getClaudeClient(): Anthropic {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY environment variable is not set");
  }

  return new Anthropic({
    apiKey,
  });
}

/**
 * Analyze a discovery call transcript using Claude
 */
export async function analyzeTranscript(
  transcript: string
): Promise<TranscriptAnalysis> {
  if (!transcript || transcript.trim().length < 50) {
    throw new Error("Transcript is too short or empty");
  }

  const client = getClaudeClient();

  try {
    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      temperature: 0.3, // Lower temperature for more consistent, factual analysis
      system: getTranscriptAnalysisPrompt(),
      messages: [
        {
          role: "user",
          content: getTranscriptUserPrompt(transcript),
        },
      ],
    });

    // Extract the text response
    const textContent = response.content.find((block) => block.type === "text");
    if (!textContent || textContent.type !== "text") {
      throw new Error("No text response from Claude");
    }

    // Parse the JSON response
    const jsonMatch = textContent.text.match(/```json\n([\s\S]+?)\n```/);
    const jsonString = jsonMatch ? jsonMatch[1] : textContent.text;

    let analysis: TranscriptAnalysis;
    try {
      analysis = JSON.parse(jsonString);
    } catch (parseError) {
      console.error("Failed to parse Claude response:", textContent.text);
      throw new Error("Failed to parse analysis results from Claude");
    }

    // Validate the response structure
    validateAnalysis(analysis);

    return analysis;
  } catch (error) {
    if (error instanceof Anthropic.APIError) {
      console.error("Anthropic API Error:", {
        status: error.status,
        message: error.message,
        type: error.type,
      });
      throw new Error(`Claude API Error: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Validate that the analysis has the required structure
 */
function validateAnalysis(analysis: any): asserts analysis is TranscriptAnalysis {
  if (!analysis || typeof analysis !== "object") {
    throw new Error("Analysis is not an object");
  }

  if (!analysis.clientContext || typeof analysis.clientContext !== "object") {
    throw new Error("Analysis missing clientContext");
  }

  if (!Array.isArray(analysis.painPoints)) {
    throw new Error("Analysis missing painPoints array");
  }

  if (!Array.isArray(analysis.tenzoSolutions)) {
    throw new Error("Analysis missing tenzoSolutions array");
  }

  if (!Array.isArray(analysis.demoAreas)) {
    throw new Error("Analysis missing demoAreas array");
  }

  if (!Array.isArray(analysis.competitors)) {
    throw new Error("Analysis missing competitors array");
  }

  // Basic validation passed
}

/**
 * Helper to estimate transcript analysis cost
 * (Claude Sonnet pricing as of 2025)
 */
export function estimateAnalysisCost(transcriptLength: number): {
  estimatedInputTokens: number;
  estimatedOutputTokens: number;
  estimatedCostUSD: number;
} {
  // Rough estimation: 1 token ≈ 4 characters
  const promptTokens = 3000; // System prompt is ~3000 tokens
  const transcriptTokens = Math.ceil(transcriptLength / 4);
  const estimatedInputTokens = promptTokens + transcriptTokens;
  const estimatedOutputTokens = 1500; // Typical analysis output

  // Claude Sonnet pricing (2025): $3/MTok input, $15/MTok output
  const inputCost = (estimatedInputTokens / 1_000_000) * 3;
  const outputCost = (estimatedOutputTokens / 1_000_000) * 15;

  return {
    estimatedInputTokens,
    estimatedOutputTokens,
    estimatedCostUSD: inputCost + outputCost,
  };
}
