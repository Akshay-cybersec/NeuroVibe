// app/viberoom/page.tsx
import VibeDashboard from "@/components/Dashboard";
import { Navbar } from "@/components/Navbar";

export default function VibeRoomPage() {
  return (
    <main className="min-h-screen bg-slate-950">
      <Navbar />
      <div className="pt-32">
        <VibeDashboard />
      </div>
    </main>
  );
}