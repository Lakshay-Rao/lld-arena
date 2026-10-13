import { Problem } from '../domain/Problem.js'

export class ProblemRepository {
  constructor(db) {
    this.db = db
  }

  findAll() {
    const rows = this.db.prepare('SELECT * FROM problems ORDER BY rowid ASC').all()
    return rows.map((row) => new Problem(row))
  }

  findById(id) {
    const row = this.db.prepare('SELECT * FROM problems WHERE id = ?').get(id)
    if (!row) return null
    return new Problem(row)
  }
}
