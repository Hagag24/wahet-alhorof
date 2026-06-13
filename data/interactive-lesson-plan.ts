/**
 * Interactive lesson plan helper.
 * Maps lesson structures and stages.
 */

export type LessonStageId = 'intro' | 'objectives' | 'story' | 'games' | 'results'

export function getInteractiveStageHref(lessonId: string, stageId: LessonStageId): string {
  return `/lessons/${lessonId}/${stageId}`
}

export function getOfficialInteractiveLessonPlan(lessonId: string) {
  return {
    stages: ['intro', 'objectives', 'story', 'games', 'results'] as const,
    stageOrder: ['intro', 'objectives', 'story', 'games', 'results'],
  }
}

export function getOfficialInteractiveVisibleStages(lessonId: string): LessonStageId[] {
  return ['intro', 'objectives', 'story', 'games', 'results']
}
