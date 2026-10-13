export const AttemptStatus = {
  SUBMITTED: 'SUBMITTED',
  EVALUATING: 'EVALUATING',
  EVALUATED: 'EVALUATED',
  FAILED: 'FAILED'
}

export class Attempt {
  constructor(data = {}) {
    const problemId = data.problemId || data.problem_id
    const attemptNumber = data.attemptNumber ?? data.attempt_number ?? 1
    const createdAt = data.createdAt || data.created_at || new Date().toISOString()

    this.id = data.id || `att-${problemId}-${Date.now()}`
    this.problemId = problemId
    this.attemptNumber = Number(attemptNumber)
    this.solution = data.solution
    this.explanation = data.explanation || ''
    this.status = data.status || AttemptStatus.SUBMITTED
    this.score = (data.score !== null && data.score !== undefined) ? Number(data.score) : null
    this.createdAt = createdAt
  }

  validate() {
    if (!this.problemId) {
      throw new Error('Problem ID is required')
    }
    if (!this.solution || typeof this.solution !== 'string' || this.solution.trim().length === 0) {
      throw new Error('Solution cannot be empty')
    }
    if (!this.attemptNumber || this.attemptNumber < 1) {
      throw new Error('Attempt number must be a positive integer')
    }
    return true
  }

  markEvaluating() {
    this.status = AttemptStatus.EVALUATING
  }

  markEvaluated(score) {
    this.status = AttemptStatus.EVALUATED
    this.score = Number(score)
  }

  markFailed() {
    this.status = AttemptStatus.FAILED
  }

  toJSON() {
    return {
      id: this.id,
      problemId: this.problemId,
      attemptNumber: this.attemptNumber,
      solution: this.solution,
      solutionCode: this.solution,
      explanation: this.explanation,
      status: this.status,
      score: this.score,
      overallScore: this.score,
      createdAt: this.createdAt
    }
  }
}
