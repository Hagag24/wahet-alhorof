'use client'

interface MascotProps {
  type?: 'rabbit' | 'cat' | 'bird' | 'robot' | 'star'
  size?: 'sm' | 'md' | 'lg'
  animate?: boolean
}

export function Mascot({
  type = 'rabbit',
  size = 'md',
  animate = true,
}: MascotProps) {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
  }

  const animationClass = animate ? 'animate-bounce-gentle' : ''

  // Rabbit mascot
  if (type === 'rabbit') {
    return (
      <div className={`${sizeClasses[size]} ${animationClass} relative`}>
        <svg
          viewBox="0 0 200 240"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Body */}
          <circle cx="100" cy="140" r="45" fill="#FF8FAB" />
          {/* Head */}
          <circle cx="100" cy="80" r="40" fill="#FFB0C7" />
          {/* Left Ear */}
          <ellipse cx="70" cy="25" rx="15" ry="35" fill="#FF8FAB" />
          {/* Right Ear */}
          <ellipse cx="130" cy="25" rx="15" ry="35" fill="#FF8FAB" />
          {/* Eyes */}
          <circle cx="85" cy="75" r="6" fill="#1F2A44" />
          <circle cx="115" cy="75" r="6" fill="#1F2A44" />
          {/* Nose */}
          <circle cx="100" cy="90" r="4" fill="#FFD166" />
          {/* Mouth */}
          <path
            d="M 100 90 Q 90 100 85 95"
            stroke="#1F2A44"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M 100 90 Q 110 100 115 95"
            stroke="#1F2A44"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Feet */}
          <ellipse cx="80" cy="180" rx="12" ry="15" fill="#FFB0C7" />
          <ellipse cx="120" cy="180" rx="12" ry="15" fill="#FFB0C7" />
        </svg>
      </div>
    )
  }

  // Cat mascot
  if (type === 'cat') {
    return (
      <div className={`${sizeClasses[size]} ${animationClass} relative`}>
        <svg
          viewBox="0 0 200 240"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Body */}
          <circle cx="100" cy="140" r="45" fill="#39BDF8" />
          {/* Head */}
          <circle cx="100" cy="80" r="40" fill="#5CD4FF" />
          {/* Left Ear */}
          <polygon points="65,25 55,50 75,45" fill="#39BDF8" />
          {/* Right Ear */}
          <polygon points="135,25 145,50 125,45" fill="#39BDF8" />
          {/* Eyes */}
          <circle cx="85" cy="70" r="7" fill="#FFD166" />
          <circle cx="115" cy="70" r="7" fill="#FFD166" />
          {/* Pupils */}
          <circle cx="85" cy="70" r="4" fill="#1F2A44" />
          <circle cx="115" cy="70" r="4" fill="#1F2A44" />
          {/* Nose */}
          <polygon points="100,90 95,95 105,95" fill="#FFD166" />
          {/* Mouth */}
          <path
            d="M 100 95 Q 85 105 80 100"
            stroke="#1F2A44"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M 100 95 Q 115 105 120 100"
            stroke="#1F2A44"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Paws */}
          <ellipse cx="75" cy="180" rx="12" ry="15" fill="#5CD4FF" />
          <ellipse cx="125" cy="180" rx="12" ry="15" fill="#5CD4FF" />
        </svg>
      </div>
    )
  }

  // Bird mascot
  if (type === 'bird') {
    return (
      <div className={`${sizeClasses[size]} ${animationClass} relative`}>
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Body */}
          <ellipse cx="100" cy="110" rx="35" ry="40" fill="#4ECDC4" />
          {/* Head */}
          <circle cx="100" cy="60" r="30" fill="#6FE5DB" />
          {/* Beak */}
          <polygon points="130,60 145,55 140,65" fill="#FFD166" />
          {/* Eyes */}
          <circle cx="110" cy="55" r="6" fill="#1F2A44" />
          {/* Wing */}
          <ellipse cx="70" cy="110" rx="20" ry="35" fill="#4ECDC4" transform="rotate(-20 70 110)" />
          {/* Tail */}
          <path
            d="M 130 130 Q 160 120 165 140"
            stroke="#4ECDC4"
            strokeWidth="8"
            strokeLinecap="round"
          />
          {/* Feet */}
          <path
            d="M 85 145 L 85 160 M 85 160 L 80 165 M 85 160 L 90 165"
            stroke="#FFD166"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M 115 145 L 115 160 M 115 160 L 110 165 M 115 160 L 120 165"
            stroke="#FFD166"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      </div>
    )
  }

  // Robot mascot
  if (type === 'robot') {
    return (
      <div className={`${sizeClasses[size]} ${animationClass} relative`}>
        <svg
          viewBox="0 0 200 240"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Head */}
          <rect x="60" y="30" width="80" height="70" rx="10" fill="#7C5CFF" />
          {/* Left Eye */}
          <rect x="75" y="50" width="20" height="20" rx="4" fill="#FFD166" />
          {/* Right Eye */}
          <rect x="105" y="50" width="20" height="20" rx="4" fill="#FFD166" />
          {/* Antenna Left */}
          <rect x="70" y="10" width="8" height="25" rx="4" fill="#7C5CFF" />
          {/* Antenna Right */}
          <rect x="122" y="10" width="8" height="25" rx="4" fill="#7C5CFF" />
          {/* Body */}
          <rect x="50" y="105" width="100" height="90" rx="10" fill="#39BDF8" />
          {/* Left Arm */}
          <rect x="20" y="130" width="35" height="20" rx="10" fill="#5CD4FF" />
          {/* Right Arm */}
          <rect x="145" y="130" width="35" height="20" rx="10" fill="#5CD4FF" />
          {/* Left Hand */}
          <circle cx="25" cy="140" r="12" fill="#4ECDC4" />
          {/* Right Hand */}
          <circle cx="175" cy="140" r="12" fill="#4ECDC4" />
          {/* Buttons */}
          <circle cx="85" cy="150" r="6" fill="#FFD166" />
          <circle cx="100" cy="150" r="6" fill="#FFD166" />
          <circle cx="115" cy="150" r="6" fill="#FFD166" />
          {/* Feet */}
          <rect x="65" y="195" width="20" height="35" rx="6" fill="#39BDF8" />
          <rect x="115" y="195" width="20" height="35" rx="6" fill="#39BDF8" />
        </svg>
      </div>
    )
  }

  // Star mascot
  if (type === 'star') {
    return (
      <div className={`${sizeClasses[size]} ${animationClass} relative`}>
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Main Star */}
          <path
            d="M 100 20 L 120 80 L 180 80 L 135 120 L 155 180 L 100 140 L 45 180 L 65 120 L 20 80 L 80 80 Z"
            fill="#FFD166"
            stroke="#FFC93B"
            strokeWidth="2"
          />
          {/* Left Eye */}
          <circle cx="80" cy="75" r="8" fill="#1F2A44" />
          {/* Right Eye */}
          <circle cx="120" cy="75" r="8" fill="#1F2A44" />
          {/* Happy Mouth */}
          <path
            d="M 85 105 Q 100 120 115 105"
            stroke="#1F2A44"
            strokeWidth="3"
            strokeLinecap="round"
          />
          {/* Sparkles */}
          <circle cx="30" cy="40" r="4" fill="#39BDF8" opacity="0.7" />
          <circle cx="170" cy="50" r="4" fill="#39BDF8" opacity="0.7" />
          <circle cx="40" cy="160" r="4" fill="#4ECDC4" opacity="0.7" />
          <circle cx="160" cy="150" r="4" fill="#4ECDC4" opacity="0.7" />
        </svg>
      </div>
    )
  }

  return null
}
