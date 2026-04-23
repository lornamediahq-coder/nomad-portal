import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import EditProfileForm from "./EditProfileForm";
import SignOutButton from "./SignOutButton";

const ARCHETYPE_META: Record<string, { emoji: string; colour: string }> = {
  Explorer:  { emoji: "🧭", colour: "#e8a020" },
  Builder:   { emoji: "🔨", colour: "#0F6E56" },
  Visionary: { emoji: "🔭", colour: "#5c6bc0" },
  Wanderer:  { emoji: "🌊", colour: "#2a9d8f" },
  Sovereign: { emoji: "👑", colour: "#8d6e63" },
};

function initials(name: string | null | undefined) {
  if (!name) return "?";
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  const [
    { data: profile },
    { count: sprintsCompleted },
    { count: expensesLogged },
    { count: checkInsPosted },
  ] = await Promise.all([
    supabase.from("users").select("full_name, archetype, xp, level, created_at").eq("id", user.id).single(),
    supabase.from("sprint_goals").select("*", { count: "exact", head: true }).eq("user_id", user.id).eq("status", "completed"),
    supabase.from("budget_entries").select("*", { count: "exact", head: true }).eq("user_id", user.id),
    supabase.from("pod_checkins").select("*", { count: "exact", head: true }).eq("user_id", user.id),
  ]);

  const name = profile?.full_name ?? "Nomad";
  const archetype = profile?.archetype ?? null;
  const xp = profile?.xp ?? 0;
  const level = profile?.level ?? 1;
  const xpInLevel = xp % 100;
  const meta = archetype ? (ARCHETYPE_META[archetype] ?? null) : null;

  const joined = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString("en-GB", { month: "long", year: "numeric" })
    : null;

  return (
    <div className="px-5 pt-6 pb-6 max-w-lg mx-auto flex flex-col gap-5">
      {/* Avatar + name */}
      <div className="flex flex-col items-center gap-3 py-4">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-semibold"
          style={{ background: "#0F6E56", color: "white", fontFamily: "var(--font-jost)" }}
        >
          {initials(name)}
        </div>
        <div className="text-center">
          <h1 style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.8rem", fontWeight: 600, color: "#1a1a18", lineHeight: 1.2 }}>
            {name}
          </h1>
          <p className="text-xs mt-0.5" style={{ color: "#9b9b8e", fontFamily: "var(--font-jost)" }}>
            {user.email}
            {joined ? ` · Joined ${joined}` : ""}
          </p>
        </div>

        {/* Archetype badge */}
        {archetype && meta && (
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-full"
            style={{ background: meta.colour + "18", border: `1.5px solid ${meta.colour}44` }}
          >
            <span className="text-base">{meta.emoji}</span>
            <span className="text-xs font-semibold tracking-widest uppercase"
                  style={{ color: meta.colour, fontFamily: "var(--font-jost)" }}>
              {archetype}
            </span>
          </div>
        )}
      </div>

      {/* XP card */}
      <div className="rounded-3xl p-5" style={{ background: "white", border: "1.5px solid #e8e2d8" }}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs font-medium tracking-widest uppercase mb-0.5"
               style={{ color: "#6b6b60", fontFamily: "var(--font-jost)" }}>Level {level}</p>
            <p style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.6rem", fontWeight: 600, color: "#1a1a18", lineHeight: 1 }}>
              {xp} <span style={{ fontSize: "1rem", color: "#9b9b8e", fontWeight: 400 }}>XP</span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs" style={{ color: "#9b9b8e", fontFamily: "var(--font-jost)" }}>
              {100 - xpInLevel} XP to level {level + 1}
            </p>
          </div>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background: "#e8e2d8" }}>
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${xpInLevel}%`, background: "#0F6E56" }}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Sprints", value: sprintsCompleted ?? 0, sub: "completed" },
          { label: "Entries", value: expensesLogged ?? 0, sub: "logged" },
          { label: "Check-ins", value: checkInsPosted ?? 0, sub: "posted" },
        ].map(({ label, value, sub }) => (
          <div key={label} className="rounded-3xl p-4 text-center"
               style={{ background: "white", border: "1.5px solid #e8e2d8" }}>
            <p style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.8rem", fontWeight: 600, color: "#1a1a18", lineHeight: 1 }}>
              {value}
            </p>
            <p className="text-xs mt-1" style={{ color: "#6b6b60", fontFamily: "var(--font-jost)" }}>{label}</p>
            <p className="text-xs" style={{ color: "#c8c4bc", fontFamily: "var(--font-jost)" }}>{sub}</p>
          </div>
        ))}
      </div>

      {/* Edit name */}
      <div className="rounded-3xl p-5" style={{ background: "white", border: "1.5px solid #e8e2d8" }}>
        <p className="text-xs font-medium tracking-widest uppercase mb-3"
           style={{ color: "#6b6b60", fontFamily: "var(--font-jost)" }}>Edit name</p>
        <EditProfileForm userId={user.id} currentName={name} />
      </div>

      {/* Sign out */}
      <SignOutButton />
    </div>
  );
}
