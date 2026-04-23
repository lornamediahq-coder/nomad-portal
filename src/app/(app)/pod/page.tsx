import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import CheckInForm from "./CheckInForm";
import PodActions from "./PodActions";
import UpgradeGate from "@/components/UpgradeGate";

const MOOD_EMOJI: Record<string, string> = {
  energised: "⚡", focused: "🎯", grateful: "🙏",
  tired: "😴", anxious: "😰", neutral: "😐",
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function initials(name: string | null | undefined) {
  if (!name) return "?";
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

export default async function PodPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  const { data: userProfile } = await supabase
    .from("users")
    .select("tier")
    .eq("id", user.id)
    .single();

  const userTier = (userProfile?.tier as string) ?? "free";
  if (userTier === "free") {
    return (
      <div className="px-5 pt-6 pb-6 max-w-lg mx-auto flex flex-col gap-5">
        <div>
          <h1 style={{ fontFamily: "var(--font-cormorant)", fontSize: "2.2rem", fontWeight: 500, color: "#1a1a18", lineHeight: 1.2 }}>
            Pod
          </h1>
          <p className="text-xs tracking-widest uppercase mt-1" style={{ color: "#0F6E56", fontFamily: "var(--font-jost)" }}>
            Accountability circle
          </p>
        </div>
        <UpgradeGate
          feature="Pod Access"
          requiredTier="Nomad"
          description="Create or join a pod of up to 5 nomads. Share daily check-ins, track moods, and hold each other accountable in real time."
        />
      </div>
    );
  }

  const { data: membership } = await supabase
    .from("pod_members")
    .select("pod_id, role")
    .eq("user_id", user.id)
    .maybeSingle();

  // If in a pod, fetch checkins + member info
  type CheckinRow = {
    id: string; body: string; mood: string | null;
    created_at: string; user_id: string;
    users: { full_name: string | null }[] | null;
  };

  let checkins: CheckinRow[] = [];
  let memberCount = 0;

  if (membership) {
    const [checkinsRes, membersRes] = await Promise.all([
      supabase
        .from("pod_checkins")
        .select("id, body, mood, created_at, user_id, users(full_name)")
        .eq("pod_id", membership.pod_id)
        .order("created_at", { ascending: false })
        .limit(30),
      supabase
        .from("pod_members")
        .select("user_id", { count: "exact", head: true })
        .eq("pod_id", membership.pod_id),
    ]);
    checkins = (checkinsRes.data ?? []) as CheckinRow[];
    memberCount = membersRes.count ?? 0;
  }

  const shortCode = membership?.pod_id.slice(0, 8).toUpperCase();

  return (
    <div className="px-5 pt-6 pb-6 max-w-lg mx-auto flex flex-col gap-5">
      <div>
        <h1 style={{ fontFamily: "var(--font-cormorant)", fontSize: "2.2rem", fontWeight: 500, color: "#1a1a18", lineHeight: 1.2 }}>
          Pod
        </h1>
        <p className="text-xs tracking-widest uppercase mt-1" style={{ color: "#0F6E56", fontFamily: "var(--font-jost)" }}>
          {membership ? `${memberCount} member${memberCount !== 1 ? "s" : ""}` : "Accountability circle"}
        </p>
      </div>

      {!membership ? (
        /* ── Empty state ── */
        <div className="flex flex-col gap-5">
          <div className="rounded-3xl px-6 py-10 text-center"
               style={{ background: "white", border: "1.5px solid #e8e2d8" }}>
            <div className="text-4xl mb-4">🤝</div>
            <h2 className="mb-2" style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.5rem", fontWeight: 500, color: "#1a1a18" }}>
              You&apos;re not in a pod yet
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: "#6b6b60", fontFamily: "var(--font-jost)" }}>
              Pods are small accountability circles of 2–5 nomads. Check in daily, share wins, and keep each other honest.
            </p>
          </div>
          <PodActions userId={user.id} />
        </div>
      ) : (
        /* ── Pod home ── */
        <div className="flex flex-col gap-5">
          {/* Pod code card */}
          <div className="rounded-3xl px-5 py-4 flex items-center justify-between"
               style={{ background: "white", border: "1.5px solid #e8e2d8" }}>
            <div>
              <p className="text-xs font-medium tracking-widest uppercase mb-0.5"
                 style={{ color: "#6b6b60", fontFamily: "var(--font-jost)" }}>Invite code</p>
              <p className="text-sm font-semibold tracking-widest"
                 style={{ color: "#1a1a18", fontFamily: "var(--font-jost)" }}>{shortCode}</p>
            </div>
            <p className="text-xs text-right" style={{ color: "#9b9b8e", fontFamily: "var(--font-jost)", maxWidth: "140px", lineHeight: 1.4 }}>
              Share this code so others can join your pod
            </p>
          </div>

          {/* Check-in form */}
          <CheckInForm userId={user.id} podId={membership.pod_id} />

          {/* Feed */}
          <div>
            <p className="text-xs font-medium tracking-widest uppercase mb-3"
               style={{ color: "#6b6b60", fontFamily: "var(--font-jost)" }}>Recent check-ins</p>

            {checkins.length === 0 ? (
              <div className="rounded-3xl px-5 py-8 text-center"
                   style={{ background: "white", border: "1.5px solid #e8e2d8" }}>
                <p className="text-sm" style={{ color: "#9b9b8e", fontFamily: "var(--font-jost)" }}>
                  No check-ins yet — be the first to post
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {checkins.map((c) => {
                  const name = c.users?.[0]?.full_name ?? "Nomad";
                  const isMe = c.user_id === user.id;
                  return (
                    <div key={c.id} className="rounded-3xl p-4"
                         style={{ background: "white", border: `1.5px solid ${isMe ? "#c8f0e4" : "#e8e2d8"}` }}>
                      <div className="flex items-center gap-2.5 mb-2">
                        {/* Avatar */}
                        <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-semibold"
                             style={{ background: isMe ? "#0F6E56" : "#e8e2d8", color: isMe ? "white" : "#6b6b60", fontFamily: "var(--font-jost)" }}>
                          {initials(name)}
                        </div>
                        <span className="text-xs font-medium flex-1"
                              style={{ color: "#1a1a18", fontFamily: "var(--font-jost)" }}>
                          {isMe ? "You" : name}
                        </span>
                        {c.mood && (
                          <span className="text-base">{MOOD_EMOJI[c.mood] ?? ""}</span>
                        )}
                        <span className="text-xs" style={{ color: "#9b9b8e", fontFamily: "var(--font-jost)" }}>
                          {timeAgo(c.created_at)}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed" style={{ color: "#4a4a42", fontFamily: "var(--font-jost)" }}>
                        {c.body}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
