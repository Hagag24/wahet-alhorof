export const GAME_MASTERY_THRESHOLD = 80

export interface AnswerOutcome {
  correct: boolean
  retrySameQuestion: boolean
  advanceQuestion: boolean
  revealCorrectAnswer: boolean
}

export function evaluateAnswer(answer: string | number, correctAnswer: string | number): AnswerOutcome {
  const correct = String(answer) === String(correctAnswer)

  return {
    correct,
    retrySameQuestion: !correct,
    advanceQuestion: correct,
    revealCorrectAnswer: false,
  }
}

export function calculateMastery(correctAnswers: number, totalQuestions: number): number {
  if (totalQuestions <= 0) return 0
  return Math.round((correctAnswers / totalQuestions) * 100)
}

export function isMastered(mastery: number): boolean {
  return mastery >= GAME_MASTERY_THRESHOLD
}

export function shouldUnlockNextLevel(previousMastery: number): boolean {
  return isMastered(previousMastery)
}

export function shouldAdvanceToNextInternalLevel(
  mastery: number,
  nextIndex: number,
  totalVisibleGames: number
): boolean {
  return nextIndex < totalVisibleGames && isMastered(mastery)
}
