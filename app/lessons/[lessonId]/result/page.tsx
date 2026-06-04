import { lessons } from "@/data/lessons";
import { ResultPageClient } from "./result-page-client";

export function generateStaticParams() {
  return lessons.map((lesson) => ({
    lessonId: lesson.id,
  }));
}

export default async function ResultPage({ params }: { params: Promise<{ lessonId: string }> }) {
  const { lessonId } = await params;
  return <ResultPageClient lessonId={lessonId} />;
}
