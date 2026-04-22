import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import SprintSetupForm from "./SprintSetupForm";
import SprintBoard from "./SprintBoard";

export default async function SprintPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  const { data: goal } = await supabase
    .from("sprint_goals")
    .select("id, title, weeks, start_date")
    .eq("user_id", user.id)
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { data: tasks } = goal
    ? await supabase
        .from("sprint_tasks")
        .select("id, title, completed, xp_value")
        .eq("goal_id", goal.id)
        .order("created_at", { ascending: true })
    : { data: [] };

  return (
    <div className="px-5 pt-10 pb-6 max-w-lg mx-auto">
      <h1 className="mb-1" style={{
        fontFamily: "var(--font-cormorant)",
        fontSize: "2.2rem",
        fontWeight: 500,
        color: "#1a1a18",
        lineHeight: 1.2,
      }}>
        Sprint
      </h1>
      <p className="text-xs tracking-widest uppercase mb-8"
         style={{ color: "#0F6E56", fontFamily: "var(--font-jost)" }}>
        {goal ? "Active" : "No active sprint"}
      </p>

      {goal ? (
        <SprintBoard goal={goal} initialTasks={tasks ?? []} userId={user.id} />
      ) : (
        <div className="flex flex-col gap-8">
          {/* Empty state */}
          <div className="rounded-3xl px-6 py-10 text-center"
               style={{ background: "white", border: "1.5px solid #e8e2d8" }}>
            <div className="text-4xl mb-4">⚡</div>
            <h2 className="mb-2" style={{
              fontFamily: "var(--font-cormorant)",
              fontSize: "1.5rem",
              fontWeight: 500,
              color: "#1a1a18",
            }}>
              No active sprint
            </h2>
            <p className="text-sm" style={{ color: "#6b6b60", fontFamily: "var(--font-jost)" }}>
              A sprint is a focused burst of intentional work. Set a goal, add tasks, and track your progress week by week.
            </p>
          </div>

          {/* Setup form */}
          <div>
            <p className="text-xs font-medium tracking-widest uppercase mb-5"
               style={{ color: "#6b6b60", fontFamily: "var(--font-jost)" }}>
              Start a new sprint
            </p>
            <SprintSetupForm userId={user.id} />
          </div>
        </div>
      )}
    </div>
  );
}
