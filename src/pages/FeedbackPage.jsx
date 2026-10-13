import React from 'react'
import {
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  RotateCcw,
  History,
  Sparkles,
  TrendingUp,
  FileCode2,
  ChevronRight,
  Award
} from 'lucide-react'
import ScoreRing from '../components/common/ScoreRing'
import ProgressBar from '../components/common/ProgressBar'

export default function FeedbackPage({
  attempt,
  onTryAgain,
  onViewAttempts
}) {
  if (!attempt) return null

  const {
    problemTitle,
    attemptNumber,
    overallScore,
    previousScore,
    delta,
    scoreBreakdown,
    strengths,
    areasToImprove,
    suggestedImprovements,
    overallFeedback
  } = attempt

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Top Banner / Review Header */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Evaluation Complete</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Design Review
            </h1>
            <div className="flex items-center gap-3 mt-1 text-slate-400 text-sm">
              <span className="text-white font-semibold">{problemTitle}</span>
              <span>•</span>
              <span className="text-indigo-400 font-medium">Attempt #{attemptNumber}</span>
              {delta !== null && delta !== undefined && (
                <>
                  <span>•</span>
                  <span className={`inline-flex items-center gap-1 font-semibold ${delta >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    <TrendingUp className="w-3.5 h-3.5" />
                    {delta > 0 ? `+${delta} points` : `${delta} points`}
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onTryAgain(attempt.problemId, attempt)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Try Again</span>
            </button>
            <button
              onClick={onViewAttempts}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs sm:text-sm border border-slate-700 transition-all cursor-pointer"
            >
              <History className="w-4 h-4 text-slate-400" />
              <span>View My Attempts</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Score & Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Large Score Indicator */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 flex flex-col items-center justify-center text-center backdrop-blur-sm shadow-lg">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
            Overall Score
          </span>
          <ScoreRing score={overallScore} max={100} size={180} strokeWidth={14} />

          {previousScore && (
            <div className="mt-5 p-3 rounded-lg bg-slate-950/80 border border-slate-800 text-xs text-slate-400 w-full">
              <span>Score Progression: </span>
              <span className="text-slate-300 font-mono">{previousScore}</span>
              <span className="mx-1 text-slate-500">→</span>
              <span className="text-white font-bold font-mono">{overallScore}</span>
              {delta && (
                <span className="ml-2 font-semibold text-emerald-400">
                  (+{delta} pts)
                </span>
              )}
            </div>
          )}
        </div>

        {/* Score Breakdown with Progress Bars */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 space-y-4 backdrop-blur-sm shadow-lg flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-1">
              Score Breakdown
            </h2>
            <p className="text-xs text-slate-400">
              Evaluated against architectural criteria and best practices
            </p>
          </div>

          <div className="space-y-3.5">
            {scoreBreakdown?.requirementsCoverage && (
              <ProgressBar
                label={scoreBreakdown.requirementsCoverage.label}
                score={scoreBreakdown.requirementsCoverage.score}
                max={scoreBreakdown.requirementsCoverage.max}
              />
            )}
            {scoreBreakdown?.responsibilitySeparation && (
              <ProgressBar
                label={scoreBreakdown.responsibilitySeparation.label}
                score={scoreBreakdown.responsibilitySeparation.score}
                max={scoreBreakdown.responsibilitySeparation.max}
              />
            )}
            {scoreBreakdown?.abstraction && (
              <ProgressBar
                label={scoreBreakdown.abstraction.label}
                score={scoreBreakdown.abstraction.score}
                max={scoreBreakdown.abstraction.max}
              />
            )}
            {scoreBreakdown?.extensibility && (
              <ProgressBar
                label={scoreBreakdown.extensibility.label}
                score={scoreBreakdown.extensibility.score}
                max={scoreBreakdown.extensibility.max}
              />
            )}
            {scoreBreakdown?.objectRelationships && (
              <ProgressBar
                label={scoreBreakdown.objectRelationships.label}
                score={scoreBreakdown.objectRelationships.score}
                max={scoreBreakdown.objectRelationships.max}
              />
            )}
            {scoreBreakdown?.designQuality && (
              <ProgressBar
                label={scoreBreakdown.designQuality.label}
                score={scoreBreakdown.designQuality.score}
                max={scoreBreakdown.designQuality.max}
              />
            )}
          </div>
        </div>
      </div>

      {/* Strengths & Areas to Improve Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* STRENGTHS */}
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.03] p-6 space-y-4 shadow-md">
          <div className="flex items-center gap-2.5 pb-2 border-b border-emerald-500/20">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <h2 className="text-base font-bold text-emerald-300 uppercase tracking-wider">
              Strengths
            </h2>
          </div>

          <div className="space-y-3">
            {strengths?.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3 rounded-lg bg-slate-950/60 border border-emerald-500/20 text-slate-200 text-xs sm:text-sm leading-relaxed"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* AREAS TO IMPROVE */}
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/[0.03] p-6 space-y-4 shadow-md">
          <div className="flex items-center gap-2.5 pb-2 border-b border-amber-500/20">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
            </div>
            <h2 className="text-base font-bold text-amber-300 uppercase tracking-wider">
              Areas to Improve
            </h2>
          </div>

          <div className="space-y-3">
            {areasToImprove?.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3 rounded-lg bg-slate-950/60 border border-amber-500/20 text-slate-200 text-xs sm:text-sm leading-relaxed"
              >
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SUGGESTED IMPROVEMENTS */}
      {suggestedImprovements && (
        <div className="rounded-2xl border border-indigo-500/30 bg-slate-900/80 p-6 sm:p-7 space-y-5 shadow-xl">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center">
              <Lightbulb className="w-4 h-4 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white uppercase tracking-wider">
                Suggested Improvements
              </h2>
              <span className="text-xs text-slate-400">
                Architectural recommendations to increase extensibility
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="text-sm text-slate-300 font-medium">
              {suggestedImprovements.recommendation}
            </div>

            {suggestedImprovements.patterns && (
              <div className="flex flex-wrap gap-2">
                {suggestedImprovements.patterns.map((pat, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-md bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 font-mono text-xs font-semibold"
                  >
                    {pat}
                  </span>
                ))}
              </div>
            )}

            {/* Architectural ASCII/Tree Diagram */}
            {suggestedImprovements.asciiDiagram && (
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-xs sm:text-sm text-indigo-300 leading-relaxed overflow-x-auto shadow-inner">
                <div className="text-[11px] uppercase tracking-wider text-slate-500 mb-2 font-sans font-semibold">
                  Architectural Structure:
                </div>
                <pre className="whitespace-pre">{suggestedImprovements.asciiDiagram}</pre>
              </div>
            )}

            <div className="p-3.5 rounded-lg bg-slate-950/70 border border-slate-800/80 text-xs sm:text-sm text-slate-300 leading-relaxed">
              <strong className="text-white">Explanation: </strong>
              "{suggestedImprovements.explanation}"
            </div>
          </div>
        </div>
      )}

      {/* OVERALL FEEDBACK */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-7 space-y-3 shadow-md">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Award className="w-4 h-4 text-indigo-400" />
          Overall Feedback
        </h2>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          {overallFeedback}
        </p>
      </div>

      {/* Action Footer Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-2xl bg-slate-900 border border-slate-800">
        <div>
          <h3 className="text-sm font-bold text-white">Ready for another iteration?</h3>
          <p className="text-xs text-slate-400">
            Refactor your design using the strategies outlined above to boost your score.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => onTryAgain(attempt.problemId, attempt)}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Try Again</span>
          </button>
          <button
            onClick={onViewAttempts}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-sm border border-slate-700 transition-all cursor-pointer"
          >
            <History className="w-4 h-4 text-slate-400" />
            <span>View My Attempts</span>
          </button>
        </div>
      </div>
    </div>
  )
}
