"use client";

import { motion } from "framer-motion";
import { Star, Trophy, ArrowLeft, RotateCcw, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTTS } from "@/hooks/use-tts";
import { useEffect, useMemo, useState } from "react";
import { AudibleText } from "@/components/common/audible-text";
import { Confetti } from "@/components/common/confetti";
import { StarRating } from "@/components/common/star-rating";
import { RewardBadge } from "@/components/common/reward-badge";
import { useGameProgress } from "@/hooks/use-game-progress";
import { useSound } from "@/hooks/use-sound";
import type { GameResult, Badge } from "@/types";

interface ResultScreenProps {
  result: GameResult;
  lessonId: string;
  onRetry: () => void;
  onNext: () => void;
  onBackToMap: () => void;
}

export function ResultScreen({ result, lessonId, onRetry, onNext, onBackToMap }: ResultScreenProps) {
  const { unlockedRewards, unlockReward } = useGameProgress();
  const { speak } = useTTS();
  const { playSound } = useSound();
  const [mounted, setMounted] = useState(false);
  const celebrationParticles = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: 60 + Math.random() * 40,
        color: i % 3 === 0 ? '#6366F1' : i % 3 === 1 ? '#FACC15' : '#39BDF8',
      })),
    []
  );

  useEffect(() => {
    setMounted(true);
    if (result.stars > 0) {
      playSound(result.stars === 3 ? "finish" : "reward");
      setTimeout(() => playSound("pop"), 500);
    }
    
    // Vocal reinforcement
    const msg = getMessage();
    speak(msg);
  }, [result.stars, speak, playSound]);
  
  const isPerfect = result.stars === 3;
  const isGood = result.stars >= 2;
  
  const getMessage = () => {
    if (isPerfect) return "ممتاز! أنت بطل حقيقي!";
    if (isGood) return "أحسنت! عمل رائع!";
    if (result.stars === 1) return "جيد! حاول مرة أخرى للحصول على نجوم أكثر";
    return "لا بأس! المحاولة هي بداية النجاح";
  };
  
  // New reward calculation
  const newReward: Badge | null = isPerfect ? {
    id: `reward-${lessonId}`,
    name: "نجم متألق",
    description: "أكملت الدرس بثلاث نجوم!",
    icon: "⭐",
    requirement: "أكمل درساً بثلاث نجوم",
    earnedAt: new Date().toISOString()
  } : null;

  return (
    <div className="min-h-screen bg-[#FFF9F0] flex flex-col items-center justify-center p-4 relative" dir="rtl">
      {isPerfect && <Confetti trigger={true} />}
      
      {/* Background decorations from Image 1 style */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
        {mounted && celebrationParticles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute text-4xl"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
              y: [0, -100]
            }}
            transition={{
              duration: 2,
              delay: p.id * 0.1,
              repeat: Infinity,
              repeatDelay: 3
            }}
            style={{
              left: `${p.left}%`,
              top: `${p.top}%`,
              color: p.color
            }}
          >
            {isPerfect ? "✨" : isGood ? "⭐" : "💪"}
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", duration: 0.8 }}
        className="bg-white rounded-[3.5rem] shadow-2xl p-8 md:p-12 max-w-2xl w-full text-center relative z-10 border-8 border-white"
      >
        {/* Victory Header */}
        <div className="mb-10">
          {isPerfect ? (
            <div className="relative inline-block">
              <div className="w-40 h-40 bg-gradient-to-br from-[#FACC15] to-[#EAB308] rounded-full flex items-center justify-center shadow-2xl border-4 border-white animate-bounce-slow">
                <Trophy className="w-24 h-24 text-white" />
              </div>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-6"
              >
                <Sparkles className="w-12 h-12 text-[#FACC15] absolute top-0 left-1/2 -translate-x-1/2 fill-[#FACC15]" />
              </motion.div>
            </div>
          ) : (
            <div className="flex justify-center gap-4">
              {[1, 2, 3].map((s) => (
                <motion.div
                  key={s}
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.5 + s * 0.2, type: "spring" }}
                >
                  <Star 
                    className={`w-20 h-20 ${s <= result.stars ? "text-[#FACC15] fill-[#FACC15] drop-shadow-lg" : "text-gray-200"}`}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Mascot Mood matching Image 1 */}
        <motion.div
          className="relative inline-block mb-8"
          animate={{ 
            y: [0, -10, 0],
            rotate: isPerfect ? [0, 5, -5, 0] : 0
          }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <div className="text-[10rem] md:text-[12rem] select-none filter drop-shadow-xl">
            🐰
          </div>
          {isPerfect && (
            <div className="absolute -top-4 -right-4 text-6xl rotate-12">👑</div>
          )}
        </motion.div>

        {/* Message with Premium Typography */}
        <h2 className="text-4xl md:text-5xl font-black text-gray-800 mb-4 leading-tight">
          <AudibleText text={getMessage()} />
        </h2>

        <div className="bg-[#F8FAFC] rounded-[2rem] p-6 mb-8 border-4 border-dashed border-gray-100 flex justify-around">
          <div className="text-center">
            <p className="text-gray-400 text-xs font-black uppercase tracking-widest mb-1">النقاط</p>
            <p className="text-3xl font-black text-[#6366F1]">{result.score}/{result.totalQuestions}</p>
          </div>
          <div className="w-px h-12 bg-gray-200" />
          <div className="text-center">
            <p className="text-gray-400 text-xs font-black uppercase tracking-widest mb-1">الوقت</p>
            <p className="text-3xl font-black text-[#39BDF8]">
              {Math.floor(result.timeSpent / 60)}:{String(result.timeSpent % 60).padStart(2, '0')}
            </p>
          </div>
        </div>

        {/* New Reward Display */}
        {newReward && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="mb-10 bg-gradient-to-br from-[#6366F1]/10 to-[#39BDF8]/10 p-6 rounded-[2.5rem] border-2 border-white shadow-sm"
          >
            <p className="text-sm font-bold text-[#6366F1] mb-4">حصلت على شارة جديدة! 🏅</p>
            <div className="flex items-center justify-center gap-4">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-4xl shadow-md border-2 border-[#6366F1]/20">
                {newReward.icon}
              </div>
              <div className="text-right">
                <p className="font-black text-gray-800 text-lg">{newReward.name}</p>
                <p className="text-gray-500 text-sm">{newReward.description}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Action Buttons matching Image 1 buttons */}
        <div className="flex flex-col gap-4">
          <Button
            onClick={onNext}
            className="w-full text-2xl py-10 rounded-[2rem] bg-[#6366F1] hover:bg-[#4F46E5] shadow-[0_8px_0_#4338CA] active:shadow-none active:translate-y-2 transition-all gap-3 font-black"
          >
            الدرس التالي
            <ArrowLeft className="w-8 h-8" />
          </Button>
          
          <div className="grid grid-cols-2 gap-4">
            <Button
              onClick={onRetry}
              variant="outline"
              className="py-8 rounded-[1.5rem] border-2 border-gray-200 text-gray-600 font-bold text-lg gap-2 hover:bg-gray-50"
            >
              <RotateCcw className="w-5 h-5" />
              إعادة اللعبة
            </Button>
            <Button
              onClick={onBackToMap}
              variant="outline"
              className="py-8 rounded-[1.5rem] border-2 border-gray-200 text-gray-600 font-bold text-lg gap-2 hover:bg-gray-50"
            >
              الخريطة
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
