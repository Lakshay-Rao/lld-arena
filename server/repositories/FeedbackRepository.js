import { Feedback } from '../domain/Feedback.js'

export class FeedbackRepository {
  constructor(db) {
    this.db = db
  }

  findByAttemptId(attemptId) {
    const row = this.db.prepare('SELECT * FROM feedback WHERE attempt_id = ?').get(attemptId)
    if (!row) return null
    return new Feedback(row)
  }

  save(feedback) {
    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO feedback (
        id, attempt_id, overall_feedback, strengths, areas_to_improve,
        suggested_improvements, score_breakdown, created_at
      ) VALUES (
        @id, @attempt_id, @overall_feedback, @strengths, @areas_to_improve,
        @suggested_improvements, @score_breakdown, @created_at
      )
    `)
    stmt.run({
      id: feedback.id,
      attempt_id: feedback.attemptId,
      overall_feedback: feedback.overallFeedback,
      strengths: JSON.stringify(feedback.strengths || []),
      areas_to_improve: JSON.stringify(feedback.areasToImprove || []),
      suggested_improvements: JSON.stringify(feedback.suggestedImprovements || {}),
      score_breakdown: JSON.stringify(feedback.scoreBreakdown || {}),
      created_at: feedback.createdAt
    })
    return feedback
  }
}
