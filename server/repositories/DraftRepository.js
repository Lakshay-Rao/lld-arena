export class DraftRepository {
  constructor(db) {
    this.db = db
  }

  findByProblemId(problemId) {
    const row = this.db.prepare('SELECT * FROM drafts WHERE problem_id = ?').get(problemId)
    if (!row) return null
    return {
      id: row.id,
      problemId: row.problem_id,
      solution: row.solution,
      code: row.solution,
      explanation: row.explanation,
      updatedAt: row.updated_at
    }
  }

  save(problemId, solution, explanation = '') {
    const id = `draft-${problemId}`
    const updatedAt = new Date().toISOString()
    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO drafts (id, problem_id, solution, explanation, updated_at)
      VALUES (?, ?, ?, ?, ?)
    `)
    stmt.run(id, problemId, solution, explanation, updatedAt)
    return {
      id,
      problemId,
      solution,
      code: solution,
      explanation,
      updatedAt
    }
  }

  delete(problemId) {
    this.db.prepare('DELETE FROM drafts WHERE problem_id = ?').run(problemId)
  }
}
