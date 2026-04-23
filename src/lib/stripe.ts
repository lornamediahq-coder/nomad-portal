import Stripe from "stripe";

// Lazy getter — prevents build-time throw when env var is absent
export function getStripe(): Stripe {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not set");
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2026-03-25.dahlia" as any });
}

// DB tier values: "free" | "pro" | "elite"
// Display names:  Explorer  | Nomad  | Visionary
export function getPriceTierMap(): Record<string, "pro" | "elite"> {
  return {
    [process.env.STRIPE_PRICE_NOMAD_MONTHLY ?? ""]:     "pro",
    [process.env.STRIPE_PRICE_NOMAD_YEARLY ?? ""]:      "pro",
    [process.env.STRIPE_PRICE_VISIONARY_MONTHLY ?? ""]: "elite",
    [process.env.STRIPE_PRICE_VISIONARY_YEARLY ?? ""]:  "elite",
  };
}
