"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Play, RotateCcw, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FloatingLetters } from "@/components/common/floating-letters";
import { SafeImage } from "@/components/common/safe-image";
import { imageAssets } from "@/lib/image-assets";
import { useTTS } from "@/hooks/use-tts";

interface SplashScreenProps {
  onComplete: () => void;
}

type IntroSceneId =
  | "official-azhar"
  | "official-researcher-book"
  | "official-supervision-board"
  | "welcome-gate"
  | "welcome-skills-island"
  | "welcome-adventure-train";

interface IntroTextBlock {
  title?: string;
  lines: string[];
  emphasis?: boolean;
}

interface IntroScene {
  id: IntroSceneId;
  phase: "official" | "welcome";
  audioKey: string;
  audioPath: string;
  eyebrow: string;
  sceneTitle: string;
  title: string;
  subtitle: string;
  narration: string;
  blocks: IntroTextBlock[];
}

const INTRO_SCENES: IntroScene[] = [
  {
    id: "official-azhar",
    phase: "official",
    audioKey: "official_intro_scene_1",
    audioPath: "/audio/ui/official_intro_scene_1.mp3",
    eyebrow: "منارة العلم واللغة العربية",
    sceneTitle: "واجهة الأزهر الشريف",
    title: "جامعة الأزهر",
    subtitle: "كلية التربية بنين بالقاهرة - قسم المناهج وطرق التدريس",
    narration:
      "مرحبًا بكم في هذا التطبيق التعليمي، المُهدى من جامعة الأزهر الشريف، كلية التربية بنين بالقاهرة، قسم المناهج وطرق التدريس.",
    blocks: [
      {
        lines: [
          "جامعة الأزهر",
          "كلية التربية بنين بالقاهرة",
          "قسم المناهج وطرق التدريس",
        ],
        emphasis: true,
      },
      {
        title: "تحت إشراف",
        lines: [
          "أ.د. خالد فاروق الهواري",
          "د. باسم محمد عبده الجندي",
          "د. أشرف محمد سعد",
        ],
      },
    ],
  },
  {
    id: "official-researcher-book",
    phase: "official",
    audioKey: "official_intro_scene_2",
    audioPath: "/audio/ui/official_intro_scene_2.mp3",
    eyebrow: "كتاب الباحث السحري",
    sceneTitle: "بيانات البحث",
    title: "هذا التطبيق مقدم استكمالًا لمتطلبات الحصول على درجة الماجستير",
    subtitle: "تخصص: مناهج وطرق تدريس اللغة العربية",
    narration:
      "هذا العمل مقدم استكمالًا لمتطلبات الحصول على درجة الماجستير في التربية، تخصص مناهج وطرق تدريس اللغة العربية. إعداد الباحث: مصطفى أحمد محمد حسن حسان.",
    blocks: [
      {
        lines: [
          "هذا التطبيق مقدم استكمالًا لمتطلبات الحصول على درجة الماجستير في التربية",
          "تخصص: مناهج وطرق تدريس اللغة العربية",
        ],
        emphasis: true,
      },
      {
        title: "إعداد الباحث",
        lines: [
          "مصطفى أحمد محمد حسن حسان",
          "معلم لغة عربية",
          "بوزارة التربية والتعليم بجمهورية مصر العربية",
        ],
      },
    ],
  },
  {
    id: "official-supervision-board",
    phase: "official",
    audioKey: "official_intro_scene_3",
    audioPath: "/audio/ui/official_intro_scene_3.mp3",
    eyebrow: "لوحة الشرف والإشراف",
    sceneTitle: "تحت إشراف",
    title: "نخبة من العلماء الأجلاء",
    subtitle: "كلية التربية بالقاهرة - جامعة الأزهر",
    narration:
      "ويأتي هذا العمل تحت إشراف نخبة من العلماء الأجلاء: الأستاذ الدكتور خالد فاروق الهواري، الدكتور باسم محمد عبده الجندي، والدكتور أشرف محمد سعد، أساتذة المناهج وطرق التدريس بكلية التربية بجامعة الأزهر.",
    blocks: [
      {
        title: "أ.د. خالد فاروق الهواري",
        lines: [
          "أستاذ المناهج وطرق التدريس",
          "كلية التربية بالقاهرة - جامعة الأزهر",
        ],
      },
      {
        title: "د. باسم محمد عبده الجندي",
        lines: [
          "أستاذ المناهج وطرق التدريس",
          "كلية التربية بالقاهرة - جامعة الأزهر",
        ],
      },
      {
        title: "د. أشرف محمد سعد",
        lines: [
          "أستاذ المناهج وطرق التدريس",
          "كلية التربية بالقاهرة - جامعة الأزهر",
        ],
      },
    ],
  },
  {
    id: "welcome-gate",
    phase: "welcome",
    audioKey: "welcome_intro_scene_1",
    audioPath: "/audio/ui/welcome_intro_scene_1.mp3",
    eyebrow: "واحة الحروف والأصوات السحرية",
    sceneTitle: "بوابة الترحيب",
    title: "مرحبًا بك!",
    subtitle: "أهلًا بك يا بطل الصف الأول الابتدائي",
    narration:
      "عزيزي تلميذ الصف الأول الابتدائي، أهلًا ومرحبًا بك يا بطل في رحلة ممتعة وشيقة، مليئة بالألعاب اللغوية الإلكترونية المرتبطة بالأصوات والحروف الجميلة.",
    blocks: [
      {
        lines: [
          "عزيزي تلميذ الصف الأول الابتدائي، أهلًا ومرحبًا بك يا بطل في رحلة ممتعة وشيقة.",
          "رحلتك مليئة بالألعاب اللغوية الإلكترونية المرتبطة بالأصوات والحروف الجميلة.",
        ],
        emphasis: true,
      },
    ],
  },
  {
    id: "welcome-skills-island",
    phase: "welcome",
    audioKey: "welcome_intro_scene_2",
    audioPath: "/audio/ui/welcome_intro_scene_2.mp3",
    eyebrow: "واحة الحروف والأصوات السحرية",
    sceneTitle: "جزيرة المهارات",
    title: "نسمع، نتعرف، نحلل، ندمج",
    subtitle: "مهارات الأصوات والحروف خطوة بخطوة",
    narration:
      "عزيزي التلميذ، في هذا التطبيق سوف تتعلم كيف تسمع الأصوات، وتتعرف على الحروف والكلمات، وتحللها وتدمجها بطريقة سهلة ومرحة.",
    blocks: [
      {
        lines: [
          "سوف تتعلم كيف تسمع الأصوات.",
          "وتتعرف على الحروف والكلمات.",
          "وتحللها وتدمجها بطريقة سهلة ومرحة.",
        ],
        emphasis: true,
      },
    ],
  },
  {
    id: "welcome-adventure-train",
    phase: "welcome",
    audioKey: "welcome_intro_scene_3",
    audioPath: "/audio/ui/welcome_intro_scene_3.mp3",
    eyebrow: "واحة الحروف والأصوات السحرية",
    sceneTitle: "قطار المغامرة والانطلاق",
    title: "هَيَّا بنا ننطلق!",
    subtitle: "نلعب ونتعلم الأصوات والحروف في مغامرات ممتعة",
    narration:
      "هَيَّا بنا ننطلق! عزيزي التلميذ، نلعب ونتعلم الأصوات والحروف في مغامرات ممتعة تساعدك على التمييز بين الأصوات، والتعرف على الحروف، وبناء مهاراتك خطوة بخطوة.",
    blocks: [
      {
        lines: [
          "نلعب ونتعلم الأصوات والحروف في مغامرات ممتعة.",
          "ستساعدك الرحلة على التمييز بين الأصوات، والتعرف على الحروف، وبناء مهاراتك خطوة بخطوة.",
        ],
        emphasis: true,
      },
    ],
  },
];

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [ready, setReady] = useState(false);
  const [sceneIndex, setSceneIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [audioReady, setAudioReady] = useState(false);
  const [audioStatus, setAudioStatus] = useState<"idle" | "playing" | "ended" | "error">("idle");
  const [audioError, setAudioError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const autoAdvanceTimerRef = useRef<number | null>(null);
  const completionStartedRef = useRef(false);
  const { stop } = useTTS();

  const clearAutoAdvanceTimer = useCallback(() => {
    if (autoAdvanceTimerRef.current !== null) {
      window.clearTimeout(autoAdvanceTimerRef.current);
      autoAdvanceTimerRef.current = null;
    }
  }, []);

  const stopSceneAudio = useCallback(() => {
    clearAutoAdvanceTimer();
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    stop();
    setAudioStatus("idle");
  }, [clearAutoAdvanceTimer, stop]);

  const unlockAudio = useCallback(() => {
    try {
      window.localStorage.setItem("kids_audio_unlocked", "true");
    } catch {
      // The direct click is still enough for media unlock even if storage is blocked.
    }
    setAudioReady(true);
    window.dispatchEvent(new Event("kids-audio-unlocked"));
  }, []);

  useEffect(() => {
    try {
      setAudioReady(window.localStorage.getItem("kids_audio_unlocked") === "true");
    } catch {
      setAudioReady(false);
    }

    setReady(true);
  }, []);

  const completeIntro = useCallback(() => {
    if (leaving || completionStartedRef.current) return;
    completionStartedRef.current = true;
    stopSceneAudio();
    setLeaving(true);
    window.setTimeout(onComplete, 620);
  }, [leaving, onComplete, stopSceneAudio]);

  const goToNextScene = useCallback((manual = true) => {
    stopSceneAudio();
    setAudioError(null);
    if (sceneIndex >= INTRO_SCENES.length - 1) {
      completeIntro();
      return;
    }
    setSceneIndex((current) => Math.min(current + 1, INTRO_SCENES.length - 1));
  }, [completeIntro, sceneIndex, stopSceneAudio]);

  const goToPreviousScene = useCallback(() => {
    stopSceneAudio();
    setAudioError(null);
    setSceneIndex((current) => Math.max(current - 1, 0));
  }, [stopSceneAudio]);

  const playSceneAudio = useCallback(() => {
    if (!ready || leaving) return;
    unlockAudio();
    stopSceneAudio();

    const scene = INTRO_SCENES[sceneIndex];
    const audio = new Audio(`${scene.audioPath}?v=3`);
    audioRef.current = audio;
    setAudioError(null);
    setAudioStatus("idle");

    audio.onplay = () => setAudioStatus("playing");
    audio.onended = () => {
      setAudioStatus("ended");
      audioRef.current = null;
      clearAutoAdvanceTimer();
      autoAdvanceTimerRef.current = window.setTimeout(() => goToNextScene(false), 850);
    };
    audio.onerror = () => {
      setAudioStatus("error");
      setAudioError("تعذر تشغيل صوت هذا المشهد. يمكنك إعادة المحاولة أو الانتقال يدويًا.");
      audioRef.current = null;
    };

    void audio.play().catch(() => {
      setAudioStatus("error");
      audioRef.current = null;
    });
  }, [clearAutoAdvanceTimer, goToNextScene, leaving, ready, sceneIndex, stopSceneAudio, unlockAudio]);

  useEffect(() => {
    if (!ready || leaving || !audioReady) return;
    playSceneAudio();
    return () => stopSceneAudio();
  }, [audioReady, leaving, playSceneAudio, ready, sceneIndex, stopSceneAudio]);

  if (!ready) return null;

  const scene = INTRO_SCENES[sceneIndex];

  return (
    <div
      className={`fixed inset-0 z-50 overflow-y-auto bg-[#FFF9F0] text-gray-800 transition-all duration-700 ${
        leaving ? "pointer-events-none scale-105 opacity-0" : "scale-100 opacity-100"
      }`}
      dir="rtl"
    >
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#DBEAFE] to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#FACC15]/20 to-transparent" />
      <FloatingLetters />

      <CinematicScenePlayer
        scene={scene}
        sceneIndex={sceneIndex}
        sceneCount={INTRO_SCENES.length}
        audioReady={audioReady}
        audioStatus={audioStatus}
        audioError={audioError}
        onNext={() => goToNextScene(true)}
        onPrevious={goToPreviousScene}
        onReplay={playSceneAudio}
        onSkip={completeIntro}
      />
    </div>
  );
}

function CinematicScenePlayer({
  scene,
  sceneIndex,
  sceneCount,
  audioReady,
  audioStatus,
  audioError,
  onNext,
  onPrevious,
  onReplay,
  onSkip,
}: {
  scene: IntroScene;
  sceneIndex: number;
  sceneCount: number;
  audioReady: boolean;
  audioStatus: "idle" | "playing" | "ended" | "error";
  audioError: string | null;
  onNext: () => void;
  onPrevious: () => void;
  onReplay: () => void;
  onSkip: () => void;
}) {
  const isFirstScene = sceneIndex === 0;
  const isLastScene = sceneIndex === sceneCount - 1;
  const progress = ((sceneIndex + 1) / sceneCount) * 100;

  return (
    <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-4 sm:px-6 sm:py-6">
      <header className="flex items-center justify-between gap-3">
        <div className="min-w-0 rounded-2xl bg-white/85 px-4 py-3 shadow-sm ring-1 ring-gray-100 backdrop-blur">
          <p className="text-xs font-black text-[#6366F1]">{scene.eyebrow}</p>
          <p className="truncate text-sm font-bold text-gray-500">
            المشهد {sceneIndex + 1} من {sceneCount}: {scene.sceneTitle}
          </p>
        </div>

        <Button
          type="button"
          variant="ghost"
          onClick={onSkip}
          className="h-auto rounded-2xl bg-white/85 px-4 py-3 text-sm font-black text-gray-600 shadow-sm ring-1 ring-gray-100 hover:bg-white"
        >
          تخطي المقدمة
        </Button>
      </header>

      <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/80 shadow-inner ring-1 ring-gray-100">
        <motion.div
          key={scene.id}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="h-full rounded-full bg-gradient-to-l from-[#6366F1] via-[#39BDF8] to-[#FACC15]"
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.section
          key={scene.id}
          initial={{ opacity: 0, y: 22, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -14, scale: 0.98 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
          className="flex flex-1 flex-col items-center gap-4 py-4 lg:flex-row lg:gap-8"
        >
          <SceneVisual scene={scene} />
          <SceneCopy
            scene={scene}
            isFirstScene={isFirstScene}
            isLastScene={isLastScene}
            audioReady={audioReady}
            audioStatus={audioStatus}
            audioError={audioError}
            onNext={onNext}
            onPrevious={onPrevious}
            onReplay={onReplay}
          />
        </motion.section>
      </AnimatePresence>
    </main>
  );
}

function SceneCopy({
  scene,
  isFirstScene,
  isLastScene,
  audioReady,
  audioStatus,
  audioError,
  onNext,
  onPrevious,
  onReplay,
}: {
  scene: IntroScene;
  isFirstScene: boolean;
  isLastScene: boolean;
  audioReady: boolean;
  audioStatus: "idle" | "playing" | "ended" | "error";
  audioError: string | null;
  onNext: () => void;
  onPrevious: () => void;
  onReplay: () => void;
}) {
  const statusLabel =
    audioStatus === "playing"
      ? null
      : audioStatus === "error"
        ? "الصوت يحتاج إعادة محاولة"
        : "جاهز للتشغيل";

  return (
    <div className="w-full max-w-2xl space-y-3">
      <div className="space-y-2 text-center">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="inline-block">
          <span className="rounded-full border-2 border-[#6366F1]/20 bg-gradient-to-r from-[#6366F1]/10 to-[#10B981]/10 px-3 py-1 text-xs font-black text-[#6366F1]">
            {scene.eyebrow}
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-2xl font-black leading-tight text-gray-900 sm:text-3xl lg:text-4xl"
        >
          {scene.title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-base font-bold text-[#6366F1] sm:text-lg"
        >
          {scene.subtitle}
        </motion.p>
      </div>

      <div className="space-y-2">
        {scene.blocks.map((block, blockIndex) => (
          <motion.div
            key={`${scene.id}-${block.title || blockIndex}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + blockIndex * 0.1 }}
            className={`rounded-xl border-2 p-3 ${
              block.emphasis
                ? "border-[#FACC15]/50 bg-gradient-to-br from-[#FFFBEB] to-[#FEF3C7] shadow-lg"
                : "border-gray-200 bg-white shadow-sm"
            }`}
          >
            {block.title && (
              <h3 className="mb-2 text-xs font-black uppercase tracking-wider text-[#6366F1]">
                {block.title}
              </h3>
            )}
            <div className="space-y-1">
              {block.lines.map((line) => (
                <p
                  key={line}
                  className={`leading-relaxed ${
                    block.emphasis
                      ? "text-sm font-bold text-gray-800 sm:text-base"
                      : "text-xs font-medium text-gray-600 sm:text-sm"
                  }`}
                >
                  {line}
                </p>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {audioError && (
        <div className="rounded-2xl border-2 border-amber-200 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-800">
          {audioError}
        </div>
      )}

      {statusLabel && (
        <div className="flex justify-center">
          <span className="rounded-full bg-white px-3 py-1 text-sm font-bold text-gray-500 shadow-sm ring-1 ring-gray-100">
            {statusLabel}
          </span>
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-1 gap-3 pt-2 sm:grid-cols-3"
      >
        <Button
          type="button"
          onClick={onPrevious}
          disabled={isFirstScene}
          variant="outline"
          className="h-12 rounded-2xl bg-white font-black text-gray-700 disabled:opacity-60"
        >
          <ChevronRight className="ml-2 h-5 w-5" />
          عودة
        </Button>

        <Button
          type="button"
          onClick={onReplay}
          variant="outline"
          className="h-12 rounded-2xl bg-white font-black text-[#6366F1]"
        >
          {audioReady ? <RotateCcw className="ml-2 h-5 w-5" /> : <Volume2 className="ml-2 h-5 w-5" />}
          {audioReady ? "إعادة المشهد" : "تشغيل الصوت"}
        </Button>

        <Button
          type="button"
          onClick={onNext}
          className="h-12 rounded-2xl bg-gradient-to-r from-[#6366F1] to-[#4F46E5] font-black text-white shadow-[0_5px_0_#4338CA] transition-all hover:from-[#5558E3] hover:to-[#4338CA] active:translate-y-1 active:shadow-none"
        >
          {isLastScene ? (
            <>
              <Play className="ml-2 h-5 w-5 fill-current" />
              ابدأ الرحلة
            </>
          ) : (
            <>
              التالي
              <ChevronLeft className="mr-2 h-5 w-5" />
            </>
          )}
        </Button>
      </motion.div>
    </div>
  );
}

function SceneVisual({ scene }: { scene: IntroScene }) {
  if (scene.id === "official-azhar") return <OfficialIntroScene />;
  if (scene.id === "official-researcher-book") return <ResearcherBookScene />;
  if (scene.id === "official-supervision-board") return <HonorBoardScene />;
  if (scene.id === "welcome-gate") return <WelcomeIntroScene />;
  if (scene.id === "welcome-skills-island") return <SkillsIslandScene />;
  return <AdventureTrainScene />;
}

function OfficialIntroScene() {
  return (
    <div className="w-full max-w-sm">
      <SafeImage
        src={imageAssets.intro.alazhar_minarets_faculty.path}
        alt={imageAssets.intro.alazhar_minarets_faculty.alt}
        className="h-auto w-full rounded-2xl border-4 border-white/50 shadow-xl"
        priority
      />
    </div>
  );
}

function ResearcherBookScene() {
  return (
    <div className="w-full max-w-sm">
      <SafeImage
        src={imageAssets.intro.magical_research_book.path}
        alt={imageAssets.intro.magical_research_book.alt}
        className="h-auto w-full rounded-2xl border-4 border-white/50 shadow-xl"
        priority
      />
    </div>
  );
}

function HonorBoardScene() {
  return (
    <div className="w-full max-w-sm">
      <SafeImage
        src={imageAssets.intro.golden_honor_board.path}
        alt={imageAssets.intro.golden_honor_board.alt}
        className="h-auto w-full rounded-2xl border-4 border-white/50 shadow-xl"
        priority
      />
    </div>
  );
}

function WelcomeIntroScene() {
  return (
    <div className="w-full max-w-sm">
      <SafeImage
        src={imageAssets.intro.welcome_magic_gate.path}
        alt={imageAssets.intro.welcome_magic_gate.alt}
        className="h-auto w-full rounded-2xl border-4 border-white/50 shadow-xl"
        priority
      />
    </div>
  );
}

function SkillsIslandScene() {
  return (
    <div className="w-full max-w-sm">
      <SafeImage
        src={imageAssets.intro.skills_floating_island.path}
        alt={imageAssets.intro.skills_floating_island.alt}
        className="h-auto w-full rounded-2xl border-4 border-white/50 shadow-xl"
        priority
      />
    </div>
  );
}

function AdventureTrainScene() {
  return (
    <div className="w-full max-w-sm">
      <SafeImage
        src={imageAssets.intro.flying_adventure_train.path}
        alt={imageAssets.intro.flying_adventure_train.alt}
        className="h-auto w-full rounded-2xl border-4 border-white/50 shadow-xl"
        priority
      />
    </div>
  );
}
