import Link from "next/link";

const TIER_COLOUR = { Nomad: "#0F6E56", Visionary: "#8d6e63" };

export default function UpgradeGate({
  feature,
  requiredTier,
  description,
}: {
  feature: string;
  requiredTier: "Nomad" | "Visionary";
  description?: string;
}) {
  const colour = TIER_COLOUR[requiredTier];
  return (
    <div className="rounded-3xl px-6 py-12 text-center"
         style={{ background: "white", border: "1.5px solid #e8e2d8" }}>
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4"
           style={{ background: colour + "18", border: `1.5px solid ${colour}33` }}>
        🔒
      </div>
      <h2 className="mb-1" style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.5rem", fontWeight: 600, color: "#1a1a18" }}>
        {feature}
      </h2>
      <p className="text-xs font-semibold tracking-widest uppercase mb-3"
         style={{ color: colour, fontFamily: "var(--font-jost)" }}>
        {requiredTier} plan required
      </p>
      {description && (
        <p className="text-sm leading-relaxed mb-5" style={{ color: "#6b6b60", fontFamily: "var(--font-jost)" }}>
          {description}
        </p>
      )}
      <Link
        href="/subscription"
        className="inline-block px-6 py-3 rounded-2xl text-sm font-medium"
        style={{ background: colour, color: "white", fontFamily: "var(--font-jost)", textDecoration: "none" }}
      >
        Upgrade to {requiredTier} →
      </Link>
    </div>
  );
}
