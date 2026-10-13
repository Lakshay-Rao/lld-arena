import React from 'react'

export default function ScoreRing({ score = 78, max = 100, size = 160, strokeWidth = 12 }) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const percent = Math.min(100, Math.max(0, (score / max) * 100))
  const strokeDashoffset = circumference - (percent / 100) * circumference

  // Color scheme based on score
  const getColor = () => {
    if (score >= 85) {
      return {
        stroke: '#10b981', // emerald-500
        text: 'text-emerald-400',
        glow: 'rgba(16, 185, 129, 0.25)',
        badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
        label: 'Excellent'
      }
    }
    if (score >= 70) {
      return {
        stroke: '#6366f1', // indigo-500
        text: 'text-indigo-400',
        glow: 'rgba(99, 102, 241, 0.25)',
        badge: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
        label: 'Strong Foundation'
      }
    }
    return {
      stroke: '#f59e0b', // amber-500
      text: 'text-amber-400',
      glow: 'rgba(245, 158, 11, 0.25)',
      badge: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      label: 'Needs Work'
    }
  }

  const { stroke, text, glow, badge, label } = getColor()

  return (
    <div className="flex flex-col items-center">
      <div
        className="relative flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        <svg
          className="transform -rotate-90"
          width={size}
          height={size}
        >
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#1e293b" // slate-800
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Animated progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            style={{
              transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
              filter: `drop-shadow(0 0 10px ${glow})`
            }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <div className="flex items-baseline">
            <span className={`text-4xl font-extrabold tracking-tight ${text}`}>
              {score}
            </span>
            <span className="text-slate-400 text-sm font-medium ml-1">/ {max}</span>
          </div>
          <span className="text-[11px] font-medium tracking-wider text-slate-400 uppercase mt-0.5">
            Score
          </span>
        </div>
      </div>

      <div className="mt-3">
        <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full border ${badge}`}>
          {label}
        </span>
      </div>
    </div>
  )
}
