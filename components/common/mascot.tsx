'use client'

import { motion } from 'framer-motion'

interface MascotProps {
  type?: 'rabbit' | 'bird' | 'cat'
  mood?: 'happy' | 'thinking' | 'celebrating' | 'excited'
  size?: 'sm' | 'md' | 'lg'
  message?: string
}

export function Mascot({ type = 'rabbit', mood = 'happy', size = 'md', message }: MascotProps) {
  const sizeClasses = {
    sm: 'w-24 h-24 text-5xl',
    md: 'w-36 h-36 text-7xl',
    lg: 'w-48 h-48 text-8xl',
  }

  const mascotEmojis = {
    rabbit: '🐰',
    bird: '🐦',
    cat: '🐱',
  }

  const moodAnimations = {
    happy: {
      animate: { y: [0, -8, 0] },
      transition: { repeat: Infinity, duration: 1.5, ease: 'easeInOut' as const },
    },
    thinking: {
      animate: { rotate: [-5, 5, -5] },
      transition: { repeat: Infinity, duration: 2, ease: 'easeInOut' as const },
    },
    celebrating: {
      animate: { scale: [1, 1.1, 1], rotate: [-5, 5, -5] },
      transition: { repeat: Infinity, duration: 0.5 },
    },
    excited: {
      animate: { scale: [1, 1.15, 1], y: [0, -10, 0] },
      transition: { repeat: Infinity, duration: 0.6 },
    },
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <motion.div
        {...moodAnimations[mood]}
        className={`
          ${sizeClasses[size]}
          flex items-center justify-center
          bg-gradient-to-br from-accent/30 to-mint/30
          rounded-full shadow-lg
        `}
      >
        <span role="img" aria-label={type}>
          {mascotEmojis[type]}
        </span>
      </motion.div>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl px-4 py-2 shadow-md max-w-xs text-center relative"
        >
          <div className="absolute -top-2 right-1/2 translate-x-1/2 w-4 h-4 bg-white rotate-45" />
          <p className="text-foreground font-medium relative z-10">{message}</p>
        </motion.div>
      )}
    </div>
  )
}
