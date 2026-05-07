export type FeedbackKind = "correct" | "wrong";

export interface FeedbackConfig {
  fallbackText: string;
  clips: string[];
}

export const feedbackAudioConfig: Record<FeedbackKind, FeedbackConfig> = {
  correct: {
    fallbackText: "أحسنت يا بطل",
    clips: [
      "/audio/words/word-044.mp3", // رائع
      "/audio/words/word-045.mp3", // ممتاز
      "/audio/words/word-046.mp3", // أحسنت يا بطل
    ],
  },
  wrong: {
    fallbackText: "حاول مرة أخرى",
    clips: ["/audio/words/word-047.mp3"],
  },
};

