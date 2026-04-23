"use client";

import { useState } from "react";

export default function CopyWaitlistButton({ emails }: { emails: string[] }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(emails.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      onClick={copy}
      className="text-xs font-medium px-3 py-1.5 rounded-xl"
      style={{ background: "#e6f4f0", color: "#0F6E56", fontFamily: "var(--font-jost)" }}
    >
      {copied ? "Copied ✓" : "Copy all"}
    </button>
  );
}
