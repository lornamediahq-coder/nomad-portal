"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";

const DURATIONS = [1, 2, 3, 4, 6, 8];

export default function SprintSetupForm({ userId }: { userId: string }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [weeks, setWeeks] = useState(2);
  const [saving, setSaving] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setSaving(true);

    const supabase = createClient();
    await supabase.from("sprint_goals").insert({
      user_id: userId,
      title: title.trim(),
      duration_weeks: weeks,
      status: "active",
    });

    router.push("/home");
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <div>
        <label className="block text-xs font-medium tracking-widest uppercase mb-2"
               style={{ color: "#6b6b60", fontFamily: "var(--font-jost)" }}>
          Sprint goal
        </label>
        <input
          type="text"
          required
          placeholder="e.g. Launch my first freelance client"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-3 rounded-2xl text-sm outline-none"
          style={{
            background: "white",
            border: "1.5px solid #e8e2d8",
            color: "#1a1a18",
            fontFamily: "var(--font-jost)",
          }}
          onFocus={(e) => (e.target.style.borderColor = "#0F6E56")}
          onBlur={(e) => (e.target.style.borderColor = "#e8e2d8")}
        />
      </div>

      <div>
        <label className="block text-xs font-medium tracking-widest uppercase mb-2"
               style={{ color: "#6b6b60", fontFamily: "var(--font-jost)" }}>
          Duration
        </label>
        <div className="flex gap-2 flex-wrap">
          {DURATIONS.map((w) => (
            <button
              key={w}
              type="button"
              onClick={() => setWeeks(w)}
              className="px-3 py-2 rounded-xl text-xs font-medium transition-all"
              style={{
                background: weeks === w ? "#0F6E56" : "white",
                color: weeks === w ? "white" : "#6b6b60",
                border: `1.5px solid ${weeks === w ? "#0F6E56" : "#e8e2d8"}`,
                fontFamily: "var(--font-jost)",
              }}
            >
              {w}w
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={saving || !title.trim()}
        className="w-full py-4 rounded-2xl text-sm font-medium tracking-wide transition-opacity"
        style={{
          background: "#0F6E56",
          color: "white",
          fontFamily: "var(--font-jost)",
          opacity: saving || !title.trim() ? 0.6 : 1,
        }}
      >
        {saving ? "Setting up…" : "Start my sprint →"}
      </button>

      <button
        type="button"
        onClick={() => router.push("/home")}
        className="text-sm text-center"
        style={{ color: "#9b9b8e", fontFamily: "var(--font-jost)" }}
      >
        Skip for now
      </button>
    </form>
  );
}
