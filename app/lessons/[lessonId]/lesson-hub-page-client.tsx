"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LessonHub } from "@/components/screens/lesson-hub";
import { useApp } from "@/contexts/app-context";
import { lessons } from "@/data/lessons";

export function LessonHubPageClient({ lessonId }: { lessonId: string }) {
  const { navigateTo, startLesson } = useApp();
  const router = useRouter();
  
  const lesson = lessons.find(l => l.id === lessonId);

  useEffect(() => {
    if (!lesson) {
      router.replace("/dashboard");
    }
  }, [lesson, router]);

  if (!lesson) return null;

  return (
    <LessonHub 
      lesson={lesson}
      onBack={() => navigateTo("learning-map")}
      onStartStory={() => router.push(`/lessons/${lessonId}/story`)}
      onStartGame={(index) => router.push(`/lessons/${lessonId}/game/${index}`)}
    />
  );
}
