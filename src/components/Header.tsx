"use client";

export default function Header() {
  return (
    <header className="hero-gradient text-white relative overflow-hidden">
      {/* Subtle decorative element */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute -right-20 -top-20 w-96 h-96 rounded-full bg-white" />
        <div className="absolute -left-10 -bottom-32 w-72 h-72 rounded-full bg-white" />
      </div>

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8 py-7 sm:py-9">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-white/[0.08] backdrop-blur-sm border border-white/[0.06] flex items-center justify-center">
                <span className="text-[15px] font-bold tracking-tight text-white/90">
                  FX
                </span>
              </div>
              <div>
                <h1 className="text-[22px] sm:text-[26px] font-bold tracking-[-0.02em] text-white">
                  AI FX Hedging Assistant
                </h1>
              </div>
            </div>
            <p className="mt-2.5 text-[14px] sm:text-[15px] text-blue-200/60 max-w-lg leading-relaxed font-light">
              Understand your foreign exchange exposure and explore hedging
              strategies with AI-assisted analysis.
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-3">
            <div className="flex items-center gap-1.5 rounded-full bg-white/[0.06] backdrop-blur-sm border border-white/[0.06] px-3.5 py-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400/80" />
              <span className="text-[11px] font-medium text-blue-200/70 tracking-wide">
                Educational Demo
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
