import { createClient } from "@/lib/supabase-server";
import { supabase as service } from "@/lib/supabase";
import { NextResponse } from "next/server";

const ADMIN_EMAIL = "lornamediahq@gmail.com";

export async function POST(request: Request) {
  const authClient = await createClient();
  const { data: { user } } = await authClient.auth.getUser();

  if (!user || user.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { userId, tier } = await request.json() as { userId: string; tier: string };
  const valid = ["free", "pro", "elite"];
  if (!valid.includes(tier)) {
    return NextResponse.json({ error: "Invalid tier" }, { status: 400 });
  }

  const { error } = await service.from("users").update({ tier }).eq("id", userId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
