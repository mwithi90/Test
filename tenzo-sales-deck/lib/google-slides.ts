import { google } from "googleapis";
import type { TranscriptAnalysis } from "@/types";

// Tenzo brand colors (from brand guidelines)
const TENZO_COLORS = {
  primary: { red: 0.102, green: 0.451, blue: 0.91 }, // #1a73e8
  secondary: { red: 0.541, green: 0.706, blue: 0.973 }, // #8ab4f8
  accent: { red: 0.984, green: 0.737, blue: 0.016 }, // #fbbc04
  text: { red: 0.373, green: 0.388, blue: 0.408 }, // #5f6368
  background: { red: 1, green: 1, blue: 1 }, // #ffffff
};

/**
 * Initialize Google Slides API client using Service Account
 * This is the recommended method for server-side use
 */
function getGoogleSlidesClient() {
  // Use service account credentials
  const credentials = {
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  };

  if (!credentials.client_email || !credentials.private_key) {
    throw new Error(
      "Google Service Account credentials not configured. Please set GOOGLE_SERVICE_ACCOUNT_EMAIL and GOOGLE_PRIVATE_KEY in .env"
    );
  }

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: [
      "https://www.googleapis.com/auth/presentations",
      "https://www.googleapis.com/auth/drive.file",
    ],
  });

  return {
    slides: google.slides({ version: "v1", auth }),
    drive: google.drive({ version: "v3", auth }),
  };
}

/**
 * Create a new Google Slides presentation
 */
async function createPresentation(title: string): Promise<string> {
  const { slides } = getGoogleSlidesClient();

  const response = await slides.presentations.create({
    requestBody: {
      title,
    },
  });

  if (!response.data.presentationId) {
    throw new Error("Failed to create presentation");
  }

  return response.data.presentationId;
}

/**
 * Make the presentation publicly accessible or shareable
 */
async function makeShareable(presentationId: string): Promise<void> {
  const { drive } = getGoogleSlidesClient();

  await drive.permissions.create({
    fileId: presentationId,
    requestBody: {
      role: "reader",
      type: "anyone", // Anyone with the link can view
    },
  });
}

/**
 * Generate the complete sales presentation from analysis
 */
export async function generateSalesPresentation(
  analysis: TranscriptAnalysis
): Promise<{ presentationId: string; presentationUrl: string }> {
  const title = `${analysis.clientContext.companyName} - Tenzo Custom Demo`;

  // Create the presentation
  const presentationId = await createPresentation(title);

  // Build all the slides
  const requests: any[] = [];

  // Delete the default blank slide
  requests.push({
    deleteObject: {
      objectId: "p", // Default slide ID
    },
  });

  // 1. Title slide
  requests.push(...createTitleSlide(analysis.clientContext.companyName));

  // 2. Pain points slide
  requests.push(...createPainPointsSlide(analysis.painPoints));

  // 3. Solution slides (one for each pain)
  analysis.tenzoSolutions.slice(0, 5).forEach((solution, index) => {
    requests.push(...createSolutionSlide(solution, index));
  });

  // 4. Demo areas slide
  requests.push(...createDemoAreasSlide(analysis.demoAreas));

  // 5. Next steps slide
  requests.push(...createNextStepsSlide());

  // Execute all requests
  const { slides } = getGoogleSlidesClient();
  await slides.presentations.batchUpdate({
    presentationId,
    requestBody: {
      requests,
    },
  });

  // Make shareable
  await makeShareable(presentationId);

  return {
    presentationId,
    presentationUrl: `https://docs.google.com/presentation/d/${presentationId}/edit`,
  };
}

/**
 * Create title slide
 */
