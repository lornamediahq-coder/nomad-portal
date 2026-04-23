import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import { supabase as service } from "@/lib/supabase";
import TierSelector from "./TierSelector";
import CopyWaitlistButton from "./CopyWaitlistButton";

const ADMIN_EMAIL = "lornamediahq@gmail.com";

function fmt(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.email !== ADMIN_EMAIL) redirect("/home");

  const [{ data: users, error: usersErr }, { data: waitlist }, { count: totalUsers }] = await Promise.all([
    service.from("users").select("id, email, full_name, archetype, xp, level, tier, created_at").order("created_at", { ascending: false }),
    service.from("waitlist_emails").select("email, created_at").order("created_at", { ascending: false }),
    service.from("users").select("*", { count: "exact", head: true }),
  ]);

  return (
    <div className="px-5 pt-6 pb-6 max-w-2xl mx-auto flex flex-col gap-6">
      <div>
        <h1 style={{ fontFamily: "var(--font-cormorant)", fontSize: "2.2rem", fontWeight: 500, color: "#1a1a18", lineHeight: 1.2 }}>
          Admin
        </h1>
        <p className="text-xs tracking-widest uppercase mt-1" style={{ color: "#0F6E56", fontFamily: "var(--font-jost)" }}>
          Tasha only
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-3xl p-5 text-center" style={{ background: "white", border: "1.5px solid #e8e2d8" }}>
          <p style={{ fontFamily: "var(--font-cormorant)", fontSize: "2.5rem", fontWeight: 600, color: "#1a1a18", lineHeight: 1 }}>
            {totalUsers ?? 0}
          </p>
          <p className="text-xs mt-1 tracking-widest uppercase" style={{ color: "#6b6b60", fontFamily: "var(--font-jost)" }}>
            Total users
          </p>
        </div>
        <div className="rounded-3xl p-5 text-center" style={{ background: "white", border: "1.5px solid #e8e2d8" }}>
          <p style={{ fontFamily: "var(--font-cormorant)", fontSize: "2.5rem", fontWeight: 600, color: "#1a1a18", lineHeight: 1 }}>
            {waitlist?.length ?? 0}
          </p>
          <p className="text-xs mt-1 tracking-widest uppercase" style={{ color: "#6b6b60", fontFamily: "var(--font-jost)" }}>
            Waitlist
          </p>
        </div>
      </div>

      {/* User list */}
      <div>
        <p className="text-xs font-medium tracking-widest uppercase mb-3"
           style={{ color: "#6b6b60", fontFamily: "var(--font-jost)" }}>Users</p>

        {usersErr && (
          <p className="text-sm p-4 rounded-2xl" style={{ background: "#fff0f0", color: "#c0392b", fontFamily: "var(--font-jost)" }}>
            DB error: run the SQL migrations first (add tier + notifications_read_at columns).
          </p>
        )}

        <div className="flex flex-col gap-2">
          {(users ?? []).map((u) => (
            <div
              key={u.id}
              className="rounded-2xl px-4 py-3"
              style={{ background: "white", border: "1.5px solid #e8e2d8" }}
            >
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: "#1a1a18", fontFamily: "var(--font-jost)" }}>
                    {u.full_name ?? "—"}
                  </p>
                  <p className="text-xs truncate" style={{ color: "#9b9b8e", fontFamily: "var(--font-jost)" }}>
                    {u.email}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "#c8c4bc", fontFamily: "var(--font-jost)" }}>
                    {u.archetype ?? "no archetype"} · {u.xp ?? 0} XP · Lv{u.level ?? 1} · {fmt(u.created_at)}
                  </p>
                </div>
                <TierSelector userId={u.id} currentTier={u.tier ?? "free"} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Waitlist */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-medium tracking-widest uppercase"
             style={{ color: "#6b6b60", fontFamily: "var(--font-jost)" }}>Waitlist emails</p>
          <CopyWaitlistButton emails={(waitlist ?? []).map((w) => w.email)} />
        </div>

        <div className="rounded-3xl overflow-hidden" style={{ background: "white", border: "1.5px solid #e8e2d8" }}>
          {(waitlist ?? []).length === 0 ? (
            <p className="px-5 py-6 text-sm text-center" style={{ color: "#9b9b8e", fontFamily: "var(--font-jost)" }}>
              No waitlist signups yet.
            </p>
          ) : (
            (waitlist ?? []).map((w, i) => (
              <div
                key={i}
                className="px-5 py-3 flex items-center justify-between"
                style={{ borderBottom: i < (waitlist?.length ?? 0) - 1 ? "1px solid #f0ece4" : "none" }}
              >
                <p className="text-sm" style={{ color: "#1a1a18", fontFamily: "var(--font-jost)" }}>{w.email}</p>
                <p className="text-xs" style={{ color: "#9b9b8e", fontFamily: "var(--font-jost)" }}>{fmt(w.created_at)}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
