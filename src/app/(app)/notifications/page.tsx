import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import MarkReadButton from "./MarkReadButton";

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

type Notif = {
  id: string;
  icon: string;
  title: string;
  body: string;
  created_at: string;
  read: boolean;
};

export default async function NotificationsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  const [{ data: profile }, { data: membership }] = await Promise.all([
    supabase.from("users").select("notifications_read_at").eq("id", user.id).single(),
    supabase.from("pod_members").select("pod_id").eq("user_id", user.id).maybeSingle(),
  ]);

  const readAt = profile?.notifications_read_at
    ? new Date(profile.notifications_read_at as string)
    : null;

  const notifs: Notif[] = [];

  // Sprint completions
  const { data: sprints } = await supabase
    .from("sprint_goals")
    .select("id, title, created_at")
    .eq("user_id", user.id)
    .eq("status", "completed")
    .order("created_at", { ascending: false })
    .limit(5);

  for (const s of sprints ?? []) {
    notifs.push({
      id: `sprint-${s.id}`,
      icon: "⚡",
      title: "Sprint completed",
      body: `"${s.title}" — great work.`,
      created_at: s.created_at,
      read: readAt ? new Date(s.created_at) < readAt : false,
    });
  }

  // Pod check-ins from others
  if (membership) {
    type CheckinRow = {
      id: string; body: string; created_at: string;
      user_id: string; users: { full_name: string | null }[] | null;
    };
    const { data: checkins } = await supabase
      .from("pod_checkins")
      .select("id, body, created_at, user_id, users(full_name)")
      .eq("pod_id", membership.pod_id)
      .neq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10) as { data: CheckinRow[] | null };

    for (const c of checkins ?? []) {
      const name = c.users?.[0]?.full_name ?? "A pod member";
      notifs.push({
        id: `checkin-${c.id}`,
        icon: "🤝",
        title: `${name} checked in`,
        body: c.body.slice(0, 90) + (c.body.length > 90 ? "…" : ""),
        created_at: c.created_at,
        read: readAt ? new Date(c.created_at) < readAt : false,
      });
    }
  }

  notifs.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  const unreadCount = notifs.filter((n) => !n.read).length;

  return (
    <div className="px-5 pt-6 pb-6 max-w-lg mx-auto flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 style={{ fontFamily: "var(--font-cormorant)", fontSize: "2.2rem", fontWeight: 500, color: "#1a1a18", lineHeight: 1.2 }}>
            Notifications
          </h1>
          <p className="text-xs tracking-widest uppercase mt-1" style={{ color: "#0F6E56", fontFamily: "var(--font-jost)" }}>
            {unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
          </p>
        </div>
        {unreadCount > 0 && <MarkReadButton userId={user.id} />}
      </div>

      {notifs.length === 0 ? (
        <div className="rounded-3xl px-6 py-12 text-center" style={{ background: "white", border: "1.5px solid #e8e2d8" }}>
          <div className="text-4xl mb-4">🔔</div>
          <h2 className="mb-2" style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.5rem", fontWeight: 500, color: "#1a1a18" }}>
            Nothing yet
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: "#6b6b60", fontFamily: "var(--font-jost)" }}>
            Activity from your sprints and pod will appear here.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {notifs.map((n) => (
            <div
              key={n.id}
              className="rounded-2xl p-4 flex items-start gap-3"
              style={{
                background: n.read ? "white" : "#f0faf6",
                border: `1.5px solid ${n.read ? "#e8e2d8" : "#c8f0e4"}`,
              }}
            >
              <span className="text-xl flex-shrink-0 mt-0.5">{n.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-sm font-medium flex-1" style={{ color: "#1a1a18", fontFamily: "var(--font-jost)" }}>
                    {n.title}
                  </p>
                  {!n.read && (
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: "#0F6E56" }} />
                  )}
                </div>
                <p className="text-xs leading-relaxed mb-1" style={{ color: "#6b6b60", fontFamily: "var(--font-jost)" }}>
                  {n.body}
                </p>
                <p className="text-xs" style={{ color: "#c8c4bc", fontFamily: "var(--font-jost)" }}>
                  {timeAgo(n.created_at)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
