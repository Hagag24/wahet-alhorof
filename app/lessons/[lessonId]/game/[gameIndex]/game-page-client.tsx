"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { GameRouter } from "@/components/games/game-router";
import { useApp } from "@/contexts/app-context";
import { lessons } from "@/data/lessons";
import { useGameProgress } from "@/hooks/use-game-progress";
import { calculateMastery, shouldAdvanceToNextInternalLevel } from "@/lib/game-rules";
import type { GameResult } from "@/types";

export function GamePageClient({ lessonId, gameIndex }: { lessonId: string; gameIndex: string }) {
  const { finishGame } = useApp();
  const { recordGameAttempt, isGameUnlocked } = useGameProgress();
  const router = useRouter();
  
  const lesson = lessons.find(l => l.id === lessonId);
  const idx = parseInt(gameIndex) || 0;
  const visibleGames = lesson?.games.filter((game) => !game.hidden) || [];

  useEffect(() => {
    if (!lesson) {
      router.replace("/dashboard");
      return;
    }

    if (!isGameUnlocked(lesson.id, idx)) {
      router.replace(`/lessons/${lesson.id}`);
    }
  }, [idx, isGameUnlocked, lesson, router]);

  if (!lesson || !visibleGames[idx]) return null;

  const handleGameComplete = (result: GameResult) => {
    recordGameAttempt(result);
    
    const nextIdx = idx + 1;
    const mastery = calculateMastery(result.correctAnswers, result.totalQuestions);

    if (shouldAdvanceToNextInternalLevel(mastery, nextIdx, visibleGames.length)) {
      router.push(`/lessons/${lessonId}/game/${nextIdx}`);
    } else {
      finishGame(result);
      router.push(`/lessons/${lessonId}/result`);
    }
  };

  return (
    <GameRouter 
      lesson={{ ...lesson, games: visibleGames }}
      gameIndex={idx}
      onGameComplete={handleGameComplete}
      onBack={() => router.push(`/lessons/${lessonId}`)}
    />
  );
}
