'use client'

import React from 'react'
import { Button, Card, ProgressBar, Badge } from '../DesignSystem'
import { Mascot } from '../Mascot'

export function ParentDashboard() {
  const childName = 'محمد'
  const childAge = 6
  const currentLevel = 5
  const totalLevels = 20

  const skillsData = [
    { name: 'الحروف', progress: 75, status: 'good' },
    { name: 'الكلمات', progress: 60, status: 'developing' },
    { name: 'الاستماع', progress: 85, status: 'excellent' },
    { name: 'القراءة', progress: 50, status: 'developing' },
  ]

  const weeklyActivity = [
    { day: 'السبت', games: 3, stars: 12 },
    { day: 'الأحد', games: 2, stars: 8 },
    { day: 'الاثنين', games: 4, stars: 15 },
    { day: 'الثلاثاء', games: 1, stars: 5 },
    { day: 'الأربعاء', games: 3, stars: 11 },
    { day: 'الخميس', games: 2, stars: 9 },
    { day: 'الجمعة', games: 0, stars: 0 },
  ]

  const recentAchievements = [
    { name: 'معلم الحروف', date: '12 أبريل' },
    { name: 'صياد الكلمات', date: '10 أبريل' },
    { name: '7 أيام متتالية', date: '8 أبريل' },
  ]

  const skillsNeedingReview = [
    'الكلمات المركبة',
    'نطق بعض الحروف',
  ]

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-2">
            👨‍👩‍👦 لوحة ولي الأمر
          </h1>
          <p className="text-lg text-muted-foreground">
            متابعة تقدم {childName} التعليمي
          </p>
        </div>
        <Button variant="secondary">الإعدادات ⚙️</Button>
      </div>

      {/* Child Info Card */}
      <Card color="blue" className="mb-8 flex items-center gap-6">
        <div className="text-6xl">👦</div>
        <div>
          <h2 className="text-3xl font-bold">{childName}</h2>
          <p className="text-lg text-muted-foreground">{childAge} سنوات</p>
          <p className="font-bold mt-2">المستوى {currentLevel} من {totalLevels}</p>
        </div>
      </Card>

      <div className="grid lg:grid-cols-3 gap-8 mb-8">
        {/* Left Column: Quick Stats */}
        <div className="lg:col-span-1 space-y-6">
          {/* Today's Stats */}
          <Card color="purple">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold">اليوم</h3>
              <div className="flex justify-between items-center">
                <span className="font-bold">ألعاب</span>
                <span className="text-3xl font-bold text-primary">3</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-bold">نجوم</span>
                <span className="text-3xl font-bold text-accent">12</span>
              </div>
              <ProgressBar value={75} color="primary" />
            </div>
          </Card>

          {/* Total Progress */}
          <Card color="yellow">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold">التقدم الإجمالي</h3>
              <p className="text-4xl font-bold text-accent">65%</p>
              <ProgressBar value={65} color="success" />
              <p className="text-sm text-muted-foreground text-center">
                إلى المستوى الـ 6
              </p>
            </div>
          </Card>

          {/* Streak */}
          <Card color="mint">
            <div className="text-center space-y-2">
              <p className="text-sm font-bold text-muted-foreground">
                سلسلة الأيام المتتالية
              </p>
              <p className="text-5xl font-bold text-accent-mint">7</p>
              <p className="text-sm font-bold">🔥 ايام متتالية</p>
            </div>
          </Card>
        </div>

        {/* Middle Column: Skills */}
        <div className="lg:col-span-2 space-y-6">
          {/* Skills Progress */}
          <Card color="pink">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold">مهارات {childName}</h3>

              {skillsData.map((skill, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold">{skill.name}</span>
                    <Badge
                      status={
                        skill.status === 'excellent'
                          ? 'completed'
                          : skill.status === 'good'
                            ? 'new'
                            : 'needs-review'
                      }
                    />
                  </div>
                  <ProgressBar
                    value={skill.progress}
                    color={
                      skill.status === 'excellent'
                        ? 'success'
                        : skill.status === 'good'
                          ? 'primary'
                          : 'secondary'
                    }
                  />
                </div>
              ))}
            </div>
          </Card>

          {/* Weekly Activity Chart */}
          <Card color="blue">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold">النشاط الأسبوعي</h3>

              <div className="space-y-2">
                {weeklyActivity.map((day, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <span className="font-bold w-16 text-sm">{day.day}</span>
                    <div className="flex-1 flex items-center gap-2">
                      <div
                        className="h-6 bg-primary rounded-lg transition-all"
                        style={{
                          width: `${Math.max((day.games / 4) * 100, 5)}%`,
                        }}
                      />
                      <span className="text-sm font-bold text-muted-foreground">
                        {day.games} ألعاب
                      </span>
                    </div>
                    <span className="text-sm font-bold text-accent">
                      {day.stars} ⭐
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        {/* Recent Achievements */}
        <Card color="yellow">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">الإنجازات الأخيرة</h3>

            {recentAchievements.map((achievement, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-4 flex items-center justify-between border-2 border-accent"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🏆</span>
                  <div>
                    <p className="font-bold">{achievement.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {achievement.date}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Skills Needing Review */}
        <Card color="pink">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">يحتاج إلى متابعة</h3>

            {skillsNeedingReview.length > 0 ? (
              <div className="space-y-3">
                {skillsNeedingReview.map((skill, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-2xl p-4 flex items-center justify-between border-2 border-accent-pink"
                  >
                    <span className="font-bold">{skill}</span>
                    <Button variant="secondary" size="sm">
                      تمارين
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-6">
                ممتاز! لا توجد مهارات تحتاج متابعة الآن 🎉
              </p>
            )}
          </div>
        </Card>
      </div>

      {/* Recommendations */}
      <Card color="blue" className="mb-8">
        <div className="space-y-4">
          <h3 className="text-2xl font-bold">🎯 التوصيات</h3>

          <div className="space-y-3">
            <p className="font-bold">
              ✓ {childName} يتطور بشكل جيد جداً في مهارة الاستماع
            </p>
            <p className="font-bold">
              • ننصح بالتركيز أكثر على مهارة القراءة
            </p>
            <p className="font-bold">
              • جرّب تخصيص 15-20 دقيقة يومياً للتعلم
            </p>
            <p className="font-bold">
              • استمر في تشجيع {childName} على التعلم المستمر
            </p>
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="grid md:grid-cols-2 gap-4">
        <Button variant="primary" size="lg" className="w-full text-lg font-bold">
          📊 عرض التقرير الكامل
        </Button>
        <Button variant="secondary" size="lg" className="w-full text-lg font-bold">
          📧 اطلب تقرير أسبوعي
        </Button>
      </div>
    </div>
  )
}
