'use client'

import { motion } from 'framer-motion'
import { Badge } from '@/types'

interface RewardBadgeProps {
  badge: Badge
  size?: 'sm' | 'md' | 'lg'
  showDetails?: boolean
}

export function RewardBadge({ badge, size = 'md', showDetails = false }: RewardBadgeProps) {
  const isEarned = badge.earnedAt !== null

  const sizeClasses = {
    sm: 'w-12 h-12 text-2xl',
    md: 'w-20 h-20 text-4xl',
    lg: 'w-28 h-28 text-5xl',
  }

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="flex flex-col items-center gap-2"
    >
      <div
        className={`
          ${sizeClasses[size]}
          rounded-full flex items-center justify-center
          ${isEarned
            ? 'bg-gradient-to-br from-accent to-yellow-400 shadow-lg'
            : 'bg-muted grayscale opacity-50'
          }
          transition-all duration-300
        `}
      >
        <span className={isEarned ? '' : 'opacity-50'}>{badge.icon}</span>
      </div>
      {showDetails && (
        <div className="text-center">
          <p className={`font-bold text-sm ${isEarned ? 'text-foreground' : 'text-muted-foreground'}`}>
            {badge.name}
          </p>
          <p className="text-xs text-muted-foreground max-w-[120px]">{badge.description}</p>
        </div>
      )}
    </motion.div>
  )
}
