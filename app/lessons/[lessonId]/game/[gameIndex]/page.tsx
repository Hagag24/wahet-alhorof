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

export default function GamePage({ params }: { params: { lessonId: string; gameIndex: string } }) {
  return <GamePageClient lessonId={params.lessonId} gameIndex={params.gameIndex} />;
}
