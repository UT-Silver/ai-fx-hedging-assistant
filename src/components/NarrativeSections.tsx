"use client";

export default function NarrativeSections() {
  return (
    <>
      <WhyBetterWorkflow />
      <WhatItDoes />
      <PreTrade />
    </>
  );
}

function WhyBetterWorkflow() {
  return (
    <section className="relative section-dark border-t border-white/5">
      <div className="absolute inset-0 grid-overlay opacity-50 pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-6 sm:px-10 py-24">
        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-12 lg:gap-20 items-start">
          <div>
            <p className="section-label text-accent-400 mb-4">01 — Problem</p>
            <h2 className="font-display text-[clamp(2rem,4.5vw,3.4rem)] leading-[1.05] text-white">
              FX hedging needs a better<br />
              <span className="italic text-white/70">pre-trade workflow</span>.
            </h2>
          </div>
          <div className="space-y-5 text-[15px] leading-relaxed text-white/70 max-w-xl">
            <p>
              Corporate FX hedging today is fragmented across spreadsheets, bank
              quotes, market data feeds, and internal approval emails. The
              decision logic — what risk you have, what to hedge, how much, and
              with which structure — happens out of view of the people who
              ultimately sign off.
            </p>
            <p className="text-white/55">
              The Treasury Copilot brings the pre-trade decision into a single
              structured workflow. Inputs become a diagnosis. Strategies are
              compared like for like. Scenarios are interactive. The output is a
              memo a CFO can actually read.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function WhatItDoes() {
  const items = [
    {
      label: "Identifies",
      title: "Exposure",
      body: "Captures currency, direction, amount, horizon and certainty into a single structured view.",
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 6l9-3 9 3M3 6v12l9 3 9-3V6M3 6l9 3m0 0l9-3m-9 3v12"
        />
      ),
    },
    {
      label: "Diagnoses",
      title: "Risk",
      body: "Translates the inputs into a plain-English risk read, with pre- and post-hedge levels.",
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v3.75m0 6.75h.008v.008H12v-.008zM12 3l9.5 16.5h-19L12 3z"
        />
      ),
    },
    {
      label: "Compares",
      title: "Strategies",
      body: "Forward, option, collar and layered side-by-side — protection, flexibility, cost.",
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 12l3-3 3 3 4-4 4 4 4-4M3 18h18"
        />
      ),
    },
    {
      label: "Generates",
      title: "Treasury memo",
      body: "Polished recommendation memo with rationale, scenarios, and next steps.",
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h7l5 5v11a2 2 0 01-2 2z"
        />
      ),
    },
  ];

  return (
    <section className="section-paper">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 py-24">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-14">
          <div>
            <p className="section-label text-accent-700 mb-3">02 — Capability</p>
            <h2 className="font-display text-[clamp(2rem,4.5vw,3.4rem)] leading-[1.05] text-ink-900 max-w-2xl">
              What the assistant<br />
              <span className="italic text-ink-500">actually does</span>.
            </h2>
          </div>
          <p className="text-[14px] text-ink-500 max-w-md">
            Four jobs, one continuous flow. The output of each step feeds the
            next — no copy-pasting between tools.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map((it, i) => (
            <div
              key={it.title}
              className="card-paper p-6 card-interactive"
              style={{ borderRadius: "1.25rem" }}
            >
              <p className="text-[10px] uppercase tracking-[0.16em] text-ink-400 mb-2">
                {String(i + 1).padStart(2, "0")} · {it.label}
              </p>
              <div className="w-9 h-9 rounded-xl bg-accent-50 border border-accent-100 flex items-center justify-center mb-4">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.6}
                  className="w-5 h-5 text-accent-700"
                >
                  {it.icon}
                </svg>
              </div>
              <h3 className="font-display text-2xl text-ink-900 mb-2 tracking-tight">
                {it.title}
              </h3>
              <p className="text-[13px] leading-relaxed text-ink-500">{it.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PreTrade() {
  return (
    <section className="relative section-dark border-t border-white/5">
      <div className="absolute inset-0 grid-overlay opacity-30 pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-6 sm:px-10 py-24">
        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-12 items-start">
          <div>
            <p className="section-label text-accent-400 mb-4">03 — Boundary</p>
            <h2 className="font-display text-[clamp(2rem,4.5vw,3.2rem)] leading-[1.05] text-white max-w-xl">
              Built for <span className="italic text-accent-300">pre-trade</span><br />
              decision support.
            </h2>
            <p className="mt-6 text-[15px] leading-relaxed text-white/65 max-w-xl">
              The Copilot does not execute trades and does not replace bank
              execution. It helps treasury teams understand their exposure,
              compare strategy trade-offs, and walk into the bank conversation
              with a clear, defensible point of view.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Pill
              tone="ok"
              title="In scope"
              items={["Exposure capture", "Risk diagnosis", "Strategy comparison", "Scenario analysis", "Treasury memo"]}
            />
            <Pill
              tone="off"
              title="Out of scope"
              items={["Live bank execution", "Real-time market data", "Trade confirmation", "Hedge accounting bookings", "ISDA / credit lines"]}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function Pill({
  tone,
  title,
  items,
}: {
  tone: "ok" | "off";
  title: string;
  items: string[];
}) {
  const accent =
    tone === "ok"
      ? { ring: "border-success-500/30", text: "text-success-400", dot: "bg-success-400" }
      : { ring: "border-white/10", text: "text-white/40", dot: "bg-white/30" };
  return (
    <div className={`card p-5 border ${accent.ring}`}>
      <p className={`text-[10px] uppercase tracking-[0.16em] ${accent.text} mb-3`}>
        {title}
      </p>
      <ul className="space-y-2">
        {items.map((s) => (
          <li key={s} className="flex items-center gap-2 text-[13px] text-white/70">
            <span className={`w-1.5 h-1.5 rounded-full ${accent.dot}`} />
            {s}
          </li>
        ))}
      </ul>
    </div>
  );
}
