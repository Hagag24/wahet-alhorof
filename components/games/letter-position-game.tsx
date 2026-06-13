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

interface LetterPositionGameProps {
  gameData: GameConfig
  lessonId: string
  onComplete: (result: GameResult) => void
  onBack: () => void
}

export function LetterPositionGame({ gameData, lessonId, onComplete, onBack }: LetterPositionGameProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [wrongAnswers, setWrongAnswers] = useState(0)
  const [attempts, setAttempts] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)
  const [message, setMessage] = useState('')

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
  }, [currentQuestionIndex])

  const handleAnswer = (answer: string) => {
    if (isCorrect !== null) return

    setSelectedAnswer(answer)
    setAttempts(prev => prev + 1)

    const correct = answer === currentQuestion.correctAnswer

    if (correct) {
      setIsCorrect(true)
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

  const positionIcons: Record<string, string> = {
    'أول الكلمة': '⬅️',
    'وسط الكلمة': '↔️',
    'آخر الكلمة': '➡️',
  }

  return (
    <>
      <Confetti trigger={showConfetti} />
      <GameWrapper
        title={gameData.title}
        icon={gameData.icon}
        question={currentQuestion.question}
        questionWord={currentQuestion.word}
        currentQuestion={currentQuestionIndex}
        totalQuestions={totalQuestions}
        onBack={onBack}
      >
        {/* Visual position indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-6 shadow-lg mb-6"
        >
          <div className="flex justify-center items-center gap-2">
            {['أول', 'وسط', 'آخر'].map((pos, i) => {
              const fullPos = `${pos} الكلمة`
              const isAnswer = isCorrect && selectedAnswer === fullPos
              return (
                <motion.div
                  key={pos}
                  animate={isAnswer ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ repeat: isAnswer ? 3 : 0, duration: 0.3 }}
                  className={`
                    w-20 h-20 rounded-xl flex flex-col items-center justify-center
                    ${isAnswer ? 'bg-success text-white' : 'bg-muted'}
                  `}
                >
                  <span className="text-3xl">{i === 0 ? '⬅️' : i === 1 ? '↔️' : '➡️'}</span>
                  <span className="text-xs mt-1">{pos}</span>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Options */}
        <div className="flex flex-col gap-3 mb-6">
          {currentQuestion.options.map((option, i) => {
            const isSelected = selectedAnswer === option
            const isCorrectAnswer = option === currentQuestion.correctAnswer
            const showResult = isCorrect !== null && isSelected

            return (
              <motion.button
                key={option}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                whileHover={{ scale: isCorrect === null ? 1.02 : 1, x: isCorrect === null ? 5 : 0 }}
                whileTap={{ scale: isCorrect === null ? 0.98 : 1 }}
                onClick={() => handleAnswer(option)}
                disabled={isCorrect === true}
                className={`
                  relative p-5 rounded-2xl text-xl font-bold text-right
                  transition-all duration-300 shadow-lg flex items-center gap-4
                  ${isCorrect === null
                    ? 'bg-white hover:bg-primary/5 text-foreground hover:shadow-xl'
                    : ''
                  }
                  ${showResult && isCorrect
                    ? 'bg-success text-white ring-4 ring-success/50'
                    : ''
                  }
                  ${showResult && !isCorrect
                    ? 'bg-destructive text-white ring-4 ring-destructive/50 animate-[shake_0.5s_ease-in-out]'
                    : ''
                  }
                  ${isCorrect === true && isCorrectAnswer && !isSelected
                    ? 'opacity-50 cursor-not-allowed'
                    : ''
                  }
                `}
              >
                <span className="text-3xl">{positionIcons[option]}</span>
                <span>{option}</span>
                {showResult && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-1/2 left-4 -translate-y-1/2"
                  >
                    {isCorrect ? (
                      <Check className="w-6 h-6" />
                    ) : (
                      <X className="w-6 h-6" />
                    )}
                  </motion.div>
                )}
              </motion.button>
            )
          })}
        </div>

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
