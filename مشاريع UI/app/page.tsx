'use client'

import { useState } from 'react'
import { SoundControl } from '@/components/SoundControl'
import { KidsHomeDashboard } from '@/components/screens/KidsHomeDashboard'
import { LearningAdventureMap } from '@/components/screens/LearningAdventureMap'
import { ChooseLetterGame } from '@/components/screens/ChooseLetterGame'
import { CatchLettersGame } from '@/components/screens/CatchLettersGame'
import { MatchPictureGame } from '@/components/screens/MatchPictureGame'
import { LetterFormsGame } from '@/components/screens/LetterFormsGame'
import { HarakatGame } from '@/components/screens/HarakatGame'
import { GameResults } from '@/components/screens/GameResults'
import { ParentDashboard } from '@/components/screens/ParentDashboard'
import { TeacherDashboard } from '@/components/screens/TeacherDashboard'
import { Button } from '@/components/DesignSystem'

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState('home')

  const screens = [
    // Kids Screens
    { id: 'home', name: '🏠 الرئيسية', group: 'أطفال', component: KidsHomeDashboard },
    { id: 'map', name: '🗺️ خريطة التعلم', group: 'أطفال', component: LearningAdventureMap },
    { id: 'game-letters', name: '🔤 اختر الحرف', group: 'ألعاب', component: ChooseLetterGame },
    { id: 'game-catch', name: '🎯 اصطد الحروف', group: 'ألعاب', component: CatchLettersGame },
    { id: 'game-match', name: '🖼️ طابق الصور', group: 'ألعاب', component: MatchPictureGame },
    { id: 'game-forms', name: '📝 أشكال الحرف', group: 'ألعاب', component: LetterFormsGame },
    { id: 'game-harakat', name: '🎵 الحركات', group: 'ألعاب', component: HarakatGame },
    { id: 'results', name: '🏆 النتائج', group: 'ألعاب', component: () => <GameResults score={8} maxScore={10} /> },
    
    // Parent & Teacher Screens
    { id: 'parent', name: '👨‍👩‍👦 لوحة ولي الأمر', group: 'الوالدين', component: ParentDashboard },
    { id: 'teacher', name: '👨‍🏫 لوحة المعلم', group: 'المعلمين', component: TeacherDashboard },
  ]

  const handleGameSelect = (gameId: string) => {
    setCurrentScreen(gameId)
  }

  const CurrentComponent = (() => {
    const screen = screens.find((s) => s.id === currentScreen)
    if (!screen) return KidsHomeDashboard
    if (currentScreen === 'home') {
      return () => <KidsHomeDashboard onGameSelect={handleGameSelect} />
    }
    return screen.component
  })()

  const groups = [...new Set(screens.map((s) => s.group))]

  return (
    <div className="flex flex-col md:flex-row h-screen bg-background">
      <SoundControl position="top-right" />
      {/* Desktop Sidebar Navigation */}
      <nav className="hidden md:flex flex-col w-64 bg-white border-l-4 border-primary shadow-lg overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-b from-primary/10 to-transparent p-4 border-b border-primary/20">
          <h1 className="text-2xl font-bold text-primary">تعلم العربية</h1>
          <p className="text-xs text-muted-foreground mt-1">منصة تعليمية للأطفال</p>
        </div>
        
        <div className="flex-1 p-4 space-y-6">
          {groups.map((group) => (
            <div key={group}>
              <h2 className="text-xs font-bold text-primary uppercase mb-3 px-2">{group}</h2>
              <div className="space-y-2">
                {screens
                  .filter((s) => s.group === group)
                  .map((screen) => (
                    <button
                      key={screen.id}
                      onClick={() => setCurrentScreen(screen.id)}
                      className={`
                        w-full text-right px-4 py-2.5 rounded-lg transition-all duration-200 font-medium text-sm
                        ${
                          currentScreen === screen.id
                            ? 'bg-primary text-white shadow-md'
                            : 'text-foreground hover:bg-primary/10 hover:text-primary'
                        }
                      `}
                    >
                      {screen.name}
                    </button>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header Navigation */}
        <div className="md:hidden sticky top-0 z-50 bg-white border-b-4 border-primary shadow-lg">
          <div className="p-3 border-b border-gray-200">
            <h1 className="text-xl font-bold text-primary text-center">تعلم العربية</h1>
          </div>
          <div className="overflow-x-auto">
            <div className="flex gap-2 p-2 flex-nowrap">
              {screens.map((screen) => (
                <button
                  key={screen.id}
                  onClick={() => setCurrentScreen(screen.id)}
                  className={`
                    px-3 py-1.5 rounded-full font-bold text-xs whitespace-nowrap transition-all duration-200
                    ${
                      currentScreen === screen.id
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-foreground'
                    }
                  `}
                >
                  {screen.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Screen Content */}
        <div className="flex-1 overflow-y-auto">
          <CurrentComponent />
        </div>
      </div>
    </div>
  )
}
