"use client";

import { useMemo, useState } from "react";
import type { ElementType, ReactNode } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Check,
  Clapperboard,
  Gamepad2,
  Lightbulb,
  Lock,
  Play,
  RotateCcw,
  Sparkles,
  Target,
  Users,
  Volume2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AudibleText } from "@/components/common/audible-text";
import { SoundButton } from "@/components/common/sound-button";
import { useGameProgress } from "@/hooks/use-game-progress";
import { useSound } from "@/hooks/use-sound";
import { useTTS } from "@/hooks/use-tts";
import type { Lesson } from "@/types";

interface LessonHubProps {
  lesson: Lesson;
  onBack: () => void;
  onStartStory: () => void;
  onStartGame: (index: number) => void;
}

type LessonSectionId = "objectives" | "warmup" | "story" | "words" | "explanation" | "games";

const sectionTabs: { id: LessonSectionId; label: string; icon: ElementType }[] = [
  { id: "objectives", label: "الأهداف", icon: Target },
  { id: "warmup", label: "التمهيد", icon: Sparkles },
  { id: "story", label: "القصة", icon: BookOpen },
  { id: "words", label: "الشخصيات / الكلمات", icon: Users },
  { id: "explanation", label: "الشرح", icon: Clapperboard },
  { id: "games", label: "الألعاب", icon: Gamepad2 },
];

const lessonOneObjectiveCards = [
  {
    icon: "👂",
    title: "رادار الأذن الخارقة",
    description: "نميز الأصوات المختلفة والمتشابهة في الكلمات المسموعة.",
  },
  {
    icon: "🏭",
    title: "مصنع الأشكال",
    description: "نربط شكل الحرف بصوته الصحيح داخل الكلمة.",
  },
  {
    icon: "🪪",
    title: "شفرة الأسماء السرية",
    description: "نفهم العلاقة بين اسم الحرف وصوته داخل الكلمة.",
  },
  {
    icon: "🎣",
    title: "صياد الأصوات والكلمات",
    description: "نميز أصوات الحروف في الكلمات المنطوقة وننطقها جيدًا.",
  },
  {
    icon: "🏆",
    title: "نادي التحدي والمرح",
    description: "نشارك في الألعاب التطبيقية ونحقق الإنجاز خطوة بخطوة.",
  },
];

const lessonOneStoryText = [
  "مريم عمرها ست سنوات.",
  "يوسف عمره تسع سنوات.",
  "يوسف يساعد أمه وأباه.",
  "مثل شراء الأكل من المتجر.",
  "يوسف يركب الدراجة إلى المتجر.",
  "مريم تشعر بالحزن لأنها تريد مساعدة والديها.",
].join(" ");

const lessonOneWords = [
  { word: "مريم", image: "🧕", audioText: "مريم" },
  { word: "يوسف", image: "👦", audioText: "يوسف" },
  { word: "جدي", image: "👴", audioText: "جدي" },
  { word: "الجد", image: "👴", audioText: "الجد" },
  { word: "بيت", image: "🏠", audioText: "بيت" },
  { word: "متجر", image: "🏪", audioText: "متجر" },
  { word: "دراجة", image: "🚲", audioText: "دراجة" },
  { word: "حديقة", image: "🌳", audioText: "حديقة" },
  { word: "أمي", image: "🧕", audioText: "أمي" },
  { word: "أبي", image: "👨", audioText: "أبي" },
  { word: "كريم", image: "👦", audioText: "كريم" },
];

const lessonOneExplanationCards = [
  {
    icon: "📡",
    title: "رادار الأصوات",
    description: "نستمع للكلمات ونميز الصوت المختلف أو المتشابه في البداية.",
  },
  {
    icon: "🏭",
    title: "مصنع الأشكال",
    description: "نلاحظ شكل الحرف في أول الكلمة ووسطها وآخرها.",
  },
  {
    icon: "🪪",
    title: "بطاقة الهوية",
    description: "نتعرف إلى اسم الحرف وصوته مع كلمة قريبة من الطفل.",
  },
  {
    icon: "🎣",
    title: "صياد الأصوات",
    description: "نصطاد الكلمة الصحيحة بعد الاستماع للصوت أو الكلمة.",
  },
];

const lessonOneObjectivesNarration =
  "أهلًا بك يا بطل في خريطة الأبطال السحرية. في هذه الرحلة ستدرّب أذنيك على تمييز الأصوات المتشابهة، وتتعلم العلاقة بين شكل الحرف وصوته، وتعرف الفرق بين اسم الحرف وصوته داخل الكلمة، ثم تشارك في ألعاب ممتعة تجمع فيها النجوم وتبني مهاراتك خطوة بخطوة.";

