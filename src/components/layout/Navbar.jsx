import React from 'react'
import {
  Layers,
  LayoutDashboard,
  Code2,
  History,
  Sparkles,
  User,
  Settings,
  ChevronRight
} from 'lucide-react'

export default function Navbar({ activePage, onNavigate, attemptCount = 0 }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'problems', label: 'Problems', icon: Code2 },
    { id: 'history', label: 'My Attempts', icon: History, count: attemptCount }
  ]

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Tagline */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => onNavigate('dashboard')}
              className="flex items-center gap-3 group focus:outline-none text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-violet-700 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/30 transition-all border border-indigo-400/30">
                <Layers className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-lg tracking-tight text-white group-hover:text-indigo-300 transition-colors">
                    LLD <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">Arena</span>
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    MVP
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium tracking-tight hidden sm:block">
                  Practice Low-Level Design. Get Better Feedback.
                </p>
              </div>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center gap-1 sm:gap-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = activePage === item.id

              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.count > 0 && (
                    <span
                      className={`ml-1 text-[11px] font-semibold px-1.5 py-0.2 rounded-full ${
                        isActive
                          ? 'bg-indigo-500 text-white'
                          : 'bg-slate-800 text-slate-300 border border-slate-700'
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </button>
              )
            })}
          </nav>

          {/* User Profile / Settings */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-slate-400">Evaluator:</span>
              <span className="text-slate-200 font-medium">Ready</span>
            </div>

            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <button
                className="w-9 h-9 rounded-full bg-gradient-to-tr from-slate-800 to-slate-700 border border-slate-700 flex items-center justify-center text-slate-300 hover:border-indigo-500 hover:text-white transition-all shadow-inner"
                title="Learner Profile (Demo)"
              >
                <span className="font-semibold text-xs tracking-wider">LY</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
