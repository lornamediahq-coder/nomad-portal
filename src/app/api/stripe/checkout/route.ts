import { createClient } from "@/lib/supabase-server";
import { supabase as service } from "@/lib/supabase";
import { getStripe, getPriceTierMap } from "@/lib/stripe";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const authClient = await createClient();
  const { data: { user } } = await authClient.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { priceId } = await request.json() as { priceId: string };
  const stripe = getStripe();
  const tier = getPriceTierMap()[priceId];
  if (!tier) return NextResponse.json({ error: "Invalid price ID" }, { status: 400 });

  const { data: profile } = await authClient
    .from("users")
    .select("stripe_customer_id")
    .eq("id", user.id)
    .single();

  let customerId = profile?.stripe_customer_id as string | null;

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email!,
      metadata: { userId: user.id },
    });
    customerId = customer.id;
    await service.from("users").update({ stripe_customer_id: customerId }).eq("id", user.id);
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${baseUrl}/subscription?success=true`,
    cancel_url: `${baseUrl}/subscription`,
    metadata: { userId: user.id, tier },
    subscription_data: {
      metadata: { userId: user.id, tier },
    },
  });

  return NextResponse.json({ url: session.url });
}
