'use client'

import { motion } from 'framer-motion'
import { useTTS } from '@/hooks/use-tts'
import { useSound } from '@/hooks/use-sound'
import { useAudioValidation } from '@/hooks/use-audio-validation'
import { Volume2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SoundButtonProps {
  text?: string
  audioText?: string
  audioId?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline'
  className?: string
  children?: React.ReactNode
  onClick?: () => void
}

export function SoundButton({ 
  text, 
  audioText,
  audioId,
  size = 'md', 
  variant = 'primary', 
  className,
  children,
  onClick
}: SoundButtonProps) {
  const { speak, isSpeaking } = useTTS()
  const { playSound } = useSound()
  const audioValidation = useAudioValidation(audioId)

  // Only render if audio is valid or if we're using TTS
  const shouldRender = audioValidation.isValid || !audioId || audioText || text

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  }

  const iconSizes = {
    sm: 16,
    md: 24,
    lg: 32,
  }

  const variantClasses = {
    primary: 'bg-[#6366F1] text-white hover:bg-[#4F46E5] shadow-[0_4px_0_rgb(67,56,202)] active:translate-y-[2px] active:shadow-[0_2px_0_rgb(67,56,202)]',
    secondary: 'bg-[#FACC15] text-[#854D0E] hover:bg-[#EAB308] shadow-[0_4px_0_rgb(202,138,4)] active:translate-y-[2px] active:shadow-[0_2px_0_rgb(202,138,4)]',
    ghost: 'bg-white/80 text-[#6366F1] hover:bg-white',
    outline: 'bg-white border-2 border-[#6366F1]/20 text-[#6366F1] hover:bg-[#6366F1]/5'
  }

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    playSound('click')
    speak(audioText || text || "")
    if (onClick) {
      onClick()
    }
  }

  // Guard: don't render if audio is invalid
  if (!shouldRender) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[SoundButton] Audio not available: ${audioId}`)
    }
    return null
  }

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      className={cn(
        "rounded-[1.5rem] flex items-center justify-center gap-2 px-4 transition-all",
        size === 'sm' ? 'w-10 h-10' : sizeClasses[size],
        variantClasses[variant],
        isSpeaking && 'animate-pulse ring-4 ring-primary/20',
        className
      )}
      aria-label={`استمع`}
    >
      <Volume2 size={iconSizes[size]} className={isSpeaking ? "animate-bounce" : ""} />
      {children || (text && <span className="font-bold">{text}</span>)}
    </motion.button>
  )
}
