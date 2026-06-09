"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Star, Trophy, Lock, Sparkles, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useGameProgress } from "@/hooks/use-game-progress";
import { badges } from "@/data/rewards";
import { ProgressBar } from "@/components/common/progress-bar";

interface RewardsScreenProps {
  onBack: () => void;
}

export function RewardsScreen({ onBack }: RewardsScreenProps) {
  const { getEarnedBadges, totalStars } = useGameProgress();
  const [mounted, setMounted] = useState(false);
  const backgroundDots = useMemo(
    () =>
      Array.from({ length: 15 }, (_, i) => ({
        id: i,
        width: Math.random() * 30 + 10,
        height: Math.random() * 30 + 10,
        left: Math.random() * 100,
        top: Math.random() * 100,
        color: i % 3 === 0 ? '#6366F1' : i % 3 === 1 ? '#FACC15' : '#39BDF8',
      })),
    []
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  const earnedBadges = getEarnedBadges();
  const earnedBadgeIds = earnedBadges.map(b => b.id);

  const totalRewards = badges.length;
  const earnedRewardsCount = earnedBadges.length;
  const progressPercentage = (earnedRewardsCount / totalRewards) * 100;

  return (
    <div className="min-h-screen bg-[#FFF9F0] pb-20 relative" dir="rtl">
       {/* Decorative stars/dots background */}
       <div className="absolute inset-0 pointer-events-none opacity-20">
        {mounted && backgroundDots.map((dot) => (
          <div 
            key={dot.id} 
            className="absolute rounded-full"
            style={{
              width: `${dot.width}px`,
              height: `${dot.height}px`,
              left: `${dot.left}%`,
              top: `${dot.top}%`,
              backgroundColor: dot.color
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="p-6 flex items-center justify-between relative z-10">
        <Button
          variant="ghost"
          onClick={onBack}
          className="bg-white/80 backdrop-blur-sm rounded-2xl gap-2 border-2 border-gray-100"
        >
          <ArrowRight className="w-5 h-5" />
          <span>رجوع</span>
        </Button>
        <h1 className="text-3xl font-black text-[#5B49D1]">المكافآت</h1>
        <div className="flex items-center gap-2 bg-[#FACC15]/20 px-4 py-2 rounded-2xl border-2 border-[#FACC15]/30">
          <span className="text-lg font-black text-[#854D0E]">{totalStars}</span>
          <Star className="w-5 h-5 fill-[#FACC15] text-[#FACC15]" />
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-4 md:p-8 relative z-10">
        {/* Progress Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <Card className="rounded-[2.5rem] border-0 shadow-2xl overflow-hidden bg-white">
            <div className="bg-gradient-to-l from-[#6366F1] to-[#4F46E5] p-8 text-white">
              <div className="flex items-center gap-8">
                <div className="relative">
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center text-5xl md:text-6xl shadow-xl">
                    🏆
                  </div>
                  <motion.div
                    className="absolute -top-4 -right-4"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Sparkles className="w-8 h-8 text-yellow-400 fill-yellow-400" />
                  </motion.div>
                </div>
                
                <div className="flex-1">
                  <h2 className="text-2xl md:text-3xl font-black mb-4">ألبوم إنجازات الأبطال</h2>
                  <div className="flex items-center gap-4 mb-2">
                    <div className="flex-1">
                      <ProgressBar progress={progressPercentage} height="lg" color="bg-yellow-400" />
                    </div>
                    <span className="text-xl font-black">
                      {earnedRewardsCount}/{totalRewards}
                    </span>
                  </div>
                  <p className="text-white/70 font-medium">
                    استمر في مغامرتك لتحصل على كافة الأوسمة!
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Rewards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {badges.map((badge, i) => {
            const isUnlocked = earnedBadgeIds.includes(badge.id);
            
            return (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card 
                  className={`
                    group relative rounded-[2.5rem] border-4 transition-all duration-300 overflow-hidden
                    ${isUnlocked ? 'border-yellow-200 bg-white shadow-xl hover:-translate-y-2' : 'border-gray-100 bg-gray-50 opacity-60 grayscale'}
                  `}
                >
                  <CardContent className="p-6 text-center">
                    <div className={`
                      w-20 h-20 md:w-24 md:h-24 mx-auto rounded-[2rem] flex items-center justify-center text-4xl md:text-5xl mb-4 transition-transform group-hover:scale-110
                      ${isUnlocked ? 'bg-gradient-to-br from-yellow-400 to-orange-400 shadow-lg text-white' : 'bg-gray-200 text-gray-400'}
                    `}>
                      {isUnlocked ? badge.icon : <Lock className="w-10 h-10" />}
                    </div>
                    
                    <h3 className={`font-black text-lg mb-2 ${isUnlocked ? 'text-gray-800' : 'text-gray-400'}`}>
                      {badge.name}
                    </h3>
                    
                    <p className="text-xs text-gray-500 font-medium leading-relaxed">
                      {badge.description}
                    </p>
                    
                    {isUnlocked && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-3 text-xs font-black text-green-500 uppercase tracking-widest"
                      >
                        تم الإنجاز ✨
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
