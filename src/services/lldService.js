/**
 * Frontend Service Layer communicating with the Node.js / Express SQLite REST backend.
 */

const API_BASE = '/api'

const formatDate = (isoString) => {
  if (!isoString) return ''
  try {
    const d = new Date(isoString)
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  } catch {
    return isoString
  }
}

// Normalizes an attempt object with feedback and UI helper properties
const normalizeAttempt = (raw, allAttempts = []) => {
  if (!raw) return null
  const feedback = raw.feedback || {}

  // Find previous attempt for same problem to compute delta
  const sameProblem = (allAttempts.length ? allAttempts : [raw])
    .filter((a) => a.problemId === raw.problemId)
    .sort((a, b) => a.attemptNumber - b.attemptNumber)

  const currentIndex = sameProblem.findIndex((a) => a.id === raw.id)
  let previousScore = null
  let delta = null

  if (currentIndex > 0) {
    previousScore = sameProblem[currentIndex - 1].score ?? sameProblem[currentIndex - 1].overallScore
    if (previousScore !== null && raw.score !== null) {
      delta = (raw.score ?? raw.overallScore) - previousScore
    }
  }

  return {
    id: raw.id,
    problemId: raw.problemId || raw.problem_id,
    problemTitle: raw.problemTitle || raw.problem_title || 'Problem',
    attemptNumber: raw.attemptNumber || raw.attempt_number || 1,
    status: raw.status || 'SUBMITTED',
    date: formatDate(raw.createdAt || raw.created_at),
    createdAt: raw.createdAt || raw.created_at,
    solutionCode: raw.solution || raw.solutionCode || '',
    solution: raw.solution || raw.solutionCode || '',
    explanation: raw.explanation || '',
    overallScore: raw.score ?? raw.overallScore ?? (feedback.overallScore || 0),
    score: raw.score ?? raw.overallScore ?? (feedback.overallScore || 0),
    previousScore,
    delta,
    scoreBreakdown: feedback.scoreBreakdown || feedback.score_breakdown || null,
    strengths: feedback.strengths || [],
    areasToImprove: feedback.areasToImprove || feedback.areas_to_improve || [],
    suggestedImprovements: feedback.suggestedImprovements || feedback.suggested_improvements || null,
    overallFeedback: feedback.overallFeedback || feedback.overall_feedback || raw.overallFeedback || ''
  }
}

export const lldService = {
  // GET /api/problems
  async getProblems() {
    const res = await fetch(`${API_BASE}/problems`)
    if (!res.ok) {
      throw new Error(`Failed to fetch problems: ${res.statusText}`)
    }
    return res.json()
  },

  // GET /api/problems/:id
  async getProblemById(id) {
    const res = await fetch(`${API_BASE}/problems/${id}`)
    if (!res.ok) {
      throw new Error(`Failed to fetch problem ${id}: ${res.statusText}`)
    }
    return res.json()
  },

  // GET /api/attempts
  async getAttempts() {
    const res = await fetch(`${API_BASE}/attempts`)
    if (!res.ok) {
      throw new Error(`Failed to fetch attempts: ${res.statusText}`)
    }
    const rawAttempts = await res.json()
    return rawAttempts.map((att) => normalizeAttempt(att, rawAttempts))
  },

  // GET /api/attempts/:id
  async getAttemptById(id) {
    const res = await fetch(`${API_BASE}/attempts/${id}`)
    if (!res.ok) {
      throw new Error(`Failed to fetch attempt ${id}: ${res.statusText}`)
    }
    const raw = await res.json()
    const all = await this.getAttempts()
    return normalizeAttempt(raw, all)
  },

  // Helper for latest attempt
  async getLatestAttemptForProblem(problemId) {
    const attempts = await this.getAttempts()
    const matching = attempts
      .filter((a) => a.problemId === problemId)
      .sort((a, b) => b.attemptNumber - a.attemptNumber)
    return matching.length > 0 ? matching[0] : null
  },

  // GET /api/stats
  async getStats() {
    const res = await fetch(`${API_BASE}/stats`)
    if (!res.ok) {
      throw new Error(`Failed to fetch stats: ${res.statusText}`)
    }
    return res.json()
  },

  // GET /api/drafts/:problemId
  async getDraft(problemId) {
    try {
      const res = await fetch(`${API_BASE}/drafts/${problemId}`)
      if (res.status === 404) return null
      if (!res.ok) return null
      const data = await res.json()
      return data
    } catch {
      return null
    }
  },

  // POST /api/drafts/:problemId
  async saveDraft(problemId, draftData) {
    const res = await fetch(`${API_BASE}/drafts/${problemId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        solution: draftData.code || draftData.solution || '',
        explanation: draftData.explanation || ''
      })
    })
    if (!res.ok) {
      throw new Error('Failed to save draft')
    }
    return res.json()
  },

  // Complete Submission Flow:
  // 1. POST /api/attempts
  // 2. POST /api/attempts/:id/evaluate
  async submitSolution(problemId, { code, explanation, attemptNumber }) {
    // Step 1: Create Attempt (status: SUBMITTED)
    const createRes = await fetch(`${API_BASE}/attempts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        problemId,
        solution: code,
        explanation
      })
    })

    if (!createRes.ok) {
      const errData = await createRes.json().catch(() => ({}))
      throw new Error(errData.error || `Submission failed (${createRes.status})`)
    }

    const createdAttempt = await createRes.json()

    // Step 2: Trigger Evaluation (status: EVALUATING -> EVALUATED)
    const evalRes = await fetch(`${API_BASE}/attempts/${createdAttempt.id}/evaluate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    })

    if (!evalRes.ok) {
      const errData = await evalRes.json().catch(() => ({}))
      throw new Error(errData.error || `Evaluation failed (${evalRes.status})`)
    }

    const { attempt, feedback } = await evalRes.json()

    // Enrich attempt with feedback
    const merged = {
      ...attempt,
      feedback
    }

    const allAttempts = await this.getAttempts()
    return normalizeAttempt(merged, allAttempts)
  },

  // POST /api/attempts/:id/retry
  async retryAttempt(attemptId) {
    const res = await fetch(`${API_BASE}/attempts/${attemptId}/retry`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    })
    if (!res.ok) {
      throw new Error('Failed to retry attempt')
    }
    return res.json()
  }
}
