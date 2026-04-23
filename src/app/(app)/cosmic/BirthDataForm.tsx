"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";

interface BirthData {
  birth_date: string;
  birth_time: string | null;
  birth_place: string;
}

export default function BirthDataForm({
  userId,
  existing,
}: {
  userId: string;
  existing: BirthData | null;
}) {
  const router = useRouter();
  const [date, setDate] = useState(existing?.birth_date ?? "");
  const [time, setTime] = useState(existing?.birth_time ?? "");
  const [place, setPlace] = useState(existing?.birth_place ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!date || !place.trim()) return;
    setSaving(true);

    const supabase = createClient();
    const payload = {
      user_id: userId,
      birth_date: date,
      birth_time: time || null,
      birth_place: place.trim(),
    };

    if (existing) {
      await supabase.from("natal_charts").update(payload).eq("user_id", userId);
    } else {
      await supabase.from("natal_charts").insert(payload);
    }

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    router.refresh();
  }

  const inputStyle = {
    background: "white",
    border: "1.5px solid #e8e2d8",
    color: "#1a1a18",
    fontFamily: "var(--font-jost)",
    borderRadius: "1rem",
    padding: "12px 16px",
    fontSize: "0.875rem",
    width: "100%",
    outline: "none",
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium tracking-widest uppercase"
               style={{ color: "#6b6b60", fontFamily: "var(--font-jost)" }}>
          Date of birth
        </label>
        <input
          type="date"
          required
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={inputStyle}
          onFocus={(e) => (e.target.style.borderColor = "#0F6E56")}
          onBlur={(e) => (e.target.style.borderColor = "#e8e2d8")}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium tracking-widest uppercase"
               style={{ color: "#6b6b60", fontFamily: "var(--font-jost)" }}>
          Time of birth <span style={{ color: "#c8c4bc", textTransform: "none", letterSpacing: 0 }}>(optional)</span>
        </label>
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          style={inputStyle}
          onFocus={(e) => (e.target.style.borderColor = "#0F6E56")}
          onBlur={(e) => (e.target.style.borderColor = "#e8e2d8")}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium tracking-widest uppercase"
               style={{ color: "#6b6b60", fontFamily: "var(--font-jost)" }}>
          Place of birth
        </label>
        <input
          type="text"
          required
          placeholder="e.g. London, UK"
          value={place}
          onChange={(e) => setPlace(e.target.value)}
          style={inputStyle}
          onFocus={(e) => (e.target.style.borderColor = "#0F6E56")}
          onBlur={(e) => (e.target.style.borderColor = "#e8e2d8")}
        />
      </div>

      <button
        type="submit"
        disabled={saving || saved}
        className="w-full py-3.5 rounded-2xl text-sm font-medium tracking-wide transition-all"
        style={{
          background: saved ? "#e6f4f0" : "#0F6E56",
          color: saved ? "#0F6E56" : "white",
          fontFamily: "var(--font-jost)",
          opacity: saving ? 0.6 : 1,
          border: saved ? "1.5px solid #0F6E56" : "none",
        }}
      >
        {saving ? "Saving…" : saved ? "✓ Saved" : existing ? "Update birth data" : "Save birth data"}
      </button>
    </form>
  );
}
