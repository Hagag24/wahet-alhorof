import { lessons } from "@/data/lessons";
import { StoryPageClient } from "./story-page-client";

export function generateStaticParams() {
  return lessons.map((lesson) => ({
    lessonId: lesson.id,
  }));
}

export default async function StoryPage({ params }: { params: Promise<{ lessonId: string }> }) {
  const { lessonId } = await params;
  return <StoryPageClient lessonId={lessonId} />;
}
