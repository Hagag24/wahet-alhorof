/**
 * Interactive experience routing helper.
 * Maps lesson IDs to their interactive experience entry points.
 */

export function getInteractiveExperienceEntryHref(lessonId: string): string {
  // Map lesson IDs to their experience paths
  const experienceMap: Record<string, string> = {
    'lesson-1': '/lessons/lesson-1/story',
    'lesson-2': '/lessons/lesson-2/story',
    'lesson-3': '/lessons/lesson-3/story',
    'lesson-4': '/lessons/lesson-4/story',
  }

  return experienceMap[lessonId] || `/lessons/${lessonId}/story`
}
