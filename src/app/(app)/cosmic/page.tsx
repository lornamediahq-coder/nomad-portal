import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import BirthDataForm from "./BirthDataForm";

const ARCHETYPE_COSMIC: Record<string, {
  planet: string; element: string; energy: string; theme: string; emoji: string; colour: string;
}> = {
  Explorer: {
    planet: "Jupiter", element: "Fire", energy: "Expansive · Adventurous · Truth-seeking",
    theme: "Jupiter expands everything it touches — especially your worldview. Your cosmic nature thrives when you're in motion, learning, and crossing into unfamiliar territory.",
    emoji: "🔥", colour: "#e8a020",
  },
  Builder: {
    planet: "Saturn", element: "Earth", energy: "Disciplined · Structured · Enduring",
    theme: "Saturn rewards consistent effort over time. Your path is one of mastery — built brick by brick, season by season. The slow work is the sacred work.",
    emoji: "🌍", colour: "#0F6E56",
  },
  Visionary: {
    planet: "Uranus", element: "Air", energy: "Innovative · Disruptive · Ahead of time",
    theme: "Uranus breaks what no longer serves. You're not here to fit in — you're here to introduce ideas the world isn't ready for yet. That's the whole point.",
    emoji: "💨", colour: "#5c6bc0",
  },
  Wanderer: {
    planet: "Neptune", element: "Water", energy: "Intuitive · Fluid · Spiritually attuned",
    theme: "Neptune dissolves rigid boundaries. You navigate by feeling rather than logic, and that's a gift — not a flaw. Trust the current.",
    emoji: "🌊", colour: "#2a9d8f",
  },
  Sovereign: {
    planet: "Pluto", element: "All", energy: "Transformative · Magnetic · Uncompromising",
    theme: "Pluto rules death and rebirth. You don't just change — you shed entirely. Your power lies in radical honesty, deep strategy, and the willingness to evolve.",
    emoji: "⚡", colour: "#8d6e63",
  },
};

const WEEKLY_ENERGY = {
  title: "Week of 21 April 2026",
  summary:
    "Mercury stations direct this week, clearing the communication fog that's been clouding decisions. Pair this with Mars in Gemini activating your mental drive — write the pitch, send the email, start the conversation you've been postponing. Midweek brings a stabilising Taurus stellium: ground your vision in numbers, budgets, and tangible next steps.",
  advice: "Best days to act: Tuesday & Thursday. Reflect on Friday.",
};

