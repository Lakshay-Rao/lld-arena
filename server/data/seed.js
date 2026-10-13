import { MOCK_PROBLEMS } from '../../src/data/mockProblems.js'
import { SEED_ATTEMPTS } from '../../src/data/seedAttempts.js'

export function seedDatabase(db) {
  // 1. Seed Problems
  const insertProblem = db.prepare(`
    INSERT OR IGNORE INTO problems (
      id, title, description, difficulty, category, requirements,
      tags, things_to_think_about, considerations, starter_template, starter_explanation
    ) VALUES (
      @id, @title, @description, @difficulty, @category, @requirements,
      @tags, @things_to_think_about, @considerations, @starter_template, @starter_explanation
    )
  `)

  const insertProblemsTx = db.transaction((problems) => {
    for (const prob of problems) {
      insertProblem.run({
        id: prob.id,
        title: prob.title,
        description: prob.shortDescription,
        difficulty: prob.difficulty,
        category: prob.category,
        requirements: JSON.stringify(prob.requirements),
        tags: JSON.stringify(prob.tags),
        things_to_think_about: JSON.stringify(prob.thingsToThinkAbout),
        considerations: JSON.stringify(prob.considerations),
        starter_template: prob.starterTemplate,
        starter_explanation: prob.starterExplanation
      })
    }
  })

  insertProblemsTx(MOCK_PROBLEMS)

  // 2. Check if attempts already exist. If empty, seed initial attempts.
  const attemptCount = db.prepare('SELECT COUNT(*) as count FROM attempts').get().count
  if (attemptCount === 0) {
    const insertAttempt = db.prepare(`
      INSERT INTO attempts (
        id, problem_id, attempt_number, solution, explanation, status, score, created_at
      ) VALUES (
        @id, @problem_id, @attempt_number, @solution, @explanation, @status, @score, @created_at
      )
    `)

    const insertFeedback = db.prepare(`
      INSERT INTO feedback (
        id, attempt_id, overall_feedback, strengths, areas_to_improve,
        suggested_improvements, score_breakdown, created_at
      ) VALUES (
        @id, @attempt_id, @overall_feedback, @strengths, @areas_to_improve,
        @suggested_improvements, @score_breakdown, @created_at
      )
    `)

    const seedTx = db.transaction((attempts) => {
      for (const att of attempts) {
        insertAttempt.run({
          id: att.id,
          problem_id: att.problemId,
          attempt_number: att.attemptNumber,
          solution: att.solutionCode,
          explanation: att.explanation || '',
          status: att.status ? att.status.toUpperCase() : 'EVALUATED',
          score: att.overallScore,
          created_at: new Date(att.date || Date.now()).toISOString()
        })

        insertFeedback.run({
          id: `fb-${att.id}`,
          attempt_id: att.id,
          overall_feedback: att.overallFeedback,
          strengths: JSON.stringify(att.strengths || []),
          areas_to_improve: JSON.stringify(att.areasToImprove || []),
          suggested_improvements: JSON.stringify(att.suggestedImprovements || {}),
          score_breakdown: JSON.stringify(att.scoreBreakdown || {}),
          created_at: new Date(att.date || Date.now()).toISOString()
        })
      }
    })

    seedTx(SEED_ATTEMPTS)
  }
}
