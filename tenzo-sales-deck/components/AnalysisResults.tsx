"use client";

import React from "react";
import { TranscriptAnalysis } from "@/types";
import { Button } from "./ui/button";
import { AlertCircle, CheckCircle, Target, TrendingUp } from "lucide-react";

interface AnalysisResultsProps {
  analysis: TranscriptAnalysis;
  onGenerateSlides: () => void;
  isGenerating: boolean;
  onStartOver: () => void;
}

export function AnalysisResults({
  analysis,
  onGenerateSlides,
  isGenerating,
  onStartOver,
}: AnalysisResultsProps) {
  const severityColors = {
    high: "bg-red-100 text-red-800 border-red-200",
    medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
    low: "bg-blue-100 text-blue-800 border-blue-200",
  };

  const severityIcons = {
    high: <AlertCircle className="h-5 w-5" />,
    medium: <AlertCircle className="h-5 w-5" />,
    low: <AlertCircle className="h-5 w-5" />,
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              Analysis Complete
            </h2>
            <p className="text-gray-600 mt-1">
              Review the insights below and generate your custom presentation
            </p>
          </div>
          <Button variant="outline" onClick={onStartOver} size="sm">
            Start Over
          </Button>
        </div>

        {/* Client Context */}
        <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            Client Overview
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Company:</span>{" "}
              <span className="text-gray-900">
                {analysis.clientContext.companyName || "Unknown"}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Type:</span>{" "}
              <span className="text-gray-900">
                {analysis.clientContext.restaurantType || "Unknown"}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Locations:</span>{" "}
              <span className="text-gray-900">
                {analysis.clientContext.locations || "Unknown"}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Current Tools:</span>{" "}
              <span className="text-gray-900">
                {analysis.clientContext.currentTools?.join(", ") || "None mentioned"}
              </span>
            </div>
          </div>
          {analysis.clientContext.additionalContext && (
            <div className="mt-3 text-sm">
              <span className="font-medium text-gray-700">Notes:</span>{" "}
              <span className="text-gray-900">
                {analysis.clientContext.additionalContext}
              </span>
            </div>
          )}
        </div>

        {/* Pain Points */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <AlertCircle className="h-6 w-6 text-[#1a73e8] mr-2" />
            <h3 className="text-xl font-semibold text-gray-900">
              Identified Pain Points ({analysis.painPoints.length})
            </h3>
          </div>
          <div className="space-y-3">
            {analysis.painPoints.map((pain, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${
                  severityColors[pain.severity]
                }`}
              >
                <div className="flex items-start">
                  <div className="mr-3 mt-0.5">{severityIcons[pain.severity]}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-semibold">{pain.pain}</p>
                      <span className="text-xs uppercase font-bold px-2 py-1 rounded">
                        {pain.severity}
                      </span>
                    </div>
                    <p className="text-sm opacity-80">
                      Category: {pain.category}
                    </p>
                    {pain.quote && (
                      <blockquote className="mt-2 text-sm italic border-l-2 border-current pl-3">
                        "{pain.quote}"
                      </blockquote>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tenzo Solutions */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <CheckCircle className="h-6 w-6 text-green-600 mr-2" />
            <h3 className="text-xl font-semibold text-gray-900">
              How Tenzo Solves These ({analysis.tenzoSolutions.length})
            </h3>
          </div>
          <div className="space-y-4">
            {analysis.tenzoSolutions.map((solution, index) => (
              <div
                key={index}
                className="p-4 bg-green-50 rounded-lg border border-green-200"
              >
                <p className="font-semibold text-gray-900 mb-2">
                  Pain: {solution.pain}
                </p>
                <p className="text-sm text-gray-700 mb-2">
                  <span className="font-medium">Solution:</span>{" "}
                  {solution.solution}
                </p>
                <p className="text-sm text-gray-700 mb-2">
                  <span className="font-medium">Features:</span>{" "}
                  {solution.features.join(", ")}
                </p>
                <p className="text-sm text-green-700 font-medium">
                  ✓ {solution.benefit}
                </p>
                <div className="mt-2">
                  <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded">
                    {solution.pillar}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Demo Areas */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Target className="h-6 w-6 text-[#fbbc04] mr-2" />
            <h3 className="text-xl font-semibold text-gray-900">
              Recommended Demo Areas ({analysis.demoAreas.length})
            </h3>
          </div>
          <div className="space-y-3">
            {analysis.demoAreas
              .sort((a, b) => a.priority - b.priority)
              .map((area, index) => (
                <div
                  key={index}
                  className="p-4 bg-yellow-50 rounded-lg border border-yellow-200"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <span className="bg-[#fbbc04] text-white font-bold text-sm rounded-full h-6 w-6 flex items-center justify-center mr-2">
                          {area.priority}
                        </span>
                        <p className="font-semibold text-gray-900">
                          {area.area}
                        </p>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">
                        {area.reason}
                      </p>
                      <p className="text-xs text-gray-600">
                        Features: {area.features.join(", ")}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Competitors */}
        {analysis.competitors.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <TrendingUp className="h-6 w-6 text-[#1a73e8] mr-2" />
              <h3 className="text-xl font-semibold text-gray-900">
                Competitive Insights ({analysis.competitors.length})
              </h3>
            </div>
            <div className="space-y-3">
              {analysis.competitors.map((comp, index) => (
                <div
                  key={index}
                  className="p-4 bg-purple-50 rounded-lg border border-purple-200"
                >
                  <p className="font-semibold text-gray-900 mb-2">
                    {comp.tool}
                  </p>
                  <p className="text-sm text-gray-700 mb-1">
                    <span className="font-medium">Limitation:</span>{" "}
                    {comp.limitation}
                  </p>
                  <p className="text-sm text-purple-700 font-medium">
                    <span className="font-medium">Tenzo Advantage:</span>{" "}
                    {comp.tenzoAdvantage}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Generate Button */}
        <div className="pt-6 border-t border-gray-200">
          <Button
            onClick={onGenerateSlides}
            disabled={isGenerating}
            loading={isGenerating}
            size="lg"
            className="w-full"
          >
            {isGenerating
              ? "Generating Presentation..."
              : "Generate Google Slides Presentation"}
          </Button>
        </div>
      </div>
    </div>
  );
}
