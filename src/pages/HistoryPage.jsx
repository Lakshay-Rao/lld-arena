import React, { useState } from 'react'
import {
  History,
  TrendingUp,
  RotateCcw,
  Eye,
  Calendar,
  CheckCircle2,
  Award,
  Filter,
  ArrowRight,
  Code2
} from 'lucide-react'

export default function HistoryPage({
  attempts,
  onViewFeedback,
  onTryAgain,
  onStartNewProblem
}) {
  const [selectedProblemFilter, setSelectedProblemFilter] = useState('All')

  // Find unique problem titles
  const problemTitles = ['All', ...Array.from(new Set(attempts.map((a) => a.problemTitle)))]

  const filteredAttempts = attempts.filter((att) => {
    if (selectedProblemFilter === 'All') return true
    return att.problemTitle === selectedProblemFilter
  })

  // Calculate visual improvement delta for parking lot or others
  const parkingLotAttempts = attempts
    .filter((a) => a.problemId === 'parking-lot')
    .sort((a, b) => a.attemptNumber - b.attemptNumber)

  let improvementSummary = null
  if (parkingLotAttempts.length >= 2) {
    const first = parkingLotAttempts[0]
    const latest = parkingLotAttempts[parkingLotAttempts.length - 1]
    const scoreDiff = latest.overallScore - first.overallScore
    improvementSummary = {
      title: 'Parking Lot',
      from: first.overallScore,
      to: latest.overallScore,
      diff: scoreDiff,
      attemptCount: parkingLotAttempts.length
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-2">
            <History className="w-4 h-4" />
            <span>Practice Records</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            My Attempts
          </h1>
          <p className="mt-2 text-base text-slate-300 max-w-2xl leading-relaxed">
            Review your previous designs and track your improvement.
          </p>
        </div>

        <button
          onClick={onStartNewProblem}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-indigo-600/30 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Code2 className="w-4 h-4" />
          <span>Practice More Problems</span>
        </button>
      </div>

      {/* Visual Improvement Highlight Card (Required by prompt) */}
      {improvementSummary && (
        <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/20 via-slate-900 to-indigo-950/20 p-5 sm:p-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Improvement Detected</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                {improvementSummary.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300">
                You progressed across {improvementSummary.attemptCount} iterations by refactoring architectural separation.
              </p>
            </div>

            <div className="flex items-center gap-4 bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
              <div className="text-right">
                <span className="text-[11px] uppercase tracking-wider text-slate-400 block font-medium">
                  Score Delta
                </span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-lg font-bold text-slate-400 font-mono">
                    {improvementSummary.from}
                  </span>
                  <span className="text-slate-500">→</span>
                  <span className="text-2xl font-extrabold text-emerald-400 font-mono">
                    {improvementSummary.to}
                  </span>
                </div>
              </div>
              <div className="pl-4 border-l border-slate-800">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  +{improvementSummary.diff} points
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-2 flex items-center gap-1">
          <Filter className="w-3.5 h-3.5" /> Filter:
        </span>
        {problemTitles.map((title) => {
          const isSelected = selectedProblemFilter === title
          return (
            <button
              key={title}
              onClick={() => setSelectedProblemFilter(title)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              {title}
            </button>
          )
        })}
      </div>

      {/* Attempts List */}
      <div className="space-y-4">
        {filteredAttempts.map((att) => {
          const isHighScore = att.overallScore >= 80
          const isMediumScore = att.overallScore >= 70 && att.overallScore < 80

          return (
            <div
              key={att.id}
              className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6 hover:border-slate-700 hover:bg-slate-900/90 transition-all shadow-md group"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
                {/* Attempt Details */}
                <div className="space-y-2 max-w-xl">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                      {att.problemTitle}
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                      Attempt #{att.attemptNumber}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <CheckCircle2 className="w-3 h-3" />
                      {att.status || 'Evaluated'}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1.5 font-mono">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      {att.date}
                    </span>
                    {att.delta && (
                      <span className="text-emerald-400 font-medium">
                        +{att.delta} pts from previous
                      </span>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm text-slate-400 line-clamp-1">
                    {att.overallFeedback}
                  </p>
                </div>

                {/* Score & Actions */}
                <div className="flex items-center justify-between md:justify-end gap-5 pt-3 md:pt-0 border-t md:border-t-0 border-slate-800">
                  <div className="text-left md:text-right">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                      Score
                    </span>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span
                        className={`text-2xl font-extrabold font-mono ${
                          isHighScore
                            ? 'text-emerald-400'
                            : isMediumScore
                            ? 'text-indigo-400'
                            : 'text-amber-400'
                        }`}
                      >
                        {att.overallScore}
                      </span>
                      <span className="text-slate-500 text-xs">/ 100</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onViewFeedback(att)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs sm:text-sm font-semibold transition-all border border-slate-700 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-indigo-400" />
                      <span>View Feedback</span>
                    </button>
                    <button
                      onClick={() => onTryAgain(att.problemId, att)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold shadow-sm transition-all cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Try Again</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )
        })}

        {filteredAttempts.length === 0 && (
          <div className="py-16 text-center rounded-xl border border-dashed border-slate-800 bg-slate-900/30">
            <History className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-300">No attempts found</h3>
            <p className="text-xs text-slate-500 mt-1">Start practicing to track your design journey.</p>
          </div>
        )}
      </div>
    </div>
  )
}
