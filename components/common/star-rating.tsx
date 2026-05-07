'use client'

import { motion } from 'framer-motion'

interface StarRatingProps {
  stars: number
  maxStars?: number
  size?: 'sm' | 'md' | 'lg'
  animated?: boolean
}

export function StarRating({ stars, maxStars = 3, size = 'md', animated = true }: StarRatingProps) {
  const sizeClasses = {
    sm: 'text-xl',
    md: 'text-3xl',
    lg: 'text-5xl',
  }

  return (
    <div className="flex gap-1 justify-center">
      {Array.from({ length: maxStars }).map((_, i) => {
        const isFilled = i < stars
        return animated ? (
          <motion.span
            key={i}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: i * 0.15, type: 'spring', stiffness: 200 }}
            className={`${sizeClasses[size]} ${isFilled ? 'opacity-100' : 'opacity-30'}`}
          >
            {isFilled ? '⭐' : '☆'}
          </motion.span>
        ) : (
          <span
            key={i}
            className={`${sizeClasses[size]} ${isFilled ? 'opacity-100' : 'opacity-30'}`}
          >
            {isFilled ? '⭐' : '☆'}
          </span>
        )
      })}
    </div>
  )
}
