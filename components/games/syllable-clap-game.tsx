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

interface SyllableClapGameProps {
  gameData: GameConfig
  lessonId: string
  onComplete: (result: GameResult) => void
  onBack: () => void
}

export function SyllableClapGame({ gameData, lessonId, onComplete, onBack }: SyllableClapGameProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [wrongAnswers, setWrongAnswers] = useState(0)
  const [attempts, setAttempts] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)
  const [message, setMessage] = useState('')
  const [claps, setClaps] = useState<number[]>([])

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
    setClaps([])
  }, [currentQuestionIndex])

  const handleClap = () => {
    playSound('pop')
    setClaps(prev => [...prev, Date.now()])
    
    // Remove clap after animation
    setTimeout(() => {
      setClaps(prev => prev.slice(1))
    }, 500)
  }

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
        {/* Clapping hands */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center mb-8"
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleClap}
            className="relative w-32 h-32 bg-gradient-to-br from-accent to-yellow-400 rounded-full flex items-center justify-center text-6xl shadow-xl"
          >
            <span className="animate-bounce-slow">👏</span>
            
            {/* Clap effects */}
            <AnimatePresence>
              {claps.map((clapId) => (
                <motion.div
                  key={clapId}
                  initial={{ scale: 0.5, opacity: 1 }}
                  animate={{ scale: 2, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 rounded-full border-4 border-accent"
                />
              ))}
            </AnimatePresence>
          </motion.button>
        </motion.div>

        {/* Syllables display */}
        {currentQuestion.syllables && isCorrect && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center gap-2 mb-6"
          >
            {currentQuestion.syllables.map((syllable, i) => (
              <motion.span
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.15 }}
                className="bg-primary text-primary-foreground px-4 py-2 rounded-xl text-xl font-bold"
              >
                {syllable}
              </motion.span>
            ))}
          </motion.div>
        )}

        {/* Options */}
        <div className="flex justify-center gap-4 mb-6">
          {currentQuestion.options.map((option, i) => {
            const isSelected = selectedAnswer === option
            const isCorrectAnswer = option === currentQuestion.correctAnswer
            const showResult = isCorrect !== null && isSelected

            return (
              <motion.button
                key={option}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                whileHover={{ scale: isCorrect === null ? 1.1 : 1 }}
                whileTap={{ scale: isCorrect === null ? 0.95 : 1 }}
                onClick={() => handleAnswer(option)}
                disabled={isCorrect === true}
                className={`
                  relative w-20 h-20 rounded-full text-3xl font-bold
                  transition-all duration-300 shadow-lg
                  ${isCorrect === null
                    ? 'bg-white hover:bg-primary/10 text-foreground'
                    : ''
                  }
                  ${showResult && isCorrect
                    ? 'bg-success text-white ring-4 ring-success/50'
                    : ''
                  }
                  ${showResult && !isCorrect
                    ? 'bg-destructive text-white ring-4 ring-destructive/50'
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
                    className="absolute -top-1 -right-1"
                  >
                    {isCorrect ? (
                      <div className="w-6 h-6 bg-success rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    ) : (
                      <div className="w-6 h-6 bg-destructive rounded-full flex items-center justify-center">
                        <X className="w-4 h-4 text-white" />
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
