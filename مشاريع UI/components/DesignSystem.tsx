'use client'

import React from 'react'

/* ============ BUTTONS ============ */

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  icon?: React.ReactNode
  isLoading?: boolean
}

export function Button({
  variant = 'primary',
  size = 'md',
  icon,
  isLoading = false,
  children,
  className = '',
  ...props
}: ButtonProps) {
  const baseClasses =
    'font-bold rounded-full transition-all duration-200 flex items-center justify-center gap-2 active:scale-95 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed'

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    xl: 'px-10 py-6 text-xl font-bold',
  }

  const variantClasses = {
    primary: 'bg-primary text-primary-foreground hover:bg-purple-600 shadow-lg',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-blue-400 shadow-lg',
    danger: 'bg-destructive text-destructive-foreground hover:bg-red-600 shadow-lg',
    success: 'bg-success text-success-foreground hover:bg-green-500 shadow-lg',
  }

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? <div className="animate-spin">⏳</div> : icon}
      {children}
    </button>
  )
}

/* ============ CARDS ============ */

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'lesson' | 'game' | 'reward' | 'progress'
  color?: 'purple' | 'blue' | 'yellow' | 'mint' | 'pink'
}

export function Card({
  variant = 'lesson',
  color = 'purple',
  children,
  className = '',
  ...props
}: CardProps) {
  const baseClasses =
    'rounded-3xl p-6 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer'

  const colorClasses = {
    purple: 'bg-purple-100 border-4 border-primary',
    blue: 'bg-blue-100 border-4 border-secondary',
    yellow: 'bg-yellow-100 border-4 border-accent',
    mint: 'bg-teal-100 border-4 border-accent-mint',
    pink: 'bg-pink-100 border-4 border-accent-pink',
  }

  return (
    <div
      className={`${baseClasses} ${colorClasses[color]} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

/* ============ BADGES ============ */

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  status?: 'completed' | 'locked' | 'new' | 'needs-review'
}

export function Badge({ status = 'completed', className = '', ...props }: BadgeProps) {
  const statusClasses = {
    completed: 'bg-success text-white',
    locked: 'bg-gray-400 text-white',
    new: 'bg-accent text-foreground',
    'needs-review': 'bg-orange-400 text-white',
  }

  const statusLabels = {
    completed: '✓ مكتمل',
    locked: '🔒 مغلق',
    new: '⭐ جديد',
    'needs-review': '⚠️ يحتاج مراجعة',
  }

  return (
    <div
      className={`inline-flex items-center px-4 py-2 rounded-full font-bold text-sm ${statusClasses[status]} ${className}`}
      {...props}
    >
      {statusLabels[status]}
    </div>
  )
}

/* ============ PROGRESS BAR ============ */

interface ProgressBarProps {
  value: number
  max?: number
  color?: 'primary' | 'secondary' | 'success'
  showLabel?: boolean
}

export function ProgressBar({
  value,
  max = 100,
  color = 'primary',
  showLabel = true,
}: ProgressBarProps) {
  const percentage = (value / max) * 100
  const colorClasses = {
    primary: 'bg-primary',
    secondary: 'bg-secondary',
    success: 'bg-success',
  }

  return (
    <div className="w-full">
      <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden shadow-md">
        <div
          className={`${colorClasses[color]} h-full transition-all duration-500 flex items-center justify-center`}
          style={{ width: `${percentage}%` }}
        >
          {showLabel && percentage > 20 && (
            <span className="text-white font-bold text-sm">{Math.round(percentage)}%</span>
          )}
        </div>
      </div>
    </div>
  )
}

/* ============ FEEDBACK MESSAGE ============ */

interface FeedbackProps {
  type?: 'success' | 'error' | 'info' | 'warning'
  message: string
}

export function Feedback({ type = 'success', message }: FeedbackProps) {
  const typeClasses = {
    success: 'bg-success text-white border-4 border-green-600',
    error: 'bg-destructive text-white border-4 border-red-700',
    info: 'bg-secondary text-white border-4 border-blue-600',
    warning: 'bg-orange-400 text-white border-4 border-orange-600',
  }

  const icons = {
    success: '🎉',
    error: '😅',
    info: 'ℹ️',
    warning: '⚠️',
  }

  return (
    <div
      className={`${typeClasses[type]} rounded-2xl p-4 md:p-6 text-center font-bold text-lg md:text-xl animate-scale-in flex items-center justify-center gap-3`}
    >
      <span className="text-3xl">{icons[type]}</span>
      {message}
    </div>
  )
}

/* ============ LEVEL PROGRESS ============ */

interface LevelProgressProps {
  currentLevel: number
  totalLevels: number
  progress: number
}

export function LevelProgress({
  currentLevel,
  totalLevels,
  progress,
}: LevelProgressProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold">المستوى {currentLevel}</h3>
        <span className="text-sm text-muted-foreground">
          {currentLevel}/{totalLevels}
        </span>
      </div>
      <ProgressBar value={progress} color="primary" />
      <p className="text-center text-sm text-muted-foreground">
        اكمل المزيد لفتح المستوى التالي
      </p>
    </div>
  )
}

/* ============ GAME CARD ============ */

interface GameCardProps {
  title: string
  icon?: React.ReactNode
  color?: 'purple' | 'blue' | 'yellow' | 'mint' | 'pink'
  locked?: boolean
  onClick?: () => void
}

export function GameCard({
  title,
  icon,
  color = 'purple',
  locked = false,
  onClick,
}: GameCardProps) {
  return (
    <Card
      color={color}
      onClick={!locked ? onClick : undefined}
      className={locked ? 'opacity-50 cursor-not-allowed' : ''}
    >
      <div className="flex flex-col items-center gap-4">
        <div className="text-5xl">{icon}</div>
        <h3 className="text-xl font-bold text-center">{title}</h3>
        {locked && <Badge status="locked" />}
      </div>
    </Card>
  )
}

/* ============ STAR RATING ============ */

interface StarRatingProps {
  rating: number
  maxStars?: number
  interactive?: boolean
  onRate?: (rating: number) => void
}

export function StarRating({
  rating,
  maxStars = 3,
  interactive = false,
  onRate,
}: StarRatingProps) {
  return (
    <div className="flex gap-2 justify-center">
      {Array.from({ length: maxStars }).map((_, i) => (
        <button
          key={i}
          onClick={() => interactive && onRate?.(i + 1)}
          disabled={!interactive}
          className={`text-4xl transition-transform ${
            i < rating ? 'animate-stars' : 'opacity-30'
          } ${interactive ? 'cursor-pointer hover:scale-125' : 'cursor-default'}`}
        >
          ⭐
        </button>
      ))}
    </div>
  )
}

/* ============ SOUND BUTTON ============ */

interface SoundButtonProps {
  onClick?: () => void
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
}

export function SoundButton({ onClick, size = 'md', disabled = false }: SoundButtonProps) {
  const sizeClasses = {
    sm: 'w-12 h-12 text-2xl',
    md: 'w-16 h-16 text-3xl',
    lg: 'w-20 h-20 text-4xl',
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${sizeClasses[size]} rounded-full bg-accent text-foreground font-bold shadow-lg hover:scale-110 active:scale-95 transition-all duration-200 flex items-center justify-center animate-bounce-gentle disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100`}
    >
      🔊
    </button>
  )
}
