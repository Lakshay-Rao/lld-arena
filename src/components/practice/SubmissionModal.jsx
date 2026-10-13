import React from 'react'
import { AlertCircle, CheckCircle2, X } from 'lucide-react'

export default function SubmissionModal({ isOpen, onCancel, onConfirm, attemptNumber }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-5">
        <div className="flex items-start justify-between">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <button
            onClick={onCancel}
            className="text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div>
          <h3 className="text-xl font-bold text-white tracking-tight">
            Submit your solution?
          </h3>
          <p className="mt-2 text-sm text-slate-300 leading-relaxed">
            Once submitted, your design will be evaluated and you'll receive structured feedback.
          </p>
          <div className="mt-3 p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-400">
            <span>Submitting as: </span>
            <strong className="text-indigo-400">Attempt #{attemptNumber}</strong>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onCancel}
            className="px-4 py-2.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 text-sm font-medium transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  )
}
