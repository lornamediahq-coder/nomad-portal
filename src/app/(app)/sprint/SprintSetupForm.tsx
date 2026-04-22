"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";

export default function SprintSetupForm({ userId }: { userId: string }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [weeks, setWeeks] = useState(4);
  const [taskInput, setTaskInput] = useState("");
  const [tasks, setTasks] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function addTask() {
    const t = taskInput.trim();
    if (!t) return;
    setTasks((prev) => [...prev, t]);
    setTaskInput("");
  }

  function removeTask(i: number) {
    setTasks((prev) => prev.filter((_, idx) => idx !== i));
  }

  async function launch() {
    if (!title.trim()) { setError("Give your sprint a title."); return; }
    setSaving(true);
    setError("");

    const supabase = createClient();

    const { data: goal, error: goalErr } = await supabase
      .from("sprint_goals")
      .insert({ user_id: userId, title: title.trim(), weeks, start_date: new Date().toISOString().split("T")[0] })
      .select("id")
      .single();

    if (goalErr || !goal) {
      setError("Could not create sprint. Try again.");
      setSaving(false);
      return;
    }

    if (tasks.length > 0) {
      await supabase.from("sprint_tasks").insert(
        tasks.map((t) => ({ goal_id: goal.id, title: t, xp_value: 10 }))
      );
    }

    router.refresh();
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Title */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium tracking-widest uppercase"
               style={{ color: "#6b6b60", fontFamily: "var(--font-jost)" }}>
          Sprint goal
        </label>
        <input
          type="text"
          placeholder="e.g. Launch freelance offering"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-3 rounded-2xl text-sm outline-none"
          style={{ background: "white", border: "1.5px solid #e8e2d8", color: "#1a1a18", fontFamily: "var(--font-jost)" }}
          onFocus={(e) => (e.target.style.borderColor = "#0F6E56")}
          onBlur={(e) => (e.target.style.borderColor = "#e8e2d8")}
        />
      </div>

      {/* Duration */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium tracking-widest uppercase"
               style={{ color: "#6b6b60", fontFamily: "var(--font-jost)" }}>
          Duration — {weeks} {weeks === 1 ? "week" : "weeks"}
        </label>
        <div className="flex gap-2 flex-wrap">
          {[1, 2, 3, 4, 6, 8, 12].map((w) => (
            <button
              key={w}
              onClick={() => setWeeks(w)}
              className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
              style={{
                background: weeks === w ? "#0F6E56" : "white",
                color: weeks === w ? "white" : "#6b6b60",
                border: `1.5px solid ${weeks === w ? "#0F6E56" : "#e8e2d8"}`,
                fontFamily: "var(--font-jost)",
              }}
            >
              {w}w
            </button>
          ))}
        </div>
      </div>

      {/* Tasks */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium tracking-widest uppercase"
               style={{ color: "#6b6b60", fontFamily: "var(--font-jost)" }}>
          Tasks (optional)
        </label>

        {tasks.length > 0 && (
          <ul className="flex flex-col gap-2 mb-1">
            {tasks.map((t, i) => (
              <li key={i} className="flex items-center gap-2 px-4 py-2.5 rounded-xl"
                  style={{ background: "#e6f4f0", fontFamily: "var(--font-jost)" }}>
                <span className="flex-1 text-sm" style={{ color: "#1a1a18" }}>{t}</span>
                <button onClick={() => removeTask(i)} style={{ color: "#9b9b8e", fontSize: "1.1rem", lineHeight: 1 }}>×</button>
              </li>
            ))}
          </ul>
        )}

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Add a task…"
            value={taskInput}
            onChange={(e) => setTaskInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTask())}
            className="flex-1 px-4 py-3 rounded-2xl text-sm outline-none"
            style={{ background: "white", border: "1.5px solid #e8e2d8", color: "#1a1a18", fontFamily: "var(--font-jost)" }}
            onFocus={(e) => (e.target.style.borderColor = "#0F6E56")}
            onBlur={(e) => (e.target.style.borderColor = "#e8e2d8")}
          />
          <button
            onClick={addTask}
            className="px-4 py-3 rounded-2xl text-sm font-medium"
            style={{ background: "#0F6E56", color: "white", fontFamily: "var(--font-jost)" }}
          >
            Add
          </button>
        </div>
      </div>

      {error && (
        <p className="text-sm" style={{ color: "#c0392b", fontFamily: "var(--font-jost)" }}>{error}</p>
      )}

      <button
        onClick={launch}
        disabled={saving}
        className="w-full py-4 rounded-2xl text-sm font-medium tracking-wide transition-opacity"
        style={{ background: "#0F6E56", color: "white", fontFamily: "var(--font-jost)", opacity: saving ? 0.6 : 1 }}
      >
        {saving ? "Launching…" : "Launch Sprint →"}
      </button>
    </div>
  );
}
