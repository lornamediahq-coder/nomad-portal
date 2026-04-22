import BottomTabBar from "@/components/BottomTabBar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#F5F0E8" }}>
      <main className="flex-1 pb-24">{children}</main>
      <BottomTabBar />
    </div>
  );
}
