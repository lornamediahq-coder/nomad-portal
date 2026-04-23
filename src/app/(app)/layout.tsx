import Link from "next/link";
import { createClient } from "@/lib/supabase-server";
import BottomTabBar from "@/components/BottomTabBar";

function initials(name: string | null | undefined) {
  if (!name) return "?";
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = user
    ? await supabase.from("users").select("full_name").eq("id", user.id).single()
    : { data: null };

  const abbr = initials(profile?.full_name);

  return (
    <div style={{ background: "#F5F0E8", minHeight: "100vh" }}>
      {/* Sticky top bar */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 40,
          background: "rgba(245,240,232,0.92)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid #e8e2d8",
        }}
      >
        <div
          style={{
            maxWidth: "512px",
            margin: "0 auto",
            padding: "10px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-cormorant)",
              fontSize: "1.05rem",
              fontWeight: 600,
              color: "#0F6E56",
              letterSpacing: "0.02em",
            }}
          >
            Nomad Portal
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Link href="/notifications" style={{ textDecoration: "none", display: "flex", alignItems: "center" }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#6b6b60" strokeWidth={1.8} style={{ width: "22px", height: "22px" }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
              </svg>
            </Link>
            <Link href="/profile" style={{ textDecoration: "none" }}>
              <div
                style={{
                  width: "34px",
                  height: "34px",
                  borderRadius: "50%",
                  background: "#0F6E56",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontFamily: "var(--font-jost)",
                  fontSize: "0.7rem",
                  fontWeight: 600,
                  letterSpacing: "0.05em",
                }}
              >
                {abbr}
              </div>
            </Link>
          </div>
        </div>
      </header>

      <main style={{ paddingBottom: "88px" }}>{children}</main>
      <BottomTabBar />
    </div>
  );
}
