import React, { useState, useEffect } from 'react'
import { CheckCircle2, Loader2, Sparkles, BrainCircuit } from 'lucide-react'

export default function EvaluationProgressModal({ isOpen, onComplete }) {
  // Steps as defined in user prompt:
  // 1: Submission received
  // 2: Checking requirements
  // 3: Analyzing responsibilities
  // 4: Generating feedback
  const [currentStep, setCurrentStep] = useState(0)

  const steps = [
    { id: 1, label: 'Submission received' },
    { id: 2, label: 'Checking requirements' },
    { id: 3, label: 'Analyzing responsibilities' },
    { id: 4, label: 'Generating feedback' }
  ]

  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(0)
      return
    }

    // Step progression timers
    const timer1 = setTimeout(() => setCurrentStep(1), 400)
    const timer2 = setTimeout(() => setCurrentStep(2), 1100)
    const timer3 = setTimeout(() => setCurrentStep(3), 1900)
    const timer4 = setTimeout(() => setCurrentStep(4), 2700)
    const timerDone = setTimeout(() => {
      onComplete()
    }, 3500)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
      clearTimeout(timer4)
      clearTimeout(timerDone)
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-2xl border border-indigo-500/30 bg-slate-900 p-8 shadow-2xl shadow-indigo-500/10 space-y-6">
        {/* Header with animated icon */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 relative">
            <BrainCircuit className="w-8 h-8 animate-pulse text-indigo-400" />
            <div className="absolute -inset-1 rounded-2xl bg-indigo-500/20 blur-md -z-10 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-white tracking-tight">
              Analyzing your design...
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Parsing class hierarchy, interfaces, responsibilities, and modularity
            </p>
          </div>
        </div>

        {/* Progress Steps Checklist */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-3.5">
          {steps.map((step, idx) => {
            const isFinished = currentStep > idx
            const isCurrent = currentStep === idx

            return (
              <div
                key={step.id}
                className="flex items-center gap-3 text-sm transition-all duration-300"
              >
                {isFinished ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                ) : isCurrent ? (
                  <div className="w-5 h-5 flex items-center justify-center">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-ping absolute" />
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 relative" />
                  </div>
                ) : (
                  <div className="w-5 h-5 flex items-center justify-center">
                    <span className="w-2 h-2 rounded-full bg-slate-700" />
                  </div>
                )}

                <span
                  className={`font-medium ${
                    isFinished
                      ? 'text-slate-200'
                      : isCurrent
                      ? 'text-indigo-300 font-semibold'
                      : 'text-slate-500'
                  }`}
                >
                  {step.label}
                </span>

                {isCurrent && (
                  <span className="ml-auto text-[11px] text-indigo-400 font-mono animate-pulse">
                    Evaluating...
                  </span>
                )}
              </div>
            )
          })}
        </div>

        {/* Animated Progress Bar */}
        <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-gradient-to-r from-indigo-500 to-violet-500 h-full transition-all duration-500 ease-out"
            style={{ width: `${(Math.min(currentStep, 4) / 4) * 100}%` }}
          />
        </div>
      </div>
    </div>
  )
}
