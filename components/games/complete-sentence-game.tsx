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

interface CompleteSentenceGameProps {
  gameData: GameConfig
  lessonId: string
  onComplete: (result: GameResult) => void
  onBack: () => void
}

const wordToEmoji: Record<string, string> = {
  'المدرسة': '🏫',
  'مدرسة': '🏫',
  'زهرة': '🌸',
  'ممحاة': '🧹',
  'قلم': '✏️',
  'لوحة': '🖼️',
  'رسمة': '🎨',
  'المتجر': '🏪',
  'الحديقة': '🌻',
}

export function CompleteSentenceGame({ gameData, lessonId, onComplete, onBack }: CompleteSentenceGameProps) {
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

  const sentence = currentQuestion.sentence || ''
  const imageWord = currentQuestion.image || ''
  const emoji = wordToEmoji[imageWord] || '📷'

  // Render sentence with blank highlighted
  const renderSentence = () => {
    const parts = sentence.split('........')
    return (
      <p className="text-2xl md:text-3xl text-foreground leading-relaxed">
        {parts[0]}
        <span className={`
          inline-block min-w-[100px] mx-2 px-4 py-1 rounded-lg border-2 border-dashed
          ${isCorrect
            ? 'border-success bg-success/20 text-success'
            : 'border-primary bg-primary/10'
          }
        `}>
          {isCorrect ? selectedAnswer : '........'}
        </span>
        {parts[1]}
      </p>
    )
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
        {/* Image hint */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="flex justify-center mb-6"
        >
          <div className="w-24 h-24 bg-gradient-to-br from-accent/30 to-mint/30 rounded-2xl flex items-center justify-center text-5xl shadow-lg">
            {emoji}
          </div>
        </motion.div>

        {/* Sentence */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-6 shadow-lg mb-6 text-center"
        >
          {renderSentence()}
        </motion.div>

        {/* Options */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {currentQuestion.options.map((option, i) => {
            const isSelected = selectedAnswer === option
            const isCorrectAnswer = option === currentQuestion.correctAnswer
            const showResult = isCorrect !== null && isSelected

            return (
              <motion.button
                key={option}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                whileHover={{ scale: isCorrect === null ? 1.05 : 1 }}
                whileTap={{ scale: isCorrect === null ? 0.95 : 1 }}
                onClick={() => handleAnswer(option)}
                disabled={isCorrect === true}
                className={`
                  relative p-4 rounded-xl text-lg font-bold
                  transition-all duration-300 shadow-md
                  ${isCorrect === null
                    ? 'bg-white hover:bg-primary/5 text-foreground hover:shadow-lg'
                    : ''
                  }
                  ${showResult && isCorrect
                    ? 'bg-success text-white ring-2 ring-success/50'
                    : ''
                  }
                  ${showResult && !isCorrect
                    ? 'bg-destructive text-white ring-2 ring-destructive/50'
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
                    className="absolute -top-2 -right-2"
                  >
                    {isCorrect ? (
                      <div className="w-5 h-5 bg-success rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 bg-destructive rounded-full flex items-center justify-center">
                        <X className="w-3 h-3 text-white" />
                      </div>
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
    </>
  )
}
