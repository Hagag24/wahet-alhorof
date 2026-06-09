'use client'

import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ProgressBar } from '@/components/common/progress-bar'
import { SoundButton } from '@/components/common/sound-button'
import { AudibleText } from '@/components/common/audible-text'
import { ArrowRight, Volume2 } from 'lucide-react'

interface GameWrapperProps {
  title: string
  icon: string
  question: string
  questionWord?: string
  currentQuestion: number
  totalQuestions: number
  onBack: () => void
  children: ReactNode
}

export function GameWrapper({
  title,
  icon,
  question,
  questionWord,
  currentQuestion,
  totalQuestions,
  onBack,
  children,
}: GameWrapperProps) {
  const progress = ((currentQuestion + 1) / totalQuestions) * 100

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-primary/5 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-4"
        >
          <Button variant="ghost" onClick={onBack} className="gap-2">
            <ArrowRight className="w-5 h-5" />
            عودة
          </Button>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{icon}</span>
            <h1 className="text-lg font-bold text-primary">
              <AudibleText text={title} stopPropagation={false} />
            </h1>
          </div>
        </motion.div>

        {/* Progress */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
            <span>السؤال {currentQuestion + 1} من {totalQuestions}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <ProgressBar progress={progress} showLabel={false} height="sm" />
        </motion.div>

        {/* Question */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-6"
        >
          {questionWord && (
            <div className="flex items-center justify-center gap-3 mb-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: 'spring' }}
                className="bg-white rounded-2xl shadow-lg px-8 py-4 inline-flex items-center gap-3"
              >
                <span className="text-4xl md:text-5xl font-bold text-primary">
                  {questionWord}
                </span>
                <SoundButton text={questionWord} size="md" variant="secondary" />
              </motion.div>
            </div>
          )}
          <p className="text-xl md:text-2xl text-foreground font-medium">
            <AudibleText text={question} stopPropagation={false} />
          </p>
        </motion.div>

        {/* Game content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {children}
        </motion.div>
      </div>
    </div>
  )
}
