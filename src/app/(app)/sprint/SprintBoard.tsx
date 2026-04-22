"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";

interface Task { id: string; title: string; completed: boolean; xp_value: number }
interface Goal { id: string; title: string; weeks: number; start_date: string }

function weekOf(startDate: string, weeks: number) {
  const start = new Date(startDate);
  const now = new Date();
  const daysDiff = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  return Math.min(Math.max(Math.floor(daysDiff / 7) + 1, 1), weeks);
}

function endDate(startDate: string, weeks: number) {
  const d = new Date(startDate);
  d.setDate(d.getDate() + weeks * 7);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

export default function SprintBoard({
  goal,
  initialTasks,
  userId,
}: {
  goal: Goal;
  initialTasks: Task[];
  userId: string;
}) {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [newTask, setNewTask] = useState("");
  const [adding, setAdding] = useState(false);
  const [completing, setCompleting] = useState(false);

  const done = tasks.filter((t) => t.completed).length;
  const total = tasks.length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  const currentWeek = weekOf(goal.start_date, goal.weeks);

  async function toggleTask(task: Task) {
    const supabase = createClient();
    await supabase.from("sprint_tasks").update({ completed: !task.completed }).eq("id", task.id);
    setTasks((prev) => prev.map((t) => t.id === task.id ? { ...t, completed: !task.completed } : t));

    if (!task.completed) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("xp_events").insert({ user_id: user.id, event_type: "task_complete", xp_awarded: task.xp_value });
        const { data: profile } = await supabase.from("users").select("xp").eq("id", user.id).single();
        if (profile) {
          const newXp = (profile.xp ?? 0) + task.xp_value;
          await supabase.from("users").update({ xp: newXp, level: Math.floor(newXp / 100) + 1 }).eq("id", user.id);
        }
      }
    }
  }

  async function addTask() {
    const t = newTask.trim();
    if (!t) return;
    setAdding(true);
    const supabase = createClient();
    const { data } = await supabase
      .from("sprint_tasks")
      .insert({ goal_id: goal.id, title: t, xp_value: 10 })
      .select("id, title, completed, xp_value")
      .single();
    if (data) setTasks((prev) => [...prev, data]);
    setNewTask("");
    setAdding(false);
  }

  async function completeSprint() {
    if (!confirm("Mark this sprint as complete?")) return;
    setCompleting(true);
    const supabase = createClient();
    await supabase.from("sprint_goals").update({ status: "completed" }).eq("id", goal.id);
    router.refresh();
  }

  const pending = tasks.filter((t) => !t.completed);
  const done_tasks = tasks.filter((t) => t.completed);

  return (
    <div className="flex flex-col gap-5">
      {/* Sprint header card */}
      <div className="rounded-3xl p-5" style={{ background: "white", border: "1.5px solid #e8e2d8" }}>
        <div className="flex items-start justify-between gap-2 mb-4">
          <div>
            <p className="text-xs font-medium tracking-widest uppercase mb-1"
               style={{ color: "#6b6b60", fontFamily: "var(--font-jost)" }}>
              Week {currentWeek} of {goal.weeks} · ends {endDate(goal.start_date, goal.weeks)}
            </p>
            <h2 style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.5rem", fontWeight: 600, color: "#1a1a18", lineHeight: 1.2 }}>
              {goal.title}
            </h2>
          </div>
          <span className="text-sm font-semibold flex-shrink-0"
                style={{ color: "#0F6E56", fontFamily: "var(--font-jost)" }}>
            {pct}%
          </span>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background: "#e8e2d8" }}>
          <div className="h-full rounded-full transition-all duration-500"
               style={{ width: `${pct}%`, background: "#0F6E56" }} />
        </div>
        <p className="text-xs mt-2" style={{ color: "#9b9b8e", fontFamily: "var(--font-jost)" }}>
          {done} of {total} tasks complete
        </p>
      </div>

      {/* Pending tasks */}
      {pending.length > 0 && (
        <div className="flex flex-col gap-1">
          <p className="text-xs font-medium tracking-widest uppercase mb-2"
             style={{ color: "#6b6b60", fontFamily: "var(--font-jost)" }}>To do</p>
          {pending.map((task) => (
            <button key={task.id} onClick={() => toggleTask(task)}
              className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-left mb-1.5"
              style={{ background: "white", border: "1.5px solid #e8e2d8" }}>
              <div className="w-5 h-5 rounded-full flex-shrink-0 border-2" style={{ borderColor: "#c8c4bc" }} />
              <span className="flex-1 text-sm" style={{ color: "#1a1a18", fontFamily: "var(--font-jost)" }}>{task.title}</span>
              <span className="text-xs font-medium px-2 py-0.5 rounded-full"
                    style={{ background: "#e6f4f0", color: "#0F6E56", fontFamily: "var(--font-jost)" }}>
                +{task.xp_value}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Quick add task */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Add a task…"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTask())}
          className="flex-1 px-4 py-3 rounded-2xl text-sm outline-none"
          style={{ background: "white", border: "1.5px solid #e8e2d8", color: "#1a1a18", fontFamily: "var(--font-jost)" }}
          onFocus={(e) => (e.target.style.borderColor = "#0F6E56")}
          onBlur={(e) => (e.target.style.borderColor = "#e8e2d8")}
        />
        <button onClick={addTask} disabled={adding}
          className="px-4 py-3 rounded-2xl text-sm font-medium"
          style={{ background: "#0F6E56", color: "white", fontFamily: "var(--font-jost)", opacity: adding ? 0.6 : 1 }}>
          Add
        </button>
      </div>

      {/* Completed tasks */}
      {done_tasks.length > 0 && (
        <div className="flex flex-col gap-1">
          <p className="text-xs font-medium tracking-widest uppercase mb-2"
             style={{ color: "#6b6b60", fontFamily: "var(--font-jost)" }}>Completed</p>
          {done_tasks.map((task) => (
            <button key={task.id} onClick={() => toggleTask(task)}
              className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-left mb-1.5"
              style={{ background: "white", border: "1.5px solid #c8f0e4", opacity: 0.6 }}>
              <div className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center"
                   style={{ background: "#0F6E56" }}>
                <svg viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth={2.5} className="w-3 h-3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2 6l3 3 5-5" />
                </svg>
              </div>
              <span className="flex-1 text-sm line-through" style={{ color: "#9b9b8e", fontFamily: "var(--font-jost)" }}>{task.title}</span>
            </button>
          ))}
        </div>
      )}

      {/* Complete sprint */}
      <button onClick={completeSprint} disabled={completing}
        className="w-full py-3.5 rounded-2xl text-sm font-medium transition-opacity mt-2"
        style={{ background: "transparent", border: "1.5px solid #e8e2d8", color: "#6b6b60", fontFamily: "var(--font-jost)" }}>
        {completing ? "Completing…" : "Mark sprint complete"}
      </button>
    </div>
  );
}
