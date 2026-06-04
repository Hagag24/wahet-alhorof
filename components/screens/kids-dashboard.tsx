"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ProgressBar } from "@/components/common/progress-bar";
import { AudibleText } from "@/components/common/audible-text";
import { lessons } from "@/data/lessons";
import { useGameProgress } from "@/hooks/use-game-progress";
import { useSound } from "@/hooks/use-sound";
import type { Character, Lesson } from "@/types";
import type { Screen } from "@/contexts/app-context";
import { Home, Gamepad2, Trophy, TrendingUp, User, Play, Star, Map, Users, GraduationCap, ChevronLeft, Volume1, Volume2, VolumeX } from "lucide-react";

interface KidsDashboardProps {
  character: Character;
  onNavigate: (screen: Screen) => void;
  onStartLesson: (lesson: Lesson) => void;
}

const characterEmojis: Record<string, string> = {
  "rabbit": "🐰",
  "cat": "🐱",
  "bird": "🐦",
  "bear": "🐻",
  "fox": "🦊",
  "panda": "🐼",
};

export function KidsDashboard({ character, onNavigate, onStartLesson }: KidsDashboardProps) {
  const { progress, totalStars, completedLessons, unlockedRewards } = useGameProgress();
  const { soundProfile, setSoundProfile } = useSound();
  const [mounted, setMounted] = useState(false);
  const [soundDialogOpen, setSoundDialogOpen] = useState(false);
  const backgroundDots = useMemo(
    () =>
      Array.from({ length: 10 }, (_, i) => ({
        id: i,
        width: Math.random() * 20 + 10,
        height: Math.random() * 20 + 10,
        left: Math.random() * 100,
        top: Math.random() * 100,
        color: i % 3 === 0 ? '#6366F1' : i % 3 === 1 ? '#FACC15' : '#39BDF8',
      })),
    []
  );

  useEffect(() => {
    setMounted(true);
  }, []);
  
  const overallProgress = lessons.length > 0 
    ? Math.round((completedLessons / lessons.length) * 100)
    : 0;

  const getNextLesson = () => {
    for (const lesson of lessons) {
      if (!progress[lesson.id]?.completed) {
        return lesson;
      }
    }
    return lessons[0];
  };

  const nextLesson = getNextLesson();
  const getSoundLabel = () => {
    if (soundProfile === "quiet") return "هادئ";
    if (soundProfile === "party") return "احتفالي";
    return "طبيعي";
  };

  const soundOptions = [
    { id: "quiet", label: "هادئ", description: "مناسب للأطفال الحساسين للصوت" },
    { id: "normal", label: "طبيعي", description: "توازن جيد للتعلم اليومي" },
    { id: "party", label: "احتفالي", description: "مؤثرات أكثر حماسًا" },
  ] as const;

  return (
    <div className="min-h-screen bg-[#FFF9F0] pb-32 relative" dir="rtl">
      {/* Decorative stars/dots background */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
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

      {/* Header matching Image 1 style */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-md p-6 sticky top-0 z-50 border-b-4 border-[#6366F1]/10 rounded-b-[2rem] shadow-sm"
      >
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#6366F1]/10 flex items-center justify-center text-3xl">
              {characterEmojis[character.image] || "🎭"}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-[#FACC15]/20 px-4 py-2 rounded-2xl border-2 border-[#FACC15]/30">
              <span className="text-lg font-black text-[#854D0E]">{totalStars}</span>
              <Star className="w-5 h-5 fill-[#FACC15] text-[#FACC15]" />
            </div>
            <Dialog open={soundDialogOpen} onOpenChange={setSoundDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  className="rounded-2xl bg-gray-100 gap-2 px-3"
                  title={`مستوى الصوت: ${getSoundLabel()}`}
                >
                  {soundProfile === "quiet" ? <VolumeX className="w-5 h-5" /> : soundProfile === "party" ? <Volume2 className="w-5 h-5" /> : <Volume1 className="w-5 h-5" />}
                  <span className="text-xs font-bold">{getSoundLabel()}</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md rounded-3xl" dir="rtl">
                <DialogHeader>
                  <DialogTitle className="text-right text-2xl font-black">إعدادات الصوت</DialogTitle>
                </DialogHeader>
                <div className="space-y-3">
                  {soundOptions.map((option) => {
                    const active = soundProfile === option.id;
                    return (
                      <button
                        key={option.id}
                        onClick={() => {
                          setSoundProfile(option.id);
                          setSoundDialogOpen(false);
                        }}
                        className={`w-full p-4 rounded-2xl border-2 text-right transition-all ${
                          active
                            ? "border-[#6366F1] bg-[#6366F1]/10"
                            : "border-gray-200 hover:border-[#6366F1]/40"
                        }`}
                      >
                        <p className="font-black text-gray-800">{option.label}</p>
                        <p className="text-sm text-gray-500">{option.description}</p>
                      </button>
                    );
                  })}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </motion.header>

      <div className="max-w-4xl mx-auto p-4 md:p-8 relative z-10">
        {/* Welcome Banner matching Image 1 branding */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-l from-[#6366F1] to-[#4F46E5] rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 mb-6 sm:mb-8 text-white relative overflow-hidden shadow-xl"
        >
          <div className="relative z-10">
            <h2 className="text-2xl sm:text-3xl font-black mb-2 sm:mb-3">
              <AudibleText text="جاهز للمغامرة اليوم؟" stopPropagation={false} />
            </h2>
            <p className="text-white/80 text-base sm:text-lg mb-4 sm:mb-6 max-w-md">
              <AudibleText text="استمر في رحلتك لتعلم الأصوات والحروف واكتشاف المكافآت الرائعة!" stopPropagation={false} />
            </p>
            <Button 
              onClick={() => onStartLesson(nextLesson)}
              className="bg-[#FACC15] hover:bg-[#EAB308] text-[#854D0E] font-black text-lg sm:text-xl px-6 sm:px-8 py-5 sm:py-7 rounded-2xl shadow-lg border-b-4 border-[#CA8A04] flex items-center gap-2 text-sm sm:text-base"
            >
              <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-current" />
              أكمل الرحلة
            </Button>
          </div>
          
          {/* Large floating mascot part from Image 1 */}
          <div className="absolute left-[-20px] bottom-[-20px] text-[8rem] sm:text-[10rem] opacity-20 rotate-12 select-none pointer-events-none">
            {characterEmojis[character.image] || "🎭"}
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard icon="🏆" label="شارات" value={unlockedRewards.length} color="bg-purple-100 text-purple-600" />
          <StatCard icon="🌟" label="نجوم" value={totalStars} color="bg-yellow-100 text-yellow-600" />
          <StatCard icon="📚" label="دروس" value={completedLessons} color="bg-blue-100 text-blue-600" />
          <StatCard icon="📈" label="تقدم" value={`${overallProgress}%`} color="bg-green-100 text-green-600" />
        </div>

        {/* Lessons List matching Image 1 premium cards */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xl sm:text-2xl font-black text-gray-800">
              <AudibleText text="رحلة التعلم" />
            </h3>
            <Button variant="ghost" onClick={() => onNavigate("learning-map")} className="text-[#6366F1] font-bold text-sm sm:text-base">
              عرض الخريطة <ChevronLeft className="mr-1 w-4 h-4" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {lessons.map((lesson, i) => {
              const lessonProgress = progress[lesson.id];
              const isCompleted = lessonProgress?.completed;
              const isLocked = i > 0 && !progress[lessons[i-1].id]?.completed;

              return (
                <motion.div
                  key={lesson.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card
                    className={`
                      group relative overflow-hidden rounded-[2rem] border-4 transition-all duration-300
                      ${isLocked ? 'opacity-70 grayscale bg-gray-50' : 'cursor-pointer hover:shadow-2xl hover:-translate-y-2'}
                    `}
                    style={{ 
                      borderColor: isLocked ? '#E2E8F0' : isCompleted ? '#10B98120' : `${lesson.color}20`,
                      backgroundColor: 'white'
                    }}
                    onClick={() => !isLocked && onStartLesson(lesson)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center gap-5">
                        <div 
                          className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl shadow-inner group-hover:scale-110 transition-transform"
                          style={{ backgroundColor: `${lesson.color}15`, color: lesson.color }}
                        >
                          {lesson.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-bold px-2 py-1 rounded-lg bg-gray-100 text-gray-500 uppercase tracking-wider">
                              المستوى {lesson.order}
                            </span>
                            {isCompleted && (
                              <span className="text-xs font-bold px-2 py-1 rounded-lg bg-green-100 text-green-600">
                                مكتمل ✨
                              </span>
                            )}
                          </div>
                          <h4 className="text-xl font-black text-gray-800">
                            <AudibleText text={lesson.title} stopPropagation={false} />
                          </h4>
                        </div>
                        {!isLocked && (
                          <div className="flex flex-col items-center gap-1">
                            <div className="flex gap-0.5">
                              {[1, 2, 3].map((s) => (
                                <Star
                                  key={s}
                                  className={`w-4 h-4 ${s <= (lessonProgress?.stars || 0) ? "text-[#FACC15] fill-[#FACC15]" : "text-gray-200"}`}
                                />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
                        <div className="flex -space-x-2 rtl:space-x-reverse">
                          {lesson.games.slice(0, 3).map((g, idx) => (
                            <div key={idx} className="w-8 h-8 rounded-full bg-white border-2 border-gray-100 flex items-center justify-center text-sm shadow-sm">
                              {g.icon}
                            </div>
                          ))}
                        </div>
                        <Button 
                          size="sm" 
                          className={`rounded-xl font-bold ${isLocked ? 'bg-gray-200 text-gray-400' : ''}`}
                          style={!isLocked ? { backgroundColor: lesson.color } : {}}
                        >
                          {isCompleted ? "مراجعة" : isLocked ? "مغلق" : "ابدأ"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Navigation matching Image 1 / 4 exactly */}
      <motion.nav
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed bottom-0 left-0 right-0 p-4 md:p-6 z-50 flex justify-center"
      >
        <div className="bg-white/90 backdrop-blur-xl rounded-[2.5rem] p-4 shadow-[0_-10px_40px_rgba(0,0,0,0.08)] border-4 border-white flex justify-around items-center w-full max-w-4xl">
          <NavAction icon="📊" label="تقدم واضح" active={false} onClick={() => onNavigate("learning-map")} />
          <div className="w-px h-10 bg-gray-100" />
          <NavAction icon="🏅" label="مكافآت" active={false} onClick={() => onNavigate("rewards")} />
          <div className="w-px h-10 bg-gray-100" />
          <NavAction icon="⭐" label="مستويات" active={false} onClick={() => onNavigate("learning-map")} />
          <div className="w-px h-10 bg-gray-100" />
          <NavAction icon="🎮" label="ألعاب" active={true} onClick={() => onNavigate("dashboard")} />
        </div>
      </motion.nav>
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: string, label: string, value: string | number, color: string }) {
  return (
    <Card className="border-0 shadow-sm rounded-[1.5rem] overflow-hidden group hover:shadow-md transition-shadow">
      <CardContent className="p-4 flex flex-col items-center text-center">
        <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center text-2xl mb-2 group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
        <div className="text-2xl font-black text-gray-800">{value}</div>
        <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{label}</div>
      </CardContent>
    </Card>
  );
}

function NavAction({ icon, label, active, onClick }: { icon: string, label: string, active: boolean, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 px-4 py-2 rounded-[1.5rem] transition-all duration-300
        ${active ? "bg-[#6366F1] text-white scale-110 shadow-lg" : "text-gray-400 hover:bg-gray-50"}
      `}
    >
      <span className="text-2xl">{icon}</span>
      <span className="text-[10px] font-black whitespace-nowrap">{label}</span>
    </button>
  );
}
