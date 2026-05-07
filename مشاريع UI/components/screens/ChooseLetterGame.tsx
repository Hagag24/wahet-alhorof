'use client'

import React, { useState, useEffect } from 'react'
import { Button, ProgressBar, StarRating, SoundButton, Feedback } from '../DesignSystem'
import { Mascot } from '../Mascot'
import { useSound } from '@/hooks/useSound'
import { useTTS } from '@/hooks/useTTS'

export function ChooseLetterGame() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const { play } = useSound()
  const { speak, speakLetter, speakFeedback, isSpeaking } = useTTS()

  const questions = [
    {
      question: 'اختر حرف الباء',
      sound: '🔊 (بــــــــاء)',
      options: ['ت', 'ب', 'ج', 'ح'],
      correct: 1,
    },
    {
      question: 'اختر حرف التاء',
      sound: '🔊 (تــــــــاء)',
      options: ['ب', 'ت', 'ج', 'خ'],
      correct: 1,
    },
    {
      question: 'اختر حرف الجيم',
      sound: '🔊 (جــــــــيم)',
      options: ['ح', 'ج', 'د', 'ب'],
      correct: 1,
    },
  ]

  const handleAnswer = async (index: number) => {
    setSelectedAnswer(index)
    const correct = index === questions[currentQuestion].correct
    setIsCorrect(correct)
    
    if (correct) {
      setScore(score + 1)
      await play('correct')
      await speakFeedback(true)
    } else {
      await play('wrong')
      await speakFeedback(false)
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

  const progress = ((currentQuestion + 1) / questions.length) * 100

  // Speak the question when it changes
  useEffect(() => {
    if (!isSpeaking) {
      const question = questions[currentQuestion]
      const letter = question.options[question.correct]
      speakLetter(letter)
    }
  }, [currentQuestion, isSpeaking])

  const handlePlayAgain = async () => {
    await play('click')
    setCurrentQuestion(0)
    setScore(0)
    setSelectedAnswer(null)
    setShowFeedback(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-background text-foreground p-4 md:p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-primary">
          🔤 لعبة تمييز الحروف
        </h1>
        <Button variant="secondary" size="sm">
          ← خروج
        </Button>
      </div>

      {/* Progress Bar */}
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
          {/* Mascot and Question */}
          <div className="grid md:grid-cols-2 gap-8 mb-8 items-center">
            <div className="flex justify-center">
              <Mascot type="cat" size="lg" animate={true} />
            </div>

            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-center md:text-right">
                {questions[currentQuestion].question}
              </h2>

              <div className="flex justify-center md:justify-end gap-3">
                <SoundButton 
                  size="lg" 
                  onClick={async () => {
                    const letter = questions[currentQuestion].options[questions[currentQuestion].correct]
                    await speakLetter(letter)
                  }}
                  disabled={isSpeaking}
                />
              </div>

              <p className="text-center md:text-right text-muted-foreground italic">
                اضغط على الزر أعلاه لتسمع الحرف
              </p>
            </div>
          </div>

          {/* Answer Cards */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            {questions[currentQuestion].options.map((letter, index) => {
              const isSelected = selectedAnswer === index
              const isAnswered = selectedAnswer !== null

              let bgColor = 'bg-white hover:bg-blue-50'
              let borderColor = 'border-2 border-primary'
              let textColor = 'text-primary'

              if (isAnswered) {
                if (index === questions[currentQuestion].correct) {
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
                  key={index}
                  onClick={() => !isAnswered && handleAnswer(index)}
                  disabled={isAnswered}
                  className={`
                    p-6 md:p-8 rounded-3xl font-bold text-5xl md:text-6xl
                    ${bgColor} ${borderColor} ${textColor}
                    transition-all duration-300 transform
                    ${!isAnswered ? 'hover:scale-105 active:scale-95' : ''}
                    disabled:cursor-not-allowed
                    shadow-lg
                  `}
                >
                  {letter}
                </button>
              )
            })}
          </div>

          {/* Feedback Message */}
          {showFeedback && (
            <div className="mb-8">
              {isCorrect ? (
                <Feedback type="success" message="🎉 ممتاز يا بطل! إجابة صحيحة" />
              ) : (
                <Feedback type="error" message="😅 حاول مرة أخرى يا بطل، أنت على الطريق الصحيح" />
              )}
            </div>
          )}

          {/* Hint Button */}
          {!showFeedback && (
            <div className="text-center">
              <Button variant="secondary" size="md">
                💡 تلميح
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Game Complete */}
      {currentQuestion >= questions.length && (
        <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 shadow-lg">
          <div className="text-center space-y-6">
            <Mascot type="star" size="lg" />

            <h2 className="text-4xl font-bold text-primary">
              مبروك! لقد انتهيت من اللعبة 🎉
            </h2>

            <div className="bg-yellow-100 rounded-3xl p-6">
              <p className="text-2xl font-bold">
                حصلت على {score} من {questions.length} نجمة ⭐
              </p>
              <div className="mt-4 flex justify-center">
                <StarRating rating={score} maxStars={3} />
              </div>
            </div>

            <p className="text-lg text-muted-foreground">
              {score === questions.length
                ? '👑 أداء مثالي! أنت نجم حقيقي!'
                : score >= 2
                  ? '🌟 تقدم رائع! استمر في التدريب'
                  : '💪 جيد جداً! حاول مرة أخرى لتحسين أدائك'}
            </p>

            <div className="flex flex-col gap-4">
              <Button 
                variant="primary" 
                size="lg" 
                className="w-full"
                onClick={handlePlayAgain}
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
