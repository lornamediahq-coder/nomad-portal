"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";

interface Entry {
  id: string;
  amount: number;
  category: string;
  note: string | null;
  date: string;
}

function groupByDate(entries: Entry[]) {
  const groups: Record<string, Entry[]> = {};
  for (const e of entries) {
    if (!groups[e.date]) groups[e.date] = [];
    groups[e.date].push(e);
  }
  return Object.entries(groups).sort(([a], [b]) => b.localeCompare(a));
}

function fmt(date: string) {
  return new Date(date + "T00:00:00").toLocaleDateString("en-GB", {
    weekday: "short", day: "numeric", month: "short",
  });
}

const CATEGORY_ICONS: Record<string, string> = {
  Accommodation: "🏠", Food: "🍜", Transport: "✈️", Coworking: "💻",
  Subscriptions: "📱", Health: "💊", Shopping: "🛍️",
  Freelance: "💼", "Remote job": "🖥️", Business: "📊",
  Investment: "📈", Other: "💰",
};

export default function EntryLog({ initialEntries }: { initialEntries: Entry[] }) {
  const router = useRouter();
  const [entries, setEntries] = useState<Entry[]>(initialEntries);
  const [deleting, setDeleting] = useState<string | null>(null);

  async function deleteEntry(id: string) {
    setDeleting(id);
    const supabase = createClient();
    await supabase.from("budget_entries").delete().eq("id", id);
    setEntries((prev) => prev.filter((e) => e.id !== id));
    setDeleting(null);
    router.refresh();
  }

  if (entries.length === 0) {
    return (
      <div className="rounded-3xl px-5 py-10 text-center"
           style={{ background: "white", border: "1.5px solid #e8e2d8" }}>
        <p className="text-sm" style={{ color: "#9b9b8e", fontFamily: "var(--font-jost)" }}>
          No entries yet — add your first one above
        </p>
      </div>
    );
  }

  const groups = groupByDate(entries);

  return (
    <div className="flex flex-col gap-5">
      {groups.map(([date, dayEntries]) => {
        const dayTotal = dayEntries.reduce((s, e) => s + e.amount, 0);
        return (
          <div key={date}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium" style={{ color: "#6b6b60", fontFamily: "var(--font-jost)" }}>
                {fmt(date)}
              </span>
              <span className="text-xs font-semibold"
                    style={{ color: dayTotal >= 0 ? "#0F6E56" : "#1a1a18", fontFamily: "var(--font-jost)" }}>
                {dayTotal >= 0 ? "+" : ""}${Math.abs(dayTotal).toFixed(2)}
              </span>
            </div>

            <div className="flex flex-col gap-2">
              {dayEntries.map((entry) => (
                <div key={entry.id}
                  className="flex items-center gap-3 px-4 py-3 rounded-2xl"
                  style={{ background: "white", border: "1.5px solid #e8e2d8" }}>
                  <span className="text-lg flex-shrink-0">
                    {CATEGORY_ICONS[entry.category] ?? "💰"}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate"
                       style={{ color: "#1a1a18", fontFamily: "var(--font-jost)" }}>
                      {entry.category}
                    </p>
                    {entry.note && (
                      <p className="text-xs truncate" style={{ color: "#9b9b8e", fontFamily: "var(--font-jost)" }}>
                        {entry.note}
                      </p>
                    )}
                  </div>
                  <span className="text-sm font-semibold flex-shrink-0"
                        style={{ color: entry.amount >= 0 ? "#0F6E56" : "#1a1a18", fontFamily: "var(--font-jost)" }}>
                    {entry.amount >= 0 ? "+" : "−"}${Math.abs(entry.amount).toFixed(2)}
                  </span>
                  <button
                    onClick={() => deleteEntry(entry.id)}
                    disabled={deleting === entry.id}
                    className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-opacity"
                    style={{ background: "#F5F0E8", color: "#9b9b8e", opacity: deleting === entry.id ? 0.4 : 1 }}
                  >
                    <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-3 h-3">
                      <path strokeLinecap="round" d="M2 2l8 8M10 2l-8 8" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
