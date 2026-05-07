"use client";

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { useRouter, usePathname, useParams } from "next/navigation";
import type { Character, GameResult, Lesson } from "@/types";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { lessons as lessonsData } from "@/data/lessons";

export type Screen = 
  | "splash"
  | "character-select"
  | "dashboard"
  | "learning-map"
  | "lesson-hub"
  | "story-player"
  | "game"
  | "result"
  | "rewards"
  | "parent-dashboard"
  | "teacher-dashboard";

interface AppState {
  currentScreen: Screen;
  selectedCharacter: Character | null;
  currentLesson: Lesson | null;
  currentGameIndex: number;
  gameResult: GameResult | null;
  soundEnabled: boolean;
}

interface AppContextValue extends AppState {
  navigateTo: (screen: Screen) => void;
  selectCharacter: (character: Character) => void;
  startLesson: (lesson: Lesson) => void;
  nextGame: () => void;
  finishGame: (result: GameResult) => void;
  toggleSound: () => void;
  resetApp: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

const initialState: AppState = {
  currentScreen: "splash",
  selectedCharacter: null,
  currentLesson: null,
  currentGameIndex: 0,
  gameResult: null,
  soundEnabled: true,
};

export function AppProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const { value: savedCharacter, setValue: setSavedCharacter } = useLocalStorage<Character | null>("selected-character", null);
  const { value: savedSoundEnabled, setValue: setSoundEnabled } = useLocalStorage<boolean>("sound-enabled", true);
  
  const [state, setState] = useState<AppState>({
    ...initialState,
    selectedCharacter: null,
    soundEnabled: true,
  });

  // Sync state with URL and LocalStorage
  useEffect(() => {
    if (savedCharacter && !state.selectedCharacter) {
      setState(prev => ({ ...prev, selectedCharacter: savedCharacter }));
    }
  }, [savedCharacter, state.selectedCharacter]);

  useEffect(() => {
    setState(prev => ({
      ...prev,
      soundEnabled: savedSoundEnabled,
    }));
  }, [savedSoundEnabled]);

  // Sync state with URL
  useEffect(() => {
    if (pathname.startsWith("/lessons/")) {
      const parts = pathname.split("/");
      const lessonId = parts[2];
      const lesson = lessonsData.find(l => l.id === lessonId);
      
      if (lesson) {
        let gameIndex = 0;
        let screen: Screen = "lesson-hub";

        if (parts[3] === "story") {
          screen = "story-player";
        } else if (parts[3] === "game") {
          gameIndex = parseInt(parts[4]) || 0;
          screen = "game";
        } else if (parts[3] === "result") {
          screen = "result";
        }

        setState(prev => ({
          ...prev,
          currentLesson: lesson,
          currentGameIndex: gameIndex,
          currentScreen: screen
        }));
      }
    } else if (pathname === "/dashboard") {
      setState(prev => ({ ...prev, currentScreen: "dashboard" }));
    } else if (pathname === "/learning-map") {
      setState(prev => ({ ...prev, currentScreen: "learning-map" }));
    } else if (pathname === "/rewards") {
      setState(prev => ({ ...prev, currentScreen: "rewards" }));
    } else if (pathname === "/character-select") {
      setState(prev => ({ ...prev, currentScreen: "character-select" }));
    }
  }, [pathname]);

  const navigateTo = useCallback((screen: Screen) => {
    const routes: Record<Screen, string> = {
      "splash": "/",
      "character-select": "/character-select",
      "dashboard": "/dashboard",
      "learning-map": "/learning-map",
      "lesson-hub": "/lesson-hub", // Will be handled by startLesson
      "story-player": "/story-player",
      "game": "/game",
      "result": "/result",
      "rewards": "/rewards",
      "parent-dashboard": "/parent",
      "teacher-dashboard": "/teacher",
    };
    
    router.push(routes[screen] || "/");
    setState(prev => ({ ...prev, currentScreen: screen }));
  }, [router, state.currentGameIndex, state.currentLesson]);

  const selectCharacter = useCallback((character: Character) => {
    setSavedCharacter(character);
    setState(prev => ({
      ...prev,
      selectedCharacter: character,
      currentScreen: "dashboard",
    }));
    router.push("/dashboard");
  }, [setSavedCharacter, router]);

  const startLesson = useCallback((lesson: Lesson) => {
    setState(prev => ({
      ...prev,
      currentLesson: lesson,
      currentGameIndex: 0,
      gameResult: null,
      currentScreen: "lesson-hub",
    }));
    router.push(`/lessons/${lesson.id}`);
  }, [router]);

  const nextGame = useCallback(() => {
    if (!state.currentLesson) return;

    const nextIndex = state.currentGameIndex + 1;
    const totalGames = state.currentLesson.games.length;

    if (nextIndex >= totalGames) {
      setState(prev => ({ ...prev, currentScreen: "result" }));
      router.push(`/lessons/${state.currentLesson.id}/result`);
      return;
    }

    setState(prev => ({
      ...prev,
      currentGameIndex: nextIndex,
      currentScreen: "game",
    }));
    router.push(`/lessons/${state.currentLesson.id}/game/${nextIndex}`);
  }, [router]);

  const finishGame = useCallback((result: GameResult) => {
    const lessonId = state.currentLesson?.id;

    setState(prev => ({
      ...prev,
      gameResult: result,
      currentScreen: "result",
    }));

    if (lessonId) {
      router.push(`/lessons/${lessonId}/result`);
    }
  }, [router, state.currentLesson]);

  const toggleSound = useCallback(() => {
    setSoundEnabled(!state.soundEnabled);
    setState(prev => ({ ...prev, soundEnabled: !prev.soundEnabled }));
  }, [setSoundEnabled, state.soundEnabled]);

  const resetApp = useCallback(() => {
    setSavedCharacter(null);
    setState({
      ...initialState,
      soundEnabled: state.soundEnabled,
    });
    router.push("/");
  }, [setSavedCharacter, state.soundEnabled, router]);

  const value: AppContextValue = {
    ...state,
    navigateTo,
    selectCharacter,
    startLesson,
    nextGame,
    finishGame,
    toggleSound,
    resetApp,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
