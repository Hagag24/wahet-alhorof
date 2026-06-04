import { lessons } from "@/data/lessons";
import { LessonHubPageClient } from "./lesson-hub-page-client";

export function generateStaticParams() {
  return lessons.map((lesson) => ({
    lessonId: lesson.id,
  }));
}

export default async function LessonHubPage({ params }: { params: Promise<{ lessonId: string }> }) {
  const { lessonId } = await params;
  return <LessonHubPageClient lessonId={lessonId} />;
}
