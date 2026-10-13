import React, { useState, useEffect } from 'react'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import DashboardPage from './pages/DashboardPage'
import ProblemsPage from './pages/ProblemsPage'
import ProblemDetailsPage from './pages/ProblemDetailsPage'
import PracticePage from './pages/PracticePage'
import FeedbackPage from './pages/FeedbackPage'
import HistoryPage from './pages/HistoryPage'
import { lldService } from './services/lldService'

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [problems, setProblems] = useState([])
  const [attempts, setAttempts] = useState([])
  const [stats, setStats] = useState(null)
  const [selectedProblemId, setSelectedProblemId] = useState('parking-lot')
  const [activeFeedbackAttempt, setActiveFeedbackAttempt] = useState(null)
  const [practiceContext, setPracticeContext] = useState({
    attemptNumber: 1,
    isTryAgain: false,
    previousAttempt: null,
    draftData: null
  })
  const [notification, setNotification] = useState(null)

  // Load initial data from service
  useEffect(() => {
    const loadData = async () => {
      try {
        const [probs, atts, st] = await Promise.all([
          lldService.getProblems(),
          lldService.getAttempts(),
          lldService.getStats()
        ])
        setProblems(probs)
        setAttempts(atts)
        setStats(st)
      } catch (err) {
        console.error('Failed to load initial data', err)
      }
    }
    loadData()
  }, [])

  // Scroll to top on page change
  const navigateTo = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Toast notification helper
  const showToast = (message) => {
    setNotification(message)
    setTimeout(() => setNotification(null), 3000)
  }

  // Action: Select problem to view details
  const handleSelectProblem = (problemId) => {
    setSelectedProblemId(problemId)
    navigateTo('problem-details')
  }

  // Action: Start practice for a problem
  const handleStartPractice = async (problemId) => {
    setSelectedProblemId(problemId)

    // Calculate attempt number based on existing attempts
    const existing = attempts.filter((a) => a.problemId === problemId)
    const nextAttemptNumber = existing.length > 0
      ? Math.max(...existing.map((a) => a.attemptNumber)) + 1
      : 1

    const draft = await lldService.getDraft(problemId)
    const latestAttempt = await lldService.getLatestAttemptForProblem(problemId)

    setPracticeContext({
      attemptNumber: nextAttemptNumber,
      isTryAgain: existing.length > 0,
      previousAttempt: latestAttempt,
      draftData: draft
    })

    navigateTo('practice')
  }

  // Action: Continue practice from dashboard (e.g., parking-lot)
  const handleContinuePractice = (problemId) => {
    handleStartPractice(problemId)
  }

  // Action: Try Again flow (from Feedback or History)
  const handleTryAgain = async (problemId, previousAttemptObj) => {
    setSelectedProblemId(problemId)

    const existing = attempts.filter((a) => a.problemId === problemId)
    const highestNumber = existing.length > 0
      ? Math.max(...existing.map((a) => a.attemptNumber))
      : (previousAttemptObj?.attemptNumber || 2)

    const nextAttemptNumber = highestNumber + 1
    const draft = await lldService.getDraft(problemId)

    setPracticeContext({
      attemptNumber: nextAttemptNumber,
      isTryAgain: true,
      previousAttempt: previousAttemptObj || existing[0] || null,
      draftData: draft
    })

    navigateTo('practice')
  }

  // Action: Save Draft
  const handleSaveDraft = async (problemId, draftData) => {
    try {
      await lldService.saveDraft(problemId, draftData)
      showToast('Draft saved successfully')
    } catch (err) {
      console.error('Failed to save draft', err)
      showToast('Failed to save draft')
    }
  }

  // Action: Submit Solution
  const handleSubmitSolution = async ({ problemId, code, explanation, attemptNumber }) => {
    try {
      const newAttempt = await lldService.submitSolution(problemId, {
        code,
        explanation,
        attemptNumber
      })

      // Refresh attempts & stats
      const [updatedAttempts, updatedStats] = await Promise.all([
        lldService.getAttempts(),
        lldService.getStats()
      ])
      setAttempts(updatedAttempts)
      setStats(updatedStats)

      // Set active feedback and transition to Feedback Page
      setActiveFeedbackAttempt(newAttempt)
      navigateTo('feedback')
      showToast(`Attempt #${newAttempt.attemptNumber} evaluated!`)
    } catch (err) {
      console.error('Failed to submit solution', err)
      showToast(err.message || 'Failed to submit solution')
    }
  }

  // Action: View Feedback for an attempt (from History)
  const handleViewFeedback = (attempt) => {
    setActiveFeedbackAttempt(attempt)
    setSelectedProblemId(attempt.problemId)
    navigateTo('feedback')
  }

  // Get current problem object
  const currentProblem =
    problems.find((p) => p.id === selectedProblemId) || problems[0]

  // Top 3 recommended problems
  const recommendedProblems = problems.slice(0, 3)

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 antialiased font-sans">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-900 border border-indigo-500/40 text-slate-100 shadow-2xl text-xs sm:text-sm animate-in slide-in-from-bottom duration-200">
          <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
          <span>{notification}</span>
        </div>
      )}

      {/* Persistent Navigation */}
      <Navbar
        activePage={currentPage}
        onNavigate={navigateTo}
        attemptCount={attempts.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentPage === 'dashboard' && (
          <DashboardPage
            stats={stats}
            recommendedProblems={recommendedProblems}
            onStartProblem={handleSelectProblem}
            onContinueProblem={handleContinuePractice}
            onViewAllProblems={() => navigateTo('problems')}
          />
        )}

        {currentPage === 'problems' && (
          <ProblemsPage
            problems={problems}
            onSelectProblem={handleSelectProblem}
            onStartPractice={handleStartPractice}
          />
        )}

        {currentPage === 'problem-details' && (
          <ProblemDetailsPage
            problem={currentProblem}
            onBack={() => navigateTo('problems')}
            onStartPractice={handleStartPractice}
          />
        )}

        {currentPage === 'practice' && (
          <PracticePage
            problem={currentProblem}
            attemptNumber={practiceContext.attemptNumber}
            isTryAgain={practiceContext.isTryAgain}
            previousAttempt={practiceContext.previousAttempt}
            draftData={practiceContext.draftData}
            onBack={() => navigateTo('problem-details')}
            onSaveDraft={handleSaveDraft}
            onSubmitSolution={handleSubmitSolution}
          />
        )}

        {currentPage === 'feedback' && (
          <FeedbackPage
            attempt={activeFeedbackAttempt || attempts[0]}
            onTryAgain={handleTryAgain}
            onViewAttempts={() => navigateTo('history')}
          />
        )}

        {currentPage === 'history' && (
          <HistoryPage
            attempts={attempts}
            onViewFeedback={handleViewFeedback}
            onTryAgain={handleTryAgain}
            onStartNewProblem={() => navigateTo('problems')}
          />
        )}
      </main>

      {/* Footer */}
      <Footer onNavigate={navigateTo} />
    </div>
  )
}
