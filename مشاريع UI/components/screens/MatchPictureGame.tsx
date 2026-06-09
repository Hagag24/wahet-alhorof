'use client'

import React, { useState, useEffect } from 'react'
import { Button, ProgressBar, Feedback, SoundButton } from '../DesignSystem'
import { Mascot } from '../Mascot'
import { useSound } from '@/hooks/useSound'
import { useTTS } from '@/hooks/useTTS'

interface MatchItem {
  id: number
  word: string
  emoji: string
  matched: boolean
}

export function MatchPictureGame() {
  const { play } = useSound()
  const { speakWord, speakInstruction, isSpeaking } = useTTS()
  const [gameStarted, setGameStarted] = useState(false)
  const [matches, setMatches] = useState<MatchItem[]>([
    { id: 1, word: 'أسد', emoji: '🦁', matched: false },
    { id: 2, word: 'تفاحة', emoji: '🍎', matched: false },
    { id: 3, word: 'كتاب', emoji: '📚', matched: false },
    { id: 4, word: 'قمر', emoji: '🌙', matched: false },
  ])

  const [selectedPicture, setSelectedPicture] = useState<number | null>(null)
  const [selectedWord, setSelectedWord] = useState<number | null>(null)
  const [feedback, setFeedback] = useState<{
    show: boolean
    correct: boolean
  }>({ show: false, correct: false })

  useEffect(() => {
    if (!gameStarted) {
      setGameStarted(true)
      speakInstruction('طابق الصور بالكلمات الصحيحة')
    }
  }, [gameStarted, speakInstruction])

  const handleSelection = async (pictureId: number | null, wordId: number | null) => {
    if (pictureId !== null && wordId !== null) {
      const isCorrect = pictureId === wordId
      const selectedMatch = matches.find(m => m.id === pictureId)

      if (isCorrect) {
        setMatches((prev) =>
          prev.map((item) =>
            item.id === pictureId ? { ...item, matched: true } : item
          )
        )
        await play('correct')
        if (selectedMatch) {
          await speakWord(selectedMatch.word)
        }
      } else {
        await play('wrong')
      }

      setFeedback({ show: true, correct: isCorrect })
      setSelectedPicture(null)
      setSelectedWord(null)

      setTimeout(() => {
        setFeedback({ show: false, correct: false })
      }, 1500)
    }
  }

  const matchedCount = matches.filter((m) => m.matched).length
  const progress = (matchedCount / matches.length) * 100

  const handlePictureClick = (id: number) => {
    if (!matches.find((m) => m.id === id)?.matched) {
      setSelectedPicture(id)
      if (selectedWord !== null) {
        handleSelection(id, selectedWord)
      }
    }
  }

  const handleWordClick = (id: number) => {
    if (!matches.find((m) => m.id === id)?.matched) {
      setSelectedWord(id)
      if (selectedPicture !== null) {
        handleSelection(selectedPicture, id)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-background text-foreground p-4 md:p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-primary">
          🖼️ وصّل الصورة بالكلمة
        </h1>
        <Button variant="secondary" size="sm">
          ← خروج
        </Button>
      </div>

      {/* Progress */}
      <div className="mb-8">
        <p className="font-bold mb-2">
          {matchedCount} من {matches.length} مطابقات
        </p>
        <ProgressBar value={progress} color="primary" />
      </div>

      {/* Main Game Area */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Pictures Column */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-right">الصور</h3>
            <div className="space-y-4">
              {matches.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handlePictureClick(item.id)}
                  disabled={item.matched}
                  className={`
                    w-full p-6 rounded-3xl font-bold text-4xl text-center
                    transition-all duration-300 transform
                    border-4
                    ${
                      item.matched
                        ? 'bg-success border-green-600 opacity-50'
                        : selectedPicture === item.id
                          ? 'bg-yellow-200 border-yellow-500 scale-105 shadow-2xl'
                          : 'bg-white border-primary hover:scale-105 shadow-lg'
                    }
                  `}
                >
                  <div className="flex items-center justify-center gap-3">
                    <span>{item.emoji}</span>
                    {selectedPicture === item.id && !item.matched && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          speakWord(item.word)
                        }}
                        disabled={isSpeaking}
                        className="text-xl hover:scale-110"
                      >
                        🔊
                      </button>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Words Column */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-right">الكلمات</h3>
            <div className="space-y-4">
              {matches
                .slice()
                .reverse()
                .map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleWordClick(item.id)}
                    disabled={item.matched}
                    className={`
                      w-full p-6 rounded-3xl font-bold text-2xl text-center
                      transition-all duration-300 transform
                      border-4
                      ${
                        item.matched
                          ? 'bg-success border-green-600 opacity-50'
                          : selectedWord === item.id
                            ? 'bg-blue-200 border-blue-500 scale-105 shadow-2xl'
                            : 'bg-white border-secondary hover:scale-105 shadow-lg'
                      }
                    `}
                  >
                    {item.word}
                  </button>
                ))}
            </div>
          </div>
        </div>

        {/* Feedback */}
        {feedback.show && (
          <div className="mt-8">
            {feedback.correct ? (
              <Feedback type="success" message="🎉 تطابق صحيح! ممتاز!" />
            ) : (
              <Feedback type="error" message="😅 حاول مرة أخرى يا بطل" />
            )}
          </div>
        )}
      </div>

      {/* Game Complete */}
      {matchedCount === matches.length && (
        <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 shadow-lg space-y-6">
          <div className="text-center">
            <Mascot type="bird" size="lg" />

            <h2 className="text-4xl font-bold text-primary mt-6">
              أحسنت! لقد وصّلت كل شيء بشكل صحيح 🎉
            </h2>

            <p className="text-lg text-muted-foreground mt-4">
              لقد أتممت اللعبة بنجاح وتعلمت كلمات جديدة
            </p>

            <div className="bg-yellow-100 rounded-3xl p-6 mt-6">
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
                اختر لعبة أخرى 🎮
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="max-w-2xl mx-auto mt-8 bg-pink-100 rounded-3xl p-6 border-4 border-accent-pink">
        <p className="font-bold text-center">
          💡 اختر صورة ثم اختر الكلمة المطابقة لها من اليمين
        </p>
      </div>
    </div>
  )
}
