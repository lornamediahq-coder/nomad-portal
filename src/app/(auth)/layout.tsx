export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5 py-12"
         style={{ background: "#F5F0E8" }}>
      <div className="w-full max-w-sm">
        <p className="text-center text-xs font-semibold tracking-[0.2em] uppercase mb-8"
           style={{ color: "#0F6E56", fontFamily: "var(--font-jost)" }}>
          Nomad Portal
        </p>
        {children}
      </div>
    </div>
  );
}
