import { Suspense } from 'react';
import VibeDashboard from "@/components/Dashboard";
import { Navbar } from "@/components/Navbar";

export default function VibeRoomPage() {
  //this is for first commit
  return (
    <main className="min-h-screen bg-slate-950">
      <Navbar />
      <div className="pt-20"> {/* Adjusted padding to match your new dashboard height */}
        {/* WRAPPER FIX: Suspense is required here because VibeDashboard 
          uses useSearchParams(). This prevents the build error.
        */}
        <Suspense 
          fallback={
            <div className="min-h-[60vh] flex items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
                <p className="text-cyan-500 font-mono text-xs uppercase tracking-widest">
                  Initializing Neural Link...
                </p>
              </div>
            </div>
          }
        >
          <VibeDashboard />
        </Suspense>
      </div>
    </main>
  );
}