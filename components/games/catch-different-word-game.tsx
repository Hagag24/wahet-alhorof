'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GameWrapper } from './game-wrapper'
import { StarRating } from '@/components/common/star-rating'
import { Confetti } from '@/components/common/confetti'
import { GameConfig, GameResult } from '@/types'
import { useSound } from '@/hooks/use-sound'
import { getRandomMessage } from '@/data/rewards'
import { Check, X } from 'lucide-react'

interface CatchDifferentWordGameProps {
  gameData: GameConfig
  lessonId: string
  onComplete: (result: GameResult) => void
  onBack: () => void
}

export function CatchDifferentWordGame({ gameData, lessonId, onComplete, onBack }: CatchDifferentWordGameProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [wrongAnswers, setWrongAnswers] = useState(0)
  const [attempts, setAttempts] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)
  const [message, setMessage] = useState('')
  const [caughtWord, setCaughtWord] = useState<string | null>(null)

  const { playSound } = useSound()

  const questions = gameData.questions
  const currentQuestion = questions[currentQuestionIndex]
  const totalQuestions = questions.length
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1

  useEffect(() => {
    setSelectedAnswer(null)
    setIsCorrect(null)
    setAttempts(0)
    setMessage('')
    setCaughtWord(null)
  }, [currentQuestionIndex])

  const handleAnswer = (answer: string) => {
    if (isCorrect !== null) return

    setSelectedAnswer(answer)
    setAttempts(prev => prev + 1)

    const correct = answer === currentQuestion.correctAnswer

    if (correct) {
      setIsCorrect(true)
      setCaughtWord(answer)
      setCorrectAnswers(prev => prev + 1)
      playSound('correct')
      setMessage(getRandomMessage('correct'))

      setTimeout(() => {
        if (isLastQuestion) {
          setShowConfetti(true)
          playSound('finish')

          setTimeout(() => {
            const result: GameResult = {
              gameId: gameData.id,
              lessonId,
              score: Math.round((correctAnswers + 1) / totalQuestions * 100),
              totalQuestions,
              correctAnswers: correctAnswers + 1,
              wrongAnswers,
              stars: Math.ceil(((correctAnswers + 1) / totalQuestions) * 3),
              attempts: attempts + 1,
              completedAt: new Date().toISOString(),
              timeSpent: 0,
            }
            onComplete(result)
          }, 2000)
        } else {
          setCurrentQuestionIndex(prev => prev + 1)
        }
      }, 1500)
    } else {
      setIsCorrect(false)
      setWrongAnswers(prev => prev + 1)
      playSound('wrong')
      setMessage(getRandomMessage('wrong'))

      setTimeout(() => {
        setSelectedAnswer(null)
        setIsCorrect(null)
      }, 1000)
    }
  }

  return (
    <>
      <Confetti trigger={showConfetti} />
      <GameWrapper
        title={gameData.title}
        icon={gameData.icon}
        question={currentQuestion.question}
        currentQuestion={currentQuestionIndex}
        totalQuestions={totalQuestions}
        onBack={onBack}
      >
        {/* Fishing net animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative mb-8"
        >
          {/* Water background */}
          <div className="h-48 bg-gradient-to-b from-secondary/30 to-secondary/60 rounded-3xl overflow-hidden relative">
            {/* Waves */}
            <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-secondary/50 to-transparent" />
            
            {/* Fish/Bubbles with words */}
            <div className="flex justify-around items-center h-full px-4">
              {currentQuestion.options.map((option, i) => {
                const isSelected = selectedAnswer === option
                const isCaught = caughtWord === option
                const isCorrectAnswer = option === currentQuestion.correctAnswer
                const showResult = isCorrect !== null && isSelected

                return (
                  <motion.button
                    key={option}
                    initial={{ y: 50, opacity: 0 }}
                    animate={{
                      y: isCaught ? -100 : [0, -15, 0],
                      opacity: isCaught ? 0 : 1,
                      scale: isCaught ? 0.5 : 1,
                    }}
                    transition={{
                      y: isCaught
                        ? { duration: 0.5 }
                        : { repeat: Infinity, duration: 2 + i * 0.3, ease: 'easeInOut' },
                      delay: i * 0.2,
                    }}
                    whileHover={{ scale: isCorrect === null ? 1.1 : 1 }}
                    whileTap={{ scale: isCorrect === null ? 0.9 : 1 }}
                    onClick={() => handleAnswer(option)}
                    disabled={isCorrect === true}
                    className={`
                      relative px-6 py-4 rounded-full text-xl font-bold
                      shadow-lg transition-colors cursor-pointer
                      ${isCorrect === null
                        ? 'bg-white hover:bg-primary/10 text-foreground'
                        : ''
                      }
                      ${showResult && isCorrect
                        ? 'bg-success text-white'
                        : ''
                      }
                      ${showResult && !isCorrect
                        ? 'bg-destructive text-white animate-[shake_0.5s_ease-in-out]'
                        : ''
                      }
                    `}
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-2xl">🐟</span>
                      {option}
                    </span>
                    {showResult && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-2 -right-2"
                      >
                        {isCorrect ? (
                          <div className="w-6 h-6 bg-success rounded-full flex items-center justify-center shadow-md">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        ) : (
                          <div className="w-6 h-6 bg-destructive rounded-full flex items-center justify-center shadow-md">
                            <X className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </motion.div>
                    )}
                  </motion.button>
                )
              })}
            </div>

            {/* Fishing net at the top */}
            <motion.div
              animate={caughtWord ? { y: [0, -20, 0] } : {}}
              className="absolute top-4 left-1/2 -translate-x-1/2 text-4xl"
            >
              🪤
            </motion.div>
          </div>
        </motion.div>

        {/* Caught word display */}
        <AnimatePresence>
          {caughtWord && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center mb-6"
            >
              <div className="inline-flex items-center gap-3 bg-success/20 text-success px-6 py-3 rounded-2xl">
                <span className="text-3xl">🎣</span>
                <span className="text-2xl font-bold">اصطدت: {caughtWord}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Feedback */}
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`
                text-center p-4 rounded-xl
                ${isCorrect ? 'bg-success/20 text-success' : 'bg-destructive/20 text-destructive'}
              `}
            >
              <p className="text-xl font-bold">{message}</p>
              {isCorrect && attempts <= 1 && (
                <div className="mt-2">
                  <StarRating stars={attempts === 0 ? 3 : 2} size="sm" />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </GameWrapper>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          75% { transform: translateX(8px); }
        }
      `}</style>
    </>
  )
}
