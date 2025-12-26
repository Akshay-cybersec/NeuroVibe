import { Navbar } from "../components/Navbar";
import { Hero } from "../components/Hero";
import { PrivacyRoom } from "../components/PrivacyRoom";
import { Footer } from "../components/Footer"; // Import the footer

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 selection:bg-cyan-500/30">
      <Navbar />
      <Hero />
      <PrivacyRoom />
      
      {/* Why Use NeuroVibe Section */}
      <section className="py-20 px-6 max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-12">Why NeuroVibe?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
            <h3 className="text-xl font-bold text-cyan-400 mb-3">Empathetic Design</h3>
            <p className="text-slate-400 text-sm">Beyond text-to-speech; we provide tactile feedback for the sensory impaired.</p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
            <h3 className="text-xl font-bold text-cyan-400 mb-3">Universal Scope</h3>
            <p className="text-slate-400 text-sm">A standardized haptic language that works across any wearable device.</p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
            <h3 className="text-xl font-bold text-cyan-400 mb-3">Real-time NLP</h3>
            <p className="text-slate-400 text-sm">Low-latency translation of spoken phonemes into vibration patterns.</p>
          </div>
        </div>
      </section>

      {/* Add Footer here */}
      <Footer />
    </main>
  );
}