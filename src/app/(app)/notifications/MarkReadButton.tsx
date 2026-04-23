"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";

export default function MarkReadButton({ userId }: { userId: string }) {
  const router = useRouter();

  async function markRead() {
    const supabase = createClient();
    await supabase
      .from("users")
      .update({ notifications_read_at: new Date().toISOString() })
      .eq("id", userId);
    router.refresh();
  }

  return (
    <button
      onClick={markRead}
      className="text-xs font-medium px-3 py-1.5 rounded-xl"
      style={{ background: "#e6f4f0", color: "#0F6E56", fontFamily: "var(--font-jost)" }}
    >
      Mark all read
    </button>
  );
}
