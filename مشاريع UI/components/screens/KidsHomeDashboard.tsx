'use client'

import React from 'react'
import { Mascot } from '../Mascot'
import { Button, Card, GameCard, ProgressBar, Badge } from '../DesignSystem'

interface KidsHomeDashboardProps {
  onGameSelect?: (gameId: string) => void
}

export function KidsHomeDashboard({ onGameSelect }: KidsHomeDashboardProps) {
  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8 overflow-x-hidden">
      {/* Header with Welcome */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
        <div className="flex-1">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 text-primary">
            أهلاً يا بطل! 👋
          </h1>
          <p className="text-lg text-muted-foreground">
            أنت في رحلة تعليمية ممتعة
          </p>
        </div>

        {/* User Profile Card */}
        <div className="flex items-center gap-4 bg-white rounded-3xl p-4 shadow-lg">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-2xl">
            👦
          </div>
          <div>
            <h2 className="font-bold text-lg">محمد</h2>
            <p className="text-sm text-muted-foreground">المستوى 5</p>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-purple-100 rounded-3xl p-4 text-center">
          <p className="text-4xl font-bold text-primary">127</p>
          <p className="text-sm font-bold text-muted-foreground">نجمة</p>
        </div>
        <div className="bg-blue-100 rounded-3xl p-4 text-center">
          <p className="text-4xl font-bold text-secondary">12</p>
          <p className="text-sm font-bold text-muted-foreground">شارة</p>
        </div>
        <div className="bg-yellow-100 rounded-3xl p-4 text-center">
          <p className="text-4xl font-bold text-accent">3</p>
          <p className="text-sm font-bold text-muted-foreground">اليوم</p>
        </div>
        <div className="bg-teal-100 rounded-3xl p-4 text-center">
          <p className="text-4xl font-bold text-accent-mint">65%</p>
          <p className="text-sm font-bold text-muted-foreground">التقدم</p>
        </div>
      </div>

      {/* Mascot with Progress */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Left: Mascot */}
        <div className="flex justify-center items-center">
          <Mascot type="rabbit" size="lg" animate={true} />
        </div>

        {/* Right: Progress Information */}
        <div className="space-y-4">
          <h3 className="text-2xl font-bold">رحلتك اليومية</h3>

          {/* Daily Challenges */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked
                disabled
                className="w-6 h-6"
              />
              <span className="font-bold text-lg">تعلم 5 حروف جديدة</span>
              <Badge status="completed" />
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked
                disabled
                className="w-6 h-6"
              />
              <span className="font-bold text-lg">العب لعبة الحروف</span>
              <Badge status="completed" />
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                disabled
                className="w-6 h-6"
              />
              <span className="font-bold text-lg">استمع للقصة</span>
            </div>
          </div>

          {/* Progress Bars */}
          <div className="mt-6 space-y-2">
            <p className="font-bold">تقدم المستوى الحالي</p>
            <ProgressBar value={65} color="primary" />
          </div>
        </div>
      </div>

      {/* Main Game Categories */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-6">اختر لعبتك المفضلة</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <GameCard
            title="اختر الحرف"
            icon="🔤"
            color="purple"
            onClick={() => onGameSelect?.('game-letters')}
          />
          <GameCard
            title="اصطد الحروف"
            icon="🎯"
            color="blue"
            onClick={() => onGameSelect?.('game-catch')}
          />
          <GameCard
            title="طابق الصور"
            icon="🖼️"
            color="pink"
            onClick={() => onGameSelect?.('game-match')}
          />
          <GameCard
            title="أشكال الحرف"
            icon="📝"
            color="yellow"
            onClick={() => onGameSelect?.('game-forms')}
          />
          <GameCard
            title="الحركات"
            icon="🎵"
            color="mint"
            onClick={() => onGameSelect?.('game-harakat')}
          />
          <GameCard
            title="الخريطة"
            icon="🗺️"
            color="orange"
            onClick={() => onGameSelect?.('map')}
          />
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-primary to-secondary rounded-3xl p-8 text-center text-white">
        <h3 className="text-3xl font-bold mb-4">هل أنت مستعد للبدء؟</h3>
        <p className="text-lg mb-6">
          ابدأ رحلتك التعليمية واجمع النجوم والشارات
        </p>
        <button
          onClick={() => onGameSelect?.('game-letters')}
          className="bg-white text-primary font-bold px-8 py-4 rounded-full text-lg hover:scale-110 active:scale-95 transition-all duration-200 shadow-lg"
        >
          ابدأ اللعب الآن 🚀
        </button>
      </div>

      {/* Mobile Bottom Navigation Hint */}
      <div className="mt-8 pt-4 border-t-4 border-primary text-center">
        <p className="text-sm text-muted-foreground">
          💡 نصيحة: اضغط على أي لعبة لتبدأ المرح!
        </p>
      </div>
    </div>
  )
}
