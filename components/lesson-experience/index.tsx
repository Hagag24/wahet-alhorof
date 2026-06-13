'use client'

/**
 * Lesson experience components
 */

export type LessonStageId = 'intro' | 'objectives' | 'story' | 'games' | 'results'

export interface InteractiveObjectivesGameProps {
  lessonId: string
  objectives: string[]
  voiceGender?: 'male' | 'female'
  onComplete?: () => void
}

export function InteractiveObjectivesGame({
  lessonId,
  objectives,
  voiceGender = 'male',
  onComplete,
}: InteractiveObjectivesGameProps) {
  return (
    <div className="p-8 rounded-lg bg-primary/5">
      <h2 className="text-2xl font-bold mb-4">أهداف الدرس</h2>
      <ul className="space-y-2">
        {objectives.map((obj, idx) => (
          <li key={idx} className="flex items-start gap-3">
            <span className="text-primary font-bold">•</span>
            <span>{obj}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export interface InteractiveLessonRoadmapProps {
  lessonId: string
  currentStage: LessonStageId
  stages: LessonStageId[]
  onStageChange?: (stage: LessonStageId) => void
}

export function InteractiveLessonRoadmap({
  lessonId,
  currentStage,
  stages,
  onStageChange,
}: InteractiveLessonRoadmapProps) {
  return (
    <div className="flex gap-4 mb-8">
      {stages.map((stage) => (
        <button
          key={stage}
          onClick={() => onStageChange?.(stage)}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
            currentStage === stage
              ? 'bg-primary text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {stage}
        </button>
      ))}
    </div>
  )
}

export interface LessonExperienceShellProps {
  lessonId: string
  title: string
  subtitle?: string
  children: React.ReactNode
}

export function LessonExperienceShell({
  lessonId,
  title,
  subtitle,
  children,
}: LessonExperienceShellProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 to-background">
      <div className="max-w-4xl mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">{title}</h1>
          {subtitle && <p className="text-lg text-gray-600">{subtitle}</p>}
        </div>
        {children}
      </div>
    </div>
  )
}
