'use client'

import React, { useState } from 'react'
import { useSound } from '@/hooks/useSound'

interface SoundControlProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
  className?: string
}

export function SoundControl({ position = 'top-right', className = '' }: SoundControlProps) {
  const { play, setVolume, getVolume } = useSound()
  const [isOpen, setIsOpen] = useState(false)
  const currentVolume = getVolume()

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
  }

  const handleVolumeChange = (value: number) => {
    const volume = value / 100
    setVolume(volume)
    play('click')
  }

  const toggleMute = () => {
    if (currentVolume > 0) {
      setVolume(0)
    } else {
      setVolume(0.3)
    }
    play('click')
  }

  return (
    <div className={`fixed ${positionClasses[position]} z-40 ${className}`}>
      {/* Main Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="
          bg-white rounded-full p-3 shadow-lg hover:shadow-xl
          transition-all duration-200 transform hover:scale-110
          border-2 border-primary
          flex items-center justify-center
        "
        aria-label="Sound settings"
      >
        <span className="text-2xl">
          {currentVolume === 0 ? '🔇' : currentVolume < 0.5 ? '🔉' : '🔊'}
        </span>
      </button>

      {/* Control Panel */}
      {isOpen && (
        <div className="
          absolute top-16 right-0 bg-white rounded-2xl shadow-2xl p-4
          border-2 border-primary
          min-w-48
          animate-scale-in
        ">
          {/* Title */}
          <p className="text-sm font-bold text-primary mb-3">إعدادات الصوت</p>

          {/* Volume Slider */}
          <div className="space-y-3">
            <label className="flex items-center gap-2">
              <span className="text-xs">🔇</span>
              <input
                type="range"
                min="0"
                max="100"
                value={currentVolume * 100}
                onChange={(e) => handleVolumeChange(Number(e.target.value))}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <span className="text-xs">🔊</span>
            </label>

            {/* Volume Display */}
            <p className="text-center text-xs font-bold text-muted-foreground">
              {Math.round(currentVolume * 100)}%
            </p>

            {/* Mute Button */}
            <button
              onClick={toggleMute}
              className="
                w-full bg-primary text-white rounded-lg py-2
                font-bold text-sm transition-all duration-200
                hover:bg-primary/90 active:scale-95
              "
            >
              {currentVolume === 0 ? '🔊 تفعيل الصوت' : '🔇 كتم الصوت'}
            </button>

            {/* Test Button */}
            <button
              onClick={() => play('click')}
              className="
                w-full bg-secondary text-white rounded-lg py-2
                font-bold text-sm transition-all duration-200
                hover:bg-secondary/90 active:scale-95
              "
            >
              🔔 اختبر الصوت
            </button>
          </div>

          {/* Close Button */}
          <button
            onClick={() => setIsOpen(false)}
            className="
              absolute top-2 right-2 text-muted-foreground
              hover:text-foreground transition-colors
            "
          >
            ✕
          </button>
        </div>
      )}
    </div>
  )
}
