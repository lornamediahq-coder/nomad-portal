"use client";

import { useState } from "react";
import Link from "next/link";

type Prices = {
  nomadMonthly: string;
  nomadYearly: string;
  visionaryMonthly: string;
  visionaryYearly: string;
};

const EXPLORER_FEATURES = [
  "Archetype quiz & cosmic profile",
  "Sprint goal tracking (1 active)",
  "Budget & expense logging",
  "XP & level progression",
];

const NOMAD_FEATURES = [
  "Everything in Explorer",
  "Unlimited sprint goals & tasks",
  "Pod accountability circles",
  "XP leaderboard",
  "Notifications feed",
];

const VISIONARY_FEATURES = [
  "Everything in Nomad",
  "Full cosmic digest",
  "Birth chart & transit forecasts",
  "Shadow work prompts",
  "Priority support",
  "Founding member badge ✦",
];

export default function TierCards({
  currentTier,
  hasCustomer,
  prices,
}: {
  currentTier: string;
  hasCustomer: boolean;
  prices: Prices;
}) {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  const [loading, setLoading] = useState<string | null>(null);

  async function upgrade(priceId: string, tierLabel: string) {
    if (!priceId) {
      alert(`Configure ${tierLabel} price IDs in your Vercel environment variables first.`);
      return;
    }
    setLoading(priceId);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });
      const data = await res.json() as { url?: string; error?: string };
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error ?? "Something went wrong");
        setLoading(null);
      }
    } catch {
      alert("Something went wrong");
      setLoading(null);
    }
  }

  async function manage() {
    setLoading("portal");
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const { url } = await res.json() as { url?: string };
      if (url) window.location.href = url;
      else setLoading(null);
    } catch {
      setLoading(null);
    }
  }

  const nomadPrice = billing === "monthly" ? "£19" : "£149";
  const visionaryPrice = billing === "monthly" ? "£39" : "£290";
  const nomadId = billing === "monthly" ? prices.nomadMonthly : prices.nomadYearly;
  const visionaryId = billing === "monthly" ? prices.visionaryMonthly : prices.visionaryYearly;

  const isFree = currentTier === "free";
  const isNomad = currentTier === "pro";
  const isVisionary = currentTier === "elite";

  return (
    <div className="flex flex-col gap-4">
      {/* Billing toggle */}
      <div className="flex items-center justify-center gap-1 p-1 rounded-2xl self-center"
           style={{ background: "white", border: "1.5px solid #e8e2d8" }}>
        {(["monthly", "yearly"] as const).map((b) => (
          <button
            key={b}
            onClick={() => setBilling(b)}
            className="px-5 py-2 rounded-xl text-xs font-medium transition-all"
            style={{
              background: billing === b ? "#0F6E56" : "transparent",
              color: billing === b ? "white" : "#6b6b60",
              fontFamily: "var(--font-jost)",
            }}
          >
            {b === "monthly" ? "Monthly" : "Yearly · save 35%"}
          </button>
        ))}
      </div>

      {/* Explorer */}
      <div
        className="rounded-3xl p-5"
        style={{
          background: isFree ? "#f0faf6" : "white",
          border: `1.5px solid ${isFree ? "#c8f0e4" : "#e8e2d8"}`,
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.5rem", fontWeight: 600, color: "#1a1a18" }}>
              Explorer
            </h2>
            <p style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.8rem", fontWeight: 600, color: "#1a1a18", lineHeight: 1 }}>
              Free
            </p>
          </div>
          {isFree && (
            <span className="text-xs px-3 py-1 rounded-full font-semibold"
                  style={{ background: "#0F6E56", color: "white", fontFamily: "var(--font-jost)" }}>
              Current
            </span>
          )}
        </div>
        <ul className="flex flex-col gap-2 mb-4">
          {EXPLORER_FEATURES.map((f) => (
            <li key={f} className="flex items-start gap-2 text-xs" style={{ color: "#4a4a42", fontFamily: "var(--font-jost)" }}>
              <span style={{ color: "#0F6E56", flexShrink: 0 }}>✓</span> {f}
            </li>
          ))}
        </ul>
        {!isFree && (
          <button
            className="w-full py-3 rounded-2xl text-sm font-medium"
            style={{ background: "#F5F0E8", color: "#6b6b60", fontFamily: "var(--font-jost)" }}
            disabled
          >
            Downgrade via billing portal
          </button>
        )}
      </div>

      {/* Nomad */}
      <div
        className="rounded-3xl p-5"
        style={{
          background: isNomad ? "#f0faf6" : "white",
          border: `1.5px solid ${isNomad ? "#c8f0e4" : "#e8e2d8"}`,
        }}
      >
        <div className="flex items-center justify-between mb-1">
          <h2 style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.5rem", fontWeight: 600, color: "#1a1a18" }}>
            Nomad
          </h2>
          {isNomad && (
            <span className="text-xs px-3 py-1 rounded-full font-semibold"
                  style={{ background: "#0F6E56", color: "white", fontFamily: "var(--font-jost)" }}>
              Current
            </span>
          )}
        </div>
        <div className="flex items-baseline gap-1 mb-3">
          <p style={{ fontFamily: "var(--font-cormorant)", fontSize: "2rem", fontWeight: 600, color: "#1a1a18", lineHeight: 1 }}>
            {nomadPrice}
          </p>
          <p className="text-xs" style={{ color: "#9b9b8e", fontFamily: "var(--font-jost)" }}>
            /{billing === "monthly" ? "mo" : "yr"}
          </p>
        </div>
        <ul className="flex flex-col gap-2 mb-4">
          {NOMAD_FEATURES.map((f) => (
            <li key={f} className="flex items-start gap-2 text-xs" style={{ color: "#4a4a42", fontFamily: "var(--font-jost)" }}>
              <span style={{ color: "#0F6E56", flexShrink: 0 }}>✓</span> {f}
            </li>
          ))}
        </ul>
        {isNomad ? (
          <button
            onClick={manage}
            disabled={loading === "portal"}
            className="w-full py-3 rounded-2xl text-sm font-medium transition-opacity"
            style={{ background: "#F5F0E8", color: "#0F6E56", fontFamily: "var(--font-jost)", opacity: loading === "portal" ? 0.6 : 1 }}
          >
            {loading === "portal" ? "Loading…" : "Manage subscription"}
          </button>
        ) : isVisionary ? null : (
          <button
            onClick={() => upgrade(nomadId, "Nomad")}
            disabled={!!loading}
            className="w-full py-3 rounded-2xl text-sm font-medium transition-opacity"
            style={{ background: "#0F6E56", color: "white", fontFamily: "var(--font-jost)", opacity: loading ? 0.6 : 1 }}
          >
            {loading === nomadId ? "Redirecting…" : "Upgrade to Nomad →"}
          </button>
        )}
      </div>

      {/* Visionary */}
      <div
        className="rounded-3xl p-5 relative overflow-hidden"
        style={{
          background: isVisionary ? "#f0faf6" : "#1a1a18",
          border: `1.5px solid ${isVisionary ? "#c8f0e4" : "#333"}`,
        }}
      >
        <div className="flex items-center justify-between mb-1">
          <h2 style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.5rem", fontWeight: 600, color: isVisionary ? "#1a1a18" : "#d4cfc6" }}>
            Visionary
          </h2>
          {isVisionary && (
            <span className="text-xs px-3 py-1 rounded-full font-semibold"
                  style={{ background: "#0F6E56", color: "white", fontFamily: "var(--font-jost)" }}>
              Current
            </span>
          )}
          {!isVisionary && (
            <span className="text-xs px-2.5 py-1 rounded-full"
                  style={{ background: "#2a2a28", color: "#a8e6d4", fontFamily: "var(--font-jost)", fontWeight: 600 }}>
              ✦ Popular
            </span>
          )}
        </div>
        <div className="flex items-baseline gap-1 mb-3">
          <p style={{ fontFamily: "var(--font-cormorant)", fontSize: "2rem", fontWeight: 600, color: isVisionary ? "#1a1a18" : "#d4cfc6", lineHeight: 1 }}>
            {visionaryPrice}
          </p>
          <p className="text-xs" style={{ color: isVisionary ? "#9b9b8e" : "#6b6b60", fontFamily: "var(--font-jost)" }}>
            /{billing === "monthly" ? "mo" : "yr"}
          </p>
        </div>
        <ul className="flex flex-col gap-2 mb-4">
          {VISIONARY_FEATURES.map((f) => (
            <li key={f} className="flex items-start gap-2 text-xs" style={{ color: isVisionary ? "#4a4a42" : "#a8c8bc", fontFamily: "var(--font-jost)" }}>
              <span style={{ color: "#a8e6d4", flexShrink: 0 }}>✓</span> {f}
            </li>
          ))}
        </ul>
        {isVisionary ? (
          <button
            onClick={manage}
            disabled={loading === "portal"}
            className="w-full py-3 rounded-2xl text-sm font-medium transition-opacity"
            style={{ background: "#F5F0E8", color: "#0F6E56", fontFamily: "var(--font-jost)", opacity: loading === "portal" ? 0.6 : 1 }}
          >
            {loading === "portal" ? "Loading…" : "Manage subscription"}
          </button>
        ) : (
          <button
            onClick={() => upgrade(visionaryId, "Visionary")}
            disabled={!!loading}
            className="w-full py-3 rounded-2xl text-sm font-medium transition-opacity"
            style={{ background: "#0F6E56", color: "white", fontFamily: "var(--font-jost)", opacity: loading ? 0.6 : 1 }}
          >
            {loading === visionaryId ? "Redirecting…" : "Unlock Visionary ✦"}
          </button>
        )}
      </div>

      {hasCustomer && !isFree && (
        <p className="text-xs text-center" style={{ color: "#9b9b8e", fontFamily: "var(--font-jost)" }}>
          Manage or cancel anytime via the billing portal above.
        </p>
      )}

      <p className="text-xs text-center" style={{ color: "#c8c4bc", fontFamily: "var(--font-jost)" }}>
        <Link href="https://stripe.com" target="_blank" style={{ color: "inherit" }}>Secured by Stripe</Link>
        {" · "}Cancel anytime · No hidden fees
      </p>
    </div>
  );
}
