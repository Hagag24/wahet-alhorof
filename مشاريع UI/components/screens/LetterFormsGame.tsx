'use client'

import React, { useState, useEffect } from 'react'
import { Button, ProgressBar, Feedback } from '../DesignSystem'
import { Mascot } from '../Mascot'
import { useSound } from '@/hooks/useSound'
import { useTTS } from '@/hooks/useTTS'

interface LetterForm {
  position: string
  shape: string
  example: string
  placed: boolean
}

export function LetterFormsGame() {
  const { play } = useSound()
  const { speakWord, speakInstruction } = useTTS()
  const [gameStarted, setGameStarted] = useState(false)
  const [forms, setForms] = useState<Record<string, LetterForm>>({
    isolated: {
      position: 'منفصل',
      shape: 'م',
      example: 'مثال: م',
      placed: false,
    },
    beginning: {
      position: 'أول الكلمة',
      shape: 'مـ',
      example: 'مثال: موز',
      placed: false,
    },
    middle: {
      position: 'وسط الكلمة',
      shape: 'ـمـ',
      example: 'مثال: جمل',
      placed: false,
    },
    end: {
      position: 'آخر الكلمة',
      shape: 'ـم',
      example: 'مثال: قلم',
      placed: false,
    },
  })

  const [selectedForm, setSelectedForm] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<{
    show: boolean
    correct: boolean
  }>({ show: false, correct: false })

  const availableShapes = [
    { id: 'isolated', label: 'م' },
    { id: 'beginning', label: 'مـ' },
    { id: 'middle', label: 'ـمـ' },
    { id: 'end', label: 'ـم' },
  ]

  useEffect(() => {
    if (!gameStarted) {
      setGameStarted(true)
      speakInstruction('اختر شكل الحرف الصحيح في كل موضع')
      speakWord('ميم')
    }
  }, [gameStarted, speakInstruction, speakWord])

  const handlePlace = async (formId: string) => {
    if (selectedForm) {
      const isCorrect = formId === selectedForm
      if (isCorrect) {
        setForms((prev) => ({
          ...prev,
          [formId]: { ...prev[formId], placed: true },
        }))
        await play('correct')
        await speakInstruction('ممتاز!')
      } else {
        await play('wrong')
      }

      setFeedback({ show: true, correct: isCorrect })
      setSelectedForm(null)

      setTimeout(() => {
        setFeedback({ show: false, correct: false })
      }, 1500)
    }
  }

  const placedCount = Object.values(forms).filter((f) => f.placed).length
  const progress = (placedCount / Object.keys(forms).length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-b from-mint-50 to-background text-foreground p-4 md:p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-primary">
          🔤 أشكال حرف الميم
        </h1>
        <Button variant="secondary" size="sm">
          ← خروج
        </Button>
      </div>

      {/* Progress */}
      <div className="mb-8">
        <p className="font-bold mb-2">
          {placedCount} من {Object.keys(forms).length} أشكال
        </p>
        <ProgressBar value={progress} color="primary" />
      </div>

      {/* Main Letter Display */}
      <div className="text-center mb-8">
        <div className="inline-block bg-white rounded-3xl p-8 shadow-lg border-4 border-primary">
          <p className="text-sm font-bold text-muted-foreground mb-2">
            الحرف الأساسي
          </p>
          <p className="text-9xl font-bold text-primary">م</p>
        </div>
      </div>

      {/* Game Area */}
      <div className="max-w-4xl mx-auto mb-8">
        {/* Form Positions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {Object.entries(forms).map(([key, form]) => (
            <button
              key={key}
              onClick={() => handlePlace(key)}
              disabled={form.placed}
              className={`
                p-6 rounded-3xl border-4 text-center transition-all duration-300
                ${
                  form.placed
                    ? 'bg-success border-green-600 opacity-50'
                    : selectedForm === key
                      ? 'bg-yellow-100 border-yellow-500 scale-105 shadow-2xl'
                      : 'bg-white border-primary hover:scale-105 shadow-lg'
                }
              `}
            >
              <p className="text-sm font-bold text-muted-foreground mb-2">
                {form.position}
              </p>
              <p className="text-6xl font-bold text-primary mb-2">
                {form.shape}
              </p>
              <p className="text-xs text-muted-foreground italic">
                {form.example}
              </p>
            </button>
          ))}
        </div>

        {/* Available Shapes */}
        <div className="bg-purple-100 rounded-3xl p-6 border-4 border-primary mb-8">
          <p className="font-bold mb-4 text-center">
            اختر الشكل الصحيح وضعه في مكانه:
          </p>
          <div className="grid grid-cols-4 gap-4">
            {availableShapes.map((shape) => {
              const isPlaced = forms[shape.id]?.placed
              const isSelected = selectedForm === shape.id

              return (
                <button
                  key={shape.id}
                  onClick={() => !isPlaced && setSelectedForm(isSelected ? null : shape.id)}
                  disabled={isPlaced}
                  className={`
                    p-4 rounded-2xl border-4 text-4xl font-bold
                    transition-all duration-300
                    ${
                      isPlaced
                        ? 'bg-gray-300 border-gray-500 opacity-30 cursor-not-allowed'
                        : isSelected
                          ? 'bg-yellow-200 border-yellow-500 scale-110 shadow-lg'
                          : 'bg-white border-primary hover:scale-105'
                    }
                  `}
                >
                  {shape.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Feedback */}
        {feedback.show && (
          <div>
            {feedback.correct ? (
              <Feedback type="success" message="✓ ممتاز! وضعت الشكل في المكان الصحيح" />
            ) : (
              <Feedback type="error" message="😅 هذا ليس المكان الصحيح، حاول مرة أخرى" />
            )}
          </div>
        )}
      </div>

      {/* Game Complete */}
      {placedCount === Object.keys(forms).length && (
        <div 
          className="max-w-2xl mx-auto bg-white rounded-3xl p-8 shadow-lg space-y-6 animate-slide-up"
          onAnimationEnd={() => play('celebrate')}
        >
          <div className="text-center">
            <Mascot type="robot" size="lg" />

            <h2 className="text-4xl font-bold text-primary mt-6">
              ممتاز! تعلمت أشكال حرف الميم 🎉
            </h2>

            <p className="text-lg text-muted-foreground mt-4">
              الآن تعرف كيف يتغير شكل الحرف حسب موقعه في الكلمة
            </p>

            <div className="bg-blue-100 rounded-3xl p-6 mt-6">
              <p className="text-2xl font-bold">⭐ ⭐ ⭐</p>
              <p className="text-sm text-muted-foreground mt-2">
                حصلت على 3 نجوم
              </p>
            </div>

            <div className="flex flex-col gap-4 mt-6">
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
                تعلم حرف آخر 📖
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Educational Note */}
      <div className="max-w-2xl mx-auto mt-8 bg-mint-100 rounded-3xl p-6 border-4 border-accent-mint">
        <p className="font-bold text-center text-sm">
          💡 في اللغة العربية، شكل الحرف يتغير حسب مكانه في الكلمة: أول، وسط، آخر، أو منفصل
        </p>
      </div>
    </div>
  )
}
