import Link from "next/link";

const ARCHETYPES: Record<string, { emoji: string; tagline: string; description: string; colour: string }> = {
  Explorer: {
    emoji: "🧭",
    tagline: "The world is your research lab.",
    description:
      "You're energised by discovery — new places, new people, new ideas. You move fast, adapt easily, and collect experiences the way others collect assets. The Portal will help you turn that curiosity into momentum.",
    colour: "#e8b84b",
  },
  Builder: {
    emoji: "🔨",
    tagline: "You don't wander. You construct.",
    description:
      "You're here to make something real. Income, systems, skills — you measure progress in tangible outputs. The Portal gives you the structure and accountability to build while you move.",
    colour: "#0F6E56",
  },
  Visionary: {
    emoji: "🔭",
    tagline: "You see the map others haven't drawn yet.",
    description:
      "Your mind runs ahead of everyone else. You think in systems, patterns, and possibilities. The Portal keeps your ideas grounded so they turn into actual outcomes — not just beautiful thoughts.",
    colour: "#5c6bc0",
  },
  Wanderer: {
    emoji: "🌊",
    tagline: "You flow. Structure follows.",
    description:
      "You live by feel and resist rigid frameworks — and that's a strength. The Portal meets you where you are, offering just enough structure to protect your freedom without boxing it in.",
    colour: "#4db6ac",
  },
  Sovereign: {
    emoji: "👑",
    tagline: "You don't chase. You cultivate.",
    description:
      "You play the long game. Depth over breadth, quality over volume, intention over impulse. The Portal is your command centre — built for the nomad who treats their life like a business.",
    colour: "#8d6e63",
  },
};

export default async function ResultPage({
  searchParams,
}: {
  searchParams: Promise<{ archetype?: string }>;
}) {
  const { archetype } = await searchParams;
  const data = ARCHETYPES[archetype ?? ""] ?? ARCHETYPES["Explorer"];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5 py-16"
         style={{ background: "#F5F0E8" }}>
      <div className="w-full max-w-sm text-center">
        <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-10"
           style={{ color: "#0F6E56", fontFamily: "var(--font-jost)" }}>
          Your archetype
        </p>

        {/* Emoji badge */}
        <div className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl mx-auto mb-6"
             style={{ background: data.colour + "22", border: `2px solid ${data.colour}33` }}>
          {data.emoji}
        </div>

        <h1 style={{
          fontFamily: "var(--font-cormorant)",
          fontSize: "3rem",
          fontWeight: 600,
          color: "#1a1a18",
          lineHeight: 1,
          marginBottom: "0.5rem",
        }}>
          {archetype}
        </h1>

        <p className="text-sm font-medium mb-6" style={{ color: data.colour, fontFamily: "var(--font-jost)" }}>
          {data.tagline}
        </p>

        <p className="text-sm leading-relaxed mb-10" style={{ color: "#4a4a42", fontFamily: "var(--font-jost)" }}>
          {data.description}
        </p>

        <Link
          href="/home"
          className="inline-block w-full py-4 rounded-2xl text-sm font-medium tracking-wide text-center transition-opacity"
          style={{
            background: "#0F6E56",
            color: "white",
            fontFamily: "var(--font-jost)",
          }}
        >
          Enter the Portal →
        </Link>
      </div>
    </div>
  );
}
