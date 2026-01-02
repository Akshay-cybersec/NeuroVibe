"use client";
import { useEffect, useRef } from "react";

export function IncomingInviteModal({
  invite,
  onAccept,
  onReject,
}: {
  invite: any;
  onAccept: (roomCode: string) => void;
  onReject: () => void;
}) {
  const startX = useRef<number | null>(null);

  // 🔔 Ringing + vibration
  useEffect(() => {
    const pattern = [300, 200, 300, 200, 600];
    navigator.vibrate?.(pattern);

    const interval = setInterval(() => {
      navigator.vibrate?.(pattern);
    }, 2000);

    return () => {
      clearInterval(interval);
      navigator.vibrate?.(0);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md flex items-center justify-center"
      onTouchStart={(e) => {
        startX.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        if (startX.current === null) return;
        const diff = e.changedTouches[0].clientX - startX.current;

        if (diff > 80) onAccept(invite.roomCode);   // 👉 accept
        if (diff < -80) onReject();                  // 👈 reject
      }}
    >
      <div className="bg-slate-900 p-8 rounded-3xl w-full max-w-sm text-center shadow-2xl">
        <p className="text-white text-xl font-bold mb-2">
          Incoming Invite
        </p>

        <p className="text-cyan-400 mb-6">
          Room Code: <span className="font-mono">{invite.roomCode}</span>
        </p>

        <div className="flex justify-between text-sm text-slate-400 mt-6">
          <span>👈 Reject</span>
          <span>Accept 👉</span>
        </div>

        <p className="text-[10px] text-slate-500 mt-4 uppercase tracking-widest">
          Swipe to respond
        </p>
      </div>
    </div>
  );
}
