import React, { useState, useEffect } from 'react'
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Save,
  Send,
  Layers,
  Sparkles,
  HelpCircle,
  FileCode2,
  RotateCcw,
  AlertTriangle,
  Lightbulb,
  Check,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import DifficultyBadge from '../components/common/DifficultyBadge'
import SubmissionModal from '../components/practice/SubmissionModal'
import EvaluationProgressModal from '../components/practice/EvaluationProgressModal'

export default function PracticePage({
  problem,
  attemptNumber = 1,
  isTryAgain = false,
  previousAttempt = null,
  onBack,
  onSaveDraft,
  onSubmitSolution,
  draftData = null
}) {
  const [solutionCode, setSolutionCode] = useState(
    draftData?.code ||
      (isTryAgain && previousAttempt?.solutionCode
        ? previousAttempt.solutionCode
        : problem?.starterTemplate || '')
  )

  const [explanation, setExplanation] = useState(
    draftData?.explanation ||
      (isTryAgain && previousAttempt?.explanation
        ? previousAttempt.explanation
        : problem?.starterExplanation || '')
  )

  const [checkedRequirements, setCheckedRequirements] = useState({})
  const [isSubmittingModalOpen, setIsSubmittingModalOpen] = useState(false)
  const [isEvaluating, setIsEvaluating] = useState(false)
  const [showFeedbackSummary, setShowFeedbackSummary] = useState(true)
  const [draftSavedTime, setDraftSavedTime] = useState('Saved just now')
  const [activeLeftTab, setActiveLeftTab] = useState('requirements')
  const [elapsedSeconds, setElapsedSeconds] = useState(0)

  // Timer simulation for workspace
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Sync draft data when loaded from database
  useEffect(() => {
    if (draftData) {
      if (draftData.code || draftData.solution) {
        setSolutionCode(draftData.code || draftData.solution)
      }
      if (draftData.explanation) {
        setExplanation(draftData.explanation)
      }
    }
  }, [draftData])

  const formatTimer = (totalSec) => {
    const mins = Math.floor(totalSec / 60)
    const secs = totalSec % 60
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  const toggleRequirement = (idx) => {
    setCheckedRequirements((prev) => ({
      ...prev,
      [idx]: !prev[idx]
    }))
  }

  const handleSaveDraft = () => {
    if (onSaveDraft) {
      onSaveDraft(problem.id, {
        code: solutionCode,
        explanation
      })
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      setDraftSavedTime(`Saved at ${now}`)
    }
  }

  const handleOpenSubmit = () => {
    setIsSubmittingModalOpen(true)
  }

  const handleConfirmSubmit = () => {
    setIsSubmittingModalOpen(false)
    setIsEvaluating(true)
  }

  const handleEvaluationComplete = () => {
    setIsEvaluating(false)
    onSubmitSolution({
      problemId: problem.id,
      code: solutionCode,
      explanation,
      attemptNumber
    })
  }

  const loadStrategyPatternTemplate = () => {
    setSolutionCode(`// Improved Solution with Strategy Patterns Decoupled
public interface ParkingStrategy {
    ParkingSpot findSpot(List<ParkingFloor> floors, Vehicle vehicle);
}

public class NearestSpotStrategy implements ParkingStrategy {
    @Override
    public ParkingSpot findSpot(List<ParkingFloor> floors, Vehicle vehicle) {
        for (ParkingFloor floor : floors) {
            for (ParkingSpot spot : floor.getAvailableSpots()) {
                if (spot.canFit(vehicle)) return spot;
            }
        }
        return null;
    }
}

public interface PricingStrategy {
    double calculateFee(Ticket ticket, long durationMillis);
}

public class HourlyPricingStrategy implements PricingStrategy {
    @Override
    public double calculateFee(Ticket ticket, long durationMillis) {
        double hours = Math.ceil(durationMillis / (1000.0 * 3600.0));
        return hours * ticket.getVehicle().getHourlyRate();
    }
}

public class ParkingLot {
    private String name;
    private List<ParkingFloor> floors;
    private ParkingStrategy parkingStrategy;
    private PricingStrategy pricingStrategy;

    public ParkingLot(ParkingStrategy parkingStrategy, PricingStrategy pricingStrategy) {
        this.parkingStrategy = parkingStrategy;
        this.pricingStrategy = pricingStrategy;
    }

    public Ticket parkVehicle(Vehicle vehicle) {
        ParkingSpot spot = parkingStrategy.findSpot(floors, vehicle);
        if (spot == null) throw new NoSpotAvailableException();
        spot.assignVehicle(vehicle);
        return new Ticket(vehicle, spot, System.currentTimeMillis());
    }

    public double unparkVehicle(Ticket ticket) {
        ticket.getSpot().release();
        long duration = System.currentTimeMillis() - ticket.getEntryTime();
        return pricingStrategy.calculateFee(ticket, duration);
    }
}`)
    setExplanation(`Addressed Attempt #2 feedback:
- Decoupled spot allocation into pluggable ParkingStrategy (NearestSpotStrategy).
- Decoupled fee calculations into PricingStrategy (HourlyPricingStrategy).
- ParkingLot now coordinates via high-level abstractions, satisfying SRP and Open-Closed Principle.`)
  }

  return (
    <div className="space-y-6">
      {/* Top Workspace Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/90 border border-slate-800 shadow-md">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Back to problem details"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {problem.title}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Attempt #{attemptNumber}
              </span>
            </div>
            <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
              <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Status: In Progress
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 font-mono text-slate-400">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                {formatTimer(elapsedSeconds)}
              </span>
              <span>•</span>
              <span className="text-slate-500 text-[11px]">{draftSavedTime}</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {isTryAgain && (
            <button
              onClick={loadStrategyPatternTemplate}
              className="px-3 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5"
              title="Apply suggested Strategy Pattern refactor"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Apply Suggested Refactor</span>
            </button>
          )}

          <button
            onClick={handleSaveDraft}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-medium border border-slate-700 transition-colors cursor-pointer"
          >
            <Save className="w-4 h-4 text-slate-400" />
            <span>Save Draft</span>
          </button>

          <button
            onClick={handleOpenSubmit}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Submit Solution</span>
          </button>
        </div>
      </div>

      {/* Try Again Context Banner */}
      {isTryAgain && (
        <div className="rounded-xl border border-indigo-500/40 bg-gradient-to-r from-indigo-950/40 via-slate-900 to-indigo-950/40 p-4 sm:p-5 shadow-lg">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30">
                  Attempt #{attemptNumber}
                </span>
                <span className="text-xs text-slate-400">
                  Previous Score:{' '}
                  <strong className="text-amber-400 font-semibold">
                    {previousAttempt?.overallScore ?? 78} / 100
                  </strong>
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-semibold text-white">
                Try to improve your previous design based on the feedback you received.
              </h3>
            </div>
            <button
              onClick={() => setShowFeedbackSummary(!showFeedbackSummary)}
              className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium transition-colors"
            >
              <span>{showFeedbackSummary ? 'Hide Feedback Notes' : 'Show Feedback Notes'}</span>
              {showFeedbackSummary ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>
          </div>

          {showFeedbackSummary && (
            <div className="mt-3 pt-3 border-t border-indigo-500/20 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-200 space-y-1">
                <span className="font-semibold flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  Key Areas to Fix:
                </span>
                <ul className="list-disc list-inside text-amber-300/90 pl-1 space-y-0.5">
                  <li>ParkingLot is handling multiple responsibilities (SRP violation).</li>
                  <li>Fee calculation is tightly coupled in unparkVehicle.</li>
                </ul>
              </div>

              <div className="p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-200 space-y-1">
                <span className="font-semibold flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5 text-indigo-400" />
                  Suggested Architecture:
                </span>
                <p className="text-indigo-300/90 leading-relaxed">
                  Extract <code>ParkingStrategy</code> and <code>PricingStrategy</code> interfaces so allocation and pricing rules can vary independently.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main Dual-Column Practice Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT PANEL: Problem Statement & Requirements & Design Considerations */}
        <div className="lg:col-span-5 rounded-xl border border-slate-800 bg-slate-900/70 p-5 space-y-5 shadow-lg backdrop-blur-sm">
          {/* Sub Navigation Tabs */}
          <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-950 border border-slate-800 text-xs">
            <button
              onClick={() => setActiveLeftTab('requirements')}
              className={`flex-1 py-1.5 px-3 rounded-md font-medium transition-all cursor-pointer ${
                activeLeftTab === 'requirements'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Requirements ({problem.requirements.length})
            </button>
            <button
              onClick={() => setActiveLeftTab('considerations')}
              className={`flex-1 py-1.5 px-3 rounded-md font-medium transition-all cursor-pointer ${
                activeLeftTab === 'considerations'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Design Considerations
            </button>
          </div>

          {activeLeftTab === 'requirements' ? (
            <div className="space-y-4">
              <div className="space-y-1">
                <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Requirements
                </h2>
                <p className="text-xs text-slate-400">
                  Click items as you address them in your design:
                </p>
              </div>

              <div className="space-y-2.5">
                {problem.requirements.map((req, idx) => {
                  const isChecked = !!checkedRequirements[idx]
                  return (
                    <div
                      key={idx}
                      onClick={() => toggleRequirement(idx)}
                      className={`flex items-start gap-3 p-3 rounded-lg border transition-all cursor-pointer select-none text-xs sm:text-sm ${
                        isChecked
                          ? 'bg-emerald-500/[0.08] border-emerald-500/30 text-emerald-200'
                          : 'bg-slate-950/60 border-slate-800/80 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center transition-colors ${
                          isChecked
                            ? 'bg-emerald-500 text-slate-950'
                            : 'border border-slate-600 bg-slate-900'
                        }`}
                      >
                        {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <span className={`leading-relaxed ${isChecked ? 'line-through text-emerald-300/70' : ''}`}>
                        {req}
                      </span>
                    </div>
                  )
                })}
              </div>

              {/* Problem Brief Summary */}
              <div className="p-3.5 rounded-lg bg-slate-950/80 border border-slate-800/80 space-y-1.5">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Summary
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {problem.fullDescription}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-1">
                <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-400" />
                  Design Considerations
                </h2>
                <p className="text-xs text-slate-400">
                  Core architectural pillars to evaluate your solution:
                </p>
              </div>

              <div className="space-y-3">
                {problem.considerations.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80 space-y-1 text-xs"
                  >
                    <span className="font-semibold text-indigo-400 tracking-wide uppercase text-[11px]">
                      {item.label}
                    </span>
                    <p className="text-slate-300 leading-relaxed">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT PANEL: Professional Coding / Architecture Workspace */}
        <div className="lg:col-span-7 space-y-5">
          {/* Editor Container */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/90 shadow-xl overflow-hidden">
            {/* Editor Top Bar */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950 border-b border-slate-800 text-xs">
              <div className="flex items-center gap-2">
                <FileCode2 className="w-4 h-4 text-indigo-400" />
                <span className="font-semibold text-slate-200">Your Solution</span>
                <span className="text-slate-500">|</span>
                <span className="text-slate-400 font-mono text-[11px]">architecture.java</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setSolutionCode(problem.starterTemplate)
                    setExplanation(problem.starterExplanation)
                  }}
                  className="px-2 py-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors flex items-center gap-1 cursor-pointer"
                  title="Reset to starter skeleton"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Skeleton</span>
                </button>
              </div>
            </div>

            {/* Code / Architecture Textarea */}
            <div className="p-4 bg-slate-950/70">
              <textarea
                value={solutionCode}
                onChange={(e) => setSolutionCode(e.target.value)}
                placeholder="Describe your classes, interfaces, relationships, responsibilities and design decisions..."
                rows={18}
                className="w-full bg-transparent font-mono text-xs sm:text-sm text-slate-200 placeholder-slate-600 focus:outline-none resize-y leading-relaxed border-0"
                spellCheck="false"
                style={{ tabSize: 4 }}
                onKeyDown={(e) => {
                  if (e.key === 'Tab') {
                    e.preventDefault()
                    const start = e.target.selectionStart
                    const end = e.target.selectionEnd
                    const val = solutionCode
                    setSolutionCode(val.substring(0, start) + '    ' + val.substring(end))
                    setTimeout(() => {
                      e.target.selectionStart = e.target.selectionEnd = start + 4
                    }, 0)
                  }
                }}
              />
            </div>
          </div>

          {/* Additional Explanation Textarea */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-4 space-y-2 shadow-md">
            <div className="flex items-center justify-between">
              <label className="text-xs sm:text-sm font-semibold text-slate-200">
                Additional Explanation
              </label>
              <span className="text-[11px] text-slate-500 font-mono">
                {explanation.length} characters
              </span>
            </div>
            <textarea
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              placeholder="Explain why you chose this design and mention any trade-offs..."
              rows={4}
              className="w-full p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-y leading-relaxed"
            />
          </div>

          {/* Bottom Action Footer */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <button
              onClick={handleSaveDraft}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-medium border border-slate-700 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4 text-slate-400" />
              <span>Save Draft</span>
            </button>

            <button
              onClick={handleOpenSubmit}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-indigo-500/25 transition-all cursor-pointer"
            >
              <span>Submit Solution</span>
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <SubmissionModal
        isOpen={isSubmittingModalOpen}
        attemptNumber={attemptNumber}
        onCancel={() => setIsSubmittingModalOpen(false)}
        onConfirm={handleConfirmSubmit}
      />

      {/* Evaluation Progress Screen */}
      <EvaluationProgressModal
        isOpen={isEvaluating}
        onComplete={handleEvaluationComplete}
      />
    </div>
  )
}
