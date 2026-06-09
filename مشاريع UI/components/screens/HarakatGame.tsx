'use client'

import React, { useState, useEffect } from 'react'
import { Button, ProgressBar, Feedback, SoundButton } from '../DesignSystem'
import { Mascot } from '../Mascot'
import { useSound } from '@/hooks/useSound'
import { useTTS } from '@/hooks/useTTS'

interface HarakatQuestion {
  letter: string
  haraka: string
  harakaName: string
  sound: string
  options: { id: string; label: string; symbol: string }[]
  correct: string
}

export function HarakatGame() {
  const { play } = useSound()
  const { speak, speakInstruction, speakWord, isSpeaking } = useTTS()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)
  const [score, setScore] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)

  const questions: HarakatQuestion[] = [
    {
      letter: 'ب',
      haraka: 'بَ',
      harakaName: 'الفتحة',
      sound: '(بـَـــا)',
      options: [
        { id: 'fatha', label: 'الفتحة', symbol: 'َ' },
        { id: 'damma', label: 'الضمة', symbol: 'ُ' },
        { id: 'kasra', label: 'الكسرة', symbol: 'ِ' },
        { id: 'sukun', label: 'السكون', symbol: 'ْ' },
      ],
      correct: 'fatha',
    },
    {
      letter: 'ت',
      haraka: 'تُ',
      harakaName: 'الضمة',
      sound: '(تـُـــو)',
      options: [
        { id: 'fatha', label: 'الفتحة', symbol: 'َ' },
        { id: 'damma', label: 'الضمة', symbol: 'ُ' },
        { id: 'kasra', label: 'الكسرة', symbol: 'ِ' },
        { id: 'sukun', label: 'السكون', symbol: 'ْ' },
      ],
      correct: 'damma',
    },
    {
      letter: 'ج',
      haraka: 'جِ',
      harakaName: 'الكسرة',
      sound: '(جـِـــي)',
      options: [
        { id: 'fatha', label: 'الفتحة', symbol: 'َ' },
        { id: 'damma', label: 'الضمة', symbol: 'ُ' },
        { id: 'kasra', label: 'الكسرة', symbol: 'ِ' },
        { id: 'sukun', label: 'السكون', symbol: 'ْ' },
      ],
      correct: 'kasra',
    },
  ]

  const question = questions[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100

  // Speak game intro and current letter
  useEffect(() => {
    if (!gameStarted) {
      setGameStarted(true)
      speakInstruction('اسمع الحرف وحدد الحركة الصحيحة')
    } else {
      speak(question.haraka, { rate: 0.8, pitch: 1.2 })
    }
  }, [currentQuestion, gameStarted, speak, speakInstruction])

  const handleAnswer = async (answerId: string) => {
    setSelectedAnswer(answerId)
    const correct = answerId === question.correct
    setIsCorrect(correct)
    if (correct) {
      setScore(score + 1)
      await play('correct')
      await speakInstruction('ممتاز! هذه هي الحركة الصحيحة')
    } else {
      await play('wrong')
      await speakInstruction('حاول مرة أخرى')
    }
    setShowFeedback(true)

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedAnswer(null)
        setShowFeedback(false)
      }
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-background text-foreground p-4 md:p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-primary">
          🎵 لعبة الحركات
        </h1>
        <Button variant="secondary" size="sm">
          ← خروج
        </Button>
      </div>

      {/* Progress */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <p className="font-bold">السؤال {currentQuestion + 1} من {questions.length}</p>
          <span className="text-lg font-bold">{score} ✓</span>
        </div>
        <ProgressBar value={progress} color="primary" showLabel={false} />
      </div>

      {/* Game Content */}
      {currentQuestion < questions.length && (
        <div className="max-w-2xl mx-auto">
          {/* Letter Display */}
          <div className="bg-white rounded-3xl p-8 shadow-lg mb-8 text-center border-4 border-primary">
            <p className="text-sm font-bold text-muted-foreground mb-2">
              اسمع الحرف وحدد الحركة:
            </p>
            <p className="text-8xl font-bold text-primary mb-6">
              {question.haraka}
            </p>

            <div className="flex justify-center mb-6">
              <SoundButton 
                size="lg" 
                onClick={async () => await speak(question.haraka, { rate: 0.8, pitch: 1.2 })}
                disabled={isSpeaking}
              />
            </div>

            <p className="text-muted-foreground text-sm">
              {question.sound}
            </p>
          </div>

          {/* Answer Options */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            {question.options.map((option) => {
              const isSelected = selectedAnswer === option.id
              const isAnswered = selectedAnswer !== null
              const isCorrectAnswer = option.id === question.correct

              let bgColor = 'bg-white hover:bg-blue-50'
              let borderColor = 'border-2 border-primary'
              let textColor = 'text-foreground'

              if (isAnswered) {
                if (isCorrectAnswer) {
                  bgColor = 'bg-success'
                  borderColor = 'border-4 border-green-600'
                  textColor = 'text-white'
                } else if (isSelected && !isCorrect) {
                  bgColor = 'bg-destructive animate-shake-small'
                  borderColor = 'border-4 border-red-600'
                  textColor = 'text-white'
                }
              }

              return (
                <button
                  key={option.id}
                  onClick={() => !isAnswered && handleAnswer(option.id)}
                  disabled={isAnswered}
                  className={`
                    p-6 rounded-3xl font-bold
                    ${bgColor} ${borderColor} ${textColor}
                    transition-all duration-300 transform
                    ${!isAnswered ? 'hover:scale-105 active:scale-95' : ''}
                    disabled:cursor-not-allowed
                    shadow-lg
                  `}
                >
                  <p className="text-2xl mb-2">{option.label}</p>
                  <p className="text-4xl">{option.symbol}</p>
                </button>
              )
            })}
          </div>

          {/* Feedback */}
          {showFeedback && (
            <div className="mb-8">
              {isCorrect ? (
                <Feedback type="success" message="🎉 ممتاز! هذه هي الحركة الصحيحة" />
              ) : (
                <Feedback type="error" message="😅 ليست هذه الحركة، حاول مرة أخرى" />
              )}
            </div>
          )}

          {/* Educational Info */}
          <div className="bg-yellow-100 rounded-3xl p-6 border-4 border-accent">
            <p className="font-bold text-center mb-2">📖 شرح الحركات</p>
            <p className="text-sm text-center">
              الحركات: الفتحة (َ), الضمة (ُ), الكسرة (ِ), السكون (ْ)
            </p>
          </div>
        </div>
      )}

      {/* Game Complete */}
      {currentQuestion >= questions.length && (
        <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 shadow-lg">
          <div className="text-center space-y-6">
            <Mascot type="bird" size="lg" />

            <h2 className="text-4xl font-bold text-primary">
              أحسنت! تعلمت الحركات 🎉
            </h2>

            <div className="bg-purple-100 rounded-3xl p-6">
              <p className="text-2xl font-bold">
                حصلت على {score} من {questions.length} نجمة ⭐
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                {score === questions.length
                  ? '👑 مثالي! أنت محترف!'
                  : score >= 2
                    ? '🌟 ممتاز!'
                    : '💪 جيد! استمر في التدريب'}
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <Button 
                variant="primary" 
                size="lg" 
                className="w-full"
                onClick={() => window.location.reload()}
              >
                العب مرة أخرى 🔄
              </Button>
              <button 
                onClick={() => window.location.reload()}
                className="w-full bg-secondary text-secondary-foreground hover:opacity-90 active:scale-95 transition-all duration-200 font-bold px-6 py-3 rounded-xl text-lg"
              >
                اختر لعبة أخرى 🎮
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