function createTitleSlide(companyName: string): any[] {
  const slideId = "title-slide";
  const titleId = "title-text";
  const subtitleId = "subtitle-text";

  return [
    {
      createSlide: {
        objectId: slideId,
        slideLayoutReference: {
          predefinedLayout: "BLANK",
        },
      },
    },
    {
      createShape: {
        objectId: titleId,
        shapeType: "TEXT_BOX",
        elementProperties: {
          pageObjectId: slideId,
          size: {
            width: { magnitude: 600, unit: "PT" },
            height: { magnitude: 100, unit: "PT" },
          },
          transform: {
            scaleX: 1,
            scaleY: 1,
            translateX: 50,
            translateY: 150,
            unit: "PT",
          },
        },
      },
    },
    {
      insertText: {
        objectId: titleId,
        text: companyName,
      },
    },
    {
      updateTextStyle: {
        objectId: titleId,
        style: {
          fontSize: { magnitude: 44, unit: "PT" },
          foregroundColor: {
            opaqueColor: {
              rgbColor: TENZO_COLORS.primary,
            },
          },
          bold: true,
          fontFamily: "Roboto",
        },
        fields: "fontSize,foregroundColor,bold,fontFamily",
      },
    },
    {
      updateParagraphStyle: {
        objectId: titleId,
        style: {
          alignment: "CENTER",
        },
        fields: "alignment",
      },
    },
    {
      createShape: {
        objectId: subtitleId,
        shapeType: "TEXT_BOX",
        elementProperties: {
          pageObjectId: slideId,
          size: {
            width: { magnitude: 600, unit: "PT" },
            height: { magnitude: 60, unit: "PT" },
          },
          transform: {
            scaleX: 1,
            scaleY: 1,
            translateX: 50,
            translateY: 270,
            unit: "PT",
          },
        },
      },
    },
    {
      insertText: {
        objectId: subtitleId,
        text: "Custom Demo Presentation\nPowered by Tenzo",
      },
    },
    {
      updateTextStyle: {
        objectId: subtitleId,
        style: {
          fontSize: { magnitude: 24, unit: "PT" },
          foregroundColor: {
            opaqueColor: {
              rgbColor: TENZO_COLORS.text,
            },
          },
          fontFamily: "Roboto",
        },
        fields: "fontSize,foregroundColor,fontFamily",
      },
    },
    {
      updateParagraphStyle: {
        objectId: subtitleId,
        style: {
          alignment: "CENTER",
        },
        fields: "alignment",
      },
    },
  ];
}

/**
 * Create pain points slide
 */
function createPainPointsSlide(painPoints: any[]): any[] {
  const slideId = "pain-points-slide";
  const titleId = "pain-points-title";
  const contentId = "pain-points-content";

  const topPains = painPoints
    .sort((a, b) => {
      const severity = { high: 3, medium: 2, low: 1 };
      return severity[b.severity as keyof typeof severity] - severity[a.severity as keyof typeof severity];
    })
    .slice(0, 5);

  const bulletPoints = topPains.map((p, i) => `${i + 1}. ${p.pain}`).join("\n");

  return [
    {
      createSlide: {
        objectId: slideId,
        slideLayoutReference: {
          predefinedLayout: "BLANK",
        },
      },
    },
    {
      createShape: {
        objectId: titleId,
        shapeType: "TEXT_BOX",
        elementProperties: {
          pageObjectId: slideId,
          size: {
            width: { magnitude: 600, unit: "PT" },
            height: { magnitude: 60, unit: "PT" },
          },
          transform: {
            scaleX: 1,
            scaleY: 1,
            translateX: 50,
            translateY: 30,
            unit: "PT",
          },
        },
      },
    },
    {
      insertText: {
        objectId: titleId,
        text: "Your Top Challenges",
      },
    },
    {
      updateTextStyle: {
        objectId: titleId,
        style: {
          fontSize: { magnitude: 36, unit: "PT" },
          foregroundColor: {
            opaqueColor: {
              rgbColor: TENZO_COLORS.primary,
            },
          },
          bold: true,
          fontFamily: "Roboto",
        },
        fields: "fontSize,foregroundColor,bold,fontFamily",
      },
    },
    {
      createShape: {
        objectId: contentId,
        shapeType: "TEXT_BOX",
        elementProperties: {
          pageObjectId: slideId,
          size: {
            width: { magnitude: 600, unit: "PT" },
            height: { magnitude: 300, unit: "PT" },
          },
          transform: {
            scaleX: 1,
            scaleY: 1,
            translateX: 50,
            translateY: 120,
            unit: "PT",
          },
        },
      },
    },
    {
      insertText: {
        objectId: contentId,
        text: bulletPoints,
      },
    },
    {
      updateTextStyle: {
        objectId: contentId,
        style: {
          fontSize: { magnitude: 20, unit: "PT" },
          foregroundColor: {
            opaqueColor: {
              rgbColor: TENZO_COLORS.text,
            },
          },
          fontFamily: "Roboto",
        },
        fields: "fontSize,foregroundColor,fontFamily",
      },
    },
  ];
}

/**
 * Create a solution slide for each pain point
 */
