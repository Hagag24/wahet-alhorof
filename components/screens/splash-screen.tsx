"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, BookOpen } from "lucide-react";
import { useTTS } from "@/hooks/use-tts";

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [showContent, setShowContent] = useState(false);
  const { speak } = useTTS();
  const [hasSpoken, setHasSpoken] = useState(false);
  const [mounted, setMounted] = useState(false);
  const particles = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => ({
        id: i,
        duration: 4 + Math.random() * 2,
        left: Math.random() * 100,
        top: Math.random() * 100,
        color: i % 3 === 0 ? '#6366F1' : i % 3 === 1 ? '#FACC15' : '#39BDF8',
        symbol: i % 2 === 0 ? "✨" : "⭐",
      })),
    []
  );

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (showContent && !hasSpoken) {
      speak("أهلاً بكم في رحلة الوعي الصوتي! هيا نلعب ونتعلم معاً.");
      setHasSpoken(true);
    }
  }, [showContent, hasSpoken, speak]);

  return (
    <div className="min-h-screen bg-[#FFF9F0] relative overflow-hidden flex flex-col items-center justify-center p-4" dir="rtl">
      {/* Decorative stars and dots from Image 1 */}
      <div className="absolute inset-0 pointer-events-none">
        {mounted && particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute text-3xl"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: [0, 0.5, 0.2],
              scale: [0, 1, 0.8],
              y: [0, -20, 0]
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.id * 0.1
            }}
            style={{
              left: `${p.left}%`,
              top: `${p.top}%`,
              color: p.color
            }}
          >
            {p.symbol}
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {showContent && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative z-10 w-full max-w-6xl mx-auto flex flex-col items-center"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12 w-full">
              {/* Left Side: Content */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="text-right lg:pr-12"
              >
                <h1 
                  className="text-6xl md:text-8xl font-black text-[#5B49D1] mb-6 drop-shadow-sm leading-tight"
                  style={{ fontFamily: 'Cairo, sans-serif' }}
                >
                  رحلة الوعي <br />
                  <span className="text-[#6366F1]">الصوتي</span>
                </h1>
                
                <div className="space-y-4 mb-10">
                  <h2 className="text-2xl md:text-3xl font-bold text-[#E11D48]">
                    هيا نلعب ونتعلم الأصوات والحروف
                  </h2>
                  <p className="text-xl text-gray-600 max-w-md leading-relaxed">
                    انطلق في مغامرات ممتعة تساعدك على التمييز بين الأصوات، والتعرف على الحروف، وبناء مهاراتك خطوة بخطوة!
                  </p>
                </div>

                <div className="flex flex-col gap-4 max-w-md">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onComplete}
                    className="group relative bg-[#6366F1] hover:bg-[#4F46E5] text-white text-3xl font-bold py-8 px-12 rounded-[2rem] shadow-[0_10px_0_#4338CA] active:shadow-none active:translate-y-2 transition-all flex items-center justify-center gap-4 overflow-hidden"
                  >
                    <div className="bg-white/20 p-2 rounded-full">
                      <Star className="w-8 h-8 fill-yellow-400 text-yellow-400" />
                    </div>
                    ابدأ الرحلة
                  </motion.button>

                  <button
                    onClick={onComplete}
                    className="flex items-center justify-center gap-3 border-2 border-[#6366F1] text-[#6366F1] text-xl font-bold py-6 rounded-[1.5rem] hover:bg-[#6366F1]/5 transition-colors"
                  >
                    <BookOpen className="w-6 h-6" />
                    تعرف على الدروس
                  </button>
                </div>
              </motion.div>

              {/* Right Side: Rabbit Mascot */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 1, type: "spring" }}
                className="relative aspect-square flex items-center justify-center"
              >
                {/* Background glow and circle */}
                <div className="absolute inset-0 bg-[#39BDF8]/10 rounded-full blur-[100px] opacity-60" />
                <div className="absolute w-[85%] h-[85%] bg-gradient-to-br from-[#39BDF8]/20 to-[#6366F1]/10 rounded-full shadow-inner" />
                
                {/* Floating Letters around Rabbit */}
                <div className="absolute inset-0 overflow-hidden rounded-full">
                  <motion.div animate={{ y: [0, -20, 0] }} transition={{ duration: 3, repeat: Infinity }} className="absolute top-10 right-1/4 text-6xl font-bold text-red-400 opacity-60">أ</motion.div>
                  <motion.div animate={{ y: [0, 20, 0] }} transition={{ duration: 4, repeat: Infinity }} className="absolute bottom-20 left-1/4 text-6xl font-bold text-purple-400 opacity-60">ت</motion.div>
                  <motion.div animate={{ x: [0, 20, 0] }} transition={{ duration: 5, repeat: Infinity }} className="absolute top-1/2 left-10 text-6xl font-bold text-yellow-500 opacity-60">ب</motion.div>
                </div>

                <div className="relative z-10 text-[200px] md:text-[300px] leading-none select-none filter drop-shadow-2xl">
                  <motion.div
                    animate={{ 
                      y: [0, -15, 0],
                      rotate: [0, 1, -1, 0]
                    }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  >
                    🐰
                  </motion.div>
                  
                  {/* The purple book from Image 1 */}
                  <motion.div 
                    className="absolute bottom-0 right-0 md:-right-4 bg-[#6366F1] p-6 rounded-[2rem] shadow-xl border-4 border-white"
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 1, type: "spring" }}
                  >
                    <div className="relative">
                      <BookOpen className="w-16 h-16 md:w-20 md:h-20 text-white" />
                      <Star className="w-8 h-8 text-yellow-400 absolute -top-4 -right-4 fill-yellow-400" />
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>

            {/* Bottom Features Bar */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mt-16 w-full max-w-5xl bg-white/90 backdrop-blur-md rounded-[2.5rem] p-8 shadow-xl border-4 border-white flex flex-wrap justify-around items-center gap-8"
            >
              <FeatureItem icon="🎮" label="ألعاب تعليمية" subLabel="لعب وتعلم ممتع" color="bg-purple-100 text-purple-600" />
              <div className="hidden md:block w-px h-12 bg-gray-200" />
              <FeatureItem icon="⭐" label="مستويات متدرجة" subLabel="من السهل إلى المتقدم" color="bg-green-100 text-green-600" />
              <div className="hidden md:block w-px h-12 bg-gray-200" />
              <FeatureItem icon="🏅" label="مكافآت وإنجازات" subLabel="تحفيز وتشجيع مستمر" color="bg-yellow-100 text-yellow-600" />
              <div className="hidden md:block w-px h-12 bg-gray-200" />
              <FeatureItem icon="📊" label="تقدم واضح" subLabel="تابع تطور مهاراتك" color="bg-blue-100 text-blue-600" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Wave Decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-[#6366F1]/5 rounded-t-[100%] scale-x-125 translate-y-12" />
    </div>
  );
}

function FeatureItem({ icon, label, subLabel, color }: { icon: string, label: string, subLabel: string, color: string }) {
  return (
    <div className="flex items-center gap-4 text-right">
      <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center text-3xl shadow-inner`}>
        {icon}
      </div>
      <div>
        <p className="font-bold text-gray-800 text-sm">{label}</p>
        <p className="text-gray-500 text-xs">{subLabel}</p>
      </div>
    </div>
  );
}
