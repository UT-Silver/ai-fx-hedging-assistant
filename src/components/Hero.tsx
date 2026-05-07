"use client";

interface Props {
  onStart: () => void;
  onSample: () => void;
}

export default function Hero({ onStart, onSample }: Props) {
  return (
    <header className="relative overflow-hidden hero-bg">
      {/* Grid + scanline decorations */}
      <div className="absolute inset-0 grid-overlay pointer-events-none" />
      <div className="scan opacity-40" />

      {/* Top nav */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center backdrop-blur-md">
            <svg
              viewBox="0 0 24 24"
              className="w-5 h-5 text-accent-300"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 17l4-4 4 4 6-6 4 4M3 7h6m6 0h6"
              />
            </svg>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-[15px] font-semibold tracking-tight text-white">
              Treasury<span className="text-accent-400">.</span>Copilot
            </span>
            <span className="text-[10px] text-white/30 uppercase tracking-[0.16em]">
              FX
            </span>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-2">
          <span className="tag-pill">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-glow" />
            Pre-trade demo
          </span>
        </div>
      </div>

      {/* Hero content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 pt-10 sm:pt-20 pb-20 sm:pb-28">
        <div className="flex flex-wrap gap-2 mb-7">
          <span className="tag-pill">Corporate Treasury</span>
          <span className="tag-pill">FX Risk</span>
          <span className="tag-pill">AI Copilot</span>
          <span className="tag-pill">Scenario Analysis</span>
        </div>

        <h1 className="font-display text-[clamp(2.6rem,7vw,5.4rem)] leading-[1.02] tracking-tight text-white max-w-4xl">
          AI <span className="text-gradient italic">FX Hedging</span><br />
          Assistant
        </h1>

        <p className="mt-7 text-[18px] sm:text-[20px] leading-snug text-white/70 max-w-2xl font-light">
          Turn foreign currency exposure into actionable treasury decisions.
        </p>

        <p className="mt-5 text-[15px] leading-relaxed text-white/55 max-w-2xl">
          A pre-trade decision tool for treasurers, CFOs and banking relationship
          managers. Identify FX risk, compare hedging strategies, run scenario
          analysis, and generate a treasury-style memo — in one workflow.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <button onClick={onStart} className="btn-primary group">
            Start hedging analysis
            <svg
              className="w-4 h-4 transition-transform group-hover:translate-x-0.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 12h14m0 0l-6-6m6 6l-6 6"
              />
            </svg>
          </button>
          <button onClick={onSample} className="btn-ghost">
            View sample workflow
          </button>
        </div>

        {/* Floating stat / signal block */}
        <div className="mt-16 grid sm:grid-cols-3 gap-4 max-w-3xl">
          <Signal label="Strategies compared" value="4" sub="Forward · Option · Collar · Layered" />
          <Signal label="Workflow steps" value="6" sub="From exposure to memo" />
          <Signal label="Output" value="Memo + chat" sub="CFO-ready in seconds" />
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-[#04081a] pointer-events-none" />
    </header>
  );
}

function Signal({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4 backdrop-blur-md">
      <p className="text-[10px] uppercase tracking-[0.16em] text-white/40 mb-1.5">
        {label}
      </p>
      <p className="font-display text-2xl text-white tracking-tight">{value}</p>
      <p className="text-[11px] text-white/50 mt-1.5">{sub}</p>
    </div>
  );
}
