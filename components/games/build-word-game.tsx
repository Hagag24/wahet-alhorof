'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence, Reorder } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { GameWrapper } from './game-wrapper'
import { StarRating } from '@/components/common/star-rating'
import { Confetti } from '@/components/common/confetti'
import { GameConfig, GameResult } from '@/types'
import { useSound } from '@/hooks/use-sound'
import { getRandomMessage } from '@/data/rewards'
import { Check, RotateCcw } from 'lucide-react'

interface BuildWordGameProps {
  gameData: GameConfig
  lessonId: string
  onComplete: (result: GameResult) => void
  onBack: () => void
}

const wordToEmoji: Record<string, string> = {
  'أميرة': '👸',
  'أسرة': '👨‍👩‍👧',
  'حديقة': '🌻',
  'غابة': '🌲',
  'شجرة': '🌳',
  'حيوان': '🐾',
}

export function BuildWordGame({ gameData, lessonId, onComplete, onBack }: BuildWordGameProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedParts, setSelectedParts] = useState<string[]>([])
  const [availableParts, setAvailableParts] = useState<string[]>([])
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
    // Shuffle parts for new question
    const parts = currentQuestion.parts || []
    const shuffled = [...parts].sort(() => Math.random() - 0.5)
    setAvailableParts(shuffled)
    setSelectedParts([])
    setIsCorrect(null)
    setAttempts(0)
    setMessage('')
  }, [currentQuestionIndex, currentQuestion.parts])

  const handleSelectPart = (part: string) => {
    if (isCorrect !== null) return
    playSound('pop')
    setSelectedParts(prev => [...prev, part])
    setAvailableParts(prev => prev.filter((p, i) => i !== prev.indexOf(part)))
  }

  const handleRemovePart = (index: number) => {
    if (isCorrect !== null) return
    playSound('click')
    const part = selectedParts[index]
    setSelectedParts(prev => prev.filter((_, i) => i !== index))
    setAvailableParts(prev => [...prev, part])
  }

  const handleReset = () => {
    playSound('click')
    const parts = currentQuestion.parts || []
    const shuffled = [...parts].sort(() => Math.random() - 0.5)
    setAvailableParts(shuffled)
    setSelectedParts([])
    setIsCorrect(null)
    setMessage('')
  }

  const handleCheck = () => {
    const builtWord = selectedParts.join('')
    const correct = builtWord === currentQuestion.correctAnswer

    setAttempts(prev => prev + 1)

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
        setIsCorrect(null)
      }, 1000)
    }
  }

  const correctWord = currentQuestion.correctAnswer as string
  const emoji = wordToEmoji[correctWord] || '🧩'

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
        {/* Target word display when correct */}
        <AnimatePresence>
          {isCorrect && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex justify-center mb-6"
            >
              <div className="bg-success/20 rounded-2xl px-8 py-4 flex items-center gap-4">
                <span className="text-5xl">{emoji}</span>
                <span className="text-3xl font-bold text-success">{correctWord}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Build area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`
            min-h-[80px] bg-white rounded-2xl shadow-lg mb-6 p-4
            flex items-center justify-center gap-2 flex-wrap
            border-2 border-dashed
            ${isCorrect === true
              ? 'border-success bg-success/10'
              : isCorrect === false
              ? 'border-destructive bg-destructive/10'
              : 'border-primary/30'
            }
          `}
        >
          {selectedParts.length === 0 ? (
            <p className="text-muted-foreground">اضغط على المقاطع لتركيب الكلمة</p>
          ) : (
            selectedParts.map((part, i) => (
              <motion.button
                key={`selected-${i}`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleRemovePart(i)}
                disabled={isCorrect !== null}
                className={`
                  px-5 py-3 rounded-xl text-2xl font-bold
                  transition-colors shadow-md
                  ${isCorrect === true
                    ? 'bg-success text-white'
                    : isCorrect === false
                    ? 'bg-destructive text-white'
                    : 'bg-primary text-primary-foreground hover:bg-primary/90'
                  }
                `}
              >
                {part}
              </motion.button>
            ))
          )}
        </motion.div>

        {/* Available parts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap justify-center gap-3 mb-6"
        >
          {availableParts.map((part, i) => (
            <motion.button
              key={`available-${i}`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              whileHover={{ scale: 1.1, rotate: [-2, 2, 0] }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleSelectPart(part)}
              disabled={isCorrect !== null}
              className="px-6 py-4 bg-accent/30 hover:bg-accent/50 rounded-xl text-2xl font-bold text-foreground shadow-md transition-colors"
            >
              {part}
            </motion.button>
          ))}
        </motion.div>

        {/* Actions */}
        <div className="flex gap-3 mb-6">
          <Button
            variant="outline"
            onClick={handleReset}
            disabled={isCorrect !== null || selectedParts.length === 0}
            className="flex-1 py-6 text-lg gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            إعادة
          </Button>
          <Button
            onClick={handleCheck}
            disabled={isCorrect !== null || selectedParts.length === 0}
            className="flex-1 py-6 text-lg gap-2 bg-primary"
          >
            <Check className="w-5 h-5" />
            تحقق
          </Button>
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
