"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ProgressBar } from "@/components/common/progress-bar";
import { Confetti } from "@/components/common/confetti";
import type { Lesson, GameResult, GameQuestion } from "@/types";
import { useTTS } from "@/hooks/use-tts";
import { useSound } from "@/hooks/use-sound";
import { AudibleText } from "@/components/common/audible-text";
import { feedbackAudioConfig } from "@/lib/feedback-config";
import { evaluateAnswer } from "@/lib/game-rules";
import { ArrowRight, Check, X, Star, Volume2, Sparkles } from "lucide-react";

interface GameRouterProps {
  lesson: Lesson;
  gameIndex: number;
  onGameComplete: (result: GameResult) => void;
  onBack: () => void;
}

export function GameRouter({ lesson, gameIndex, onGameComplete, onBack }: GameRouterProps) {
  const game = lesson.games[gameIndex];
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [isAnswerLocked, setIsAnswerLocked] = useState(false);
  const [startTime] = useState(Date.now());
  const { speak } = useTTS();
  const { playSound } = useSound();
  const feedbackAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (feedbackAudioRef.current) {
        feedbackAudioRef.current.pause();
        feedbackAudioRef.current.currentTime = 0;
        feedbackAudioRef.current = null;
      }
    };
  }, []);

  const playFeedbackVoice = (correct: boolean) => {
    const cfg = correct ? feedbackAudioConfig.correct : feedbackAudioConfig.wrong;
    const src = cfg.clips[Math.floor(Math.random() * cfg.clips.length)];
    if (feedbackAudioRef.current) {
      feedbackAudioRef.current.pause();
      feedbackAudioRef.current.currentTime = 0;
    }
    const audio = new Audio(`${src}?t=${Date.now()}`);
    feedbackAudioRef.current = audio;
    audio.onended = () => {
      if (feedbackAudioRef.current === audio) {
        feedbackAudioRef.current = null;
      }
    };
    void audio.play().catch(() => {
      // Fallback is intentionally short and deterministic.
      speak(cfg.fallbackText);
    });
  };

  if (!game) return null;

  const questions = game.questions;
  const totalQuestions = questions.length;
  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  const getQuestionAudioText = (q: GameQuestion) => {
    if (q.pronounceQuestionAndOptions) {
      return `${q.question} ${q.options.join("، ")}`;
    }
    if (q.audioText) {
      return q.audioText;
    }
    return q.word || q.image || q.question;
  };


  const handleAnswer = (answer: string) => {
    // Prevent ultra-fast double taps from firing feedback twice.
    if (showResult || isAnswerLocked) return;
    setIsAnswerLocked(true);
    
    setSelectedAnswer(answer);
    const outcome = evaluateAnswer(answer, question.correctAnswer);
    const correct = outcome.correct;
    setIsCorrect(correct);
    setShowResult(true);

    if (correct) {
      setScore(prev => prev + 1);
      playSound("correct");
      playFeedbackVoice(true);
      playSound("applause");
      setTimeout(() => playSound("whistle"), 160);
    } else {
      setWrongAnswers(prev => prev + 1);
      playSound("wrong");
      playFeedbackVoice(false);
      setTimeout(() => {
        setSelectedAnswer(null);
        setShowResult(false);
        setIsAnswerLocked(false);
      }, 1300);
      return;
    }

    setTimeout(() => {
      if (currentQuestion < totalQuestions - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedAnswer(null);
        setShowResult(false);
        setIsAnswerLocked(false);
      } else {
        setGameComplete(true);
        const finalScore = correct ? score + 1 : score;
        const timeSpent = Math.floor((Date.now() - startTime) / 1000);
        const stars = finalScore === totalQuestions ? 3 : finalScore >= totalQuestions * 0.7 ? 2 : finalScore >= totalQuestions * 0.5 ? 1 : 0;
        
        onGameComplete({
          gameId: game.id,
          lessonId: lesson.id,
          score: finalScore,
          totalQuestions,
          correctAnswers: finalScore,
          wrongAnswers: correct ? wrongAnswers : wrongAnswers + 1,
          stars,
          attempts: 1,
          completedAt: new Date().toISOString(),
          timeSpent,
        });
        setIsAnswerLocked(false);
      }
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#FFF9F0] p-4 md:p-8" dir="rtl">
      <div className="max-w-4xl mx-auto">
        {/* Header matching Image 8 */}
        <header className="flex items-center justify-between mb-8 bg-white/80 backdrop-blur-sm p-4 rounded-3xl shadow-sm border-2 border-white">
          <Button variant="ghost" onClick={onBack} className="rounded-2xl gap-2 hover:bg-gray-100">
            <ArrowRight className="w-5 h-5" />
            <span className="hidden md:inline">رجوع</span>
          </Button>
          
          <div className="flex-1 max-w-md mx-8">
            <div className="flex items-center justify-between text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">
              <span>السؤال {currentQuestion + 1}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <ProgressBar progress={progress} height="lg" color="bg-gradient-to-r from-[#6366F1] to-[#39BDF8]" />
          </div>

          <div className="flex items-center gap-2 bg-[#FACC15]/20 px-4 py-2 rounded-2xl border-2 border-[#FACC15]/30">
            <span className="text-lg font-black text-[#854D0E]">{score}</span>
            <Star className="w-5 h-5 fill-[#FACC15] text-[#FACC15]" />
          </div>
        </header>

        <AnimatePresence mode="wait">
          {!gameComplete ? (
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="space-y-8"
            >
              {/* Main Game Card matching Image 8/10 */}
              <Card className="rounded-[3rem] border-0 shadow-[0_20px_50px_rgba(0,0,0,0.05)] bg-white overflow-hidden">
                <div className="bg-[#6366F1]/5 p-8 flex flex-col items-center text-center">
                  <div className="w-24 h-24 rounded-[2rem] bg-white shadow-xl flex items-center justify-center text-5xl mb-6 animate-bounce-slow">
                    {game.icon}
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black text-gray-800 mb-2">
                    <AudibleText text={question.question} />
                  </h2>
                </div>

                <CardContent className="p-8 md:p-12">
                  {/* Visual Content Area */}
                  {(question.word || question.image || question.sentence || question.parts) && (
                    <div className="bg-[#F8FAFC] rounded-[2.5rem] p-8 mb-10 text-center border-4 border-dashed border-gray-100 relative group">
                      {question.image && (
                        <div className="text-[8rem] md:text-[10rem] filter drop-shadow-xl mb-4 group-hover:scale-110 transition-transform">
                          {getEmojiForWord(question.image)}
                        </div>
                      )}
                      
                      {game.type === 'build-word' && question.parts && (
                         <div className="flex flex-wrap justify-center gap-4 mb-4">
                            {question.parts.map((part, i) => (
                              <div key={i} className="bg-white px-6 py-4 rounded-2xl shadow-sm border-2 border-gray-100 text-4xl font-black text-[#6366F1]">
                                {part}
                              </div>
                            ))}
                         </div>
                      )}

                      {question.word && (
                        <div className="text-5xl md:text-6xl font-black text-[#6366F1] mb-2">
                          <AudibleText text={question.word} showIcon={false} />
                        </div>
                      )}

                      {game.type === 'syllable-clap' && question.syllables && (
                        <div className="flex justify-center gap-2 mt-4">
                          {question.syllables.map((syl, i) => (
                            <span key={i} className="text-2xl font-bold bg-[#6366F1]/10 px-3 py-1 rounded-lg">
                              {syl}
                            </span>
                          ))}
                        </div>
                      )}

                      {question.sentence && (
                        <div className="text-3xl md:text-4xl font-bold text-gray-700 leading-relaxed">
                          {question.sentence.split('........').map((part, i, arr) => (
                            <span key={i}>
                              {part}
                              {i < arr.length - 1 && (
                                <span className="inline-block w-32 border-b-4 border-[#6366F1] mx-2 min-h-[1em] align-middle bg-white rounded-lg px-2">
                                  {selectedAnswer && i === 0 ? selectedAnswer : ""}
                                </span>
                              )}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      <div className="absolute top-4 right-4">
                        <Button
                          size="icon"
                          variant="secondary"
                          className="w-12 h-12 rounded-2xl bg-white shadow-md hover:bg-gray-50"
                          onClick={() => speak(getQuestionAudioText(question))}
                        >
                          <Volume2 className="w-6 h-6 text-[#6366F1]" />
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Options Grid matching Image 10 buttons */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {question.options.map((option, idx) => {
                      const isSelected = selectedAnswer === option;
                      const isCorrectOption = option === question.correctAnswer;
                      const status = !showResult
                        ? 'idle'
                        : isCorrect
                          ? (isCorrectOption ? 'correct' : 'muted')
                          : (isSelected ? 'wrong' : 'idle');

                      return (
                        <motion.button
                          key={idx}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          disabled={isAnswerLocked}
                          onClick={() => {
                            stop();
                            speak(option, undefined, () => {
                              setTimeout(() => {
                                handleAnswer(option);
                              }, 150);
                            });
                          }}
                          className={`
                            relative p-8 text-2xl font-black rounded-[2rem] border-b-[8px] transition-all duration-200
                            flex items-center justify-center gap-4 group
                            ${status === 'idle' ? 'bg-white border-gray-200 text-gray-700 hover:border-[#6366F1] hover:bg-[#6366F1]/5 hover:-translate-y-1' : ''}
                            ${status === 'correct' ? 'bg-[#10B981] border-[#059669] text-white' : ''}
                            ${status === 'wrong' ? 'bg-[#F43F5E] border-[#E11D48] text-white' : ''}
                            ${status === 'muted' ? 'bg-gray-100 border-gray-200 text-gray-300 opacity-50' : ''}
                          `}
                        >
                          <span className="relative z-10">{option}</span>
                          {status === 'correct' && <Check className="w-8 h-8 animate-in zoom-in" />}
                          {status === 'wrong' && <X className="w-8 h-8 animate-in zoom-in" />}
                          
                          {/* Decorative inner glow for buttons */}
                          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-[2rem]" />
                        </motion.button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Instant Feedback Overlay */}
              <AnimatePresence>
                {showResult && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5, y: 50 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    className={`
                      fixed bottom-10 left-1/2 -translate-x-1/2 z-50
                      px-12 py-6 rounded-[2.5rem] shadow-2xl border-4 border-white
                      flex items-center gap-4 font-black text-2xl
                      ${isCorrect ? 'bg-[#10B981] text-white' : 'bg-[#F43F5E] text-white'}
                    `}
                  >
                    {isCorrect ? (
                      <>
                        <Sparkles className="w-8 h-8 fill-current" />
                        رائع! إجابة صحيحة
                        <Sparkles className="w-8 h-8 fill-current" />
                      </>
                    ) : (
                      <>
                        <X className="w-8 h-8" />
                        حاول مرة أخرى يا بطل
                        <Sparkles className="w-8 h-8 fill-current" />
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ) : (
            <div className="text-center py-20">
              <Confetti trigger={score === totalQuestions} />
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-[12rem] mb-8">
                {score === totalQuestions ? "🏆" : "🌟"}
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function getEmojiForWord(word: string): string {
  const emojiMap: Record<string, string> = {
    "دراجة": "🚲", "يوسف": "👦", "متجر": "🏪", "مريم": "🧕", "بيت": "🏠", "حديقة": "🌳",
    "أمي": "🧕", "أبي": "👨", "أميرة": "🧕", "أسرة": "👨‍👩‍👧", "أسد": "🦁", "أرنب": "🐰",
    "نملة": "🐜", "غابة": "🌲", "شجرة": "🌳", "حيوان": "🐾", "بلبل": "🐦", "معلمة": "🧕",
    "قلم": "✏️", "زهرة": "🌸", "ممحاة": "🧽", "مدرسة": "🏫", "حقيبة": "🎒", "لوحة": "🎨",
    "رسمة": "🖼️", "صورة": "📸", "كريم": "👦", "طارق": "👦", "جدي": "👴"
  };
  return emojiMap[word] || "🖼️";
}
