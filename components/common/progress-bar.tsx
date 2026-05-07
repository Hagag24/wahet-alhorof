'use client'

import { motion } from 'framer-motion'

interface ProgressBarProps {
  progress?: number
  current?: number
  max?: number
  color?: string
  height?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  animated?: boolean
}

export function ProgressBar({
  progress: progressProp,
  current,
  max = 100,
  color = 'bg-primary',
  height = 'md',
  showLabel = false,
  animated = true,
}: ProgressBarProps) {
  // Support both progress prop and current/max props
  const progress = progressProp ?? (current !== undefined ? (current / max) * 100 : 0)
  const heightClasses = {
    sm: 'h-2',
    md: 'h-4',
    lg: 'h-6',
  }

  const clampedProgress = Math.min(100, Math.max(0, progress))

  return (
    <div className="w-full">
      <div className={`w-full bg-muted rounded-full overflow-hidden ${heightClasses[height]}`}>
        {animated ? (
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${clampedProgress}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className={`h-full ${color} rounded-full`}
          />
        ) : (
          <div
            className={`h-full ${color} rounded-full`}
            style={{ width: `${clampedProgress}%` }}
          />
        )}
      </div>
      {showLabel && (
        <div className="text-center mt-1 text-sm text-muted-foreground font-medium">
          {Math.round(clampedProgress)}%
        </div>
      )}
    </div>
  )
}
