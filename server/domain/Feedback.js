export class Feedback {
  constructor(data = {}) {
    const attemptId = data.attemptId || data.attempt_id
    const overallFeedback = data.overallFeedback ?? data.overall_feedback ?? ''
    const strengths = data.strengths ?? []
    const areasToImprove = data.areasToImprove ?? data.areas_to_improve ?? []
    const suggestedImprovements = data.suggestedImprovements ?? data.suggested_improvements ?? {}
    const scoreBreakdown = data.scoreBreakdown ?? data.score_breakdown ?? {}
    const createdAt = data.createdAt || data.created_at || new Date().toISOString()

    this.id = data.id || `fb-${attemptId}`
    this.attemptId = attemptId
    this.overallFeedback = overallFeedback
    this.strengths = typeof strengths === 'string' ? JSON.parse(strengths) : strengths
    this.areasToImprove = typeof areasToImprove === 'string' ? JSON.parse(areasToImprove) : areasToImprove
    this.suggestedImprovements = typeof suggestedImprovements === 'string' ? JSON.parse(suggestedImprovements) : suggestedImprovements
    this.scoreBreakdown = typeof scoreBreakdown === 'string' ? JSON.parse(scoreBreakdown) : scoreBreakdown
    this.createdAt = createdAt
  }

  toJSON() {
    return {
      id: this.id,
      attemptId: this.attemptId,
      overallFeedback: this.overallFeedback,
      strengths: this.strengths,
      areasToImprove: this.areasToImprove,
      suggestedImprovements: this.suggestedImprovements,
      scoreBreakdown: this.scoreBreakdown,
      createdAt: this.createdAt
    }
  }
}
