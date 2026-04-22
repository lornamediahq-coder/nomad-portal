import WaitlistForm from "@/components/WaitlistForm";

const pillars = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
      </svg>
    ),
    label: "Reset",
    title: "Reset",
    description: "Mindset & routines",
    body: "Cultivate clarity and consistency on the road. Build rituals that travel with you, restore your energy, and keep your head in the game no matter where you land.",
    accent: "bg-amber-50 text-amber-700",
    border: "border-amber-100",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
      </svg>
    ),
    label: "Rebuild",
    title: "Rebuild",
    description: "Income & skills",
    body: "Build income streams that don't require a fixed address. Level up the skills that make you location-independent — freelancing, online business, remote work, and beyond.",
    accent: "bg-sky-50 text-sky-700",
    border: "border-sky-100",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
      </svg>
    ),
    label: "Resource",
    title: "Resource",
    description: "Guides & tools",
    body: "Curated playbooks, gear guides, finance templates, and destination deep-dives — everything you need to navigate nomad life without reinventing the wheel.",
    accent: "bg-stone-100 text-stone-700",
    border: "border-stone-200",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
      </svg>
    ),
    label: "Connect",
    title: "Connect",
    description: "Community & opportunities",
    body: "Find your people. Tap into a community of nomads, collaborators, and opportunity-seekers who get it. From collab threads to curated job boards — your network travels too.",
    accent: "bg-rose-50 text-rose-700",
    border: "border-rose-100",
  },
];

export default function Home() {
  return (
    <main className="flex-1">
      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center text-center px-6 py-32 md:py-44 overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(ellipse 70% 55% at 50% 0%, #e7e0d8 0%, transparent 70%)",
          }}
        />

        <p className="mb-4 text-xs font-semibold tracking-[0.2em] uppercase text-stone-500">
          Nomad Portal
        </p>

        <h1 className="max-w-3xl text-4xl sm:text-5xl md:text-6xl font-semibold leading-tight tracking-tight text-stone-900">
          Reset. Rebuild.{" "}
          <span className="text-stone-400">Resource.</span> Connect.
        </h1>

        <p className="mt-6 max-w-xl text-base sm:text-lg text-stone-500 leading-relaxed">
          A digital home for nomads building their life, income and energy while
          travelling.
        </p>

        <a
          href="#waitlist"
          className="mt-10 inline-block px-8 py-4 rounded-2xl bg-stone-900 text-white text-sm font-medium tracking-wide hover:bg-stone-700 transition-colors shadow-sm"
        >
          Join the Portal
        </a>
      </section>

      {/* Four Pillars */}
      <section className="px-6 pb-28 max-w-6xl mx-auto">
        <p className="text-center text-xs font-semibold tracking-[0.2em] uppercase text-stone-400 mb-12">
          What&apos;s inside
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {pillars.map((p) => (
            <div
              key={p.label}
              className={`rounded-3xl border ${p.border} bg-white p-8 flex flex-col gap-4 hover:shadow-md transition-shadow`}
            >
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center ${p.accent}`}
              >
                {p.icon}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-stone-900">
                  {p.title}
                </h3>
                <p className="text-xs text-stone-400 mt-0.5">{p.description}</p>
              </div>
              <p className="text-sm text-stone-600 leading-relaxed">{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Waitlist */}
      <section
        id="waitlist"
        className="px-6 py-24 bg-stone-900 text-white text-center"
      >
        <p className="text-xs font-semibold tracking-[0.2em] uppercase text-stone-400 mb-4">
          Early access
        </p>
        <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-4">
          Be first through the door.
        </h2>
        <p className="text-stone-400 text-base max-w-sm mx-auto mb-10 leading-relaxed">
          We&apos;re building something for the restless. Drop your email and
          we&apos;ll let you know when the portal opens.
        </p>

        <WaitlistForm />
      </section>

      {/* Footer */}
      <footer className="px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-6xl mx-auto text-stone-400 text-sm">
        <span className="font-medium text-stone-600">Nomad Portal</span>

        <nav className="flex items-center gap-6">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-stone-700 transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
            </svg>
            Instagram
          </a>

          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-stone-700 transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
            YouTube
          </a>
        </nav>

        <p className="text-xs text-stone-300">
          &copy; {new Date().getFullYear()} Nomad Portal
        </p>
      </footer>
    </main>
  );
}
