"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { LessonHub } from "@/components/screens/lesson-hub";
import { useApp } from "@/contexts/app-context";
import { lessons } from "@/data/lessons";
import { getInteractiveExperienceEntryHref } from "@/data/interactive-experience";

export function LessonHubPageClient({ lessonId }: { lessonId: string }) {
  const { navigateTo, startLesson } = useApp();
  const router = useRouter();
  
  const lesson = lessons.find(l => l.id === lessonId);

  const interactiveEntryHref = useMemo(() => {
    return getInteractiveExperienceEntryHref(lessonId);
  }, [lessonId]);

  useEffect(() => {
    if (!lesson) {
      router.replace("/dashboard");
    }
  }, [lesson, router]);

  if (!lesson) return null;

  const startStoryHref = interactiveEntryHref ?? `/lessons/${lessonId}/story`;

  return (
    <LessonHub 
      lesson={lesson}
      onBack={() => navigateTo("learning-map")}
      onStartStory={() => router.push(startStoryHref)}
      onStartGame={(index) => router.push(`/lessons/${lessonId}/game/${index}`)}
    />
  );
}
