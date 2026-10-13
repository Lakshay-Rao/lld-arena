import React, { useState } from 'react'
import {
  Search,
  Filter,
  Tag,
  ArrowRight,
  BookOpen,
  CheckCircle,
  Sparkles
} from 'lucide-react'
import DifficultyBadge from '../components/common/DifficultyBadge'

export default function ProblemsPage({ problems, onSelectProblem, onStartPractice }) {
  const [filterDifficulty, setFilterDifficulty] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  const difficulties = ['All', 'Easy', 'Medium', 'Hard']

  const filteredProblems = problems.filter((problem) => {
    const matchesDifficulty =
      filterDifficulty === 'All' ||
      problem.difficulty.toLowerCase() === filterDifficulty.toLowerCase()

    const matchesSearch =
      problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      problem.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      problem.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))

    return matchesDifficulty && matchesSearch
  })

  return (
    <div className="space-y-8">
      {/* Title & Subtitle */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-2">
          <BookOpen className="w-4 h-4" />
          <span>Curated Problem Bank</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          LLD Problems
        </h1>
        <p className="mt-2 text-base text-slate-300 max-w-3xl leading-relaxed">
          Choose a problem and practice designing a real-world object-oriented system.
        </p>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
        {/* Difficulty Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-slate-950 border border-slate-800">
          {difficulties.map((diff) => {
            const isSelected = filterDifficulty === diff
            return (
              <button
                key={diff}
                onClick={() => setFilterDifficulty(diff)}
                className={`px-3.5 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                {diff}
              </button>
            )
          })}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[260px] sm:w-72">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search problems or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
          />
        </div>
      </div>

      {/* Problem Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProblems.map((problem) => (
          <div
            key={problem.id}
            className="flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-900/50 hover:border-slate-700 hover:bg-slate-900/80 p-6 transition-all group"
          >
            <div className="space-y-4">
              {/* Header Badges */}
              <div className="flex items-center justify-between gap-2">
                <DifficultyBadge difficulty={problem.difficulty} />
                <span className="text-[11px] font-medium text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700/50">
                  {problem.category}
                </span>
              </div>

              {/* Title & Description */}
              <div>
                <h3
                  onClick={() => onSelectProblem(problem.id)}
                  className="text-xl font-bold text-white group-hover:text-indigo-300 transition-colors cursor-pointer"
                >
                  {problem.title}
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {problem.shortDescription}
                </p>
              </div>

              {/* Tags */}
              <div className="pt-2">
                <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <Tag className="w-3 h-3" />
                  <span>Tags:</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {problem.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-2 py-0.5 rounded bg-slate-800/90 text-slate-300 border border-slate-700/60 font-mono"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions: View Details & Start Practice */}
            <div className="pt-6 mt-6 border-t border-slate-800/80 flex items-center gap-2">
              <button
                onClick={() => onSelectProblem(problem.id)}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-all border border-slate-700 cursor-pointer"
              >
                <span>View Details</span>
              </button>
              <button
                onClick={() => onStartPractice(problem.id)}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-md shadow-indigo-600/20 cursor-pointer"
              >
                <span>Start Practice</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}

        {filteredProblems.length === 0 && (
          <div className="col-span-full py-16 text-center rounded-xl border border-dashed border-slate-800 bg-slate-900/30">
            <Filter className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-300">No problems match your filter</h3>
            <p className="text-xs text-slate-500 mt-1">Try resetting the difficulty filter or search keyword.</p>
            <button
              onClick={() => {
                setFilterDifficulty('All')
                setSearchQuery('')
              }}
              className="mt-4 px-4 py-1.5 rounded-lg bg-slate-800 text-xs font-medium text-slate-300 hover:text-white"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
