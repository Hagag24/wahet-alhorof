/**
 * Interactive lesson plan helper.
 * Maps lesson structures and stages.
 */

export function getInteractiveStageHref(lessonId: string, stageId: string): string {
  return `/lessons/${lessonId}/${stageId}`
}

export function getOfficialInteractiveLessonPlan(lessonId: string) {
  // Returns the lesson plan structure
  return {}
}

export function getOfficialInteractiveVisibleStages(lessonId: string) {
  // Returns visible stages for a lesson
  return []
}
