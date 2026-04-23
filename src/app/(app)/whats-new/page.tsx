const ENTRIES = [
  {
    date: "23 April 2026",
    tag: "Launch",
    tagColour: "#0F6E56",
    title: "Nomad Portal is live",
    description:
      "Sprint tracking, budget runway, pod accountability circles, cosmic archetype, and XP progression — all shipped. Welcome to the Portal.",
  },
  {
    date: "23 April 2026",
    tag: "Feature",
    tagColour: "#5c6bc0",
    title: "Cosmic archetype quiz",
    description:
      "A 6-step identity quiz reveals your nomad archetype — Explorer, Builder, Visionary, Wanderer, or Sovereign. Your archetype shapes your cosmic card, badge colour, and personalisation across the app.",
  },
  {
    date: "23 April 2026",
    tag: "Feature",
    tagColour: "#2a9d8f",
    title: "Pod accountability circles",
    description:
      "Create or join a pod of up to 5 nomads. Post daily check-ins with mood tags, read your pod's feed in real time, and hold each other accountable to your goals.",
  },
];

export default function WhatsNewPage() {
  return (
    <div className="px-5 pt-6 pb-6 max-w-lg mx-auto flex flex-col gap-5">
      <div>
        <h1 style={{ fontFamily: "var(--font-cormorant)", fontSize: "2.2rem", fontWeight: 500, color: "#1a1a18", lineHeight: 1.2 }}>
          What&apos;s New
        </h1>
        <p className="text-xs tracking-widest uppercase mt-1" style={{ color: "#0F6E56", fontFamily: "var(--font-jost)" }}>
          Changelog
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {ENTRIES.map((entry, i) => (
          <div
            key={i}
            className="rounded-3xl p-5"
            style={{ background: "white", border: "1.5px solid #e8e2d8" }}
          >
            <div className="flex items-center gap-2 mb-3">
              <span
                className="text-xs font-semibold px-2.5 py-1 rounded-full tracking-wide"
                style={{ background: entry.tagColour + "18", color: entry.tagColour, fontFamily: "var(--font-jost)" }}
              >
                {entry.tag}
              </span>
              <span className="text-xs" style={{ color: "#9b9b8e", fontFamily: "var(--font-jost)" }}>
                {entry.date}
              </span>
            </div>

            <h2 className="mb-2" style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.4rem", fontWeight: 600, color: "#1a1a18", lineHeight: 1.2 }}>
              {entry.title}
            </h2>

            <p className="text-sm leading-relaxed" style={{ color: "#4a4a42", fontFamily: "var(--font-jost)" }}>
              {entry.description}
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-3xl px-5 py-4 text-center" style={{ background: "white", border: "1.5px solid #e8e2d8" }}>
        <p className="text-xs" style={{ color: "#9b9b8e", fontFamily: "var(--font-jost)" }}>
          More features shipping soon ✦
        </p>
      </div>
    </div>
  );
}
