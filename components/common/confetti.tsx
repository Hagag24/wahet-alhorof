'use client'

import { useEffect, useCallback } from 'react'
import confetti from 'canvas-confetti'

interface ConfettiProps {
  trigger: boolean
  onComplete?: () => void
}

export function Confetti({ trigger, onComplete }: ConfettiProps) {
  const fireConfetti = useCallback(() => {
    const duration = 3000
    const animationEnd = Date.now() + duration
    const colors = ['#7C5CFF', '#39BDF8', '#FFD166', '#4ECDC4', '#FF8FAB', '#3DDC97']

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        clearInterval(interval)
        onComplete?.()
        return
      }

      const particleCount = 50 * (timeLeft / duration)

      // Launch from both sides
      confetti({
        particleCount: Math.floor(particleCount / 2),
        startVelocity: 30,
        spread: 60,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors,
        shapes: ['circle', 'square'],
        gravity: 1,
        scalar: randomInRange(0.8, 1.2),
      })

      confetti({
        particleCount: Math.floor(particleCount / 2),
        startVelocity: 30,
        spread: 60,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors,
        shapes: ['circle', 'square'],
        gravity: 1,
        scalar: randomInRange(0.8, 1.2),
      })
    }, 250)

    return () => clearInterval(interval)
  }, [onComplete])

  useEffect(() => {
    if (trigger) {
      fireConfetti()
    }
  }, [trigger, fireConfetti])

  return null
}

// Stars burst effect
export function StarBurst({ trigger }: { trigger: boolean }) {
  useEffect(() => {
    if (trigger) {
      confetti({
        particleCount: 30,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FFD700', '#FFA500', '#FFD166'],
        shapes: ['star'],
        scalar: 1.5,
      })
    }
  }, [trigger])

  return null
}
