"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";

const MOODS = [
  { value: "energised", emoji: "⚡", label: "Energised" },
  { value: "focused",   emoji: "🎯", label: "Focused"   },
  { value: "grateful",  emoji: "🙏", label: "Grateful"  },
  { value: "tired",     emoji: "😴", label: "Tired"     },
  { value: "anxious",   emoji: "😰", label: "Anxious"   },
  { value: "neutral",   emoji: "😐", label: "Neutral"   },
];

export default function CheckInForm({ userId, podId }: { userId: string; podId: string }) {
  const router = useRouter();
  const [mood, setMood] = useState("");
  const [body, setBody] = useState("");
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim()) return;
    setSaving(true);

    const supabase = createClient();
    await supabase.from("pod_checkins").insert({
      user_id: userId,
      pod_id: podId,
      body: body.trim(),
      mood: mood || null,
    });

    setBody("");
    setMood("");
    setOpen(false);
    setSaving(false);
    router.refresh();
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full px-5 py-4 rounded-3xl text-left flex items-center gap-3"
        style={{ background: "white", border: "1.5px solid #e8e2d8" }}
      >
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0"
             style={{ background: "#F5F0E8" }}>
          ✏️
        </div>
        <span className="text-sm" style={{ color: "#9b9b8e", fontFamily: "var(--font-jost)" }}>
          How are you showing up today?
        </span>
      </button>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-3xl p-5 flex flex-col gap-4"
          style={{ background: "white", border: "1.5px solid #e8e2d8" }}>
      <p className="text-xs font-medium tracking-widest uppercase"
         style={{ color: "#6b6b60", fontFamily: "var(--font-jost)" }}>Check in</p>

      {/* Mood selector */}
      <div className="flex gap-2 flex-wrap">
        {MOODS.map((m) => (
          <button
            key={m.value}
            type="button"
            onClick={() => setMood(mood === m.value ? "" : m.value)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all"
            style={{
              background: mood === m.value ? "#0F6E56" : "#F5F0E8",
              color: mood === m.value ? "white" : "#6b6b60",
              fontFamily: "var(--font-jost)",
              border: "1.5px solid transparent",
            }}
          >
            <span>{m.emoji}</span> {m.label}
          </button>
        ))}
      </div>

      {/* Text area */}
      <textarea
        required
        rows={4}
        placeholder="What are you working on? What's alive for you right now?"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        className="w-full px-4 py-3 rounded-2xl text-sm outline-none resize-none"
        style={{
          background: "#F5F0E8",
          border: "1.5px solid transparent",
          color: "#1a1a18",
          fontFamily: "var(--font-jost)",
          lineHeight: 1.6,
        }}
        onFocus={(e) => (e.target.style.borderColor = "#0F6E56")}
        onBlur={(e) => (e.target.style.borderColor = "transparent")}
      />

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="flex-1 py-3 rounded-2xl text-sm font-medium"
          style={{ background: "#F5F0E8", color: "#6b6b60", fontFamily: "var(--font-jost)" }}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="flex-1 py-3 rounded-2xl text-sm font-medium transition-opacity"
          style={{ background: "#0F6E56", color: "white", fontFamily: "var(--font-jost)", opacity: saving ? 0.6 : 1 }}
        >
          {saving ? "Posting…" : "Post check-in"}
        </button>
      </div>
    </form>
  );
}
