"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase-browser";

export default function SignInPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // Check if onboarding is complete
    const { data: userData } = await supabase
      .from("users")
      .select("archetype")
      .eq("id", data.user.id)
      .single();

    if (!userData?.archetype) {
      router.push("/onboarding");
    } else {
      router.push("/home");
    }
  }

  return (
    <>
      <h1 className="text-center mb-2" style={{
        fontFamily: "var(--font-cormorant)",
        fontSize: "2rem",
        fontWeight: 600,
        color: "#1a1a18",
        lineHeight: 1.2,
      }}>
        Welcome back
      </h1>
      <p className="text-center text-sm mb-8" style={{ color: "#6b6b60", fontFamily: "var(--font-jost)" }}>
        New here?{" "}
        <Link href="/sign-up" style={{ color: "#0F6E56", fontWeight: 500 }}>Create an account</Link>
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium tracking-wide uppercase" style={{ color: "#6b6b60", fontFamily: "var(--font-jost)" }}>
            Email
          </label>
          <input
            type="email"
            required
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full px-4 py-3 rounded-2xl text-sm outline-none transition-all"
            style={{
              background: "white",
              border: "1.5px solid #e8e2d8",
              color: "#1a1a18",
              fontFamily: "var(--font-jost)",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#0F6E56")}
            onBlur={(e) => (e.target.style.borderColor = "#e8e2d8")}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium tracking-wide uppercase" style={{ color: "#6b6b60", fontFamily: "var(--font-jost)" }}>
            Password
          </label>
          <input
            type="password"
            required
            placeholder="Your password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full px-4 py-3 rounded-2xl text-sm outline-none transition-all"
            style={{
              background: "white",
              border: "1.5px solid #e8e2d8",
              color: "#1a1a18",
              fontFamily: "var(--font-jost)",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#0F6E56")}
            onBlur={(e) => (e.target.style.borderColor = "#e8e2d8")}
          />
        </div>

        {error && (
          <p className="text-sm text-center" style={{ color: "#c0392b", fontFamily: "var(--font-jost)" }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-2xl text-sm font-medium tracking-wide transition-opacity mt-2"
          style={{
            background: "#0F6E56",
            color: "white",
            fontFamily: "var(--font-jost)",
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </>
  );
}
