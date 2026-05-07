'use client'

import React, { useEffect, useState } from 'react'
import { Button, StarRating, ProgressBar } from '../DesignSystem'
import { Mascot } from '../Mascot'
import { useSound } from '@/hooks/useSound'

interface GameResultsProps {
  score: number
  maxScore: number
  gameName?: string
  newBadge?: string
}

export function GameResults({
  score,
  maxScore,
  gameName = 'اللعبة',
  newBadge,
}: GameResultsProps) {
  const { play } = useSound()
  const [showConfetti, setShowConfetti] = useState(true)
  const percentage = (score / maxScore) * 100
  const starsEarned = Math.ceil((score / maxScore) * 3)

  useEffect(() => {
    if (percentage === 100) {
      play('celebrate')
    } else if (percentage >= 80) {
      play('levelUp')
    } else if (percentage >= 60) {
      play('success')
    }
  }, [])

  const getMessage = () => {
    if (percentage === 100) {
      return {
        title: '👑 أداء مثالي!',
        message: 'أنت نجم حقيقي! اكمل هكذا',
      }
    } else if (percentage >= 80) {
      return {
        title: '🌟 ممتاز جداً!',
        message: 'أداء رائع! استمر هكذا',
      }
    } else if (percentage >= 60) {
      return {
        title: '👍 جيد جداً!',
        message: 'تقدم جيد! حاول مرة أخرى لتحسين أدائك',
      }
    } else {
      return {
        title: '💪 جيد!',
        message: 'لا بأس! حاول مرة أخرى وستحسن أدائك',
      }
    }
  }

  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => setShowConfetti(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [showConfetti])

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-background text-foreground p-4 md:p-8 flex items-center justify-center">
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: Math.random() * 100 + '%',
                top: -10,
                animationDelay: Math.random() * 0.5 + 's',
              } as React.CSSProperties}
            >
              ⭐
            </div>
          ))}
        </div>
      )}

      {/* Result Card */}
      <div className="max-w-2xl w-full bg-white rounded-3xl p-8 md:p-12 shadow-2xl border-4 border-primary space-y-8">
        {/* Character */}
        <div className="flex justify-center">
          <Mascot type="star" size="lg" />
        </div>

        {/* Main Message */}
        <div className="text-center space-y-3">
          <h1 className="text-4xl md:text-5xl font-bold text-primary">
            {getMessage().title}
          </h1>
          <p className="text-xl text-muted-foreground">
            {getMessage().message}
          </p>
        </div>

        {/* Score Display */}
        <div className="bg-gradient-to-r from-primary to-secondary rounded-3xl p-8 text-white text-center space-y-4">
          <p className="text-sm font-bold opacity-90">النتيجة النهائية</p>
          <p className="text-6xl font-bold">
            {score}/{maxScore}
          </p>
          <div className="h-2 bg-white/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-1000"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <p className="text-lg font-bold">{Math.round(percentage)}%</p>
        </div>

        {/* Stars Earned */}
        <div className="bg-yellow-100 rounded-3xl p-6 border-4 border-accent text-center space-y-4">
          <p className="font-bold text-lg">النجوم المكتسبة</p>
          <div className="flex justify-center gap-2">
            {[...Array(3)].map((_, i) => (
              <span
                key={i}
                className={`text-4xl transition-all duration-500 ${
                  i < starsEarned
                    ? 'animate-stars'
                    : 'opacity-20 grayscale'
                }`}
              >
                ⭐
              </span>
            ))}
          </div>
        </div>

        {/* New Badge */}
        {newBadge && (
          <div className="bg-purple-100 rounded-3xl p-6 border-4 border-primary text-center space-y-3">
            <p className="text-sm font-bold">🏆 شارة جديدة!</p>
            <p className="text-3xl">{newBadge}</p>
            <p className="text-sm text-muted-foreground">
              لقد حصلت على شارة جديدة رائعة!
            </p>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center bg-blue-50 rounded-2xl p-4">
            <p className="text-2xl font-bold text-secondary">{score}</p>
            <p className="text-xs font-bold text-muted-foreground">إجابات صحيحة</p>
          </div>
          <div className="text-center bg-purple-50 rounded-2xl p-4">
            <p className="text-2xl font-bold text-primary">{maxScore - score}</p>
            <p className="text-xs font-bold text-muted-foreground">إجابات خاطئة</p>
          </div>
          <div className="text-center bg-pink-50 rounded-2xl p-4">
            <p className="text-2xl font-bold text-accent-pink">{starsEarned}</p>
            <p className="text-xs font-bold text-muted-foreground">نجوم</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button 
            variant="primary" 
            size="lg" 
            className="w-full font-bold text-lg"
            onClick={() => window.location.reload()}
          >
            🔄 العب مرة أخرى
          </Button>
          <button 
            onClick={() => window.location.reload()}
            className="w-full bg-secondary text-secondary-foreground hover:opacity-90 active:scale-95 transition-all duration-200 font-bold px-6 py-3 rounded-xl text-lg"
          >
            🎮 لعبة أخرى
          </button>
        </div>

        {/* Progress to Next Level */}
        <div className="space-y-3">
          <p className="font-bold text-center text-sm">التقدم نحو المستوى التالي</p>
          <ProgressBar value={65} max={100} color="success" />
          <p className="text-center text-xs text-muted-foreground">
            احتاج {35} نقطة أخرى
          </p>
        </div>

        {/* Motivational Message */}
        <div className="bg-gradient-to-r from-pink-100 to-yellow-100 rounded-3xl p-6 text-center border-2 border-accent-pink">
          <p className="font-bold text-lg">
            💪 أنت في الطريق الصحيح! استمر في التعلم والتدريب
          </p>
        </div>
      </div>
    </div>
  )
}
