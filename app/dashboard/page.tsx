"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { KidsDashboard } from "@/components/screens/kids-dashboard";
import { useApp } from "@/contexts/app-context";

export default function DashboardPage() {
  const { selectedCharacter, navigateTo, startLesson } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (!selectedCharacter) {
      router.replace("/character-select");
    }
  }, [selectedCharacter, router]);

  if (!selectedCharacter) return null;

  return (
    <KidsDashboard 
      character={selectedCharacter}
      onNavigate={navigateTo}
      onStartLesson={startLesson}
    />
  );
}
