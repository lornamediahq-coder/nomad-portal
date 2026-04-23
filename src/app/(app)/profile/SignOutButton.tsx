"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";

export default function SignOutButton() {
  const router = useRouter();

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  }

  return (
    <button
      onClick={signOut}
      className="w-full py-3.5 rounded-2xl text-sm font-medium tracking-wide transition-opacity"
      style={{
        background: "transparent",
        border: "1.5px solid #e8e2d8",
        color: "#6b6b60",
        fontFamily: "var(--font-jost)",
      }}
    >
      Sign out
    </button>
  );
}
