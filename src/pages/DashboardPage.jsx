import React from 'react'
import {
  CheckCircle2,
  Trophy,
  Activity,
  Award,
  ArrowRight,
  Sparkles,
  BookOpen,
  Compass,
  Zap,
  TrendingUp
} from 'lucide-react'
import DifficultyBadge from '../components/common/DifficultyBadge'

export default function DashboardPage({
  stats,
  recommendedProblems,
  onStartProblem,
  onContinueProblem,
  onViewAllProblems
}) {
  const statCards = [
    {
      label: 'Problems Solved',
      value: stats?.problemsSolved ?? 5,
      icon: CheckCircle2,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10 border-emerald-500/20',
      subtext: 'Solid mastery'
    },
    {
      label: 'Average Score',
      value: `${stats?.averageScore ?? 78}%`,
      icon: Activity,
      color: 'text-indigo-400',
      bgColor: 'bg-indigo-500/10 border-indigo-500/20',
      subtext: '+6% this week'
    },
    {
      label: 'Total Attempts',
      value: stats?.totalAttempts ?? 8,
      icon: Award,
      color: 'text-violet-400',
      bgColor: 'bg-violet-500/10 border-violet-500/20',
      subtext: 'Across 4 problems'
    },
    {
      label: 'Best Score',
      value: `${stats?.bestScore ?? 92}%`,
      icon: Trophy,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10 border-amber-500/20',
      subtext: 'Top 5% percentile'
    }
  ]

  return (
    <div className="space-y-10">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900/90 to-slate-950 p-6 sm:p-8 shadow-xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-20 w-64 h-64 rounded-full bg-violet-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-400 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive LLD Evaluation Workspace</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Welcome back 👋
          </h1>
          <p className="mt-3 text-base sm:text-lg text-slate-300 leading-relaxed">
            Practice Low-Level Design problems and improve your architecture skills through explainable feedback.
          </p>
        </div>
      </div>

      {/* Statistics Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
            Your Performance Metrics
          </h2>
          <span className="text-xs text-slate-500 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            Live sync enabled
          </span>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat, idx) => {
            const Icon = stat.icon
            return (
              <div
                key={idx}
                className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-sm hover:border-slate-700/80 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-medium text-slate-400">
                    {stat.label}
                  </span>
                  <div className={`w-8 h-8 rounded-lg ${stat.bgColor} border flex items-center justify-center`}>
                    <Icon className={`w-4 h-4 ${stat.color}`} />
                  </div>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    {stat.value}
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-500">{stat.subtext}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* Continue Practicing Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <Zap className="w-5 h-5 text-indigo-400" />
            Continue Practicing
          </h2>
          <span className="text-xs text-indigo-400 font-medium bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/20">
            Resume Attempt
          </span>
        </div>

        <div className="relative rounded-2xl border border-indigo-500/30 bg-gradient-to-r from-slate-900 via-indigo-950/20 to-slate-900 p-6 sm:p-7 shadow-xl hover:border-indigo-500/50 transition-all">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2.5">
                <h3 className="text-2xl font-bold text-white tracking-tight">
                  Parking Lot
                </h3>
                <DifficultyBadge difficulty="Medium" />
                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  Object-Oriented Design
                </span>
              </div>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Design a flexible parking lot system supporting multiple vehicle types and parking strategies.
              </p>
              <div className="flex items-center gap-4 text-xs text-slate-400 pt-1">
                <span>Recent Score: <strong className="text-indigo-300 font-semibold">78 / 100</strong></span>
                <span>•</span>
                <span>Recommendation: <span className="text-amber-300 font-medium">Decouple Strategy Pattern</span></span>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => onContinueProblem('parking-lot')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all focus:outline-none cursor-pointer"
              >
                <span>Continue Practice</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Recommended Problems Section */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <Compass className="w-5 h-5 text-indigo-400" />
              Recommended Problems
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Hand-picked scenarios frequently asked in FAANG & high-growth startup interviews.
            </p>
          </div>
          <button
            onClick={onViewAllProblems}
            className="text-xs sm:text-sm font-medium text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {recommendedProblems.map((problem) => (
            <div
              key={problem.id}
              className="flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-900/60 p-6 hover:border-slate-700 hover:bg-slate-900/90 transition-all group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <DifficultyBadge difficulty={problem.difficulty} />
                  <span className="text-[11px] font-medium text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700/50">
                    {problem.category}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                  {problem.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed line-clamp-3">
                  {problem.shortDescription}
                </p>
              </div>

              <div className="pt-5 mt-4 border-t border-slate-800/80">
                <button
                  onClick={() => onStartProblem(problem.id)}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-indigo-600 text-slate-200 hover:text-white text-xs sm:text-sm font-semibold transition-all border border-slate-700 hover:border-indigo-500 cursor-pointer"
                >
                  <span>Start Practice</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
