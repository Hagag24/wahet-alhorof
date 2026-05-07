"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { StoryPlayer } from "@/components/screens/story-player";
import { lessons } from "@/data/lessons";

export default function StoryPage() {
  const { lessonId } = useParams();
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
