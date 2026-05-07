"use client";

import { CharacterSelectScreen } from "@/components/screens/character-select-screen";
import { useApp } from "@/contexts/app-context";

export default function CharacterSelectPage() {
  const { selectCharacter } = useApp();
  return <CharacterSelectScreen onSelect={selectCharacter} />;
}
