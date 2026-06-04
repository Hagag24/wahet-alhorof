import { lessons } from "@/data/lessons";
import { GamePageClient } from "./game-page-client";

export function generateStaticParams() {
  return lessons.flatMap((lesson) =>
    lesson.games
      .filter((game) => !game.hidden)
      .map((game, index) => ({
        lessonId: lesson.id,
        gameIndex: String(index),
      }))
  );
}

export default async function GamePage({ params }: { params: Promise<{ lessonId: string; gameIndex: string }> }) {
  const { lessonId, gameIndex } = await params;
  return <GamePageClient lessonId={lessonId} gameIndex={gameIndex} />;
}
