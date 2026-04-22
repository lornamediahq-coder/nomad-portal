"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";

const QUESTIONS = [
  {
    id: 1,
    question: "When you picture your ideal work setup, what comes to mind?",
    options: [
      { label: "A new café in a city I've never been to", archetype: "Explorer" },
      { label: "A focused home base where I can build something", archetype: "Builder" },
      { label: "Anywhere with wifi — I'm always thinking 10 steps ahead", archetype: "Visionary" },
      { label: "Wherever I end up — structure isn't my thing", archetype: "Wanderer" },
      { label: "A private, intentional space I've designed myself", archetype: "Sovereign" },
    ],
  },
  {
    id: 2,
    question: "What drives you most on the road?",
    options: [
      { label: "Discovery — new places, people, and experiences", archetype: "Explorer" },
      { label: "Progress — hitting milestones and growing income", archetype: "Builder" },
      { label: "Ideas — I'm always dreaming up the next thing", archetype: "Visionary" },
      { label: "Freedom — no rules, no fixed plans", archetype: "Wanderer" },
      { label: "Mastery — owning my craft and my schedule", archetype: "Sovereign" },
    ],
  },
  {
    id: 3,
    question: "How do you handle a rough travel week?",
    options: [
      { label: "Reset with a new destination or experience", archetype: "Explorer" },
      { label: "Double down on work — progress helps me feel grounded", archetype: "Builder" },
      { label: "Journal it and look for the bigger pattern", archetype: "Visionary" },
      { label: "Let it pass — I don't fight the current", archetype: "Wanderer" },
      { label: "Return to my routines and rituals", archetype: "Sovereign" },
    ],
  },
  {
    id: 4,
    question: "What's your relationship with money?",
    options: [
      { label: "Spend it on experiences — that's what it's for", archetype: "Explorer" },
      { label: "Track it closely — I want to know my runway", archetype: "Builder" },
      { label: "I think in systems — how can money work for me?", archetype: "Visionary" },
      { label: "I earn what I need and don't overthink it", archetype: "Wanderer" },
      { label: "Slow burn — I invest in quality and longevity", archetype: "Sovereign" },
    ],
  },
  {
    id: 5,
    question: "What do you want most from a community?",
    options: [
      { label: "Travel tips, collab opportunities, and local connections", archetype: "Explorer" },
      { label: "Accountability partners and skill-swap", archetype: "Builder" },
      { label: "Deep thinkers who challenge my ideas", archetype: "Visionary" },
      { label: "Vibe — people who just get it", archetype: "Wanderer" },
      { label: "Respected peers — quality over quantity", archetype: "Sovereign" },
    ],
  },
];

function scoreArchetype(answers: string[]): string {
  const counts: Record<string, number> = {};
  for (const a of answers) {
    counts[a] = (counts[a] ?? 0) + 1;
  }
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
}

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const q = QUESTIONS[step];

  async function selectAnswer(archetype: string) {
    const next = [...answers, archetype];
    setAnswers(next);

    if (step < QUESTIONS.length - 1) {
      setStep(step + 1);
      return;
    }

    // Last question — compute and save
    setSaving(true);
    const result = scoreArchetype(next);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      await supabase
        .from("users")
        .update({ archetype: result })
        .eq("id", user.id);
    }

    router.push(`/onboarding/result?archetype=${result}`);
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5 py-12"
         style={{ background: "#F5F0E8" }}>
      <div className="w-full max-w-sm">
        {/* Logo */}
        <p className="text-center text-xs font-semibold tracking-[0.2em] uppercase mb-10"
           style={{ color: "#0F6E56", fontFamily: "var(--font-jost)" }}>
          Nomad Portal
        </p>

        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-10">
          {QUESTIONS.map((_, i) => (
            <div
              key={i}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === step ? "24px" : "8px",
                height: "8px",
                background: i <= step ? "#0F6E56" : "#d4cfc6",
              }}
            />
          ))}
        </div>

        {/* Step counter */}
        <p className="text-center text-xs tracking-widest uppercase mb-4"
           style={{ color: "#6b6b60", fontFamily: "var(--font-jost)" }}>
          {step + 1} / {QUESTIONS.length}
        </p>

        {/* Question */}
        <h2 className="text-center mb-8" style={{
          fontFamily: "var(--font-cormorant)",
          fontSize: "1.6rem",
          fontWeight: 500,
          color: "#1a1a18",
          lineHeight: 1.3,
        }}>
          {q.question}
        </h2>

        {/* Options */}
        <div className="flex flex-col gap-3">
          {q.options.map((opt) => (
            <button
              key={opt.archetype}
              onClick={() => !saving && selectAnswer(opt.archetype)}
              disabled={saving}
              className="w-full px-5 py-4 rounded-2xl text-left text-sm transition-all"
              style={{
                background: "white",
                border: "1.5px solid #e8e2d8",
                color: "#1a1a18",
                fontFamily: "var(--font-jost)",
                cursor: saving ? "default" : "pointer",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = "#0F6E56";
                (e.currentTarget as HTMLButtonElement).style.background = "#f0faf6";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = "#e8e2d8";
                (e.currentTarget as HTMLButtonElement).style.background = "white";
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
