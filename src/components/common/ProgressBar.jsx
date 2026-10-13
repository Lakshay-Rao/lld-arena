import React from 'react'

export default function ProgressBar({ label, score, max, color = 'indigo' }) {
  const percentage = Math.min(100, Math.max(0, Math.round((score / max) * 100)))

  const getColorClasses = () => {
    if (percentage >= 85) {
      return {
        fill: 'bg-emerald-500',
        text: 'text-emerald-400',
        glow: 'shadow-[0_0_8px_rgba(16,185,129,0.4)]'
      }
    }
    if (percentage >= 70) {
      return {
        fill: 'bg-indigo-500',
        text: 'text-indigo-400',
        glow: 'shadow-[0_0_8px_rgba(99,102,241,0.4)]'
      }
    }
    return {
      fill: 'bg-amber-500',
      text: 'text-amber-400',
      glow: 'shadow-[0_0_8px_rgba(245,158,11,0.4)]'
    }
  }

  const { fill, text, glow } = getColorClasses()

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs sm:text-sm">
        <span className="font-medium text-slate-300">{label}</span>
        <div className="flex items-center gap-1.5">
          <span className={`font-semibold ${text}`}>
            {score}
          </span>
          <span className="text-slate-500 font-normal">/ {max}</span>
          <span className="text-slate-500 text-xs ml-1 font-mono">({percentage}%)</span>
        </div>
      </div>
      <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden p-0.5">
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-out ${fill} ${glow}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
