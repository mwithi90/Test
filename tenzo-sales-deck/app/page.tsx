"use client";

import { useState } from "react";
import { TranscriptUpload } from "@/components/TranscriptUpload";
import { AnalysisResults } from "@/components/AnalysisResults";
import { PresentationPreview } from "@/components/PresentationPreview";
import type { TranscriptAnalysis } from "@/types";

type AppState = "upload" | "analysis" | "preview";

export default function Home() {
  const [state, setState] = useState<AppState>("upload");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [analysis, setAnalysis] = useState<TranscriptAnalysis | null>(null);
  const [presentationUrl, setPresentationUrl] = useState<string>("");
  const [presentationId, setPresentationId] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleTranscriptSubmit = async (transcript: string) => {
    setIsAnalyzing(true);
    setError("");

    try {
      const response = await fetch("/api/analyze-transcript", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ transcript }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to analyze transcript");
      }

      setAnalysis(data.analysis);
      setState("analysis");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerateSlides = async () => {
    if (!analysis) return;

    setIsGenerating(true);
    setError("");

    try {
      const response = await fetch("/api/generate-slides", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ analysis }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to generate slides");
      }

      setPresentationUrl(data.presentationUrl);
      setPresentationId(data.presentationId);
      setState("preview");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleStartOver = () => {
    setState("upload");
    setAnalysis(null);
    setPresentationUrl("");
    setPresentationId("");
    setError("");
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#1a73e8]">
                Tenzo Sales Deck Generator
              </h1>
              <p className="text-gray-600 mt-1">
                AI-powered custom presentations from discovery calls
              </p>
            </div>
            <div className="text-sm text-gray-500">
              Powered by Claude & Google Slides
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Error Message */}
        {error && (
          <div className="max-w-4xl mx-auto mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="mt-1 text-sm text-red-700">{error}</p>
              </div>
              <button
                onClick={() => setError("")}
                className="ml-3 inline-flex text-red-400 hover:text-red-500"
              >
                <span className="sr-only">Dismiss</span>
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Steps Indicator */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center justify-center space-x-4">
            <StepIndicator
              number={1}
              label="Upload Transcript"
              active={state === "upload"}
              completed={state === "analysis" || state === "preview"}
            />
            <div
              className={`h-1 w-16 ${
                state === "analysis" || state === "preview"
                  ? "bg-[#1a73e8]"
                  : "bg-gray-300"
              }`}
            />
            <StepIndicator
              number={2}
              label="Review Analysis"
              active={state === "analysis"}
              completed={state === "preview"}
            />
            <div
              className={`h-1 w-16 ${
                state === "preview" ? "bg-[#1a73e8]" : "bg-gray-300"
              }`}
            />
            <StepIndicator
              number={3}
              label="Get Presentation"
              active={state === "preview"}
              completed={false}
            />
          </div>
        </div>

        {/* Content based on state */}
        {state === "upload" && (
          <TranscriptUpload
            onTranscriptSubmit={handleTranscriptSubmit}
            isLoading={isAnalyzing}
          />
        )}

        {state === "analysis" && analysis && (
          <AnalysisResults
            analysis={analysis}
            onGenerateSlides={handleGenerateSlides}
            isGenerating={isGenerating}
            onStartOver={handleStartOver}
          />
        )}

        {state === "preview" && presentationUrl && presentationId && (
          <PresentationPreview
            presentationUrl={presentationUrl}
            presentationId={presentationId}
            onCreateNew={handleStartOver}
          />
        )}
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            Built for Tenzo Account Executives • Powered by AI
          </p>
        </div>
      </footer>
    </main>
  );
}

// Step Indicator Component
function StepIndicator({
  number,
  label,
  active,
  completed,
}: {
  number: number;
  label: string;
  active: boolean;
  completed: boolean;
}) {
  return (
    <div className="flex flex-col items-center">
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
          completed
            ? "bg-[#1a73e8] text-white"
            : active
            ? "bg-[#1a73e8] text-white"
            : "bg-gray-300 text-gray-600"
        }`}
      >
        {completed ? "✓" : number}
      </div>
      <span
        className={`mt-2 text-xs font-medium ${
          active || completed ? "text-[#1a73e8]" : "text-gray-500"
        }`}
      >
        {label}
      </span>
    </div>
  );
}