function createSolutionSlide(solution: any, index: number): any[] {
  const slideId = `solution-slide-${index}`;
  const titleId = `solution-title-${index}`;
  const painId = `solution-pain-${index}`;
  const solutionId = `solution-solution-${index}`;
  const benefitId = `solution-benefit-${index}`;

  return [
    {
      createSlide: {
        objectId: slideId,
        slideLayoutReference: {
          predefinedLayout: "BLANK",
        },
      },
    },
    {
      createShape: {
        objectId: titleId,
        shapeType: "TEXT_BOX",
        elementProperties: {
          pageObjectId: slideId,
          size: {
            width: { magnitude: 600, unit: "PT" },
            height: { magnitude: 60, unit: "PT" },
          },
          transform: {
            scaleX: 1,
            scaleY: 1,
            translateX: 50,
            translateY: 30,
            unit: "PT",
          },
        },
      },
    },
    {
      insertText: {
        objectId: titleId,
        text: "How Tenzo Solves It",
      },
    },
    {
      updateTextStyle: {
        objectId: titleId,
        style: {
          fontSize: { magnitude: 36, unit: "PT" },
          foregroundColor: {
            opaqueColor: {
              rgbColor: TENZO_COLORS.primary,
            },
          },
          bold: true,
          fontFamily: "Roboto",
        },
        fields: "fontSize,foregroundColor,bold,fontFamily",
      },
    },
    {
      createShape: {
        objectId: painId,
        shapeType: "TEXT_BOX",
        elementProperties: {
          pageObjectId: slideId,
          size: {
            width: { magnitude: 600, unit: "PT" },
            height: { magnitude: 60, unit: "PT" },
          },
          transform: {
            scaleX: 1,
            scaleY: 1,
            translateX: 50,
            translateY: 120,
            unit: "PT",
          },
        },
      },
    },
    {
      insertText: {
        objectId: painId,
        text: `Challenge: ${solution.pain}`,
      },
    },
    {
      updateTextStyle: {
        objectId: painId,
        style: {
          fontSize: { magnitude: 18, unit: "PT" },
          foregroundColor: {
            opaqueColor: {
              rgbColor: TENZO_COLORS.text,
            },
          },
          bold: true,
          fontFamily: "Roboto",
        },
        fields: "fontSize,foregroundColor,bold,fontFamily",
      },
    },
    {
      createShape: {
        objectId: solutionId,
        shapeType: "TEXT_BOX",
        elementProperties: {
          pageObjectId: slideId,
          size: {
            width: { magnitude: 600, unit: "PT" },
            height: { magnitude: 100, unit: "PT" },
          },
          transform: {
            scaleX: 1,
            scaleY: 1,
            translateX: 50,
            translateY: 200,
            unit: "PT",
          },
        },
      },
    },
    {
      insertText: {
        objectId: solutionId,
        text: `Solution: ${solution.solution}\n\nFeatures: ${solution.features.join(", ")}`,
      },
    },
    {
      updateTextStyle: {
        objectId: solutionId,
        style: {
          fontSize: { magnitude: 16, unit: "PT" },
          foregroundColor: {
            opaqueColor: {
              rgbColor: TENZO_COLORS.text,
            },
          },
          fontFamily: "Roboto",
        },
        fields: "fontSize,foregroundColor,fontFamily",
      },
    },
    {
      createShape: {
        objectId: benefitId,
        shapeType: "TEXT_BOX",
        elementProperties: {
          pageObjectId: slideId,
          size: {
            width: { magnitude: 600, unit: "PT" },
            height: { magnitude: 60, unit: "PT" },
          },
          transform: {
            scaleX: 1,
            scaleY: 1,
            translateX: 50,
            translateY: 330,
            unit: "PT",
          },
        },
      },
    },
    {
      insertText: {
        objectId: benefitId,
        text: `✓ ${solution.benefit}`,
      },
    },
    {
      updateTextStyle: {
        objectId: benefitId,
        style: {
          fontSize: { magnitude: 18, unit: "PT" },
          foregroundColor: {
            opaqueColor: {
              rgbColor: TENZO_COLORS.accent,
            },
          },
          bold: true,
          fontFamily: "Roboto",
        },
        fields: "fontSize,foregroundColor,bold,fontFamily",
      },
    },
  ];
}

/**
 * Create demo areas slide
 */
