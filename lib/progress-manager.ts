'use client'

import { GameResult } from '@/types'
import { calculateMastery, GAME_MASTERY_THRESHOLD } from '@/lib/game-rules'

/**
 * ProgressManager — Manage lesson progress and level unlocking via localStorage.
 * 
 * Key behaviors:
 * - Stores progress per lesson (game scores, mastery percentage)
 * - Enforces 80% mastery before unlocking the next level
 * - Prevents direct URL access to locked levels
 * - Provides progress queries and updates
 */

export interface LessonProgress {
  lessonId: string
  gamesCompleted: number[]
  totalScore: number
  gamesAttempted: number
  mastery: number
  completedAt?: string
  unlocked: boolean
}

const PROGRESS_STORAGE_KEY = 'wahet_alhorof_progress'

export class ProgressManager {
  /**
   * Get current progress for a lesson.
   */
  static getProgress(lessonId: string): LessonProgress {
    if (typeof window === 'undefined') {
      return {
        lessonId,
        gamesCompleted: [],
        totalScore: 0,
        gamesAttempted: 0,
        mastery: 0,
        unlocked: false,
      }
    }

    const stored = localStorage.getItem(PROGRESS_STORAGE_KEY)
    if (!stored) return this.createEmptyProgress(lessonId)

    try {
      const data = JSON.parse(stored)
      return data[lessonId] || this.createEmptyProgress(lessonId)
    } catch {
      return this.createEmptyProgress(lessonId)
    }
  }

  /**
   * Update progress after a game is completed.
   */
  static recordGameResult(result: GameResult): LessonProgress {
    if (typeof window === 'undefined') return this.getProgress(result.lessonId)

    const stored = localStorage.getItem(PROGRESS_STORAGE_KEY)
    const data = stored ? JSON.parse(stored) : {}

    const current = data[result.lessonId] || this.createEmptyProgress(result.lessonId)

    // Track this game as completed
    if (!current.gamesCompleted.includes(result.gameId)) {
      current.gamesCompleted.push(result.gameId)
    }

    current.gamesAttempted++
    current.totalScore += result.score
    current.mastery = Math.round(current.totalScore / current.gamesAttempted)

    if (result.score >= 80) {
      current.completedAt = new Date().toISOString()
    }

    data[result.lessonId] = current

    localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(data))

    if (process.env.NODE_ENV === 'development') {
      console.log(`[Progress] Lesson ${result.lessonId} mastery updated to ${current.mastery}%`)
    }

    return current
  }

  /**
   * Check if a lesson is unlocked.
   * First lesson is always unlocked. Others require 80% mastery on previous lesson.
   */
  static isLessonUnlocked(lessonId: string, allLessons: { id: string }[]): boolean {
    const lessonIndex = allLessons.findIndex((l) => l.id === lessonId)

    // First lesson is always unlocked
    if (lessonIndex === 0) return true

    // Check if previous lesson is mastered
    const previousLesson = allLessons[lessonIndex - 1]
    if (!previousLesson) return true

    const previousProgress = this.getProgress(previousLesson.id)
    return previousProgress.mastery >= GAME_MASTERY_THRESHOLD
  }

  /**
   * Check if all games in a lesson are mastered.
   */
  static isLessonMastered(lessonId: string): boolean {
    const progress = this.getProgress(lessonId)
    return progress.mastery >= GAME_MASTERY_THRESHOLD
  }

  /**
   * Reset all progress (mainly for testing/debugging).
   */
  static resetAll(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(PROGRESS_STORAGE_KEY)
      if (process.env.NODE_ENV === 'development') {
        console.log('[Progress] All progress cleared')
      }
    }
  }

  /**
   * Reset progress for a specific lesson.
   */
  static resetLesson(lessonId: string): void {
    if (typeof window === 'undefined') return

    const stored = localStorage.getItem(PROGRESS_STORAGE_KEY)
    if (!stored) return

    const data = JSON.parse(stored)
    delete data[lessonId]

    localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(data))

    if (process.env.NODE_ENV === 'development') {
      console.log(`[Progress] Lesson ${lessonId} progress cleared`)
    }
  }

  private static createEmptyProgress(lessonId: string): LessonProgress {
    return {
      lessonId,
      gamesCompleted: [],
      totalScore: 0,
      gamesAttempted: 0,
      mastery: 0,
      unlocked: true, // Default to unlocked; will be validated elsewhere
    }
  }
}
