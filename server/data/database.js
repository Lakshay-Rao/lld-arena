import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

let dbInstance = null

export function getDatabase(dbPath = null) {
  if (dbInstance) return dbInstance

  const targetPath = dbPath || process.env.DB_PATH || path.join(__dirname, 'lld_arena.db')

  // Ensure directory exists if file-based
  if (targetPath !== ':memory:') {
    const dir = path.dirname(targetPath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
  }

  const db = new Database(targetPath)
  // Enable foreign keys and WAL mode for reliability
  db.pragma('foreign_keys = ON')
  if (targetPath !== ':memory:') {
    db.pragma('journal_mode = WAL')
  }

  initTables(db)
  dbInstance = db
  return db
}

export function closeDatabase() {
  if (dbInstance) {
    dbInstance.close()
    dbInstance = null
  }
}

export function initTables(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS problems (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      difficulty TEXT NOT NULL,
      category TEXT NOT NULL,
      requirements TEXT NOT NULL,
      tags TEXT,
      things_to_think_about TEXT,
      considerations TEXT,
      starter_template TEXT,
      starter_explanation TEXT
    );

    CREATE TABLE IF NOT EXISTS attempts (
      id TEXT PRIMARY KEY,
      problem_id TEXT NOT NULL,
      attempt_number INTEGER NOT NULL,
      solution TEXT NOT NULL,
      explanation TEXT,
      status TEXT NOT NULL,
      score INTEGER,
      created_at TEXT NOT NULL,
      FOREIGN KEY (problem_id) REFERENCES problems(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS feedback (
      id TEXT PRIMARY KEY,
      attempt_id TEXT NOT NULL UNIQUE,
      overall_feedback TEXT,
      strengths TEXT,
      areas_to_improve TEXT,
      suggested_improvements TEXT,
      score_breakdown TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY (attempt_id) REFERENCES attempts(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS drafts (
      id TEXT PRIMARY KEY,
      problem_id TEXT NOT NULL UNIQUE,
      solution TEXT NOT NULL,
      explanation TEXT,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (problem_id) REFERENCES problems(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_attempts_problem_id ON attempts(problem_id);
    CREATE INDEX IF NOT EXISTS idx_feedback_attempt_id ON feedback(attempt_id);
  `)
}