function createDemoAreasSlide(demoAreas: any[]): any[] {
  const slideId = "demo-areas-slide";
  const titleId = "demo-areas-title";
  const contentId = "demo-areas-content";

  const topAreas = demoAreas
    .sort((a, b) => a.priority - b.priority)
    .slice(0, 5);

  const bulletPoints = topAreas
    .map((area) => `• ${area.area} - ${area.reason}`)
    .join("\n");

  return [
    {
      createSlide: {
        objectId: slideId,
        slideLayoutReference: {
          predefinedLayout: "BLANK",
        },
      },
    },
    {
      createShape: {
        objectId: titleId,
        shapeType: "TEXT_BOX",
        elementProperties: {
          pageObjectId: slideId,
          size: {
            width: { magnitude: 600, unit: "PT" },
            height: { magnitude: 60, unit: "PT" },
          },
          transform: {
            scaleX: 1,
            scaleY: 1,
            translateX: 50,
            translateY: 30,
            unit: "PT",
          },
        },
      },
    },
    {
      insertText: {
        objectId: titleId,
        text: "Key Demo Areas",
      },
    },
    {
      updateTextStyle: {
        objectId: titleId,
        style: {
          fontSize: { magnitude: 36, unit: "PT" },
          foregroundColor: {
            opaqueColor: {
              rgbColor: TENZO_COLORS.primary,
            },
          },
          bold: true,
          fontFamily: "Roboto",
        },
        fields: "fontSize,foregroundColor,bold,fontFamily",
      },
    },
    {
      createShape: {
        objectId: contentId,
        shapeType: "TEXT_BOX",
        elementProperties: {
          pageObjectId: slideId,
          size: {
            width: { magnitude: 600, unit: "PT" },
            height: { magnitude: 300, unit: "PT" },
          },
          transform: {
            scaleX: 1,
            scaleY: 1,
            translateX: 50,
            translateY: 120,
            unit: "PT",
          },
        },
      },
    },
    {
      insertText: {
        objectId: contentId,
        text: bulletPoints,
      },
    },
    {
      updateTextStyle: {
        objectId: contentId,
        style: {
          fontSize: { magnitude: 18, unit: "PT" },
          foregroundColor: {
            opaqueColor: {
              rgbColor: TENZO_COLORS.text,
            },
          },
          fontFamily: "Roboto",
        },
        fields: "fontSize,foregroundColor,fontFamily",
      },
    },
  ];
}

/**
 * Create next steps slide
 */
function createNextStepsSlide(): any[] {
  const slideId = "next-steps-slide";
  const titleId = "next-steps-title";
  const contentId = "next-steps-content";

  return [
    {
      createSlide: {
        objectId: slideId,
        slideLayoutReference: {
          predefinedLayout: "BLANK",
        },
      },
    },
    {
      createShape: {
        objectId: titleId,
        shapeType: "TEXT_BOX",
        elementProperties: {
          pageObjectId: slideId,
          size: {
            width: { magnitude: 600, unit: "PT" },
            height: { magnitude: 60, unit: "PT" },
          },
          transform: {
            scaleX: 1,
            scaleY: 1,
            translateX: 50,
            translateY: 30,
            unit: "PT",
          },
        },
      },
    },
    {
      insertText: {
        objectId: titleId,
        text: "Next Steps",
      },
    },
    {
      updateTextStyle: {
        objectId: titleId,
        style: {
          fontSize: { magnitude: 36, unit: "PT" },
          foregroundColor: {
            opaqueColor: {
              rgbColor: TENZO_COLORS.primary,
            },
          },
          bold: true,
          fontFamily: "Roboto",
        },
        fields: "fontSize,foregroundColor,bold,fontFamily",
      },
    },
    {
      createShape: {
        objectId: contentId,
        shapeType: "TEXT_BOX",
        elementProperties: {
          pageObjectId: slideId,
          size: {
            width: { magnitude: 600, unit: "PT" },
            height: { magnitude: 200, unit: "PT" },
          },
          transform: {
            scaleX: 1,
            scaleY: 1,
            translateX: 50,
            translateY: 150,
            unit: "PT",
          },
        },
      },
    },
    {
      insertText: {
        objectId: contentId,
        text:
          "Let's schedule your personalized demo!\n\n" +
          "We'll show you exactly how Tenzo can solve the challenges we discussed.\n\n" +
          "Visit: www.gotenzo.com\n" +
          "Book a demo today!",
      },
    },
    {
      updateTextStyle: {
        objectId: contentId,
        style: {
          fontSize: { magnitude: 20, unit: "PT" },
          foregroundColor: {
            opaqueColor: {
              rgbColor: TENZO_COLORS.text,
            },
          },
          fontFamily: "Roboto",
        },
        fields: "fontSize,foregroundColor,fontFamily",
      },
    },
    {
      updateParagraphStyle: {
        objectId: contentId,
        style: {
          alignment: "CENTER",
        },
        fields: "alignment",
      },
    },
  ];
}
