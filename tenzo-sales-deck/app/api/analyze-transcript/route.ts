import { NextRequest, NextResponse } from "next/server";
import { analyzeTranscript } from "@/lib/claude";
import type {
  AnalyzeTranscriptRequest,
  AnalyzeTranscriptResponse,
} from "@/types";

export const runtime = "nodejs";
export const maxDuration = 60; // Allow up to 60 seconds for analysis

export async function POST(request: NextRequest) {
  try {
    const body: AnalyzeTranscriptRequest = await request.json();

    if (!body.transcript) {
      return NextResponse.json(
        {
          success: false,
          error: "Transcript is required",
        } as AnalyzeTranscriptResponse,
        { status: 400 }
      );
    }

    // Validate transcript length
    if (body.transcript.length < 50) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Transcript is too short. Please provide a meaningful discovery call transcript (at least 50 characters).",
        } as AnalyzeTranscriptResponse,
        { status: 400 }
      );
    }

    if (body.transcript.length > 100000) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Transcript is too long. Please limit to 100,000 characters or less.",
        } as AnalyzeTranscriptResponse,
        { status: 400 }
      );
    }

    // Analyze the transcript using Claude
    const analysis = await analyzeTranscript(body.transcript);

    return NextResponse.json({
      success: true,
      analysis,
    } as AnalyzeTranscriptResponse);
  } catch (error) {
    console.error("Error analyzing transcript:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    return NextResponse.json(
      {
        success: false,
        error: `Failed to analyze transcript: ${errorMessage}`,
      } as AnalyzeTranscriptResponse,
      { status: 500 }
    );
  }
}
