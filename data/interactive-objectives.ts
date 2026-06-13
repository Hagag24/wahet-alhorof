/**
 * Interactive objectives helper.
 * Maps lesson IDs to their learning objectives.
 */

export function getInteractiveObjectivesForLesson(lessonId: string): string[] {
  const objectivesMap: Record<string, string[]> = {
    'lesson-1': [
      'التعرف على أصوات الحروف الهجائية',
      'التمييز بين الأصوات المتشابهة والمختلفة',
      'نطق الحروف بشكل صحيح',
    ],
    'lesson-2': [
      'قراءة كلمات بسيطة',
      'تكوين كلمات من حروف',
      'فهم معاني الكلمات',
    ],
    'lesson-3': [
      'قراءة جمل بسيطة',
      'فهم المعنى الإجمالي',
      'الإجابة عن أسئلة',
    ],
    'lesson-4': [
      'قراءة نصوص قصيرة',
      'استخراج المعلومات الأساسية',
      'التعبير عن الفهم',
    ],
  }
  return objectivesMap[lessonId] || []
}

