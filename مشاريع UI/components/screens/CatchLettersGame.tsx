'use client'

import React, { useState, useEffect } from 'react'
import { Button, ProgressBar, Feedback } from '../DesignSystem'
import { Mascot } from '../Mascot'
import { useSound } from '@/hooks/useSound'
import { useTTS } from '@/hooks/useTTS'

interface FloatingLetter {
  id: number
  letter: string
  x: number
  y: number
  isTarget: boolean
}

export function CatchLettersGame() {
  const [gameActive, setGameActive] = useState(true)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(30)
  const [floatingLetters, setFloatingLetters] = useState<FloatingLetter[]>([])
  const [lastId, setLastId] = useState(0)
  const targetLetter = 'ب'
  const { play } = useSound()
  const { speakInstruction, speakLetter } = useTTS()
  const [gameStarted, setGameStarted] = useState(false)

  // Speak game instructions on start
  useEffect(() => {
    if (gameActive && !gameStarted) {
      setGameStarted(true)
      speakInstruction(`اصطد جميع حروف ${targetLetter}. لديك 30 ثانية!`)
      speakLetter(targetLetter)
    }
  }, [gameActive, gameStarted, speakInstruction, speakLetter, targetLetter])

  // Generate new letters
  useEffect(() => {
    if (!gameActive) return

    const interval = setInterval(() => {
      const letters = ['ب', 'ت', 'ج', 'ح', 'د', 'ف']
      const randomLetter =
        Math.random() > 0.4 ? targetLetter : letters[Math.floor(Math.random() * letters.length)]

      setLastId((prev) => {
        const newId = prev + 1
        setFloatingLetters((prev) => [
          ...prev,
          {
            id: newId,
            letter: randomLetter,
            x: Math.random() * 80,
            y: -10,
            isTarget: randomLetter === targetLetter,
          },
        ])
        return newId
      })
    }, 800)

    return () => clearInterval(interval)
  }, [gameActive])

  // Move letters down and remove off-screen
  useEffect(() => {
    if (!gameActive) return

    const interval = setInterval(() => {
      setFloatingLetters((prev) =>
        prev
          .map((letter) => ({
            ...letter,
            y: letter.y + 2,
          }))
          .filter((letter) => letter.y < 100)
      )
    }, 30)

    return () => clearInterval(interval)
  }, [gameActive])

  // Timer
  useEffect(() => {
    if (!gameActive) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameActive(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [gameActive])

  const handleLetterClick = async (id: number, isTarget: boolean) => {
    if (isTarget) {
      setScore(score + 1)
      setFloatingLetters((prev) => prev.filter((l) => l.id !== id))
      await play('collect')
      if (score === 4) {
        await speakInstruction('ممتاز! أحسنت!')
      }
    } else {
      await play('wrong')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-200 via-blue-100 to-blue-50 text-foreground p-4 md:p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-primary">
            🎯 اصطاد حرف {targetLetter}
          </h1>
          <p className="text-muted-foreground">اضغط على كل {targetLetter} قبل أن تسقط!</p>
        </div>
        <Button variant="secondary" size="sm">
          ← خروج
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-3xl p-4 text-center shadow-lg">
          <p className="text-4xl font-bold text-primary">{score}</p>
          <p className="font-bold text-sm">الحروف المقبوضة</p>
        </div>
        <div className="bg-white rounded-3xl p-4 text-center shadow-lg">
          <p className="text-4xl font-bold text-secondary">{timeLeft}</p>
          <p className="font-bold text-sm">الثواني المتبقية</p>
        </div>
        <div className="bg-white rounded-3xl p-4 text-center shadow-lg">
          <p className="text-4xl font-bold text-accent">
            {floatingLetters.length}
          </p>
          <p className="font-bold text-sm">على الشاشة</p>
        </div>
      </div>

      {/* Game Area */}
      {gameActive && (
        <div className="relative bg-gradient-to-b from-cyan-200 to-blue-100 rounded-3xl overflow-hidden h-96 shadow-2xl border-4 border-primary mb-8">
          {/* Floating Letters */}
          {floatingLetters.map((item) => (
            <button
              key={item.id}
              onClick={() => handleLetterClick(item.id, item.isTarget)}
              style={{
                position: 'absolute',
                left: `${item.x}%`,
                top: `${item.y}%`,
                transition: 'transform 0.1s',
              }}
              className={`
                w-16 h-16 rounded-full font-bold text-4xl
                transition-all duration-150 transform hover:scale-125
                ${
                  item.isTarget
                    ? 'bg-accent text-foreground border-4 border-yellow-600 shadow-lg'
                    : 'bg-blue-300 text-white border-4 border-blue-500 shadow-md opacity-80'
                }
              `}
            >
              {item.letter}
            </button>
          ))}

          {/* Mascot */}
          <div className="absolute bottom-4 left-4 w-20 h-20">
            <Mascot type="cat" size="sm" animate={true} />
          </div>
        </div>
      )}

      {/* Game Over */}
      {!gameActive && (
        <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 shadow-lg space-y-6">
          <div className="text-center">
            <Mascot type="rabbit" size="lg" />

            <h2 className="text-4xl font-bold text-primary mt-6">
              انتهت اللعبة! 🏁
            </h2>

            <div className="bg-yellow-100 rounded-3xl p-6 mt-6">
              <p className="text-3xl font-bold mb-4">
                حصلت على {score} {targetLetter}
              </p>
              <ProgressBar value={score} max={20} color="primary" />
              <p className="text-sm text-muted-foreground mt-2">
                {score >= 15
                  ? '👑 أداء مثالي!'
                  : score >= 10
                    ? '🌟 ممتاز!'
                    : score >= 5
                      ? '👍 جيد!'
                      : '💪 حاول مرة أخرى'}
              </p>
            </div>

            <div className="flex flex-col gap-4 mt-6">
              <Button 
                variant="primary" 
                size="lg" 
                className="w-full"
                onClick={() => {
                  setGameActive(true)
                  setScore(0)
                  setTimeLeft(30)
                  setFloatingLetters([])
                }}
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

      {/* Instructions */}
      <div className="max-w-2xl mx-auto mt-8 bg-purple-100 rounded-3xl p-6 border-4 border-primary">
        <p className="font-bold text-center">
          💡 اضغط على الحرف الأصفر فقط ({targetLetter}), لا تضغط على الحروف الأخرى!
        </p>
      </div>
    </div>
  )
}