export default async function CosmicPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  const [{ data: profile }, { data: natal }] = await Promise.all([
    supabase.from("users").select("full_name, archetype").eq("id", user.id).single(),
    supabase.from("natal_charts").select("birth_date, birth_time, birth_place").eq("user_id", user.id).maybeSingle(),
  ]);

  const archetypeKey = profile?.archetype ?? "Explorer";
  const cosmic = ARCHETYPE_COSMIC[archetypeKey] ?? ARCHETYPE_COSMIC["Explorer"];

  return (
    <div className="px-5 pt-6 pb-6 max-w-lg mx-auto flex flex-col gap-5">
      <div>
        <h1 style={{ fontFamily: "var(--font-cormorant)", fontSize: "2.2rem", fontWeight: 500, color: "#1a1a18", lineHeight: 1.2 }}>
          Cosmic
        </h1>
        <p className="text-xs tracking-widest uppercase mt-1" style={{ color: "#0F6E56", fontFamily: "var(--font-jost)" }}>
          Your inner sky
        </p>
      </div>

      {/* Weekly energy */}
      <div className="rounded-3xl p-5" style={{ background: "#1a1a18" }}>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-base">✦</span>
          <p className="text-xs font-medium tracking-widest uppercase" style={{ color: "#6b6b60", fontFamily: "var(--font-jost)" }}>
            Weekly energy
          </p>
        </div>
        <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "#a8e6d4", fontFamily: "var(--font-jost)" }}>
          {WEEKLY_ENERGY.title}
        </p>
        <p className="text-sm leading-relaxed mb-3" style={{ color: "#d4cfc6", fontFamily: "var(--font-jost)" }}>
          {WEEKLY_ENERGY.summary}
        </p>
        <p className="text-xs" style={{ color: "#6b6b60", fontFamily: "var(--font-jost)", fontStyle: "italic" }}>
          {WEEKLY_ENERGY.advice}
        </p>
      </div>

      {/* Cosmic archetype card */}
      <div className="rounded-3xl p-5" style={{ background: "white", border: "1.5px solid #e8e2d8" }}>
        <p className="text-xs font-medium tracking-widest uppercase mb-4" style={{ color: "#6b6b60", fontFamily: "var(--font-jost)" }}>
          Your cosmic archetype
        </p>

        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
               style={{ background: cosmic.colour + "18", border: `1.5px solid ${cosmic.colour}33` }}>
            {cosmic.emoji}
          </div>
          <div>
            <h2 style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.5rem", fontWeight: 600, color: "#1a1a18", lineHeight: 1.1 }}>
              {archetypeKey}
            </h2>
            <p className="text-xs mt-0.5" style={{ color: cosmic.colour, fontFamily: "var(--font-jost)", fontWeight: 500 }}>
              {cosmic.planet} · {cosmic.element}
            </p>
          </div>
        </div>

        <p className="text-xs font-medium mb-2" style={{ color: "#6b6b60", fontFamily: "var(--font-jost)", fontStyle: "italic" }}>
          {cosmic.energy}
        </p>
        <p className="text-sm leading-relaxed" style={{ color: "#4a4a42", fontFamily: "var(--font-jost)" }}>
          {cosmic.theme}
        </p>
      </div>

      {/* Birth data */}
      <div className="rounded-3xl p-5" style={{ background: "white", border: "1.5px solid #e8e2d8" }}>
        <div className="flex items-center justify-between mb-1">
          <p className="text-xs font-medium tracking-widest uppercase" style={{ color: "#6b6b60", fontFamily: "var(--font-jost)" }}>
            Birth data
          </p>
          {natal && (
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "#e6f4f0", color: "#0F6E56", fontFamily: "var(--font-jost)" }}>
              Saved
            </span>
          )}
        </div>

        {natal && (
          <p className="text-sm mb-4" style={{ color: "#6b6b60", fontFamily: "var(--font-jost)" }}>
            {natal.birth_date}
            {natal.birth_time ? ` · ${natal.birth_time}` : ""}
            {" · "}{natal.birth_place}
          </p>
        )}

        {!natal && (
          <p className="text-sm mb-4" style={{ color: "#9b9b8e", fontFamily: "var(--font-jost)" }}>
            Add your birth data to unlock your full natal chart in a future update.
          </p>
        )}

        <BirthDataForm userId={user.id} existing={natal ?? null} />
      </div>

      {/* Visionary tier teaser */}
      <div className="rounded-3xl p-5 relative overflow-hidden" style={{ background: "#1a1a18", border: "1.5px solid #333" }}>
        <div className="absolute top-3 right-4 text-xs px-2.5 py-1 rounded-full"
             style={{ background: "#2a2a28", color: "#a8e6d4", fontFamily: "var(--font-jost)", fontWeight: 600, letterSpacing: "0.1em" }}>
          VISIONARY
        </div>

        <p className="text-xs font-medium tracking-widest uppercase mb-4" style={{ color: "#6b6b60", fontFamily: "var(--font-jost)" }}>
          Full cosmic digest
        </p>

        <ul className="flex flex-col gap-3 mb-5">
          {[
            { icon: "🔭", label: "Full Natal Chart Report", desc: "Planets, houses, aspects & interpretations" },
            { icon: "🌙", label: "Monthly Transit Forecast", desc: "Personalised planetary movements" },
            { icon: "📅", label: "Ritual Calendar", desc: "New moons, full moons & power days" },
            { icon: "🌑", label: "Shadow Work Prompts", desc: "Guided inner work for your archetype" },
          ].map(({ icon, label, desc }) => (
            <li key={label} className="flex items-start gap-3 opacity-60">
              <span className="text-base mt-0.5">{icon}</span>
              <div>
                <p className="text-sm font-medium" style={{ color: "#d4cfc6", fontFamily: "var(--font-jost)" }}>{label}</p>
                <p className="text-xs" style={{ color: "#6b6b60", fontFamily: "var(--font-jost)" }}>{desc}</p>
              </div>
            </li>
          ))}
        </ul>

        <Link
          href="/subscription"
          className="block w-full py-3.5 rounded-2xl text-sm font-medium tracking-wide text-center"
          style={{ background: "#0F6E56", color: "white", fontFamily: "var(--font-jost)", textDecoration: "none" }}
        >
          Unlock Visionary ✦
        </Link>
      </div>
    </div>
  );
}
