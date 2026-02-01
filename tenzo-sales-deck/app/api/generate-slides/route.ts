import { NextRequest, NextResponse } from "next/server";
import { generateSalesPresentation } from "@/lib/google-slides";
import type {
  GenerateSlidesRequest,
  GenerateSlidesResponse,
} from "@/types";

export const runtime = "nodejs";
export const maxDuration = 60; // Allow up to 60 seconds for slide generation

export async function POST(request: NextRequest) {
  try {
    const body: GenerateSlidesRequest = await request.json();

    if (!body.analysis) {
      return NextResponse.json(
        {
          success: false,
          error: "Analysis data is required",
        } as GenerateSlidesResponse,
        { status: 400 }
      );
    }

    // Validate analysis structure
    if (
      !body.analysis.clientContext ||
      !body.analysis.painPoints ||
      !body.analysis.tenzoSolutions ||
      !body.analysis.demoAreas
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid analysis data structure",
        } as GenerateSlidesResponse,
        { status: 400 }
      );
    }

    // Generate the Google Slides presentation
    const result = await generateSalesPresentation(body.analysis);

    return NextResponse.json({
      success: true,
      presentationId: result.presentationId,
      presentationUrl: result.presentationUrl,
    } as GenerateSlidesResponse);
  } catch (error) {
    console.error("Error generating slides:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    return NextResponse.json(
      {
        success: false,
        error: `Failed to generate slides: ${errorMessage}`,
      } as GenerateSlidesResponse,
      { status: 500 }
    );
  }
}
