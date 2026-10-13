import { Attempt } from '../domain/Attempt.js'

export class AttemptRepository {
  constructor(db) {
    this.db = db
  }

  findAll() {
    const rows = this.db.prepare(`
      SELECT a.*, p.title as problem_title
      FROM attempts a
      LEFT JOIN problems p ON a.problem_id = p.id
      ORDER BY a.created_at DESC
    `).all()
    return rows.map((r) => {
      const att = new Attempt(r)
      att.problemTitle = r.problem_title
      return att
    })
  }

  findById(id) {
    const row = this.db.prepare(`
      SELECT a.*, p.title as problem_title
      FROM attempts a
      LEFT JOIN problems p ON a.problem_id = p.id
      WHERE a.id = ?
    `).get(id)
    if (!row) return null
    const att = new Attempt(row)
    att.problemTitle = row.problem_title
    return att
  }

  findByProblemId(problemId) {
    const rows = this.db.prepare(`
      SELECT a.*, p.title as problem_title
      FROM attempts a
      LEFT JOIN problems p ON a.problem_id = p.id
      WHERE a.problem_id = ?
      ORDER BY a.attempt_number ASC
    `).all(problemId)
    return rows.map((r) => {
      const att = new Attempt(r)
      att.problemTitle = r.problem_title
      return att
    })
  }

  findLatestByProblemId(problemId) {
    const row = this.db.prepare(`
      SELECT a.*, p.title as problem_title
      FROM attempts a
      LEFT JOIN problems p ON a.problem_id = p.id
      WHERE a.problem_id = ?
      ORDER BY a.attempt_number DESC
      LIMIT 1
    `).get(problemId)
    if (!row) return null
    const att = new Attempt(row)
    att.problemTitle = row.problem_title
    return att
  }

  getNextAttemptNumber(problemId) {
    const row = this.db.prepare(`
      SELECT MAX(attempt_number) as max_num
      FROM attempts
      WHERE problem_id = ?
    `).get(problemId)
    return (row?.max_num || 0) + 1
  }

  save(attempt) {
    const stmt = this.db.prepare(`
      INSERT INTO attempts (
        id, problem_id, attempt_number, solution, explanation, status, score, created_at
      ) VALUES (
        @id, @problem_id, @attempt_number, @solution, @explanation, @status, @score, @created_at
      )
    `)
    stmt.run({
      id: attempt.id,
      problem_id: attempt.problemId,
      attempt_number: attempt.attemptNumber,
      solution: attempt.solution,
      explanation: attempt.explanation || '',
      status: attempt.status,
      score: attempt.score,
      created_at: attempt.createdAt
    })
    return attempt
  }

  update(attempt) {
    const stmt = this.db.prepare(`
      UPDATE attempts
      SET status = @status, score = @score, solution = @solution, explanation = @explanation
      WHERE id = @id
    `)
    stmt.run({
      id: attempt.id,
      status: attempt.status,
      score: attempt.score,
      solution: attempt.solution,
      explanation: attempt.explanation || ''
    })
    return attempt
  }

  getStats() {
    const attempts = this.db.prepare('SELECT score, problem_id FROM attempts WHERE score IS NOT NULL').all()
    const allAttemptsCount = this.db.prepare('SELECT COUNT(*) as count FROM attempts').get().count
    const solvedProblems = this.db.prepare(`
      SELECT COUNT(DISTINCT problem_id) as count
      FROM attempts
      WHERE score >= 70
    `).get().count

    const scores = attempts.map((a) => a.score)
    const averageScore = scores.length > 0
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      : 0
    const bestScore = scores.length > 0 ? Math.max(...scores) : 0

    return {
      problemsSolved: solvedProblems,
      averageScore,
      totalAttempts: allAttemptsCount,
      bestScore
    }
  }
}
