"use client";

import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/common/progress-bar";
import type { StoryScene } from "@/types";
import { useTTS } from "@/hooks/use-tts";
import { ArrowRight, Play, Pause, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Story {
  id?: string;
  title?: string;
  icon?: string;
  color?: string;
  story?: string;
  scenes?: StoryScene[];
  storyScenes?: StoryScene[];
}

interface StoryPlayerProps {
  story: string | Story;
  onComplete: () => void;
  onSkip: () => void;
}

export function StoryPlayer({ story, onComplete, onSkip }: StoryPlayerProps) {
  const [currentScene, setCurrentScene] = useState(0);
  const { speak, stop, isSpeaking } = useTTS();

  const scenes: StoryScene[] = useMemo(() => {
    if (typeof story === "string") {
      return story
        .split(". ")
        .filter((s) => s.trim())
        .map((text, i) => ({
          id: `scene-${i}`,
          text: text.trim() + (text.endsWith(".") ? "" : "."),
        }));
    }

    if (story.id === "lesson-1" && story.story) {
      const firstVisual = story.storyScenes?.[0]?.image || story.scenes?.[0]?.image;
      return [
        {
          id: "lesson-1-full-story",
          text: story.story,
          image: firstVisual,
        },
      ];
    }

    return story.storyScenes || story.scenes || [];
  }, [story]);

  const shouldUseFullLessonOneAudio =
    typeof story !== "string" && story.id === "lesson-1" && scenes[currentScene]?.id === "lesson-1-full-story";
  
  const totalScenes = scenes.length;
  const progress = totalScenes > 0 ? ((currentScene + 1) / totalScenes) * 100 : 0;

  // Auto-play speech for current scene when it changes
  useEffect(() => {
    const timer = setTimeout(() => {
      handlePlay();
    }, 1000);
    return () => clearTimeout(timer);
  }, [currentScene]);

  const handlePlay = () => {
    if (isSpeaking) {
      stop();
    } else if (scenes[currentScene]) {
      const sceneId = scenes[currentScene].id;
      const audioPath = shouldUseFullLessonOneAudio
        ? "/audio/stories/lesson-1-full.mp3"
        : sceneId?.startsWith("scene-")
          ? `/audio/stories/${sceneId}.mp3`
          : undefined;
      speak(scenes[currentScene].text, audioPath);
    }
  };

  const handleNext = () => {
    stop();
    if (currentScene < totalScenes - 1) {
      setCurrentScene(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  const handlePrev = () => {
    stop();
    if (currentScene > 0) {
      setCurrentScene(prev => prev - 1);
    }
  };

  const handleRestart = () => {
    stop();
    setCurrentScene(0);
  };

  const isLastScene = currentScene === totalScenes - 1;

  const renderVisual = (visual: string) => {
    const isImagePath = visual.startsWith('/') || visual.startsWith('http') || visual.includes('.');
    
    if (isImagePath) {
      return (
        <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
          <motion.img 
            key={`${visual}-blur`}
            src={visual} 
            className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-30 scale-110"
            alt=""
          />
          <motion.img 
            key={visual}
            initial={{ scale: 1.05, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            src={visual} 
            alt="Story visual" 
            className="relative z-10 object-contain w-full h-full drop-shadow-2xl" 
          />
        </div>
      );
    }
    
    return (
      <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-indigo-50 to-blue-50">
        <span className="text-[15rem] md:text-[20rem] filter drop-shadow-2xl select-none animate-bounce-slow">
          {visual}
        </span>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black z-[100] flex flex-col" dir="rtl">
      {/* Cinematic Image Area */}
      <div className="relative flex-1 bg-gray-900 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScene}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "circOut" }}
            className="absolute inset-0"
          >
            {renderVisual(scenes[currentScene]?.image || (scenes[currentScene]?.images?.[0]) || getEmojiForScene(scenes[currentScene]?.text || ""))}
          </motion.div>
        </AnimatePresence>

        {/* Overlay Controls */}
        <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-20">
          <Button 
            variant="ghost" 
            onClick={onSkip} 
            className="bg-black/20 backdrop-blur-md text-white rounded-2xl gap-2 hover:bg-black/40 border-0"
          >
            <ArrowRight className="w-5 h-5" />
            تخطي القصة
          </Button>
          
          <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={onSkip}
                className="w-12 h-12 rounded-2xl bg-black/20 backdrop-blur-md text-white border-0"
              >
                <ChevronLeft className="w-6 h-6" />
              </Button>
          </div>
        </div>

        <div className="absolute top-0 left-0 right-0 z-30">
           <ProgressBar progress={progress} height="sm" color="bg-[#6366F1]" />
        </div>
      </div>

      {/* Narrative & Controls Area */}
      <div className="bg-white p-6 md:p-10 flex flex-col items-center justify-center relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
          <Button
            onClick={handlePlay}
            size="lg"
            className={cn(
              "w-20 h-20 rounded-full shadow-2xl transition-all duration-300 border-4 border-white",
              isSpeaking ? 'bg-[#F43F5E] scale-105' : 'bg-[#6366F1] hover:scale-110'
            )}
          >
            {isSpeaking ? (
              <Pause className="w-10 h-10 fill-current text-white" />
            ) : (
              <Play className="w-10 h-10 fill-current text-white ml-1" />
            )}
          </Button>
        </div>

        <div className="max-w-4xl w-full text-center mt-4 overflow-y-auto max-h-[150px] sm:max-h-[200px] md:max-h-[300px]">
          <motion.div
            key={currentScene}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "text-2xl sm:text-3xl md:text-5xl font-black text-gray-800 leading-tight md:leading-relaxed min-h-[3rem] sm:min-h-[4rem] transition-colors duration-500",
              isSpeaking ? "text-[#6366F1]" : "text-gray-800"
            )}
          >
            {scenes[currentScene]?.text || ""}
          </motion.div>
        </div>

        <div className="flex items-center justify-between w-full mt-6 sm:mt-8 gap-2 sm:gap-4 max-w-4xl">
           <Button
            variant="ghost"
            onClick={handlePrev}
            disabled={currentScene === 0}
            className="text-gray-400 hover:text-[#6366F1] font-bold gap-2 text-sm sm:text-base px-2 sm:px-4"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="hidden sm:inline">السابق</span>
            <span className="sm:hidden">سابق</span>
          </Button>

          <div className="flex gap-1 sm:gap-2">
            {scenes.map((_, i) => (
              <div 
                key={i} 
                className={cn(
                  "h-1 sm:h-1.5 rounded-full transition-all duration-300",
                  i === currentScene ? "bg-[#6366F1] w-6 sm:w-8" : "bg-gray-200 w-2"
                )}
              />
            ))}
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleRestart}
            className="text-gray-400 hover:text-[#6366F1]"
            aria-label="إعادة القصة"
          >
            <RotateCcw className="w-5 h-5 sm:w-6 sm:h-6" />
          </Button>

          <Button
            variant="ghost"
            onClick={handleNext}
            className="text-[#6366F1] font-bold gap-2 text-sm sm:text-base px-2 sm:px-4"
          >
            {isLastScene ? "انتهى" : "التالي"}
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function getEmojiForScene(text: string): string {
  if (text.includes("مريم")) return "👧";
  if (text.includes("يوسف")) return "👦";
  if (text.includes("دراجة")) return "🚲";
  if (text.includes("متجر")) return "🏪";
  if (text.includes("حديقة")) return "🌳";
  if (text.includes("أميرة")) return "👸";
  if (text.includes("أسرة")) return "👨‍👩‍👧";
  if (text.includes("أسد")) return "🦁";
  if (text.includes("أرنب")) return "🐰";
  if (text.includes("نملة")) return "🐜";
  if (text.includes("مدرسة")) return "🏫";
  if (text.includes("معلمة")) return "👩‍🏫";
  if (text.includes("زهرة")) return "🌸";
  return "📖";
}
