"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ResultScreen } from "@/components/screens/result-screen";
import { useApp } from "@/contexts/app-context";
import { lessons } from "@/data/lessons";

export default function ResultPage() {
  const { lessonId } = useParams();
  const { gameResult, navigateTo, startLesson } = useApp();
  const router = useRouter();
  
  const lesson = lessons.find(l => l.id === lessonId);

  useEffect(() => {
    if (!lesson || !gameResult) {
      router.replace(`/lessons/${lessonId || 'lesson-1'}`);
    }
  }, [lesson, gameResult, router, lessonId]);

  if (!lesson || !gameResult) return null;

  const handleNext = () => {
    const currentIndex = lessons.findIndex(l => l.id === lesson.id);
    const nextLesson = lessons[currentIndex + 1];
    if (nextLesson) {
      startLesson(nextLesson);
    } else {
      router.push("/learning-map");
    }
  };

  return (
    <ResultScreen 
      result={gameResult}
      lessonId={lesson.id}
      onRetry={() => router.push(`/lessons/${lessonId}/game/0`)}
      onNext={handleNext}
      onBackToMap={() => router.push("/learning-map")}
    />
  );
}
