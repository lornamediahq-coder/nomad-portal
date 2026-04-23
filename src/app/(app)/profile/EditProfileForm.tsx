"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";

export default function EditProfileForm({
  userId,
  currentName,
}: {
  userId: string;
  currentName: string;
}) {
  const router = useRouter();
  const [name, setName] = useState(currentName);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);

    const supabase = createClient();
    await supabase
      .from("users")
      .update({ full_name: name.trim() })
      .eq("id", userId);

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="flex-1 px-4 py-3 rounded-2xl text-sm outline-none"
        style={{
          background: "white",
          border: "1.5px solid #e8e2d8",
          color: "#1a1a18",
          fontFamily: "var(--font-jost)",
        }}
        onFocus={(e) => (e.target.style.borderColor = "#0F6E56")}
        onBlur={(e) => (e.target.style.borderColor = "#e8e2d8")}
      />
      <button
        type="submit"
        disabled={saving || saved}
        className="px-5 py-3 rounded-2xl text-sm font-medium transition-all flex-shrink-0"
        style={{
          background: saved ? "#e6f4f0" : "#0F6E56",
          color: saved ? "#0F6E56" : "white",
          fontFamily: "var(--font-jost)",
          opacity: saving ? 0.6 : 1,
          border: saved ? "1.5px solid #0F6E56" : "none",
        }}
      >
        {saved ? "✓" : "Save"}
      </button>
    </form>
  );
}
