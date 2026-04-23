import EnterPortalButton from "./EnterPortalButton";

const ARCHETYPES: Record<string, { emoji: string; tagline: string; description: string; colour: string; traits: string[] }> = {
  Explorer: {
    emoji: "🧭",
    tagline: "The world is your research lab.",
    description:
      "You're energised by discovery — new places, new people, new ideas. You move fast, adapt easily, and collect experiences the way others collect assets. The Portal will help you turn that curiosity into momentum.",
    colour: "#e8a020",
    traits: ["Curious", "Adaptable", "Expansive"],
  },
  Builder: {
    emoji: "🔨",
    tagline: "You don't wander. You construct.",
    description:
      "You're here to make something real. Income, systems, skills — you measure progress in tangible outputs. The Portal gives you the structure and accountability to build while you move.",
    colour: "#0F6E56",
    traits: ["Disciplined", "Strategic", "Productive"],
  },
  Visionary: {
    emoji: "🔭",
    tagline: "You see the map others haven't drawn yet.",
    description:
      "Your mind runs ahead of everyone else. You think in systems, patterns, and possibilities. The Portal keeps your ideas grounded so they turn into actual outcomes — not just beautiful thoughts.",
    colour: "#5c6bc0",
    traits: ["Innovative", "Systemic", "Forward-thinking"],
  },
  Wanderer: {
    emoji: "🌊",
    tagline: "You flow. Structure follows.",
    description:
      "You live by feel and resist rigid frameworks — and that's a strength. The Portal meets you where you are, offering just enough structure to protect your freedom without boxing it in.",
    colour: "#2a9d8f",
    traits: ["Intuitive", "Fluid", "Present"],
  },
  Sovereign: {
    emoji: "👑",
    tagline: "You don't chase. You cultivate.",
    description:
      "You play the long game. Depth over breadth, quality over volume, intention over impulse. The Portal is your command centre — built for the nomad who treats their life like a business.",
    colour: "#8d6e63",
    traits: ["Deliberate", "Magnetic", "Transformative"],
  },
};

export default async function ResultPage({
  searchParams,
}: {
  searchParams: Promise<{ archetype?: string }>;
}) {
  const { archetype } = await searchParams;
  const data = ARCHETYPES[archetype ?? ""] ?? ARCHETYPES["Explorer"];
  const resolvedArchetype = archetype && ARCHETYPES[archetype] ? archetype : "Explorer";

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-5 py-16"
      style={{ background: "#F5F0E8" }}
    >
      <div className="w-full max-w-sm text-center">
        {/* Identity confirmed badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8"
             style={{ background: data.colour + "18", border: `1px solid ${data.colour}33` }}>
          <span className="text-xs">✦</span>
          <p className="text-xs font-semibold tracking-[0.18em] uppercase"
             style={{ color: data.colour, fontFamily: "var(--font-jost)" }}>
            Identity confirmed
          </p>
        </div>

        {/* Archetype icon */}
        <div
          className="w-24 h-24 rounded-3xl flex items-center justify-center text-5xl mx-auto mb-6"
          style={{ background: data.colour + "22", border: `2px solid ${data.colour}44` }}
        >
          {data.emoji}
        </div>

        <h1 style={{
          fontFamily: "var(--font-cormorant)",
          fontSize: "3.2rem",
          fontWeight: 600,
          color: "#1a1a18",
          lineHeight: 1,
          marginBottom: "0.5rem",
        }}>
          {resolvedArchetype}
        </h1>

        <p className="text-sm font-medium mb-5" style={{ color: data.colour, fontFamily: "var(--font-jost)" }}>
          {data.tagline}
        </p>

        {/* Traits */}
        <div className="flex items-center justify-center gap-2 mb-6 flex-wrap">
          {data.traits.map((t) => (
            <span
              key={t}
              className="text-xs px-3 py-1 rounded-full font-medium"
              style={{ background: data.colour + "14", color: data.colour, fontFamily: "var(--font-jost)" }}
            >
              {t}
            </span>
          ))}
        </div>

        <p className="text-sm leading-relaxed mb-10" style={{ color: "#4a4a42", fontFamily: "var(--font-jost)" }}>
          {data.description}
        </p>

        <EnterPortalButton />

        <p className="text-xs mt-4" style={{ color: "#c8c4bc", fontFamily: "var(--font-jost)" }}>
          Next: set your first sprint goal
        </p>
      </div>
    </div>
  );
}
