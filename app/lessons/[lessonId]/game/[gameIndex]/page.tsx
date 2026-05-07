"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { GameRouter } from "@/components/games/game-router";
import { useApp } from "@/contexts/app-context";
import { lessons } from "@/data/lessons";
import { useGameProgress } from "@/hooks/use-game-progress";
import type { GameResult } from "@/types";

export default function GamePage() {
  const { lessonId, gameIndex } = useParams();
  const { finishGame } = useApp();
  const { completeLesson } = useGameProgress();
  const router = useRouter();
  
  const lesson = lessons.find(l => l.id === lessonId);
  const idx = parseInt(gameIndex as string) || 0;

  useEffect(() => {
    if (!lesson) {
      router.replace("/dashboard");
    }
  }, [lesson, router]);

  if (!lesson) return null;

  const handleGameComplete = (result: GameResult) => {
    // Save progress
    completeLesson(lesson.id, result.stars);
    
    const nextIdx = idx + 1;
    if (nextIdx < lesson.games.length) {
      router.push(`/lessons/${lessonId}/game/${nextIdx}`);
    } else {
      finishGame(result);
      router.push(`/lessons/${lessonId}/result`);
    }
  };

  return (
    <GameRouter 
      lesson={lesson}
      gameIndex={idx}
      onGameComplete={handleGameComplete}
      onBack={() => router.push(`/lessons/${lessonId}`)}
    />
  );
}
