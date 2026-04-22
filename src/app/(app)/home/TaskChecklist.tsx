"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase-browser";

interface Task {
  id: string;
  title: string;
  completed: boolean;
  xp_value: number;
}

export default function TaskChecklist({ initialTasks }: { initialTasks: Task[] }) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  async function toggle(taskId: string, current: boolean) {
    const supabase = createClient();

    await supabase
      .from("sprint_tasks")
      .update({ completed: !current })
      .eq("id", taskId);

    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: !current } : t))
    );

    if (!current) {
      const task = tasks.find((t) => t.id === taskId);
      if (!task) return;

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Record the XP event
      await supabase.from("xp_events").insert({
        user_id: user.id,
        event_type: "task_complete",
        xp_awarded: task.xp_value,
      });

      // Increment xp directly on the users row
      const { data: profile } = await supabase
        .from("users")
        .select("xp")
        .eq("id", user.id)
        .single();

      if (profile) {
        const newXp = (profile.xp ?? 0) + task.xp_value;
        const newLevel = Math.floor(newXp / 100) + 1;
        await supabase
          .from("users")
          .update({ xp: newXp, level: newLevel })
          .eq("id", user.id);
      }
    }
  }

  if (tasks.length === 0) {
    return (
      <div className="rounded-3xl px-5 py-8 text-center"
           style={{ background: "white", border: "1.5px solid #e8e2d8" }}>
        <p className="text-sm" style={{ color: "#9b9b8e", fontFamily: "var(--font-jost)" }}>
          No tasks due today — add some in Sprint
        </p>
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-2.5">
      {tasks.map((task) => (
        <li key={task.id}>
          <button
            onClick={() => toggle(task.id, task.completed)}
            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-left transition-all"
            style={{
              background: "white",
              border: `1.5px solid ${task.completed ? "#c8f0e4" : "#e8e2d8"}`,
              opacity: task.completed ? 0.6 : 1,
            }}
          >
            <div
              className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center transition-all"
              style={{
                background: task.completed ? "#0F6E56" : "transparent",
                border: task.completed ? "none" : "2px solid #c8c4bc",
              }}
            >
              {task.completed && (
                <svg viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth={2.5} className="w-3 h-3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2 6l3 3 5-5" />
                </svg>
              )}
            </div>
            <span
              className="flex-1 text-sm"
              style={{
                color: task.completed ? "#9b9b8e" : "#1a1a18",
                textDecoration: task.completed ? "line-through" : "none",
                fontFamily: "var(--font-jost)",
              }}
            >
              {task.title}
            </span>
            <span className="text-xs font-medium px-2 py-0.5 rounded-full"
                  style={{ background: "#e6f4f0", color: "#0F6E56", fontFamily: "var(--font-jost)" }}>
              +{task.xp_value}
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}
