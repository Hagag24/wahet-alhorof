"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { lessons } from "@/data/lessons";
import type { Lesson } from "@/types";
import { ArrowRight, Lock, Check, Play, Star, ChevronLeft } from "lucide-react";
import { AudibleText } from "@/components/common/audible-text";

interface LearningMapProps {
  progress: Record<string, { completed: boolean; stars: number }>;
  onSelectLesson: (lesson: Lesson) => void;
  onBack: () => void;
}

export function LearningMap({ progress, onSelectLesson, onBack }: LearningMapProps) {
  const [mounted, setMounted] = useState(false);
  const floatingStars = useMemo(
    () =>
      Array.from({ length: 10 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
      })),
    []
  );

  useEffect(() => {
    setMounted(true);
  }, []);
  const getLessonStatus = (lessonId: string, index: number): "completed" | "active" | "locked" => {
    const lessonProgress = progress[lessonId];
    if (lessonProgress?.completed) return "completed";
    if (index === 0) return "active";
    const prevLesson = lessons[index - 1];
    if (progress[prevLesson.id]?.completed) return "active";
    return "locked";
  };

  return (
    <div className="min-h-screen bg-[#FFF9F0] relative overflow-hidden" dir="rtl">
      {/* Scenic Background Decorations from Image 4 */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-[10%] text-8xl opacity-10">☁️</div>
        <div className="absolute top-40 right-[15%] text-7xl opacity-10">☁️</div>
        <div className="absolute bottom-40 left-[20%] text-6xl opacity-10">🌳</div>
        <div className="absolute bottom-20 right-[10%] text-8xl opacity-10">🏔️</div>
        
        {/* Floating Stars */}
        {mounted && floatingStars.map((star) => (
          <motion.div
            key={star.id}
            animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 3, repeat: Infinity, delay: star.id * 0.5 }}
            className="absolute text-2xl text-yellow-400"
            style={{ left: `${star.left}%`, top: `${star.top}%` }}
          >
            ⭐
          </motion.div>
        ))}
      </div>

      <header className="relative z-10 p-6 flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={onBack}
          className="bg-white/80 backdrop-blur-sm rounded-2xl gap-2 border-2 border-gray-100"
        >
          <ArrowRight className="w-5 h-5" />
          <span>العودة للرئيسية</span>
        </Button>
        <h1 className="text-3xl font-black text-[#5B49D1]">خريطة الرحلة</h1>
        <div className="w-10" />
      </header>

      <div className="max-w-4xl mx-auto p-4 relative z-10 pb-32">
        <div className="relative">
          {/* The Path Line from Image 4 */}
          <svg 
            className="absolute inset-0 w-full h-full pointer-events-none" 
            style={{ minHeight: '1000px' }}
            viewBox="0 0 100 1000"
            preserveAspectRatio="none"
          >
            <motion.path
              d="M 50 50 Q 80 150 50 250 T 50 450 T 50 650 T 50 850"
              fill="none"
              stroke="#6366F1"
              strokeWidth="1"
              strokeDasharray="2 2"
              className="opacity-20"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2 }}
            />
          </svg>

          <div className="flex flex-col items-center gap-24 relative pt-10">
            {lessons.map((lesson, i) => {
              const status = getLessonStatus(lesson.id, i);
              const lessonProg = progress[lesson.id];
              const isEven = i % 2 === 0;

              return (
                <motion.div
                  key={lesson.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className={`relative flex items-center w-full justify-center ${isEven ? 'flex-row' : 'flex-row-reverse'}`}
                >
                  {/* Station Marker - Circular as seen in Image 4 */}
                  <div className="relative z-20">
                    <motion.div
                      whileHover={status !== 'locked' ? { scale: 1.1 } : {}}
                      onClick={() => status !== 'locked' && onSelectLesson(lesson)}
                      className={`
                        w-24 h-24 rounded-full flex items-center justify-center text-4xl shadow-xl cursor-pointer border-4
                        transition-all duration-300
                        ${status === 'completed' ? 'bg-primary border-white' : ''}
                        ${status === 'active' ? 'bg-white border-primary ring-8 ring-primary/20' : ''}
                        ${status === 'locked' ? 'bg-gray-200 border-gray-300 grayscale' : ''}
                      `}
                    >
                      {status === 'completed' ? (
                        <Check className="w-12 h-12 text-white" />
                      ) : (
                        <span>{lesson.icon}</span>
                      )}
                    </motion.div>
                    
                    {/* Stars achieved */}
                    {status !== 'locked' && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex gap-1 bg-white px-2 py-1 rounded-full shadow-md">
                        {[1, 2, 3].map((s) => (
                          <Star
                            key={s}
                            className={`w-4 h-4 ${s <= (lessonProg?.stars || 0) ? "text-[#FACC15] fill-[#FACC15]" : "text-gray-200"}`}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Info Card next to marker */}
                  <div className={`absolute ${isEven ? 'left-[calc(50%+4rem)]' : 'right-[calc(50%+4rem)]'} w-48 md:w-64`}>
                    <motion.div
                      whileHover={status !== 'locked' ? { x: isEven ? 10 : -10 } : {}}
                    >
                      <Card 
                        className={`border-4 rounded-[2rem] overflow-hidden ${status === 'locked' ? 'opacity-50' : 'shadow-lg hover:shadow-2xl'}`}
                        style={{ borderColor: status !== 'locked' ? `${lesson.color}40` : '#E2E8F0' }}
                      >
                        <CardContent className="p-4 text-center">
                          <h3 className="font-black text-gray-800 mb-1">
                            <AudibleText text={lesson.title} stopPropagation={false} />
                          </h3>
                          <p className="text-xs text-gray-500 line-clamp-1 mb-3">
                            {lesson.description}
                          </p>
                          <Button
                            size="sm"
                            disabled={status === 'locked'}
                            className="rounded-xl font-bold w-full"
                            style={{ backgroundColor: status !== 'locked' ? lesson.color : '#E2E8F0' }}
                            onClick={() => onSelectLesson(lesson)}
                          >
                            {status === 'completed' ? 'مراجعة' : status === 'locked' ? 'مغلق' : 'ابدأ'}
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}

            {/* Final Treasure from Image 4 */}
            <motion.div 
              className="relative z-10 pt-10"
              initial={{ rotate: -5 }}
              animate={{ rotate: 5 }}
              transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
            >
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-6xl shadow-2xl border-8 border-white">
                🏆
              </div>
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-white px-4 py-1 rounded-full shadow-lg border-2 border-yellow-200 whitespace-nowrap">
                <AudibleText text="الكنز الكبير!" className="font-black text-orange-600" stopPropagation={false} />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
