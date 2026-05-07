"use client";

import { useState } from "react";
import { RecommendationContext } from "@/lib/types";
import { CHIPS, ChipId, copilotReply } from "@/lib/copilot-responses";

interface Message {
  role: "user" | "assistant";
  text: string;
}

interface Props {
  ctx: RecommendationContext;
}

export default function CopilotChat({ ctx }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "I've drafted the recommendation above. Ask anything about the hedge, the trade-offs, or how to phrase it for stakeholders.",
    },
  ]);

  const handleChip = (id: ChipId, label: string) => {
    const reply = copilotReply(id, ctx);
    setMessages((m) => [
      ...m,
      { role: "user", text: label },
      { role: "assistant", text: reply },
    ]);
  };

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent-400 to-accent-700 flex items-center justify-center shadow-glow-soft">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              className="w-5 h-5 text-white"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
              />
            </svg>
          </div>
          <div>
            <p className="font-display text-lg text-white tracking-tight">
              Ask the Treasury Copilot
            </p>
            <p className="text-[11px] text-white/45">
              Rule-based responses for now — can plug into a live LLM later.
            </p>
          </div>
        </div>
      </div>

      {/* Conversation */}
      <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1 mb-4">
        {messages.map((m, i) => (
          <Bubble key={i} message={m} />
        ))}
      </div>

      {/* Suggested chips */}
      <div className="pt-4 border-t border-white/5">
        <p className="text-[10px] uppercase tracking-[0.16em] text-white/40 mb-2">
          Try
        </p>
        <div className="flex flex-wrap gap-2">
          {CHIPS.map((c) => (
            <button
              key={c.id}
              onClick={() => handleChip(c.id, c.label)}
              className="chip"
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function Bubble({ message }: { message: Message }) {
  const isUser = message.role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[88%] rounded-2xl px-4 py-3 text-[13px] leading-relaxed ${
          isUser
            ? "bg-accent-500 text-ink-900 font-medium"
            : "bg-white/[0.04] border border-white/[0.08] text-white/80"
        }`}
      >
        {message.text}
      </div>
    </div>
  );
}
