import { lessons } from "@/data/lessons";
import { ResultPageClient } from "./result-page-client";

export function generateStaticParams() {
  return lessons.map((lesson) => ({
    lessonId: lesson.id,
  }));
}

export default function ResultPage({ params }: { params: { lessonId: string } }) {
  return <ResultPageClient lessonId={params.lessonId} />;
}
