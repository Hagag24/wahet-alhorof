import { lessons } from "@/data/lessons";
import { LessonHubPageClient } from "./lesson-hub-page-client";

export function generateStaticParams() {
  return lessons.map((lesson) => ({
    lessonId: lesson.id,
  }));
}

export default function LessonHubPage({ params }: { params: { lessonId: string } }) {
  return <LessonHubPageClient lessonId={params.lessonId} />;
}
