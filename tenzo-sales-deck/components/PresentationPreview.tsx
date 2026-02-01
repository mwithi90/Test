"use client";

import React from "react";
import { Button } from "./ui/button";
import { ExternalLink, Copy, CheckCircle } from "lucide-react";

interface PresentationPreviewProps {
  presentationUrl: string;
  presentationId: string;
  onCreateNew: () => void;
}

export function PresentationPreview({
  presentationUrl,
  presentationId,
  onCreateNew,
}: PresentationPreviewProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(presentationUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Presentation Created!
          </h2>
          <p className="text-gray-600">
            Your custom Tenzo sales deck is ready to share
          </p>
        </div>

        {/* Preview iframe */}
        <div className="mb-6 rounded-lg overflow-hidden border border-gray-300">
          <iframe
            src={`https://docs.google.com/presentation/d/${presentationId}/preview`}
            className="w-full h-96"
            allowFullScreen
            title="Presentation Preview"
          />
        </div>

        {/* Action buttons */}
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <input
              type="text"
              value={presentationUrl}
              readOnly
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm font-mono"
            />
            <Button
              onClick={handleCopyLink}
              variant="outline"
              size="md"
              className="whitespace-nowrap"
            >
              {copied ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Link
                </>
              )}
            </Button>
          </div>

          <div className="flex space-x-3">
            <Button
              onClick={() => window.open(presentationUrl, "_blank")}
              size="lg"
              className="flex-1"
            >
              <ExternalLink className="h-5 w-5 mr-2" />
              Open in Google Slides
            </Button>
            <Button
              onClick={onCreateNew}
              variant="outline"
              size="lg"
              className="flex-1"
            >
              Create Another
            </Button>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">
            Next Steps:
          </h3>
          <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
            <li>Review and customize the presentation as needed</li>
            <li>Add your company-specific examples and case studies</li>
            <li>Include relevant screenshots from Tenzo dashboards</li>
            <li>Share the link with your prospect or download as PDF</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
