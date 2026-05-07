"use client";

import { useState, useMemo } from "react";
import { RecommendationContext } from "@/lib/types";
import { generateMemo, MemoTone } from "@/lib/memo-generator";
import StepShell from "./StepShell";
import HedgeTimeline from "./HedgeTimeline";
import CopilotChat from "./CopilotChat";

interface Props {
  ctx: RecommendationContext;
}

export default function Step6Memo({ ctx }: Props) {
  const [tone, setTone] = useState<MemoTone>("default");
  const [bump, setBump] = useState(0); // forces regenerate animation
  const [copied, setCopied] = useState(false);

  // Note: `bump` is intentionally a dependency — clicking "Regenerate" should
  // produce a new memo string even when ctx and tone are unchanged, so that
  // the fade-in animation re-fires.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const memo = useMemo(() => generateMemo(ctx, tone), [ctx, tone, bump]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(memo);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const handleDownload = () => {
    const blob = new Blob([memo], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `treasury-memo-${ctx.input.foreignCurrency}-${ctx.input.baseCurrency}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const isLayered = ctx.selectedStrategy === "layered";

  return (
    <StepShell
      index={6}
      label="Treasury Memo"
      title="Generate the recommendation memo."
      subtitle="A short, polished memo to walk into the bank — or the CFO's inbox."
      tone="dark"
      id="step-6"
    >
      <div className="space-y-5">
        {/* Memo card */}
        <div className="card p-6">
          <div className="flex items-center justify-between gap-3 flex-wrap mb-5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent-400 to-accent-700 flex items-center justify-center shadow-glow-soft">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.8}
                  className="w-5 h-5 text-white"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 6-7-6" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 15v4a2 2 0 002 2h10a2 2 0 002-2v-4" />
                </svg>
              </div>
              <div>
                <p className="font-display text-lg text-white tracking-tight">
                  Treasury memo
                </p>
                <p className="text-[11px] text-white/45">
                  Auto-drafted from the workflow inputs.
                </p>
              </div>
            </div>

            {/* Tone toggle */}
            <div className="flex items-center gap-2">
              {(
                [
                  { v: "default", label: "Default" },
                  { v: "conservative", label: "More conservative" },
                  { v: "simple", label: "Simpler" },
                ] as { v: MemoTone; label: string }[]
              ).map((t) => (
                <button
                  key={t.v}
                  onClick={() => {
                    setTone(t.v);
                    setBump((b) => b + 1);
                  }}
                  className={`text-[11px] px-3 py-1.5 rounded-full transition-all ${
                    tone === t.v
                      ? "bg-accent-500 text-ink-900 font-semibold"
                      : "bg-white/[0.04] border border-white/[0.08] text-white/65 hover:text-white"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Memo body */}
          <pre
            key={bump}
            className="whitespace-pre-wrap text-[12.5px] leading-[1.7] text-white/80 font-sans bg-white/[0.02] border border-white/[0.05] rounded-2xl p-5 max-h-[520px] overflow-y-auto animate-fade-in"
          >
            {memo}
          </pre>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-2 mt-5">
            <button onClick={handleCopy} className="btn-paper">
              {copied ? "Copied" : "Copy memo"}
            </button>
            <button onClick={handleDownload} className="btn-paper">
              Download .txt
            </button>
            <button
              onClick={() => setBump((b) => b + 1)}
              className="btn-paper"
            >
              Regenerate
            </button>
            <button
              onClick={() => setTone("conservative")}
              className="btn-paper"
            >
              Make more conservative
            </button>
            <button
              onClick={() => setTone("simple")}
              className="btn-paper"
            >
              Make simpler
            </button>
          </div>
        </div>

        {/* Timeline */}
        <HedgeTimeline isLayered={isLayered} timeHorizon={ctx.input.timeHorizon} />

        {/* Copilot chat */}
        <CopilotChat ctx={ctx} />
      </div>
    </StepShell>
  );
}
