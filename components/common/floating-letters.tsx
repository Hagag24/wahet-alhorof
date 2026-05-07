'use client'

import { motion } from 'framer-motion'

const arabicLetters = ['أ', 'ب', 'ت', 'م', 'س', 'ن', 'ر', 'ل', 'ي', 'و']

const colors = [
  'text-primary',
  'text-secondary',
  'text-accent',
  'text-mint',
  'text-pink',
  'text-success',
]

const floatingConfigs = arabicLetters.map((_, i) => {
  const startX = 8 + ((i * 17) % 82)
  const startY = 12 + ((i * 23) % 76)
  const animY1 = 18 + ((i * 11) % 46)
  const animY2 = 10 + ((i * 7) % 38)
  const duration = 4 + (i % 3) * 0.8

  return { startX, startY, animY1, animY2, duration }
})

export function FloatingLetters() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {arabicLetters.map((letter, i) => (
        <motion.div
          key={i}
          initial={{
            x: `${floatingConfigs[i].startX}%`,
            y: `${floatingConfigs[i].startY}%`,
            opacity: 0,
            scale: 0,
          }}
          animate={{
            y: [`${floatingConfigs[i].animY1}%`, `${floatingConfigs[i].animY2}%`],
            opacity: [0.3, 0.6, 0.3],
            scale: [0.8, 1.2, 0.8],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: floatingConfigs[i].duration,
            repeat: Infinity,
            delay: i * 0.3,
            ease: 'easeInOut',
          }}
          className={`absolute text-4xl md:text-6xl font-bold ${colors[i % colors.length]} opacity-30`}
          style={{
            left: `${5 + (i * 10) % 90}%`,
          }}
        >
          {letter}
        </motion.div>
      ))}
    </div>
  )
}
