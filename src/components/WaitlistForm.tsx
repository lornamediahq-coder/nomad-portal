"use client";

import { useState } from "react";

export default function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");

    const res = await fetch("/api/waitlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (res.ok) {
      setStatus("success");
      setMessage("You're on the list! We'll be in touch soon.");
      setEmail("");
    } else {
      setStatus("error");
      setMessage(data.error || "Something went wrong.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full max-w-md mx-auto">
      <input
        type="email"
        required
        placeholder="your@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={status === "loading" || status === "success"}
        className="flex-1 px-4 py-3 rounded-xl border border-stone-200 bg-white text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-400 text-sm disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={status === "loading" || status === "success"}
        className="px-6 py-3 rounded-xl bg-white text-stone-900 font-medium text-sm hover:bg-stone-100 transition-colors disabled:opacity-50 whitespace-nowrap"
      >
        {status === "loading" ? "Joining…" : status === "success" ? "You're in!" : "Join the Portal"}
      </button>

      {message && (
        <p
          className={`col-span-full text-sm text-center mt-1 ${
            status === "success" ? "text-emerald-600" : "text-red-500"
          }`}
          style={{ width: "100%", flexBasis: "100%" }}
        >
          {message}
        </p>
      )}
    </form>
  );
}
