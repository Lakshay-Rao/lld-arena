import React from 'react'
import { Layers, ShieldCheck, Heart } from 'lucide-react'

export default function Footer({ onNavigate }) {
  return (
    <footer className="mt-20 border-t border-slate-800/80 bg-slate-950 py-10 text-xs text-slate-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-md bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
            <Layers className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="font-bold text-slate-300">LLD Arena</span>
            <span className="mx-2 text-slate-700">•</span>
            <span className="text-slate-400">Practice Low-Level Design. Get Better Feedback.</span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <button
            onClick={() => onNavigate('dashboard')}
            className="hover:text-slate-300 transition-colors"
          >
            Dashboard
          </button>
          <button
            onClick={() => onNavigate('problems')}
            className="hover:text-slate-300 transition-colors"
          >
            Problems
          </button>
          <button
            onClick={() => onNavigate('history')}
            className="hover:text-slate-300 transition-colors"
          >
            My Attempts
          </button>
        </div>
      </div>
    </footer>
  )
}
