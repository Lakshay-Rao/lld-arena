import React from 'react'
import {
  ArrowLeft,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Code,
  Tag,
  Lightbulb
} from 'lucide-react'
import DifficultyBadge from '../components/common/DifficultyBadge'

export default function ProblemDetailsPage({ problem, onBack, onStartPractice }) {
  if (!problem) return null

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-slate-200 transition-colors cursor-pointer group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span>Back to Problems</span>
      </button>

      {/* Header Card */}
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 p-6 sm:p-8 shadow-xl">
        <div className="flex flex-wrap items-center gap-2.5 mb-4">
          <DifficultyBadge difficulty={problem.difficulty} />
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            {problem.category}
          </span>
          <div className="flex items-center gap-1.5 ml-auto">
            {problem.tags.map((tag, idx) => (
              <span
                key={idx}
                className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700/60 font-mono hidden sm:inline-block"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          {problem.title}
        </h1>

        <div className="mt-4 pt-4 border-t border-slate-800/80">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Description:
          </h2>
          <p className="text-base sm:text-lg text-slate-200 leading-relaxed">
            "{problem.shortDescription}"
          </p>
          <p className="mt-2 text-sm text-slate-400 leading-relaxed">
            {problem.fullDescription}
          </p>
        </div>
      </div>

      {/* Requirements Section */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 sm:p-7 backdrop-blur-sm shadow-md">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <h2 className="text-lg font-bold text-white tracking-tight">
            System Requirements
          </h2>
        </div>

        <ul className="space-y-3">
          {problem.requirements.map((req, idx) => (
            <li
              key={idx}
              className="flex items-start gap-3 p-3 rounded-lg bg-slate-950/50 border border-slate-800/60 text-slate-200 text-sm"
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{req}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Things to Think About */}
      <div className="rounded-xl border border-amber-500/20 bg-amber-500/[0.03] p-6 sm:p-7 shadow-md">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
            <Lightbulb className="w-4 h-4 text-amber-400" />
          </div>
          <h2 className="text-lg font-bold text-amber-200 tracking-tight">
            Things to Think About
          </h2>
        </div>

        <div className="space-y-2.5">
          {problem.thingsToThinkAbout.map((item, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 text-slate-300 text-sm leading-relaxed"
            >
              <span className="text-amber-400 font-bold">•</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action: Start Practice */}
      <div className="flex items-center justify-between p-6 rounded-2xl bg-gradient-to-r from-indigo-950/40 via-slate-900 to-indigo-950/40 border border-indigo-500/30 shadow-xl">
        <div>
          <h3 className="text-base font-bold text-white">Ready to design your architecture?</h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Step into the practice workspace to draft your classes, interfaces, and trade-offs.
          </p>
        </div>
        <button
          onClick={() => onStartPractice(problem.id)}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 transition-all cursor-pointer"
        >
          <span>Start Practice</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
