"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";

export default function PodActions({ userId }: { userId: string }) {
  const router = useRouter();
  const [mode, setMode] = useState<"idle" | "create" | "join">("idle");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function createPod() {
    setLoading(true);
    const podId = crypto.randomUUID();
    const supabase = createClient();
    const { error: err } = await supabase
      .from("pod_members")
      .insert({ pod_id: podId, user_id: userId, role: "lead" });

    if (err) { setError("Could not create pod. Try again."); setLoading(false); return; }
    router.refresh();
  }

  async function joinPod() {
    const trimmed = code.trim();
    if (!trimmed) return;
    setLoading(true);
    setError("");

    const supabase = createClient();

    // Verify pod exists
    const { data: existing } = await supabase
      .from("pod_members")
      .select("pod_id")
      .eq("pod_id", trimmed)
      .limit(1);

    if (!existing?.length) {
      setError("Pod not found. Double-check the invite code.");
      setLoading(false);
      return;
    }

    const { error: err } = await supabase
      .from("pod_members")
      .insert({ pod_id: trimmed, user_id: userId, role: "member" });

    if (err?.code === "23505") { setError("You're already in this pod."); setLoading(false); return; }
    if (err) { setError("Could not join pod. Try again."); setLoading(false); return; }
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-3">
      {mode === "idle" && (
        <>
          <button
            onClick={() => { setMode("create"); setError(""); }}
            className="w-full py-4 rounded-2xl text-sm font-medium tracking-wide"
            style={{ background: "#0F6E56", color: "white", fontFamily: "var(--font-jost)" }}
          >
            Create a pod
          </button>
          <button
            onClick={() => { setMode("join"); setError(""); }}
            className="w-full py-4 rounded-2xl text-sm font-medium tracking-wide"
            style={{ background: "white", border: "1.5px solid #e8e2d8", color: "#1a1a18", fontFamily: "var(--font-jost)" }}
          >
            Join with invite code
          </button>
        </>
      )}

      {mode === "create" && (
        <div className="flex flex-col gap-3">
          <p className="text-sm text-center" style={{ color: "#6b6b60", fontFamily: "var(--font-jost)" }}>
            Creating a pod generates a unique invite code you can share with up to 4 other nomads.
          </p>
          {error && <p className="text-sm text-center" style={{ color: "#c0392b", fontFamily: "var(--font-jost)" }}>{error}</p>}
          <button
            onClick={createPod}
            disabled={loading}
            className="w-full py-4 rounded-2xl text-sm font-medium tracking-wide transition-opacity"
            style={{ background: "#0F6E56", color: "white", fontFamily: "var(--font-jost)", opacity: loading ? 0.6 : 1 }}
          >
            {loading ? "Creating…" : "Create pod →"}
          </button>
          <button onClick={() => setMode("idle")} className="text-sm text-center"
                  style={{ color: "#9b9b8e", fontFamily: "var(--font-jost)" }}>Cancel</button>
        </div>
      )}

      {mode === "join" && (
        <div className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Paste invite code…"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl text-sm outline-none"
            style={{ background: "white", border: "1.5px solid #e8e2d8", color: "#1a1a18", fontFamily: "var(--font-jost)" }}
            onFocus={(e) => (e.target.style.borderColor = "#0F6E56")}
            onBlur={(e) => (e.target.style.borderColor = "#e8e2d8")}
          />
          {error && <p className="text-sm" style={{ color: "#c0392b", fontFamily: "var(--font-jost)" }}>{error}</p>}
          <button
            onClick={joinPod}
            disabled={loading}
            className="w-full py-4 rounded-2xl text-sm font-medium tracking-wide transition-opacity"
            style={{ background: "#0F6E56", color: "white", fontFamily: "var(--font-jost)", opacity: loading ? 0.6 : 1 }}
          >
            {loading ? "Joining…" : "Join pod →"}
          </button>
          <button onClick={() => setMode("idle")} className="text-sm text-center"
                  style={{ color: "#9b9b8e", fontFamily: "var(--font-jost)" }}>Cancel</button>
        </div>
      )}
    </div>
  );
}
