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

interface SimilarWordsGameProps {
  gameData: GameConfig
  lessonId: string
  onComplete: (result: GameResult) => void
  onBack: () => void
}

export function SimilarWordsGame({ gameData, lessonId, onComplete, onBack }: SimilarWordsGameProps) {
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
        {/* Chain link visual */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center mb-6"
        >
          <div className="flex items-center gap-2 text-4xl">
            <span>🔗</span>
            <span className="text-muted-foreground">ابحث عن الكلمة المشابهة</span>
            <span>🔗</span>
          </div>
        </motion.div>

        {/* Options */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {currentQuestion.options.map((option, i) => {
            const isSelected = selectedAnswer === option
            const isCorrectAnswer = option === currentQuestion.correctAnswer
            const showResult = isCorrect !== null && isSelected

            return (
              <motion.button
                key={option}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                whileHover={{ scale: isCorrect === null ? 1.03 : 1 }}
                whileTap={{ scale: isCorrect === null ? 0.97 : 1 }}
                onClick={() => handleAnswer(option)}
                disabled={isCorrect === true}
                className={`
                  relative p-5 rounded-2xl text-xl font-bold
                  transition-all duration-300 shadow-lg
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
                {option}
                {showResult && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-2 left-2"
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

        {/* Show similarity when correct */}
        <AnimatePresence>
          {isCorrect && currentQuestion.word && selectedAnswer && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-mint/20 rounded-2xl p-4 mb-4 text-center"
            >
              <p className="text-lg">
                <span className="font-bold text-primary">{currentQuestion.word}</span>
                <span className="mx-3 text-mint">🔗</span>
                <span className="font-bold text-success">{selectedAnswer}</span>
              </p>
              <p className="text-muted-foreground mt-1">كلاهما يبدأ بنفس الصوت!</p>
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
