"use client";

import { useCallback } from "react";
import { useLocalStorage } from "./use-local-storage";
import type { UserProgress, LessonProgress, Badge, GameResult, Character } from "@/types";
import { badges as allBadges } from "@/data/rewards";
import { lessons } from "@/data/lessons";
import { calculateMastery, shouldUnlockNextLevel } from "@/lib/game-rules";

const getVisibleGames = (lessonId: string) => {
  const lesson = lessons.find((l) => l.id === lessonId);
  return lesson?.games.filter((game) => !game.hidden) || [];
};

// Helper to create initial progress for all lessons
const createInitialLessonsProgress = (): Record<string, LessonProgress> => {
  const progressObj: Record<string, LessonProgress> = {};
  lessons.forEach((lesson) => {
    progressObj[lesson.id] = {
      lessonId: lesson.id,
      completed: false,
      stars: 0,
      gamesCompleted: [],
      bestScore: 0,
      lastAttempt: "",
    };
  });
  return progressObj;
};

const initialProgress: UserProgress = {
  selectedCharacter: null,
  studentName: "طالب",
  totalStars: 0,
  lessonsProgress: createInitialLessonsProgress(),
  gameMastery: {},
  currentLevel: 1,
  lastPlayedAt: "",
};

export function useGameProgress() {
  const { value: progress, setValue: setProgress, isLoaded } = useLocalStorage<UserProgress>(
    "phonemic-awareness-progress",
    initialProgress
  );

  const getGameMastery = useCallback((lessonId: string, gameId: string): number => {
    return progress.gameMastery[lessonId]?.[gameId] || 0;
  }, [progress.gameMastery]);

  const isGameUnlocked = useCallback((lessonId: string, gameIndex: number): boolean => {
    const visibleGames = getVisibleGames(lessonId);
    if (gameIndex <= 0) return true;
    if (gameIndex >= visibleGames.length) return false;

    const previousGameId = visibleGames[gameIndex - 1]?.id;
    if (!previousGameId) return false;
    return shouldUnlockNextLevel(getGameMastery(lessonId, previousGameId));
  }, [getGameMastery]);

  const recordGameAttempt = useCallback((result: GameResult) => {
    const mastery = calculateMastery(result.correctAnswers, result.totalQuestions);

    setProgress((prev) => {
      const currentLessonProgress = prev.lessonsProgress[result.lessonId] || {
        lessonId: result.lessonId,
        completed: false,
        stars: 0,
        gamesCompleted: [],
        bestScore: 0,
        lastAttempt: "",
      };

      const prevMastery = prev.gameMastery[result.lessonId]?.[result.gameId] || 0;
      const mergedMastery = Math.max(prevMastery, mastery);

      const oldMastered = currentLessonProgress.gamesCompleted.includes(result.gameId);
      const newMastered = shouldUnlockNextLevel(mergedMastery);

      const updatedGamesCompleted = newMastered && !oldMastered
        ? [...currentLessonProgress.gamesCompleted, result.gameId]
        : currentLessonProgress.gamesCompleted;

      const visibleGames = getVisibleGames(result.lessonId);
      const totalGames = visibleGames.length || 1;
      const isLessonCompleted = updatedGamesCompleted.length >= totalGames;

      const starsGain = newMastered && !oldMastered ? result.stars : 0;
      const newStars = currentLessonProgress.stars + starsGain;
      const newBestScore = Math.max(currentLessonProgress.bestScore, result.score);

      const updatedLessonProgress: LessonProgress = {
        ...currentLessonProgress,
        gamesCompleted: updatedGamesCompleted,
        stars: newStars,
        bestScore: newBestScore,
        completed: isLessonCompleted,
        lastAttempt: new Date().toISOString(),
      };

      const newTotalStars = prev.totalStars + starsGain;
      const newLevel = Math.floor(newTotalStars / 10) + 1;

      return {
        ...prev,
        gameMastery: {
          ...prev.gameMastery,
          [result.lessonId]: {
            ...(prev.gameMastery[result.lessonId] || {}),
            [result.gameId]: mergedMastery,
          },
        },
        lessonsProgress: {
          ...prev.lessonsProgress,
          [result.lessonId]: updatedLessonProgress,
        },
        totalStars: newTotalStars,
        currentLevel: newLevel,
        lastPlayedAt: new Date().toISOString(),
      };
    });
  }, [setProgress]);

  // Select character
  const selectCharacter = useCallback((character: Character) => {
    setProgress((prev) => ({
      ...prev,
      selectedCharacter: character,
    }));
  }, [setProgress]);

  // Update student name
  const updateStudentName = useCallback((name: string) => {
    setProgress((prev) => ({
      ...prev,
      studentName: name,
    }));
  }, [setProgress]);

  // Mark story as completed
  const completeStory = useCallback((lessonId: string) => {
    setProgress((prev) => {
      const currentLessonProgress = prev.lessonsProgress[lessonId] || {
        lessonId,
        completed: false,
        stars: 0,
        gamesCompleted: [],
        bestScore: 0,
        lastAttempt: "",
      };

      return {
        ...prev,
        lessonsProgress: {
          ...prev.lessonsProgress,
          [lessonId]: {
            ...currentLessonProgress,
            lastAttempt: new Date().toISOString(),
          },
        },
        lastPlayedAt: new Date().toISOString(),
      };
    });
  }, [setProgress]);

  // Complete a game
  const completeGame = useCallback((result: GameResult) => {
    setProgress((prev) => {
      const currentLessonProgress = prev.lessonsProgress[result.lessonId] || {
        lessonId: result.lessonId,
        completed: false,
        stars: 0,
        gamesCompleted: [],
        bestScore: 0,
        lastAttempt: "",
      };

      const updatedGamesCompleted = currentLessonProgress.gamesCompleted.includes(result.gameId)
        ? currentLessonProgress.gamesCompleted
        : [...currentLessonProgress.gamesCompleted, result.gameId];

      // Calculate lesson completion
      const totalGames = getVisibleGames(result.lessonId).length || 1;
      const isLessonCompleted = updatedGamesCompleted.length >= totalGames;

      const newStars = currentLessonProgress.stars + result.stars;
      const newBestScore = Math.max(currentLessonProgress.bestScore, result.score);

      const updatedLessonProgress: LessonProgress = {
        ...currentLessonProgress,
        gamesCompleted: updatedGamesCompleted,
        stars: newStars,
        bestScore: newBestScore,
        completed: isLessonCompleted,
        lastAttempt: new Date().toISOString(),
      };

      // Calculate new total stars
      const newTotalStars = prev.totalStars + result.stars;

      // Calculate new level based on total stars
      const newLevel = Math.floor(newTotalStars / 10) + 1;

      return {
        ...prev,
        lessonsProgress: {
          ...prev.lessonsProgress,
          [result.lessonId]: updatedLessonProgress,
        },
        totalStars: newTotalStars,
        currentLevel: newLevel,
        lastPlayedAt: new Date().toISOString(),
      };
    });
  }, [setProgress]);

  // Get lesson progress
  const getLessonProgress = useCallback((lessonId: string): LessonProgress | undefined => {
    return progress.lessonsProgress[lessonId];
  }, [progress.lessonsProgress]);

  // Get earned badges
  const getEarnedBadges = useCallback((): Badge[] => {
    const earned: Badge[] = [];
    
    // First star badge
    if (progress.totalStars >= 1) {
      const badge = allBadges.find((b) => b.id === "first-star");
      if (badge) earned.push(badge);
    }

    // Ten stars badge
    if (progress.totalStars >= 10) {
      const badge = allBadges.find((b) => b.id === "ten-stars");
      if (badge) earned.push(badge);
    }

    // All lessons completed
    const allCompleted = Object.values(progress.lessonsProgress).every((lp) => lp.completed);
    if (allCompleted) {
      const badge = allBadges.find((b) => b.id === "awareness-champion");
      if (badge) earned.push(badge);
    }

    return earned;
  }, [progress.totalStars, progress.lessonsProgress]);

  // Complete a lesson (simplified version for compatibility)
  const completeLesson = useCallback((lessonId: string, stars: number) => {
    setProgress((prev) => {
      const currentLessonProgress = prev.lessonsProgress[lessonId] || {
        lessonId,
        completed: false,
        stars: 0,
        gamesCompleted: [],
        bestScore: 0,
        lastAttempt: "",
      };

      const newStars = Math.max(currentLessonProgress.stars, stars);
      const starsDiff = newStars - currentLessonProgress.stars;

      return {
        ...prev,
        lessonsProgress: {
          ...prev.lessonsProgress,
          [lessonId]: {
            ...currentLessonProgress,
            completed: true,
            stars: newStars,
            lastAttempt: new Date().toISOString(),
          },
        },
        totalStars: prev.totalStars + starsDiff,
        lastPlayedAt: new Date().toISOString(),
      };
    });
  }, [setProgress]);

  // Unlock a reward
  const unlockReward = useCallback((badgeId: string) => {
    // This is handled by getEarnedBadges based on progress
  }, []);

  // Reset progress
  const resetProgress = useCallback(() => {
    setProgress(initialProgress);
  }, [setProgress]);

  // Calculate overall progress percentage
  const lessonValues = Object.values(progress.lessonsProgress);
  const overallProgress = lessonValues.length > 0
    ? Math.round(
        (lessonValues.filter((lp) => lp.completed).length / lessonValues.length) * 100
      )
    : 0;

  // Calculate derived values
  const totalStars = progress.totalStars;
  const completedLessons = lessonValues.filter((lp) => lp.completed).length;
  const unlockedRewards = getEarnedBadges();

  return {
    progress: progress.lessonsProgress,
    gameMastery: progress.gameMastery,
    isLoaded,
    selectCharacter,
    updateStudentName,
    completeStory,
    completeGame,
    recordGameAttempt,
    completeLesson,
    getGameMastery,
    isGameUnlocked,
    getLessonProgress,
    getEarnedBadges,
    unlockReward,
    resetProgress,
    overallProgress,
    totalStars,
    completedLessons,
    unlockedRewards,
  };
}
