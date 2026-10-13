/**
 * Abstract Base Evaluator class.
 * All evaluators must implement the evaluate() method.
 */
export class Evaluator {
  /**
   * @param {Object} params
   * @param {Object} params.problem - Problem domain model
   * @param {string} params.solution - Submitted solution code/architecture
   * @param {string} [params.explanation] - Additional trade-offs and explanations
   * @param {number} [params.attemptNumber] - Current attempt number
   * @returns {Promise<{ overallScore: number, scoreBreakdown: Object, strengths: string[], areasToImprove: string[], suggestedImprovements: Object, overallFeedback: string }>}
   */
  async evaluate({ problem, solution, explanation = '', attemptNumber = 1 }) {
    throw new Error('evaluate() must be implemented by concrete Evaluator subclasses')
  }
}
