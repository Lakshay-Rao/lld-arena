import { Feedback } from '../domain/Feedback.js'
import { AttemptStatus } from '../domain/Attempt.js'

export class EvaluationService {
  /**
   * Evaluator is injected here via constructor injection, adhering to Dependency Inversion.
   * @param {import('../evaluators/Evaluator.js').Evaluator} evaluator
   * @param {import('../repositories/AttemptRepository.js').AttemptRepository} attemptRepository
   * @param {import('../repositories/FeedbackRepository.js').FeedbackRepository} feedbackRepository
   * @param {import('../repositories/ProblemRepository.js').ProblemRepository} problemRepository
   */
  constructor(evaluator, attemptRepository, feedbackRepository, problemRepository) {
    if (!evaluator || typeof evaluator.evaluate !== 'function') {
      throw new Error('A valid Evaluator instance must be provided to EvaluationService')
    }
    this.evaluator = evaluator
    this.attemptRepository = attemptRepository
    this.feedbackRepository = feedbackRepository
    this.problemRepository = problemRepository
  }

  async evaluateAttempt(attemptId) {
    const attempt = this.attemptRepository.findById(attemptId)
    if (!attempt) {
      const err = new Error(`Attempt with ID '${attemptId}' not found`)
      err.status = 404
      throw err
    }

    // Step 1: Transition status to EVALUATING
    attempt.markEvaluating()
    this.attemptRepository.update(attempt)

    try {
      const problem = this.problemRepository.findById(attempt.problemId)
      if (!problem) {
        throw new Error(`Associated problem '${attempt.problemId}' not found`)
      }

      // Step 2: Run evaluator abstraction
      const evaluationResult = await this.evaluator.evaluate({
        problem,
        solution: attempt.solution,
        explanation: attempt.explanation,
        attemptNumber: attempt.attemptNumber
      })

      // Step 3: Create and save Feedback domain object
      const feedback = new Feedback({
        attemptId: attempt.id,
        overallFeedback: evaluationResult.overallFeedback,
        strengths: evaluationResult.strengths,
        areasToImprove: evaluationResult.areasToImprove,
        suggestedImprovements: evaluationResult.suggestedImprovements,
        scoreBreakdown: evaluationResult.scoreBreakdown
      })
      this.feedbackRepository.save(feedback)

      // Step 4: Mark attempt EVALUATED with score
      attempt.markEvaluated(evaluationResult.overallScore)
      this.attemptRepository.update(attempt)

      return {
        attempt: attempt.toJSON(),
        feedback: feedback.toJSON()
      }
    } catch (error) {
      // If evaluation fails, mark as FAILED but preserve the submitted solution!
      attempt.markFailed()
      this.attemptRepository.update(attempt)
      error.status = error.status || 500
      throw error
    }
  }
}
