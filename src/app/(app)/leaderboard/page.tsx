import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import UpgradeGate from "@/components/UpgradeGate";

const ARCHETYPE_EMOJI: Record<string, string> = {
  Explorer: "🧭", Builder: "🔨", Visionary: "🔭", Wanderer: "🌊", Sovereign: "👑",
};
const ARCHETYPE_COLOUR: Record<string, string> = {
  Explorer: "#e8a020", Builder: "#0F6E56", Visionary: "#5c6bc0",
  Wanderer: "#2a9d8f", Sovereign: "#8d6e63",
};
const MEDALS = ["🥇", "🥈", "🥉"];

function initials(name: string | null | undefined) {
  if (!name) return "?";
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

export default async function LeaderboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  const { data: profile } = await supabase
    .from("users")
    .select("tier")
    .eq("id", user.id)
    .single();

  const tier = (profile?.tier as string) ?? "free";
  if (tier === "free") {
    return (
      <div className="px-5 pt-6 pb-6 max-w-lg mx-auto flex flex-col gap-5">
        <div>
          <h1 style={{ fontFamily: "var(--font-cormorant)", fontSize: "2.2rem", fontWeight: 500, color: "#1a1a18", lineHeight: 1.2 }}>
            Leaderboard
          </h1>
          <p className="text-xs tracking-widest uppercase mt-1" style={{ color: "#0F6E56", fontFamily: "var(--font-jost)" }}>
            XP rankings
          </p>
        </div>
        <UpgradeGate
          feature="Leaderboard"
          requiredTier="Nomad"
          description="See how you stack up against other nomads. XP rankings, archetype badges, and level progression — all in one view."
        />
      </div>
    );
  }

  const { data: topUsers } = await supabase
    .from("users")
    .select("id, full_name, archetype, xp, level")
    .order("xp", { ascending: false })
    .limit(10);

  const myIndex = (topUsers ?? []).findIndex((u) => u.id === user.id);
  const myRank = myIndex >= 0 ? myIndex + 1 : null;

  return (
    <div className="px-5 pt-6 pb-6 max-w-lg mx-auto flex flex-col gap-5">
      <div>
        <h1 style={{ fontFamily: "var(--font-cormorant)", fontSize: "2.2rem", fontWeight: 500, color: "#1a1a18", lineHeight: 1.2 }}>
          Leaderboard
        </h1>
        <p className="text-xs tracking-widest uppercase mt-1" style={{ color: "#0F6E56", fontFamily: "var(--font-jost)" }}>
          XP rankings
        </p>
      </div>

      {myRank && (
        <div className="rounded-2xl px-4 py-3 flex items-center gap-3"
             style={{ background: "#0F6E56" }}>
          <p style={{ fontFamily: "var(--font-cormorant)", fontSize: "2rem", fontWeight: 600, color: "white", lineHeight: 1 }}>
            #{myRank}
          </p>
          <p className="text-sm" style={{ color: "#a8e6d4", fontFamily: "var(--font-jost)" }}>
            Your current rank
          </p>
        </div>
      )}

      {(!topUsers || topUsers.length === 0) ? (
        <div className="rounded-3xl px-6 py-12 text-center" style={{ background: "white", border: "1.5px solid #e8e2d8" }}>
          <p className="text-sm" style={{ color: "#9b9b8e", fontFamily: "var(--font-jost)" }}>
            No rankings yet — earn XP to appear here.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {topUsers.map((u, i) => {
            const isMe = u.id === user.id;
            const colour = ARCHETYPE_COLOUR[u.archetype ?? ""] ?? "#6b6b60";
            return (
              <div
                key={u.id}
                className="rounded-2xl px-4 py-3 flex items-center gap-3"
                style={{
                  background: isMe ? "#f0faf6" : "white",
                  border: `1.5px solid ${isMe ? "#c8f0e4" : "#e8e2d8"}`,
                }}
              >
                <div className="w-7 text-center flex-shrink-0">
                  {i < 3 ? (
                    <span className="text-lg">{MEDALS[i]}</span>
                  ) : (
                    <span className="text-xs font-semibold" style={{ color: "#9b9b8e", fontFamily: "var(--font-jost)" }}>
                      #{i + 1}
                    </span>
                  )}
                </div>

                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0"
                  style={{
                    background: isMe ? "#0F6E56" : "#e8e2d8",
                    color: isMe ? "white" : "#6b6b60",
                    fontFamily: "var(--font-jost)",
                  }}
                >
                  {initials(u.full_name)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-medium" style={{ color: "#1a1a18", fontFamily: "var(--font-jost)" }}>
                      {isMe ? "You" : (u.full_name ?? "Nomad")}
                    </p>
                    {u.archetype && (
                      <span
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{
                          background: colour + "18",
                          color: colour,
                          fontFamily: "var(--font-jost)",
                          fontWeight: 600,
                        }}
                      >
                        {ARCHETYPE_EMOJI[u.archetype] ?? ""} {u.archetype}
                      </span>
                    )}
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: "#9b9b8e", fontFamily: "var(--font-jost)" }}>
                    Level {u.level ?? 1}
                  </p>
                </div>

                <div className="text-right flex-shrink-0">
                  <p style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.5rem", fontWeight: 600, color: "#1a1a18", lineHeight: 1 }}>
                    {u.xp ?? 0}
                  </p>
                  <p className="text-xs" style={{ color: "#9b9b8e", fontFamily: "var(--font-jost)" }}>XP</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
