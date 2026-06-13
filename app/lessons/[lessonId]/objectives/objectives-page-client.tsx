"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { lessons } from "@/data/lessons";
import { getInteractiveObjectivesForLesson } from "@/data/interactive-objectives";
import {
  getInteractiveStageHref,
  getOfficialInteractiveLessonPlan,
  getOfficialInteractiveVisibleStages,
} from "@/data/interactive-lesson-plan";
import {
  InteractiveObjectivesGame,
  InteractiveLessonRoadmap,
  LessonExperienceShell,
  type LessonStageId,
} from "@/components/lesson-experience";

type ObjectivesPageClientProps = {
  lessonId: string;
};

export function ObjectivesPageClient({ lessonId }: ObjectivesPageClientProps) {
  const router = useRouter();

  const lesson = useMemo(() => {
    return lessons.find((item) => item.id === lessonId);
  }, [lessonId]);

  const objectives = useMemo(() => {
    return getInteractiveObjectivesForLesson(lessonId);
  }, [lessonId]);

  const lessonPlanStages = useMemo(() => {
    return getOfficialInteractiveLessonPlan(lessonId);
  }, [lessonId]);

  const lessonTitle = lesson?.title ?? "هيا نتعلم يا جدي";
  const lessonSubtitle = lesson?.description ?? "خريطة أهداف صوتية تفاعلية";
  const voiceGender = lessonId === "lesson-1" ? "male" : lessonId === "lesson-2" ? "female" : "male";

  function handleStageChange(stage: LessonStageId) {
    router.push(getInteractiveStageHref(lessonId, stage));
  }

  function handleComplete() {
    router.push(`/lessons/${lessonId}/intro-game-preview/`);
  }

  return (
    <LessonExperienceShell
      title={`🗺️ ${lessonTitle}`}
      subtitle={lessonSubtitle}
      activeStage="objectives"
      stars={objectives.length}
      onStageChange={handleStageChange}
      visibleStages={getOfficialInteractiveVisibleStages()}
    >
      <InteractiveLessonRoadmap
        stages={lessonPlanStages}
        activeStage="objectives"
        onStageClick={handleStageChange}
      />
      <InteractiveObjectivesGame
        lessonTitle={lessonTitle}
        title="خريطة أهداف الدرس"
        subtitle="اضغط على كل محطة، اسمع الهدف، واجمع نجوم الرحلة قبل الانتقال."
        objectives={objectives}
        completeLabel="إلى التمهيد 🎁⬅️"
        onComplete={handleComplete}
        defaultVoiceGender={voiceGender}
      />
    </LessonExperienceShell>
  );
}

export default ObjectivesPageClient;
