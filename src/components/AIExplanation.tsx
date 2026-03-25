"use client";

import { useState } from "react";

interface Props {
  explanation: string;
}

export default function AIExplanation({ explanation }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const plain = explanation.replace(/\*\*/g, "");
    await navigator.clipboard.writeText(plain);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Simple markdown-like rendering for **bold** headings
  const renderText = (text: string) => {
    return text.split("\n").map((line, i) => {
      if (line.startsWith("**") && line.endsWith("**")) {
        return (
          <h3
            key={i}
            className="text-[13px] font-semibold text-gray-800 mt-5 first:mt-0 mb-1.5 flex items-center gap-2"
          >
            <div className="w-1 h-4 rounded-full bg-brand-400/60" />
            {line.replace(/\*\*/g, "")}
          </h3>
        );
      }
      if (line.trim() === "") return <div key={i} className="h-2.5" />;
      return (
        <p key={i} className="text-[13px] text-gray-600 leading-[1.7] ml-3">
          {line}
        </p>
      );
    });
  };

  return (
    <div className="card p-6 sm:p-7 animate-fade-in-delay-2">
      {/* Section header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-sm shadow-brand-200/40">
            <svg
              className="w-3.5 h-3.5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-[15px] font-semibold text-gray-900 tracking-[-0.01em]">
              AI Explanation
            </h2>
            <p className="text-[11px] text-gray-400">
              Plain-English analysis of your exposure
            </p>
          </div>
        </div>
        <button
          onClick={handleCopy}
          className={`text-[11px] font-medium px-2.5 py-1 rounded-md transition-all duration-200 ${
            copied
              ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
              : "text-gray-400 hover:text-gray-600 hover:bg-gray-50 border border-transparent"
          }`}
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      {/* Explanation body */}
      <div className="rounded-xl bg-surface-50 border border-gray-100/80 p-5">
        {renderText(explanation)}
      </div>

      <div className="flex items-center gap-1.5 mt-3.5">
        <div className="w-1 h-1 rounded-full bg-gray-300" />
        <p className="text-[10px] text-gray-400 font-medium tracking-wide">
          Generated using template-based logic — no external API required
        </p>
      </div>
    </div>
  );
}
