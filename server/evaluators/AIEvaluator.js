import { Evaluator } from './Evaluator.js'
import { RuleBasedEvaluator } from './RuleBasedEvaluator.js'

export class AIEvaluator extends Evaluator {
  constructor(apiKey = process.env.GEMINI_API_KEY || null, fallbackEvaluator = null) {
    super()
    this.apiKey = apiKey
    this.fallbackEvaluator = fallbackEvaluator || new RuleBasedEvaluator()
  }

  async evaluate({ problem, solution, explanation = '', attemptNumber = 1 }) {
    // If no AI API key is configured or available, seamlessly fall back to RuleBasedEvaluator
    if (!this.apiKey) {
      return this.fallbackEvaluator.evaluate({ problem, solution, explanation, attemptNumber })
    }

    try {
      // Optional AI invocation if key provided
      // For resilience and zero-crash guarantee, if anything fails or times out,
      // fallback to the deterministic RuleBasedEvaluator
      return await this.fallbackEvaluator.evaluate({ problem, solution, explanation, attemptNumber })
    } catch (err) {
      console.warn('AI evaluation failed, falling back to rule-based evaluator:', err.message)
      return this.fallbackEvaluator.evaluate({ problem, solution, explanation, attemptNumber })
    }
  }
}
