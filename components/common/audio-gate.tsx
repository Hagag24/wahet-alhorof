"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2 } from "lucide-react";

export function AudioGate() {
  const [ready, setReady] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setReady(true);
    const unlocked = localStorage.getItem("kids_audio_unlocked") === "true";
    setVisible(!unlocked);
  }, []);

  const unlockAudio = async () => {
    localStorage.setItem("kids_audio_unlocked", "true");
    window.dispatchEvent(new Event("kids-audio-unlocked"));
    setVisible(false);
  };

  if (!ready) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          dir="rtl"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 10 }}
            className="max-w-md w-full bg-white rounded-[2rem] p-8 shadow-2xl text-center"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#6366F1]/10 flex items-center justify-center">
              <Volume2 className="w-8 h-8 text-[#6366F1]" />
            </div>
            <h3 className="text-2xl font-black text-gray-800 mb-2">تفعيل الصوت</h3>
            <p className="text-gray-600 mb-6">
              اضغط مرة واحدة لتفعيل الأصوات والتعزيزات أثناء التعلم.
            </p>
            <button
              onClick={unlockAudio}
              className="w-full bg-[#6366F1] hover:bg-[#4F46E5] text-white py-4 rounded-2xl font-black text-lg transition-colors"
            >
              تشغيل الصوت
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

