import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import SprintSetupForm from "./SprintSetupForm";

export default async function SprintSetupPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  // Skip if they already have an active sprint
  const { data: existing } = await supabase
    .from("sprint_goals")
    .select("id")
    .eq("user_id", user.id)
    .eq("status", "active")
    .maybeSingle();

  if (existing) redirect("/home");

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <div className="text-4xl mb-4">🚀</div>
        <h1 className="mb-2" style={{ fontFamily: "var(--font-cormorant)", fontSize: "2rem", fontWeight: 600, color: "#1a1a18", lineHeight: 1.1 }}>
          Set your first sprint
        </h1>
        <p className="text-sm leading-relaxed" style={{ color: "#6b6b60", fontFamily: "var(--font-jost)" }}>
          A sprint is a focused goal with a deadline. What do you want to accomplish in the next few weeks?
        </p>
      </div>

      <SprintSetupForm userId={user.id} />
    </div>
  );
}
