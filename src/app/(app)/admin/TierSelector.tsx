"use client";

import { useState } from "react";

const TIERS = ["free", "pro", "elite"];
const TIER_COLOUR: Record<string, string> = {
  free: "#9b9b8e",
  pro: "#0F6E56",
  elite: "#8d6e63",
};

export default function TierSelector({ userId, currentTier }: { userId: string; currentTier: string }) {
  const [tier, setTier] = useState(currentTier);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function save(newTier: string) {
    setSaving(true);
    setSaved(false);
    setTier(newTier);
    await fetch("/api/admin/set-tier", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, tier: newTier }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="flex items-center gap-2 flex-shrink-0">
      {saving && (
        <span className="text-xs" style={{ color: "#9b9b8e", fontFamily: "var(--font-jost)" }}>saving…</span>
      )}
      {saved && (
        <span className="text-xs" style={{ color: "#0F6E56", fontFamily: "var(--font-jost)" }}>✓</span>
      )}
      <div className="flex gap-1">
        {TIERS.map((t) => (
          <button
            key={t}
            onClick={() => save(t)}
            disabled={saving}
            className="text-xs px-2.5 py-1 rounded-lg font-medium transition-all"
            style={{
              background: tier === t ? TIER_COLOUR[t] + "18" : "#f5f0e8",
              color: tier === t ? TIER_COLOUR[t] : "#9b9b8e",
              border: `1.5px solid ${tier === t ? TIER_COLOUR[t] + "44" : "transparent"}`,
              fontFamily: "var(--font-jost)",
            }}
          >
            {t}
          </button>
        ))}
      </div>
    </div>
  );
}
