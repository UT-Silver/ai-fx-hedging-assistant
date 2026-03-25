"use client";

export default function Disclaimer() {
  return (
    <div className="rounded-xl bg-gray-50/80 border border-gray-200/50 px-5 py-3.5 animate-fade-in-delay-3">
      <div className="flex items-start gap-2.5">
        <svg
          className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
          />
        </svg>
        <p className="text-[11px] text-gray-500 leading-relaxed">
          <span className="font-semibold text-gray-600">Disclaimer:</span> This
          tool is for educational purposes only. It does not constitute
          financial, investment, or risk management advice. All scenarios are
          illustrative and use simplified assumptions. Consult a qualified
          professional before making hedging decisions.
        </p>
      </div>
    </div>
  );
}
