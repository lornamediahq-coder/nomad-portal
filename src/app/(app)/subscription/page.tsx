import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import TierCards from "./TierCards";

const TIER_LABEL: Record<string, string> = {
  free: "Explorer",
  pro: "Nomad",
  elite: "Visionary",
};
const TIER_COLOUR: Record<string, string> = {
  free: "#9b9b8e",
  pro: "#0F6E56",
  elite: "#8d6e63",
};

export default async function SubscriptionPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  const { data: profile } = await supabase
    .from("users")
    .select("tier, stripe_customer_id")
    .eq("id", user.id)
    .single();

  const tier = (profile?.tier as string) ?? "free";
  const label = TIER_LABEL[tier] ?? "Explorer";
  const colour = TIER_COLOUR[tier] ?? "#9b9b8e";
  const hasCustomer = !!profile?.stripe_customer_id;

  const { success } = await searchParams;

  const prices = {
    nomadMonthly:     process.env.STRIPE_PRICE_NOMAD_MONTHLY     ?? "",
    nomadYearly:      process.env.STRIPE_PRICE_NOMAD_YEARLY      ?? "",
    visionaryMonthly: process.env.STRIPE_PRICE_VISIONARY_MONTHLY ?? "",
    visionaryYearly:  process.env.STRIPE_PRICE_VISIONARY_YEARLY  ?? "",
  };

  return (
    <div className="px-5 pt-6 pb-6 max-w-lg mx-auto flex flex-col gap-5">
      <div>
        <h1 style={{ fontFamily: "var(--font-cormorant)", fontSize: "2.2rem", fontWeight: 500, color: "#1a1a18", lineHeight: 1.2 }}>
          Subscription
        </h1>
        <p className="text-xs tracking-widest uppercase mt-1" style={{ color: "#0F6E56", fontFamily: "var(--font-jost)" }}>
          Your plan
        </p>
      </div>

      {/* Success banner */}
      {success === "true" && (
        <div className="rounded-2xl px-5 py-4" style={{ background: "#e6f4f0", border: "1.5px solid #c8f0e4" }}>
          <p className="text-sm font-medium" style={{ color: "#0F6E56", fontFamily: "var(--font-jost)" }}>
            🎉 Payment received — your plan will update within a minute.
          </p>
        </div>
      )}

      {/* Current tier badge */}
      <div className="rounded-3xl px-5 py-4 flex items-center gap-4"
           style={{ background: "white", border: "1.5px solid #e8e2d8" }}>
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
             style={{ background: colour + "18", border: `1.5px solid ${colour}33` }}>
          <span className="text-xl">
            {tier === "free" ? "🧭" : tier === "pro" ? "🌍" : "🔭"}
          </span>
        </div>
        <div>
          <p className="text-xs font-medium tracking-widest uppercase mb-0.5"
             style={{ color: "#6b6b60", fontFamily: "var(--font-jost)" }}>
            Current plan
          </p>
          <p style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.5rem", fontWeight: 600, color: colour, lineHeight: 1 }}>
            {label}
          </p>
        </div>
      </div>

      <TierCards currentTier={tier} hasCustomer={hasCustomer} prices={prices} />
    </div>
  );
}
