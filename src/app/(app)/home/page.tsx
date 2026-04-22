import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import TaskChecklist from "./TaskChecklist";

function greeting(name: string | null) {
  const hour = new Date().getHours();
  const time = hour < 12 ? "morning" : hour < 17 ? "afternoon" : "evening";
  return `Good ${time}, ${name?.split(" ")[0] ?? "nomad"}`;
}

function runwayDays(entries: { amount: number; date: string }[]): number | null {
  if (!entries.length) return null;

  const balance = entries.reduce((sum, e) => sum + e.amount, 0);
  if (balance <= 0) return 0;

  // Average daily expenses over last 30 days
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 30);
  const expenses = entries.filter(
    (e) => e.amount < 0 && new Date(e.date) >= cutoff
  );
  if (!expenses.length) return null;

  const totalExpenses = expenses.reduce((sum, e) => sum + Math.abs(e.amount), 0);
  const dailyBurn = totalExpenses / 30;
  if (dailyBurn === 0) return null;

  return Math.floor(balance / dailyBurn);
}

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/sign-in");

  const [{ data: profile }, { data: activeGoal }, { data: budgetEntries }] =
    await Promise.all([
      supabase
        .from("users")
        .select("full_name, archetype, xp, level")
        .eq("id", user.id)
        .single(),
      supabase
        .from("sprint_goals")
        .select("id, title, weeks, start_date")
        .eq("user_id", user.id)
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase
        .from("budget_entries")
        .select("amount, date")
        .eq("user_id", user.id),
    ]);

  // Fetch today's tasks if there's an active goal
  const today = new Date().toISOString().split("T")[0];
  const { data: todayTasks } = activeGoal
    ? await supabase
        .from("sprint_tasks")
        .select("id, title, completed, xp_value")
        .eq("goal_id", activeGoal.id)
        .or(`due_date.eq.${today},due_date.is.null`)
        .order("completed", { ascending: true })
        .limit(5)
    : { data: [] };

  // Sprint progress
  let sprintProgress = 0;
  if (activeGoal) {
    const totalTasks = await supabase
      .from("sprint_tasks")
      .select("id", { count: "exact", head: true })
      .eq("goal_id", activeGoal.id);
    const doneTasks = await supabase
      .from("sprint_tasks")
      .select("id", { count: "exact", head: true })
      .eq("goal_id", activeGoal.id)
      .eq("completed", true);
    const total = totalTasks.count ?? 0;
    const done = doneTasks.count ?? 0;
    sprintProgress = total > 0 ? Math.round((done / total) * 100) : 0;
  }

  const runway = runwayDays(budgetEntries ?? []);

  const COSMIC_TEASER =
    "Mercury moves direct today — clear communication opens unexpected doors.";

  return (
    <div className="px-5 pt-10 max-w-lg mx-auto">
      {/* Greeting */}
      <h1
        className="mb-1"
        style={{
          fontFamily: "var(--font-cormorant)",
          fontSize: "2rem",
          fontWeight: 500,
          color: "#1a1a18",
          lineHeight: 1.2,
        }}
      >
        {greeting(profile?.full_name ?? null)}
      </h1>
      {profile?.archetype && (
        <p className="text-xs tracking-widest uppercase mb-8" style={{ color: "#0F6E56", fontFamily: "var(--font-jost)" }}>
          {profile.archetype}
        </p>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {/* Runway */}
        <div className="rounded-3xl p-5" style={{ background: "white", border: "1.5px solid #e8e2d8" }}>
          <p className="text-xs font-medium tracking-widest uppercase mb-2" style={{ color: "#6b6b60", fontFamily: "var(--font-jost)" }}>
            Runway
          </p>
          {runway !== null ? (
            <>
              <p style={{ fontFamily: "var(--font-cormorant)", fontSize: "2.4rem", fontWeight: 600, color: "#0F6E56", lineHeight: 1 }}>
                {runway}
              </p>
              <p className="text-xs mt-1" style={{ color: "#9b9b8e", fontFamily: "var(--font-jost)" }}>days covered</p>
            </>
          ) : (
            <p className="text-xs mt-1" style={{ color: "#9b9b8e", fontFamily: "var(--font-jost)" }}>Add budget entries to see runway</p>
          )}
        </div>

        {/* XP */}
        <div className="rounded-3xl p-5" style={{ background: "white", border: "1.5px solid #e8e2d8" }}>
          <p className="text-xs font-medium tracking-widest uppercase mb-2" style={{ color: "#6b6b60", fontFamily: "var(--font-jost)" }}>
            Level {profile?.level ?? 1}
          </p>
          <p style={{ fontFamily: "var(--font-cormorant)", fontSize: "2.4rem", fontWeight: 600, color: "#1a1a18", lineHeight: 1 }}>
            {profile?.xp ?? 0}
          </p>
          <p className="text-xs mt-1" style={{ color: "#9b9b8e", fontFamily: "var(--font-jost)" }}>XP earned</p>
        </div>
      </div>

      {/* Sprint progress */}
      {activeGoal && (
        <div className="rounded-3xl p-5 mb-4" style={{ background: "white", border: "1.5px solid #e8e2d8" }}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs font-medium tracking-widest uppercase mb-0.5" style={{ color: "#6b6b60", fontFamily: "var(--font-jost)" }}>
                Active sprint
              </p>
              <p className="text-sm font-medium" style={{ color: "#1a1a18", fontFamily: "var(--font-jost)" }}>
                {activeGoal.title}
              </p>
            </div>
            <span className="text-sm font-semibold" style={{ color: "#0F6E56", fontFamily: "var(--font-jost)" }}>
              {sprintProgress}%
            </span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: "#e8e2d8" }}>
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${sprintProgress}%`, background: "#0F6E56" }}
            />
          </div>
        </div>
      )}

      {/* Today's tasks */}
      <div className="mb-4">
        <p className="text-xs font-medium tracking-widest uppercase mb-3" style={{ color: "#6b6b60", fontFamily: "var(--font-jost)" }}>
          Today&apos;s tasks
        </p>
        <TaskChecklist initialTasks={todayTasks ?? []} />
      </div>

      {/* Cosmic teaser */}
      <div
        className="rounded-3xl px-5 py-4 flex items-start gap-3 mb-6"
        style={{ background: "#1a1a18" }}
      >
        <span className="text-lg mt-0.5">✦</span>
        <p className="text-sm leading-relaxed" style={{ color: "#d4cfc6", fontFamily: "var(--font-jost)" }}>
          {COSMIC_TEASER}
        </p>
      </div>
    </div>
  );
}
