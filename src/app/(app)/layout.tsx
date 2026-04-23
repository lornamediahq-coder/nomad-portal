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
      </header>

      <main style={{ paddingBottom: "88px" }}>{children}</main>
      <BottomTabBar />
    </div>
  );
}
