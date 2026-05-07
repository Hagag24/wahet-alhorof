"use client";

import { SplashScreen } from "@/components/screens/splash-screen";
import { useApp } from "@/contexts/app-context";

export default function Home() {
  const { selectedCharacter, navigateTo } = useApp();

  const handleComplete = () => {
    if (selectedCharacter) {
      navigateTo("dashboard");
    } else {
      navigateTo("character-select");
    }
  };

  return <SplashScreen onComplete={handleComplete} />;
}
