"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";

const EXPENSE_CATEGORIES = ["Accommodation", "Food", "Transport", "Coworking", "Subscriptions", "Health", "Shopping", "Other"];
const INCOME_CATEGORIES  = ["Freelance", "Remote job", "Business", "Investment", "Other"];

export default function AddEntryForm({ userId }: { userId: string }) {
  const router = useRouter();
  const [type, setType] = useState<"expense" | "income">("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0]);
  const [note, setNote] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const categories = type === "expense" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  function switchType(t: "expense" | "income") {
    setType(t);
    setCategory(t === "expense" ? EXPENSE_CATEGORIES[0] : INCOME_CATEGORIES[0]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const num = parseFloat(amount);
    if (!num || num <= 0) { setError("Enter a valid amount."); return; }
    setSaving(true);
    setError("");

    const supabase = createClient();
    const { error: err } = await supabase.from("budget_entries").insert({
      user_id: userId,
      amount: type === "expense" ? -Math.abs(num) : Math.abs(num),
      category,
      note: note.trim() || null,
      date,
    });

    if (err) { setError("Could not save entry. Try again."); setSaving(false); return; }

    setAmount("");
    setNote("");
    setDate(new Date().toISOString().split("T")[0]);
    setSaving(false);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-3xl p-5 flex flex-col gap-4"
          style={{ background: "white", border: "1.5px solid #e8e2d8" }}>
      <p className="text-xs font-medium tracking-widest uppercase"
         style={{ color: "#6b6b60", fontFamily: "var(--font-jost)" }}>
        Add entry
      </p>

      {/* Type toggle */}
      <div className="flex rounded-2xl overflow-hidden p-1 gap-1"
           style={{ background: "#F5F0E8" }}>
        {(["expense", "income"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => switchType(t)}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium capitalize transition-all"
            style={{
              background: type === t ? (t === "expense" ? "#1a1a18" : "#0F6E56") : "transparent",
              color: type === t ? "white" : "#6b6b60",
              fontFamily: "var(--font-jost)",
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Amount */}
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm"
              style={{ color: "#6b6b60", fontFamily: "var(--font-jost)" }}>$</span>
        <input
          type="number"
          inputMode="decimal"
          min="0"
          step="0.01"
          required
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full pl-8 pr-4 py-3 rounded-2xl text-sm outline-none"
          style={{ background: "#F5F0E8", border: "1.5px solid transparent", color: "#1a1a18", fontFamily: "var(--font-jost)" }}
          onFocus={(e) => (e.target.style.borderColor = "#0F6E56")}
          onBlur={(e) => (e.target.style.borderColor = "transparent")}
        />
      </div>

      {/* Category */}
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="w-full px-4 py-3 rounded-2xl text-sm outline-none appearance-none"
        style={{ background: "#F5F0E8", border: "1.5px solid transparent", color: "#1a1a18", fontFamily: "var(--font-jost)" }}
      >
        {categories.map((c) => <option key={c} value={c}>{c}</option>)}
      </select>

      {/* Note + Date row */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Note (optional)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="flex-1 px-4 py-3 rounded-2xl text-sm outline-none"
          style={{ background: "#F5F0E8", border: "1.5px solid transparent", color: "#1a1a18", fontFamily: "var(--font-jost)" }}
          onFocus={(e) => (e.target.style.borderColor = "#0F6E56")}
          onBlur={(e) => (e.target.style.borderColor = "transparent")}
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="px-3 py-3 rounded-2xl text-sm outline-none"
          style={{ background: "#F5F0E8", border: "1.5px solid transparent", color: "#1a1a18", fontFamily: "var(--font-jost)", width: "130px" }}
        />
      </div>

      {error && <p className="text-sm" style={{ color: "#c0392b", fontFamily: "var(--font-jost)" }}>{error}</p>}

      <button
        type="submit"
        disabled={saving}
        className="w-full py-3.5 rounded-2xl text-sm font-medium tracking-wide transition-opacity"
        style={{ background: type === "expense" ? "#1a1a18" : "#0F6E56", color: "white", fontFamily: "var(--font-jost)", opacity: saving ? 0.6 : 1 }}
      >
        {saving ? "Saving…" : `Add ${type}`}
      </button>
    </form>
  );
}
