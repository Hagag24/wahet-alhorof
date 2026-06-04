import { lessons } from "@/data/lessons";
import { StoryPageClient } from "./story-page-client";

export function generateStaticParams() {
  return lessons.map((lesson) => ({
    lessonId: lesson.id,
  }));
}

export default function StoryPage({ params }: { params: { lessonId: string } }) {
  return <StoryPageClient lessonId={params.lessonId} />;
}
