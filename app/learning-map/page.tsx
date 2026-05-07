"use client";

import { LearningMap } from "@/components/screens/learning-map";
import { useApp } from "@/contexts/app-context";
import { useGameProgress } from "@/hooks/use-game-progress";

export default function LearningMapPage() {
  const { navigateTo, startLesson } = useApp();
  const { progress } = useGameProgress();

  return (
    <LearningMap 
      onBack={() => navigateTo("dashboard")}
      onSelectLesson={startLesson}
      progress={progress}
    />
  );
}
