"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";

export default function EnterPortalButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function enter() {
    setLoading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    // Authenticated → go to dashboard. No session → go to sign-in.
    router.push(user ? "/home" : "/sign-in");
  }

  return (
    <button
      onClick={enter}
      disabled={loading}
      className="w-full py-4 rounded-2xl text-sm font-medium tracking-wide text-center transition-opacity"
      style={{
        background: "#0F6E56",
        color: "white",
        fontFamily: "var(--font-jost)",
        opacity: loading ? 0.6 : 1,
      }}
    >
      {loading ? "Opening the Portal…" : "Enter the Portal →"}
    </button>
  );
}
