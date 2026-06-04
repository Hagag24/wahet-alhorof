"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  BookOpen,
  ChevronLeft,
  GraduationCap,
  Languages,
  Play,
  Sparkles,
  Star,
  Volume2,
} from "lucide-react";
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
  durationMs: number;
  eyebrow: string;
  sceneTitle: string;
  title: string;
  subtitle: string;
  narration: string;
  blocks: IntroTextBlock[];
}

const INTRO_SEEN_KEY = "introSeen";
const INTRO_SCENES: IntroScene[] = [
  {
    id: "official-azhar",
    phase: "official",
    audioKey: "official_intro_scene_1",
    audioPath: "/audio/ui/official_intro_scene_1.mp3",
    durationMs: 15000,
    eyebrow: "منارة العلم واللغة العربية",
    sceneTitle: "واجهة الأزهر الشريف",
    title: "جامعة الأزهر",
    subtitle: "كلية التربية بنين بالقاهرة - قسم المناهج وطرق التدريس",
    narration:
      "مرحبًا بكم في هذا التطبيق التعليمي، المُهدي من جامعة الأزهر الشريف، كلية التربية بنين بالقاهرة، قسم المناهج وطرق التدريس.",
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
    durationMs: 10000,
    eyebrow: "كتاب الباحث السحري",
    sceneTitle: "بيانات البحث",
    title: "هذا التطبيق مقدم استكمالًا لمتطلبات الحصول على درجة الماجستير",
    subtitle: "تخصص: مناهج وطرق تدريس اللغة العربية",
    narration:
      "هذا العمل مقدم استكمالًا لمتطلبات الحصول على درجة الماجستير في التربية، تخصص مناهج وطرق تدريس اللغة العربية. من إعداد الباحث: مصطفى أحمد محمد حسن حسان، معلم اللغة العربية بوزارة التربية والتعليم.",
    blocks: [
      {
        lines: [
          "هذا التطبيق مقدم استكمالًا لمتطلبات الحصول على درجة المَاجِسْتِر في التربية",
          "تخصص: مناهج وطرق تدريس اللغة العربية",
        ],
        emphasis: true,
      },
      {
        title: "إعداد الباحث",
        lines: [
          "مصطفى أحمد محمد حسن حسان",
          "معلم لغة عربية",
          "معلم لغة عربية بمدرسة نوي التعليمية، إدارة شبين القناطر، محافظة القليوبية، بوزارة التربية والتعليم بجمهورية مصر العربية.",
        ],
      },
    ],
  },
  {
    id: "official-supervision-board",
    phase: "official",
    audioKey: "official_intro_scene_3",
    audioPath: "/audio/ui/official_intro_scene_3.mp3",
    durationMs: 15000,
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
    durationMs: 10000,
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
    durationMs: 12000,
    eyebrow: "واحة الحروف والأصوات السحرية",
    sceneTitle: "جزيرة المهارات",
    title: "نسمع، نتعرف، نحلل، ندمج",
    subtitle: "مهارات الأصوات والحروف خطوة بخطوة",
    narration:
      "عزيزي التلميذ، في هذا التطبيق سوف تتعلم كيف تسمع الأصوات، وتتعرف على الحروف والكلمات، وتحليلها ودمجها بطريقة سهلة ومرحة.",
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
    durationMs: 10000,
    eyebrow: "واحة الحروف والأصوات السحرية",
    sceneTitle: "قطار المغامرة والانطلاق",
    title: "هيا بنا ننطلق!",
    subtitle: "نلعب ونتعلم الأصوات والحروف في مغامرات ممتعة",
    narration:
      "هيا بنا عزيزي التلميذ ننطلق! نلعب ونتعلم الأصوات والحروف في مغامرات ممتعة تساعدك على التمييز بين الأصوات، والتعرف على الحروف، وبناء مهاراتك خطوة بخطوة.",
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

function hasSeenIntro() {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(INTRO_SEEN_KEY) === "true";
  } catch {
    return false;
  }
}

function markIntroSeen() {
  try {
    window.localStorage.setItem(INTRO_SEEN_KEY, "true");
  } catch {
    // Storage can be unavailable in restricted browser modes; the intro still completes.
  }
}

function shouldForceReplayIntro() {
  if (typeof window === "undefined") return false;
  const params = new URLSearchParams(window.location.search);
  const introMode = params.get("intro")?.toLowerCase();

  return (
    introMode === "replay" ||
    introMode === "reset" ||
    introMode === "true" ||
    params.get("replayIntro") === "true"
  );
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [ready, setReady] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [sceneIndex, setSceneIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [audioReady, setAudioReady] = useState(false);
  const [narratedSceneIndex, setNarratedSceneIndex] = useState<number | null>(null);
  const { speak, stop } = useTTS();

  useEffect(() => {
    const forceReplay = shouldForceReplayIntro();
    if (forceReplay) {
      try {
        window.localStorage.removeItem(INTRO_SEEN_KEY);
      } catch {
        // Ignore storage errors; replay still happens for the current visit.
      }
    }

    if (!forceReplay && hasSeenIntro()) {
      setShowIntro(false);
      window.setTimeout(onComplete, 120);
    }

    setReady(true);
  }, [onComplete]);

  useEffect(() => {
    const syncAudioReady = () => {
      try {
        setAudioReady(window.localStorage.getItem("kids_audio_unlocked") === "true");
      } catch {
        setAudioReady(false);
      }
    };

    syncAudioReady();
    window.addEventListener("kids-audio-unlocked", syncAudioReady);
    return () => window.removeEventListener("kids-audio-unlocked", syncAudioReady);
  }, []);

  const completeIntro = useCallback(() => {
    if (leaving) return;

    markIntroSeen();
    stop();
    setLeaving(true);
    window.setTimeout(onComplete, 620);
  }, [leaving, onComplete, stop]);

  const goToNextScene = useCallback(() => {
    stop();
    setNarratedSceneIndex(null);

    if (sceneIndex >= INTRO_SCENES.length - 1) {
      completeIntro();
      return;
    }

    setSceneIndex((current) => Math.min(current + 1, INTRO_SCENES.length - 1));
  }, [completeIntro, sceneIndex, stop]);

  useEffect(() => {
    if (!ready || !showIntro || leaving) return;

    const scene = INTRO_SCENES[sceneIndex];
    const timer = window.setTimeout(goToNextScene, scene.durationMs);
    return () => window.clearTimeout(timer);
  }, [goToNextScene, leaving, ready, sceneIndex, showIntro]);

  useEffect(() => {
    if (!ready || !showIntro || leaving || !audioReady) return;
    if (narratedSceneIndex === sceneIndex) return;

    const scene = INTRO_SCENES[sceneIndex];
    speak(scene.narration, scene.audioPath);
    setNarratedSceneIndex(sceneIndex);
  }, [audioReady, leaving, narratedSceneIndex, ready, sceneIndex, showIntro, speak]);

  if (!ready || !showIntro) return null;

  const scene = INTRO_SCENES[sceneIndex];

  return (
    <div
      className={`fixed inset-0 z-50 overflow-hidden bg-[#FFF9F0] text-gray-800 transition-all duration-700 ${
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
        onNext={goToNextScene}
        onSkip={completeIntro}
      />
    </div>
  );
}

function CinematicScenePlayer({
  scene,
  sceneIndex,
  sceneCount,
  onNext,
  onSkip,
}: {
  scene: IntroScene;
  sceneIndex: number;
  sceneCount: number;
  onNext: () => void;
  onSkip: () => void;
}) {
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
          className="flex flex-col flex-1 items-center gap-4 py-4 lg:flex-row lg:gap-8"
        >
          <SceneVisual scene={scene} />
          <SceneCopy scene={scene} isLastScene={isLastScene} onNext={onNext} />
        </motion.section>
      </AnimatePresence>
    </main>
  );
}

function SceneCopy({
  scene,
  isLastScene,
  onNext,
}: {
  scene: IntroScene;
  isLastScene: boolean;
  onNext: () => void;
}) {
  return (
    <div className="w-full max-w-2xl space-y-3">
      {/* Header Section */}
      <div className="text-center space-y-2">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-block"
        >
          <span className="px-3 py-1 rounded-full bg-gradient-to-r from-[#6366F1]/10 to-[#10B981]/10 text-xs font-black text-[#6366F1] border-2 border-[#6366F1]/20">
            {scene.eyebrow}
          </span>
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 leading-tight"
        >
          {scene.title}
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-base sm:text-lg text-[#6366F1] font-bold"
        >
          {scene.subtitle}
        </motion.p>
      </div>

      {/* Content Blocks */}
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
              <h3 className="mb-2 text-xs font-black text-[#6366F1] uppercase tracking-wider">
                {block.title}
              </h3>
            )}
            <div className="space-y-1">
              {block.lines.map((line) => (
                <p
                  key={line}
                  className={`leading-relaxed ${
                    block.emphasis
                      ? "text-sm sm:text-base font-bold text-gray-800"
                      : "text-xs sm:text-sm font-medium text-gray-600"
                  }`}
                >
                  {line}
                </p>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Action Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="pt-2"
      >
        <Button
          type="button"
          onClick={onNext}
          className="w-full h-14 rounded-2xl bg-gradient-to-r from-[#6366F1] to-[#4F46E5] hover:from-[#5558E3] hover:to-[#4338CA] text-white font-black text-lg shadow-[0_6px_0_#4338CA] active:shadow-none active:translate-y-2 transition-all"
        >
          {isLastScene ? (
            <>
              <Play className="w-5 h-5 fill-current ml-2" />
              ابدأ الرحلة
            </>
          ) : (
            <>
              التالي
              <ChevronLeft className="w-5 h-5 ml-2" />
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
        className="w-full h-auto rounded-2xl shadow-xl border-4 border-white/50"
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
        className="w-full h-auto rounded-2xl shadow-xl border-4 border-white/50"
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
        className="w-full h-auto rounded-2xl shadow-xl border-4 border-white/50"
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
        className="w-full h-auto rounded-2xl shadow-xl border-4 border-white/50"
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
        className="w-full h-auto rounded-2xl shadow-xl border-4 border-white/50"
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
        className="w-full h-auto rounded-2xl shadow-xl border-4 border-white/50"
        priority
      />
    </div>
  );
}

function StudentAvatar({ label, color, delay }: { label: string; color: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: [0, -8, 0] }}
      transition={{ opacity: { delay }, y: { duration: 2.2, repeat: Infinity, ease: "easeInOut" } }}
      className="flex flex-col items-center gap-2"
      aria-hidden="true"
    >
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-xl ring-8 ring-white/50">
        <div className="flex h-16 w-16 items-center justify-center rounded-full text-3xl font-black text-white" style={{ backgroundColor: color }}>
          {label}
        </div>
      </div>
      <div className="h-16 w-24 rounded-t-[2rem] shadow-lg" style={{ backgroundColor: color }} />
    </motion.div>
  );
}
