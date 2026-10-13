import { Attempt, AttemptStatus } from '../domain/Attempt.js'

export class AttemptService {
  constructor(attemptRepository, problemRepository, feedbackRepository = null) {
    this.attemptRepository = attemptRepository
    this.problemRepository = problemRepository
    this.feedbackRepository = feedbackRepository
  }

  async getAllAttempts() {
    const attempts = this.attemptRepository.findAll()
    // Enrich with feedback if available
    return attempts.map((att) => {
      const feedback = this.feedbackRepository ? this.feedbackRepository.findByAttemptId(att.id) : null
      return {
        ...att.toJSON(),
        problemTitle: att.problemTitle,
        feedback: feedback ? feedback.toJSON() : null
      }
    })
  }

  async getAttemptById(id) {
    const attempt = this.attemptRepository.findById(id)
    if (!attempt) {
      const err = new Error(`Attempt with ID '${id}' not found`)
      err.status = 404
      throw err
    }
    const feedback = this.feedbackRepository ? this.feedbackRepository.findByAttemptId(attempt.id) : null
    return {
      ...attempt.toJSON(),
      problemTitle: attempt.problemTitle,
      feedback: feedback ? feedback.toJSON() : null
    }
  }

  async createAttempt({ problemId, solution, explanation = '' }) {
    if (!problemId) {
      const err = new Error('problemId is required')
      err.status = 400
      throw err
    }

    const problem = this.problemRepository.findById(problemId)
    if (!problem) {
      const err = new Error(`Problem with ID '${problemId}' not found`)
      err.status = 404
      throw err
    }

    if (!solution || typeof solution !== 'string' || solution.trim().length === 0) {
      const err = new Error('Solution cannot be empty')
      err.status = 400
      throw err
    }

    const nextAttemptNumber = this.attemptRepository.getNextAttemptNumber(problemId)

    const attempt = new Attempt({
      problemId,
      attemptNumber: nextAttemptNumber,
      solution: solution.trim(),
      explanation: (explanation || '').trim(),
      status: AttemptStatus.SUBMITTED
    })

    attempt.validate()
    this.attemptRepository.save(attempt)
    return attempt
  }

  async retryAttempt(attemptId) {
    const previous = this.attemptRepository.findById(attemptId)
    if (!previous) {
      const err = new Error(`Attempt with ID '${attemptId}' not found`)
      err.status = 404
      throw err
    }

    const nextAttemptNumber = this.attemptRepository.getNextAttemptNumber(previous.problemId)

    const newAttempt = new Attempt({
      problemId: previous.problemId,
      attemptNumber: nextAttemptNumber,
      solution: previous.solution,
      explanation: previous.explanation,
      status: AttemptStatus.SUBMITTED
    })

    this.attemptRepository.save(newAttempt)
    return newAttempt
  }

  async getStats() {
    return this.attemptRepository.getStats()
  }
}
