"use client";

import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { FileText, Upload, X } from "lucide-react";
import { Button } from "./ui/button";

interface TranscriptUploadProps {
  onTranscriptSubmit: (transcript: string) => void;
  isLoading: boolean;
}

export function TranscriptUpload({
  onTranscriptSubmit,
  isLoading,
}: TranscriptUploadProps) {
  const [transcript, setTranscript] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setTranscript(text);
    };
    reader.readAsText(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/plain": [".txt"],
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
    },
    maxFiles: 1,
    disabled: isLoading,
  });

  const handleClear = () => {
    setTranscript("");
    setFileName(null);
  };

  const handleSubmit = () => {
    if (transcript.trim()) {
      onTranscriptSubmit(transcript.trim());
    }
  };

  const charCount = transcript.length;
  const wordCount = transcript.trim() ? transcript.trim().split(/\s+/).length : 0;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">
          Upload Discovery Call Transcript
        </h2>

        {!transcript && (
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
              isDragActive
                ? "border-[#1a73e8] bg-blue-50"
                : "border-gray-300 hover:border-[#1a73e8] hover:bg-gray-50"
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            {isDragActive ? (
              <p className="text-lg text-[#1a73e8]">Drop the file here...</p>
            ) : (
              <div className="space-y-2">
                <p className="text-lg text-gray-700">
                  Drag and drop a transcript file here, or click to select
                </p>
                <p className="text-sm text-gray-500">
                  Supports .txt, .pdf, and .docx files
                </p>
              </div>
            )}
          </div>
        )}

        {fileName && (
          <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <FileText className="h-6 w-6 text-[#1a73e8]" />
              <span className="text-sm font-medium text-gray-900">
                {fileName}
              </span>
            </div>
            <button
              onClick={handleClear}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              disabled={isLoading}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}

        <div className="space-y-2">
          <label
            htmlFor="transcript"
            className="block text-sm font-medium text-gray-700"
          >
            Or paste transcript directly:
          </label>
          <textarea
            id="transcript"
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="Paste your discovery call transcript here..."
            className="w-full h-64 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a73e8] focus:border-transparent resize-none font-mono text-sm"
            disabled={isLoading}
          />
          <div className="flex justify-between text-sm text-gray-500">
            <span>
              {wordCount} words, {charCount} characters
            </span>
            {charCount > 0 && charCount < 50 && (
              <span className="text-red-500">
                Minimum 50 characters required
              </span>
            )}
          </div>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={!transcript || transcript.length < 50 || isLoading}
          loading={isLoading}
          size="lg"
          className="w-full"
        >
          {isLoading ? "Analyzing Transcript..." : "Analyze Transcript"}
        </Button>
      </div>
    </div>
  );
}