const lessonOneWarmupNarration =
  "الجد يريد كتابة رسالة لحفيده، لكن الحروف تطايرت من الورقة. ساعد الجد في استعادة الحروف الناقصة. استمع إلى الحرف الناقص، ثم اضغط على الحرف الصحيح لتكتمل كلمة جدي.";

const lessonOneExplanationNarration =
  "أهلًا بك في سينما الأصوات مع مريم ويوسف. سنتعلم اليوم كيف نميّز بين الأصوات المتشابهة، وكيف يتغير صوت الحرف حسب حركته، وكيف نعرف اسم الحرف وصوته داخل الكلمة. استمع جيدًا، ولاحظ الكلمات والحروف المضيئة أمامك.";

function speakableText(title: string, description: string) {
  return `${title}. ${description}`;
}

function scrollToSection(sectionId: LessonSectionId) {
  document.getElementById(`lesson-section-${sectionId}`)?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

export function LessonHub({ lesson, onBack, onStartStory, onStartGame }: LessonHubProps) {
  const { isGameUnlocked } = useGameProgress();
  const { playSound } = useSound();
  const { speak } = useTTS();
  const [activeSection, setActiveSection] = useState<LessonSectionId>("objectives");
  const visibleGames = lesson.games.filter((game) => !game.hidden);
  const isLessonOne = lesson.id === "lesson-1";
  const objectives = isLessonOne ? lessonOneObjectiveCards : (lesson.sections?.objectives || []).map((item, index) => ({
    icon: String(index + 1),
    title: item.title,
    description: item.description,
  }));
  const explanationCards = isLessonOne ? lessonOneExplanationCards : (lesson.sections?.explanation || []).map((item, index) => ({
    icon: String(index + 1),
    title: item.title,
    description: item.description,
  }));
  const vocabulary = isLessonOne ? lessonOneWords : lesson.vocabulary.map((item) => ({
    word: item.word,
    image: item.image || "🖼️",
    audioText: item.word,
  }));
  const storyText = isLessonOne ? lessonOneStoryText : lesson.story;

  const visibleGameMasteryText = useMemo(() => `${visibleGames.length} مستويات تطبيقية`, [visibleGames.length]);

  const activateSection = (sectionId: LessonSectionId) => {
    setActiveSection(sectionId);
    scrollToSection(sectionId);
  };

  const playLessonStory = () => {
    stop();
    const storyAudioPath = lesson.id === 'lesson-1' ? "/audio/stories/lesson-1-full.mp3" :
                          lesson.id === 'lesson-2' ? "/audio/stories/lesson-2-full.mp3" :
                          lesson.id === 'lesson-3' ? "/audio/stories/lesson-3-full.mp3" :
                          lesson.id === 'lesson-4' ? "/audio/stories/lesson-4-full.mp3" :
                          undefined;
    speak(storyText, storyAudioPath);
  };

  const playObjectivesNarration = () => {
    stop();
    speak(lessonOneObjectivesNarration, "/audio/ui/lesson-1-objectives.mp3");
  };

  const playExplanationNarration = () => {
    stop();
    speak(lessonOneExplanationNarration, "/audio/ui/lesson-1-explanation.mp3");
  };

  return (
    <div className="min-h-screen bg-[#FFF9F0] pb-12 relative" dir="rtl">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />

      <header className="sticky top-0 z-50 border-b border-white/70 bg-[#FFF9F0]/90 p-4 backdrop-blur-xl sm:p-6">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
          <Button
            variant="ghost"
            onClick={onBack}
            className="bg-white/80 backdrop-blur-sm rounded-2xl gap-2 border-2 border-gray-100 text-sm sm:text-base"
          >
            <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
            <span>رجوع</span>
          </Button>
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-xl shadow-sm sm:h-10 sm:w-10 sm:text-2xl">
              {lesson.icon}
            </div>
            <div className="min-w-0 text-center">
              <h1 className="truncate text-lg font-black text-gray-800 sm:text-xl">{lesson.title}</h1>
              <p className="text-xs font-bold text-gray-500">{visibleGameMasteryText}</p>
            </div>
          </div>
          <div className="w-16" />
        </div>

        <nav className="mx-auto mt-4 grid max-w-5xl grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
          {sectionTabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeSection === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => activateSection(tab.id)}
                className={`flex h-12 items-center justify-center gap-2 rounded-2xl border-2 px-3 text-xs font-black transition-all sm:text-sm ${
                  active
                    ? "border-[#6366F1] bg-[#6366F1] text-white shadow-lg"
                    : "border-white bg-white/85 text-gray-600 hover:border-[#6366F1]/30"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="truncate">{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </header>

      <main className="relative z-10 mx-auto max-w-5xl p-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <Card className="overflow-hidden rounded-[2.5rem] border-0 bg-white shadow-2xl">
            <div
              className="relative flex h-44 items-center justify-center overflow-hidden md:h-56"
              style={{ backgroundColor: `${lesson.color}15` }}
            >
              <div className="select-none text-8xl drop-shadow-xl md:text-[10rem]">{lesson.icon}</div>
            </div>

            <CardContent className="p-6 text-center md:p-10">
              <h2 className="mb-3 text-3xl font-black text-gray-800 md:text-5xl">
                <AudibleText text={lesson.title} stopPropagation={false} />
              </h2>
              <p className="mx-auto mb-6 max-w-2xl text-lg leading-relaxed text-gray-500">
                <AudibleText text={lesson.description} stopPropagation={false} />
              </p>
              <Button
                type="button"
                onClick={() => activateSection("objectives")}
                className="rounded-2xl bg-[#FACC15] px-8 py-6 text-lg font-black text-[#854D0E] hover:bg-[#EAB308]"
              >
                ابدأ ترتيب الدرس
                <ChevronLeftIcon />
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <div className="space-y-6">
          <SectionShell id="objectives" title="أهداف الدرس" icon={<Target className="h-6 w-6 text-white" />}>
            {isLessonOne && (
              <Button
                type="button"
                onClick={playObjectivesNarration}
                className="mb-4 rounded-2xl bg-[#6366F1] font-black text-white"
              >
                <Volume2 className="ml-2 h-5 w-5" />
                تشغيل خريطة الأهداف
              </Button>
            )}
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {objectives.map((item, index) => (
                <button
                  key={item.title}
                  type="button"
                  onClick={() => speak(speakableText(item.title, item.description))}
                  className="group rounded-2xl border-2 border-gray-100 bg-[#F8FAFC] p-4 text-right transition hover:border-[#6366F1]/40 hover:bg-white"
                >
                  <div className="flex items-start gap-3">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#6366F1]/10 text-2xl font-black text-[#6366F1]">
                      {item.icon}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-center justify-between gap-2">
                        <p className="font-black text-gray-800">{item.title}</p>
                        <Volume2 className="h-5 w-5 shrink-0 text-[#6366F1] opacity-70 group-hover:opacity-100" />
                      </div>
                      <p className="text-sm leading-relaxed text-gray-600">{item.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            {!isLessonOne && (
              <MissingAudioNote text="ملفات صوت أهداف الدرس غير موجودة كـ MP3 مستقلة بعد؛ يعمل الزر كنص منطوق/fallback حسب إعدادات الصوت." />
            )}
          </SectionShell>

          <SectionShell id="warmup" title="التمهيد" icon={<Sparkles className="h-6 w-6 text-white" />}>
            {isLessonOne ? (
              <WarmupGame
                onComplete={() => activateSection("story")}
                onSpeak={(text, audioPath) => speak(text, audioPath)}
                onCorrect={() => playSound("correct")}
                onWrong={() => playSound("wrong")}
              />
            ) : (
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {(lesson.sections?.warmup || []).map((item) => (
                  <div key={item.title} className="rounded-2xl border border-orange-100 bg-[#FFF7ED] p-4">
                    <p className="mb-1 font-black text-gray-800">{item.title}</p>
                    <p className="text-sm leading-relaxed text-gray-600">{item.description}</p>
                  </div>
                ))}
              </div>
            )}
          </SectionShell>

          <SectionShell id="story" title="قصة الاستماع" icon={<BookOpen className="h-6 w-6 text-white" />}>
            <div className="rounded-[2rem] border-2 border-cyan-100 bg-[#ECFEFF] p-5">
              <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-lg font-black text-gray-800">استمع إلى القصة كاملة في مشهد واحد</p>
                  <p className="text-sm text-gray-500">لا توجد أرقام مشاهد داخل قصة الاستماع.</p>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Button
                    type="button"
                    onClick={playLessonStory}
                    className="rounded-2xl bg-[#6366F1] font-black text-white"
                  >
                    <Volume2 className="ml-2 h-5 w-5" />
                    تشغيل القصة
                  </Button>
                  <Button
                    type="button"
                    onClick={onStartStory}
                    variant="outline"
                    className="rounded-2xl bg-white font-black text-[#6366F1]"
                  >
                    <BookOpen className="ml-2 h-5 w-5" />
                    فتح القصة
                  </Button>
                </div>
              </div>
              <p className="rounded-2xl bg-white p-5 text-lg font-bold leading-loose text-gray-700 shadow-inner">
                {storyText}
              </p>
            </div>
          </SectionShell>

          <SectionShell id="words" title="شخصيات الدرس / كلمات الدرس" icon={<Users className="h-6 w-6 text-white" />}>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {vocabulary.map((vocab) => (
                <motion.div key={vocab.word} whileHover={{ scale: 1.04 }} className="flex flex-col items-center">
                  <div className="relative mb-3 flex aspect-square w-full items-center justify-center rounded-3xl border-2 border-gray-50 bg-[#F8FAFC] text-5xl shadow-inner">
                    <span className="transition-transform group-hover:scale-110">{vocab.image}</span>
                    <div className="absolute -right-2 -top-2">
                      <SoundButton
                        audioText={vocab.audioText}
                        size="sm"
                        className="h-10 w-10 rounded-full p-0 shadow-lg"
                      />
                    </div>
                  </div>
                  <span className="text-center text-lg font-bold text-gray-700">{vocab.word}</span>
                </motion.div>
              ))}
            </div>
          </SectionShell>

          <SectionShell id="explanation" title={isLessonOne ? "سينما الأصوات مع مريم ويوسف" : "شرح الدرس"} icon={<Lightbulb className="h-6 w-6 text-white" />}>
            {isLessonOne && (
              <Button
                type="button"
                onClick={playExplanationNarration}
                className="mb-4 rounded-2xl bg-[#6366F1] font-black text-white"
              >
                <Volume2 className="ml-2 h-5 w-5" />
                تشغيل شرح سينما الأصوات
              </Button>
            )}
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {explanationCards.map((item) => (
                <button
                  key={item.title}
                  type="button"
                  onClick={() => speak(speakableText(item.title, item.description))}
                  className="group rounded-2xl border border-blue-100 bg-[#EFF6FF] p-4 text-right transition hover:border-[#6366F1]/40 hover:bg-white"
                >
                  <div className="flex items-start gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-2xl shadow-sm">
                      {item.icon}
                    </span>
                    <div>
                      <div className="mb-1 flex items-center justify-between gap-2">
                        <p className="font-black text-gray-800">{item.title}</p>
                        <RotateCcw className="h-4 w-4 shrink-0 text-[#6366F1] opacity-70 group-hover:opacity-100" />
                      </div>
                      <p className="text-sm leading-relaxed text-gray-600">{item.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            {!isLessonOne && (
              <MissingAudioNote text="ملفات شرح الدرس غير موجودة كـ MP3 مستقلة بعد؛ أزرار الإعادة تستخدم النص المنطوق/fallback." />
            )}
          </SectionShell>

          <SectionShell id="games" title="الألعاب التطبيقية" icon={<Gamepad2 className="h-6 w-6 text-white" />}>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {visibleGames.map((game, i) => {
                const unlocked = isGameUnlocked(lesson.id, i);
                return (
                  <motion.div
                    key={game.id}
                    initial={{ opacity: 0, x: i % 2 === 0 ? 50 : -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Card
                      className={`group rounded-[2rem] border-4 bg-white shadow-lg transition-all ${
                        unlocked
                          ? "cursor-pointer border-transparent hover:-translate-y-2 hover:border-primary/20 hover:shadow-2xl"
                          : "cursor-not-allowed border-gray-100 opacity-75"
                      }`}
                      onClick={() => unlocked && onStartGame(i)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center gap-5">
                          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gray-50 text-4xl shadow-inner transition-transform group-hover:scale-110">
                            {game.icon}
                          </div>
                          <div className="flex-1">
                            <p className="mb-1 text-xs font-black text-gray-400">المستوى {i + 1}</p>
                            <h4 className="mb-1 text-xl font-black text-gray-800">
                              <AudibleText text={game.title} stopPropagation={false} />
                            </h4>
                            <p className="line-clamp-1 text-sm text-gray-500">{game.description}</p>
                          </div>
                          <Button
                            size="icon"
                            className={`h-12 w-12 rounded-2xl transition-all ${
                              unlocked
                                ? "bg-primary/10 text-primary hover:bg-primary hover:text-white"
                                : "bg-gray-200 text-gray-500"
                            }`}
                          >
                            {unlocked ? <Play className="h-6 w-6 fill-current" /> : <Lock className="h-5 w-5" />}
                          </Button>
                        </div>
                        {!unlocked && (
                          <p className="mt-3 text-xs text-amber-700">
                            يفتح هذا المستوى بعد إتقان المستوى السابق بنسبة 80%.
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </SectionShell>
        </div>
      </main>
    </div>
  );
}

function ChevronLeftIcon() {
  return <span className="mr-2 text-xl">‹</span>;
}

function SectionShell({
  id,
  title,
  icon,
  children,
}: {
  id: LessonSectionId;
  title: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <section id={`lesson-section-${id}`} className="scroll-mt-40">
      <Card className="rounded-[2rem] border-0 bg-white shadow-lg">
        <CardContent className="p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-xl bg-[#6366F1] p-2">{icon}</div>
            <h3 className="text-2xl font-black text-gray-800">{title}</h3>
          </div>
          {children}
        </CardContent>
      </Card>
    </section>
  );
}

function MissingAudioNote({ text }: { text: string }) {
  return (
    <p className="mt-4 rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-800">
      {text}
    </p>
  );
}

function WarmupGame({
  onComplete,
  onSpeak,
  onCorrect,
  onWrong,
}: {
  onComplete: () => void;
  onSpeak: (text: string, audioPath?: string) => void;
  onCorrect: () => void;
  onWrong: () => void;
}) {
  const [completed, setCompleted] = useState(false);
  const [wrongChoice, setWrongChoice] = useState<string | null>(null);
  const choices = ["ب", "د", "ر"];

  const instruction = lessonOneWarmupNarration;

  const handleChoice = (choice: string) => {
    if (completed) return;
    if (choice === "د") {
      setCompleted(true);
      setWrongChoice(null);
      onCorrect();
      onSpeak("أحسنت! اكتملت الكلمة: جدي.", "/audio/ui/phrase-036.mp3");
      return;
    }

    setWrongChoice(choice);
    onWrong();
    onSpeak("حاول مرة أخرى. استمع جيدًا للصوت الناقص.", "/audio/ui/phrase-037.mp3");
    window.setTimeout(() => setWrongChoice(null), 700);
  };

  return (
    <div className="rounded-[2rem] border-2 border-orange-100 bg-[#FFF7ED] p-5">
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h4 className="text-2xl font-black text-gray-800">رسالة الجد المفقودة</h4>
          <p className="mt-1 text-sm leading-relaxed text-gray-600">
            الجد يريد كتابة رسالة لحفيده، لكن الحروف طارت من الورقة. اختر الحرف الناقص.
          </p>
        </div>
        <Button
          type="button"
          onClick={() => onSpeak(instruction, "/audio/ui/phrase-034.mp3")}
          className="rounded-2xl bg-[#FACC15] font-black text-[#854D0E] hover:bg-[#EAB308]"
        >
          <Volume2 className="ml-2 h-5 w-5" />
          اسمع التعليمات
        </Button>
      </div>

      <div className="mb-5 rounded-[2rem] bg-white p-6 text-center shadow-inner">
        <p className="mb-2 text-sm font-black text-gray-400">الكلمة الناقصة</p>
        <div className="text-6xl font-black tracking-widest text-[#6366F1]">
          {completed ? "جدي" : "ج _ ي"}
        </div>
        <Button
          type="button"
          variant="ghost"
          onClick={() => onSpeak("الصوت الناقص هو د", "/audio/ui/phrase-035.mp3")}
          className="mt-4 rounded-2xl font-black text-[#6366F1]"
        >
          <Volume2 className="ml-2 h-5 w-5" />
          اسمع الصوت الناقص
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {choices.map((choice) => (
          <motion.button
            key={choice}
            type="button"
            onClick={() => handleChoice(choice)}
            animate={wrongChoice === choice ? { x: [0, -8, 8, -6, 6, 0] } : { x: 0 }}
            transition={{ duration: 0.35 }}
            className={`rounded-2xl border-b-[7px] p-6 text-4xl font-black transition-all ${
              completed && choice === "د"
                ? "border-[#059669] bg-[#10B981] text-white"
                : "border-gray-200 bg-white text-gray-700 hover:border-[#6366F1] hover:text-[#6366F1]"
            }`}
          >
            {choice}
          </motion.button>
        ))}
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-sm font-bold">
          {completed ? (
            <>
              <Check className="h-5 w-5 text-[#10B981]" />
              <span className="text-[#047857]">تمهيد مكتمل. يمكنك الانتقال إلى القصة.</span>
            </>
          ) : (
            <>
              <X className="h-5 w-5 text-gray-300" />
              <span className="text-gray-500">الإجابة الخاطئة لا تكشف الحل ولا تنقل الطالب.</span>
            </>
          )}
        </div>
        <Button
          type="button"
          disabled={!completed}
          onClick={onComplete}
          className="rounded-2xl bg-[#6366F1] font-black text-white disabled:opacity-50"
        >
          الانتقال إلى القصة
          <BookOpen className="mr-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
