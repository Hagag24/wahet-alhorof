"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { StoryPlayer } from "@/components/screens/story-player";
import { lessons } from "@/data/lessons";

export function StoryPageClient({ lessonId }: { lessonId: string }) {
  const router = useRouter();
  
  const lesson = lessons.find(l => l.id === lessonId);

  useEffect(() => {
    if (!lesson) {
      router.replace("/dashboard");
    }
  }, [lesson, router]);

  if (!lesson) return null;

  return (
    <StoryPlayer 
      story={lesson}
      onComplete={() => router.push(`/lessons/${lessonId}/game/0`)}
      onSkip={() => router.push(`/lessons/${lessonId}/game/0`)}
    />
  );
}
