"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AudibleText } from "@/components/common/audible-text";
import { SoundButton } from "@/components/common/sound-button";
import type { Lesson } from "@/types";
import { ArrowRight, BookOpen, Gamepad2, Play, Sparkles, Star } from "lucide-react";

interface LessonHubProps {
  lesson: Lesson;
  onBack: () => void;
  onStartStory: () => void;
  onStartGame: (index: number) => void;
}

export function LessonHub({ lesson, onBack, onStartStory, onStartGame }: LessonHubProps) {
  return (
    <div className="min-h-screen bg-[#FFF9F0] pb-12 relative overflow-hidden" dir="rtl">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />

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
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-2xl">
            {lesson.icon}
          </div>
          <h1 className="text-xl font-bold text-gray-800">{lesson.title}</h1>
        </div>
        <div className="w-10" />
      </header>

      <main className="max-w-4xl mx-auto p-4 relative z-10">
        {/* Main Lesson Hero Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card className="rounded-[2.5rem] overflow-hidden border-0 shadow-2xl bg-white">
            <div 
              className="h-48 md:h-64 relative flex items-center justify-center overflow-hidden"
              style={{ backgroundColor: `${lesson.color}15` }}
            >
              <div className="text-9xl md:text-[12rem] filter drop-shadow-xl select-none">
                {lesson.icon}
              </div>
              
              {/* Floating decorations */}
              <motion.div 
                animate={{ rotate: 360 }} 
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute top-4 right-4 text-4xl opacity-20"
              >
                ✨
              </motion.div>
            </div>
            
            <CardContent className="p-8 md:p-12 text-center">
              <motion.h2 
                className="text-4xl md:text-5xl font-black text-gray-800 mb-4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <AudibleText text={lesson.title} stopPropagation={false} />
              </motion.h2>
              <p className="text-xl text-gray-500 mb-8 max-w-2xl mx-auto leading-relaxed">
                <AudibleText text={lesson.description} stopPropagation={false} />
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <SoundButton
                  onClick={onStartStory}
                  text="شاهد القصة"
                  className="w-full sm:w-auto text-2xl py-8 px-12 rounded-3xl shadow-xl hover:shadow-2xl transition-all gap-3 h-auto"
                >
                  <BookOpen className="w-8 h-8" />
                  <span className="font-black">شاهد القصة</span>
                </SoundButton>
                <SoundButton 
                  text="استمع للعنوان"
                  audioText={lesson.title}
                  className="w-full sm:w-auto text-xl py-8 px-8 rounded-3xl h-auto"
                  variant="outline"
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Activities Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 px-2">
            <div className="p-2 bg-[#FACC15] rounded-xl">
              <Gamepad2 className="w-6 h-6 text-[#854D0E]" />
            </div>
            <h3 className="text-2xl font-black text-gray-800">ألعاب المستوى</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {lesson.games.map((game, i) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, x: i % 2 === 0 ? 50 : -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card 
                  className="group rounded-[2rem] border-4 border-transparent hover:border-primary/20 transition-all cursor-pointer bg-white shadow-lg hover:shadow-2xl hover:-translate-y-2"
                  onClick={() => onStartGame(i)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-5">
                      <div className="w-20 h-20 rounded-2xl bg-gray-50 flex items-center justify-center text-4xl group-hover:scale-110 transition-transform shadow-inner">
                        {game.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-xl font-black text-gray-800 mb-1">
                          <AudibleText text={game.title} stopPropagation={false} />
                        </h4>
                        <p className="text-sm text-gray-500 line-clamp-1">
                          {game.description}
                        </p>
                      </div>
                      <Button
                        size="icon"
                        className="rounded-2xl w-12 h-12 bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all"
                      >
                        <Play className="w-6 h-6 fill-current" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Lesson Vocabulary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 bg-white rounded-[2.5rem] p-8 shadow-xl border-4 border-white"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-[#10B981] rounded-xl">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-black text-gray-800">كلمات الدرس</h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {lesson.vocabulary.map((vocab, i) => (
              <motion.div
                key={vocab.word}
                whileHover={{ scale: 1.05 }}
                className="flex flex-col items-center"
              >
                <div className="w-full aspect-square bg-[#F8FAFC] rounded-3xl flex items-center justify-center text-5xl mb-3 shadow-inner border-2 border-gray-50 relative group">
                  {vocab.image ? (
                    <span className="group-hover:scale-110 transition-transform">{vocab.image}</span>
                  ) : "🖼️"}
                  <div className="absolute -top-2 -right-2">
                    <SoundButton 
                      audioText={vocab.word}
                      size="sm"
                      className="rounded-full w-10 h-10 p-0 shadow-lg"
                    />
                  </div>
                </div>
                <span className="font-bold text-gray-700 text-lg">{vocab.word}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
