"use client";
import { motion, AnimatePresence } from "framer-motion";
import { QRCodeCanvas } from "qrcode.react";
import { X, Copy, Share2 } from "lucide-react";

export default function ShareModal({
  visible,
  close,
  shareURL,
  roomCode
}: {
  visible: boolean;
  close: () => void;
  shareURL: string;
  roomCode: string;
}) {
  if (!visible) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/60 backdrop-blur-xl flex items-center justify-center z-[999]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-slate-950/80 border border-white/10 rounded-3xl p-8 text-center shadow-2xl max-w-xs"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.8 }}
        >
          <button
            className="absolute top-4 right-4 text-slate-400 hover:text-white"
            onClick={close}
          >
            <X size={20} />
          </button>

          <QRCodeCanvas value={shareURL} size={140} className="mx-auto mb-6" />

          <p className="text-cyan-400 font-mono text-xl tracking-[0.4em]">
            {roomCode}
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              className="py-2 rounded-xl bg-cyan-600 text-white text-sm font-black flex gap-2 items-center justify-center"
              onClick={() =>
                navigator.share
                  ? navigator.share({ url: shareURL })
                  : navigator.clipboard.writeText(shareURL)
              }
            >
              <Share2 size={16} /> Share
            </button>

            <button
              className="py-2 rounded-xl bg-white/10 text-cyan-400 text-sm font-black flex gap-2 items-center justify-center"
              onClick={() => navigator.clipboard.writeText(roomCode)}
            >
              <Copy size={16} /> Copy Code
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
