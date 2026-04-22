"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase-browser";

type PageState = "form" | "check-email";

export default function SignUpPage() {
  const router = useRouter();
  const [form, setForm] = useState({ full_name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState<PageState>("form");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { full_name: form.full_name } },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // If Supabase email confirmation is ON, session is null until confirmed.
    // In that case, show the "check your email" screen instead of proceeding.
    if (!data.session) {
      setState("check-email");
      setLoading(false);
      return;
    }

    router.push("/onboarding");
  }

  if (state === "check-email") {
    return (
      <div className="text-center">
        <div
          className="w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-6 text-2xl"
          style={{ background: "#e6f4f0" }}
        >
          ✉️
        </div>
        <h1 className="mb-3" style={{
          fontFamily: "var(--font-cormorant)",
          fontSize: "2rem",
          fontWeight: 600,
          color: "#1a1a18",
          lineHeight: 1.2,
        }}>
          Check your email
        </h1>
        <p className="text-sm leading-relaxed mb-6" style={{ color: "#6b6b60", fontFamily: "var(--font-jost)" }}>
          We sent a confirmation link to <strong style={{ color: "#1a1a18" }}>{form.email}</strong>.
          Click it, then sign in below.
        </p>
        <div
          className="text-xs leading-relaxed p-4 rounded-2xl mb-6 text-left"
          style={{ background: "#fffbe6", border: "1px solid #f0e0a0", color: "#7a6010", fontFamily: "var(--font-jost)" }}
        >
          <strong>Skip email confirmation for development:</strong> Go to Supabase Dashboard → Authentication → Providers → Email → turn off <em>"Confirm email"</em>, then sign up again.
        </div>
        <Link
          href="/sign-in"
          className="inline-block w-full py-3.5 rounded-2xl text-sm font-medium text-center"
          style={{ background: "#0F6E56", color: "white", fontFamily: "var(--font-jost)" }}
        >
          Go to sign in
        </Link>
      </div>
    );
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
        Create your account
      </h1>
      <p className="text-center text-sm mb-8" style={{ color: "#6b6b60", fontFamily: "var(--font-jost)" }}>
        Already have one?{" "}
        <Link href="/sign-in" style={{ color: "#0F6E56", fontWeight: 500 }}>Sign in</Link>
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {[
          { key: "full_name", label: "Full name", type: "text", placeholder: "Your name" },
          { key: "email",     label: "Email",     type: "email", placeholder: "you@example.com" },
          { key: "password",  label: "Password",  type: "password", placeholder: "Min. 6 characters" },
        ].map(({ key, label, type, placeholder }) => (
          <div key={key} className="flex flex-col gap-1.5">
            <label className="text-xs font-medium tracking-wide uppercase"
              style={{ color: "#6b6b60", fontFamily: "var(--font-jost)" }}>
              {label}
            </label>
            <input
              type={type}
              required
              minLength={key === "password" ? 6 : undefined}
              placeholder={placeholder}
              value={form[key as keyof typeof form]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              className="w-full px-4 py-3 rounded-2xl text-sm outline-none transition-all"
              style={{ background: "white", border: "1.5px solid #e8e2d8", color: "#1a1a18", fontFamily: "var(--font-jost)" }}
              onFocus={(e) => (e.target.style.borderColor = "#0F6E56")}
              onBlur={(e) => (e.target.style.borderColor = "#e8e2d8")}
            />
          </div>
        ))}

        {error && (
          <p className="text-sm text-center" style={{ color: "#c0392b", fontFamily: "var(--font-jost)" }}>{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-2xl text-sm font-medium tracking-wide mt-2"
          style={{ background: "#0F6E56", color: "white", fontFamily: "var(--font-jost)", opacity: loading ? 0.6 : 1 }}
        >
          {loading ? "Creating account…" : "Create account"}
        </button>
      </form>
    </>
  );
}
