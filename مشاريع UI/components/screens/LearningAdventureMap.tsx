'use client'

import React, { useState } from 'react'
import { Button, Badge, ProgressBar } from '../DesignSystem'
import { Mascot } from '../Mascot'

export function LearningAdventureMap() {
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null)

  const levels = [
    { id: 1, name: 'عالم حرف أ', status: 'completed', progress: 100 },
    { id: 2, name: 'عالم حرف ب', status: 'completed', progress: 100 },
    { id: 3, name: 'عالم حرف ت', status: 'completed', progress: 100 },
    { id: 4, name: 'عالم حرف ث', status: 'completed', progress: 100 },
    { id: 5, name: 'عالم حرف ج', status: 'active', progress: 65 },
    { id: 6, name: 'عالم حرف ح', status: 'locked', progress: 0 },
    { id: 7, name: 'عالم حرف خ', status: 'locked', progress: 0 },
    { id: 8, name: 'صندوق الكنز', status: 'locked', progress: 0 },
  ]

  const getLevelColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#3DDC97'
      case 'active':
        return '#7C5CFF'
      case 'locked':
        return '#D1D5DB'
      default:
        return '#E5E7EB'
    }
  }

  const getLevelIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return '✓'
      case 'active':
        return '🎮'
      case 'locked':
        return '🔒'
      default:
        return '?'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-background text-foreground p-4 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-2">
            🗺️ خريطة رحلتك
          </h1>
          <p className="text-lg text-muted-foreground">
            اختر مستوى لتبدأ المغامرة
          </p>
        </div>
        <Button variant="secondary" className="flex items-center gap-2">
          ← رجوع
        </Button>
      </div>

      {/* Progress Overview */}
      <div className="bg-white rounded-3xl p-6 mb-8 shadow-lg">
        <h3 className="font-bold text-xl mb-4">تقدمك الإجمالي</h3>
        <ProgressBar value={65} max={100} color="primary" />
        <p className="text-center text-sm text-muted-foreground mt-2">
          اكملت 5 من 8 مستويات
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 mb-8">
        {/* Game Path Visualization */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold mb-6">مسار المغامرة</h3>

            {/* SVG Path Visualization */}
            <div className="relative h-96 mb-8">
              <svg
                className="w-full h-full"
                viewBox="0 0 600 400"
                preserveAspectRatio="xMidYMid meet"
              >
                {/* Path */}
                <path
                  d="M 50,350 Q 100,300 150,280 T 300,200 T 450,150 T 550,100"
                  stroke="#FFD166"
                  strokeWidth="4"
                  fill="none"
                  strokeDasharray="5,5"
                />

                {/* Level Nodes */}
                {levels.map((level, index) => {
                  const x = 50 + (index * 65)
                  const y = 350 - (index * 40) + (index % 2 === 0 ? 50 : 0)

                  return (
                    <g
                      key={level.id}
                      onClick={() => setSelectedLevel(level.id)}
                      style={{ cursor: level.status !== 'locked' ? 'pointer' : 'default' }}
                    >
                      {/* Circle */}
                      <circle
                        cx={x}
                        cy={y}
                        r="30"
                        fill={getLevelColor(level.status)}
                        stroke="#FFFFFF"
                        strokeWidth="3"
                        style={{
                          filter:
                            level.status === 'active'
                              ? 'drop-shadow(0 0 10px rgba(124, 92, 255, 0.6))'
                              : 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
                        }}
                      />

                      {/* Level Number */}
                      <text
                        x={x}
                        y={y + 8}
                        textAnchor="middle"
                        fontSize="20"
                        fontWeight="bold"
                        fill={
                          level.status === 'locked'
                            ? '#9CA3AF'
                            : '#FFFFFF'
                        }
                      >
                        {level.id}
                      </text>
                    </g>
                  )
                })}

                {/* Treasure Box */}
                <g transform="translate(550, 100)">
                  <rect
                    x="-20"
                    y="-10"
                    width="40"
                    height="30"
                    rx="5"
                    fill="#FFD166"
                    stroke="#FFC93B"
                    strokeWidth="2"
                  />
                  <path
                    d="M -20,0 L 20,0"
                    stroke="#FFC93B"
                    strokeWidth="2"
                  />
                </g>
              </svg>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 justify-center">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-success"></div>
                <span className="font-bold">مكتمل</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-primary animate-pulse-glow"></div>
                <span className="font-bold">نشط</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gray-400"></div>
                <span className="font-bold">مقفول</span>
              </div>
            </div>
          </div>
        </div>

        {/* Level Details */}
        <div className="lg:col-span-1">
          {selectedLevel ? (
            <div className="bg-white rounded-3xl p-6 shadow-lg h-full space-y-4">
              <h3 className="text-2xl font-bold">
                {levels.find((l) => l.id === selectedLevel)?.name}
              </h3>

              <div className="space-y-3">
                <p className="text-muted-foreground font-bold">
                  الحالة:{' '}
                  <Badge
                    status={
                      levels.find((l) => l.id === selectedLevel)
                        ?.status as any
                    }
                  />
                </p>

                <div>
                  <p className="font-bold mb-2">التقدم</p>
                  <ProgressBar
                    value={
                      levels.find((l) => l.id === selectedLevel)
                        ?.progress || 0
                    }
                  />
                </div>

                <p className="text-sm text-muted-foreground text-center">
                  {levels.find((l) => l.id === selectedLevel)?.status ===
                  'locked'
                    ? 'أكمل المستويات السابقة لفتح هذا المستوى'
                    : 'اضغط ابدأ لتبدأ اللعبة'}
                </p>

                <Button
                  variant="primary"
                  size="lg"
                  className="w-full"
                  disabled={
                    levels.find((l) => l.id === selectedLevel)?.status ===
                    'locked'
                  }
                >
                  ابدأ اللعبة 🎮
                </Button>
              </div>

              {/* Fun Facts */}
              <div className="bg-purple-100 rounded-2xl p-4 border-2 border-primary">
                <p className="text-sm font-bold">💡 هل تعلم؟</p>
                <p className="text-sm mt-2">
                  كل مستوى جديد يحمل تحديات مشوقة وجوائز رائعة!
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-6 shadow-lg h-full flex flex-col items-center justify-center">
              <Mascot type="star" size="md" />
              <p className="text-center font-bold mt-4">
                اختر مستوى لترى التفاصيل
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
