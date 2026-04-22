import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import AddEntryForm from "./AddEntryForm";
import EntryLog from "./EntryLog";

function computeSummary(entries: { amount: number; date: string }[]) {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0];

  let allTimeBalance = 0;
  let monthIncome = 0;
  let monthExpenses = 0;

  for (const e of entries) {
    allTimeBalance += e.amount;
    if (e.date >= monthStart) {
      if (e.amount > 0) monthIncome += e.amount;
      else monthExpenses += Math.abs(e.amount);
    }
  }

  const dailyBurn = monthExpenses / 30;
  const runway = dailyBurn > 0 && allTimeBalance > 0
    ? Math.floor(allTimeBalance / dailyBurn)
    : null;

  return { allTimeBalance, monthIncome, monthExpenses, runway };
}

function StatCard({ label, value, sub, accent }: {
  label: string; value: string; sub?: string; accent?: string;
}) {
  return (
    <div className="rounded-3xl p-5" style={{ background: "white", border: "1.5px solid #e8e2d8" }}>
      <p className="text-xs font-medium tracking-widest uppercase mb-2"
         style={{ color: "#6b6b60", fontFamily: "var(--font-jost)" }}>{label}</p>
      <p style={{
        fontFamily: "var(--font-cormorant)",
        fontSize: "1.9rem",
        fontWeight: 600,
        color: accent ?? "#1a1a18",
        lineHeight: 1,
      }}>{value}</p>
      {sub && <p className="text-xs mt-1" style={{ color: "#9b9b8e", fontFamily: "var(--font-jost)" }}>{sub}</p>}
    </div>
  );
}

export default async function BudgetPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  const { data: entries } = await supabase
    .from("budget_entries")
    .select("id, amount, category, note, date")
    .eq("user_id", user.id)
    .order("date", { ascending: false })
    .order("created_at", { ascending: false });

  const { allTimeBalance, monthIncome, monthExpenses, runway } =
    computeSummary(entries ?? []);

  const fmt = (n: number) =>
    (n < 0 ? "−" : "") + "$" + Math.abs(n).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });

  return (
    <div className="px-5 pt-10 pb-6 max-w-lg mx-auto">
      <h1 className="mb-1" style={{
        fontFamily: "var(--font-cormorant)",
        fontSize: "2.2rem",
        fontWeight: 500,
        color: "#1a1a18",
        lineHeight: 1.2,
      }}>
        Budget
      </h1>
      <p className="text-xs tracking-widest uppercase mb-8"
         style={{ color: "#0F6E56", fontFamily: "var(--font-jost)" }}>
        This month
      </p>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <StatCard
          label="Income"
          value={`$${monthIncome.toLocaleString("en-US", { maximumFractionDigits: 0 })}`}
          sub="this month"
          accent="#0F6E56"
        />
        <StatCard
          label="Expenses"
          value={`$${monthExpenses.toLocaleString("en-US", { maximumFractionDigits: 0 })}`}
          sub="this month"
        />
        <StatCard
          label="Balance"
          value={fmt(allTimeBalance)}
          sub="all time"
          accent={allTimeBalance >= 0 ? "#0F6E56" : "#c0392b"}
        />
        <div className="rounded-3xl p-5" style={{ background: allTimeBalance > 0 ? "#0F6E56" : "white", border: "1.5px solid #e8e2d8" }}>
          <p className="text-xs font-medium tracking-widest uppercase mb-2"
             style={{ color: allTimeBalance > 0 ? "#a8e6d4" : "#6b6b60", fontFamily: "var(--font-jost)" }}>
            Runway
          </p>
          {runway !== null ? (
            <>
              <p style={{
                fontFamily: "var(--font-cormorant)",
                fontSize: "1.9rem",
                fontWeight: 600,
                color: allTimeBalance > 0 ? "white" : "#1a1a18",
                lineHeight: 1,
              }}>{runway}</p>
              <p className="text-xs mt-1"
                 style={{ color: allTimeBalance > 0 ? "#a8e6d4" : "#9b9b8e", fontFamily: "var(--font-jost)" }}>
                days covered
              </p>
            </>
          ) : (
            <p className="text-xs mt-1 leading-snug"
               style={{ color: "#9b9b8e", fontFamily: "var(--font-jost)" }}>
              {entries?.length ? "No expenses yet" : "Add entries to calculate"}
            </p>
          )}
        </div>
      </div>

      {/* Freedom fund note */}
      {runway !== null && (
        <div className="rounded-2xl px-4 py-3 mb-6 flex items-center gap-2"
             style={{ background: "#e6f4f0", border: "1px solid #c8f0e4" }}>
          <span className="text-base">💡</span>
          <p className="text-xs leading-snug" style={{ color: "#0a5040", fontFamily: "var(--font-jost)" }}>
            At your current burn rate of <strong>${(monthExpenses / 30).toFixed(0)}/day</strong>,
            your balance covers <strong>{runway} days</strong> of nomad life.
          </p>
        </div>
      )}

      {/* Add entry form */}
      <div className="mb-6">
        <AddEntryForm userId={user.id} />
      </div>

      {/* Entry log */}
      <div>
        <p className="text-xs font-medium tracking-widest uppercase mb-4"
           style={{ color: "#6b6b60", fontFamily: "var(--font-jost)" }}>
          History
        </p>
        <EntryLog initialEntries={entries ?? []} />
      </div>
    </div>
  );
}
