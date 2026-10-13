import express from 'express'
import cors from 'cors'
import { getDatabase, initTables } from './data/database.js'
import { seedDatabase } from './data/seed.js'

import { ProblemRepository } from './repositories/ProblemRepository.js'
import { AttemptRepository } from './repositories/AttemptRepository.js'
import { FeedbackRepository } from './repositories/FeedbackRepository.js'
import { DraftRepository } from './repositories/DraftRepository.js'

import { RuleBasedEvaluator } from './evaluators/RuleBasedEvaluator.js'
import { AIEvaluator } from './evaluators/AIEvaluator.js'

import { ProblemService } from './services/ProblemService.js'
import { AttemptService } from './services/AttemptService.js'
import { EvaluationService } from './services/EvaluationService.js'

import { createProblemController } from './controllers/problemController.js'
import { createAttemptController } from './controllers/attemptController.js'
import { createEvaluationController } from './controllers/evaluationController.js'
import { createDraftController } from './controllers/draftController.js'
import { createStatsController } from './controllers/statsController.js'

export function createApp(db = null, customEvaluator = null) {
  const database = db || getDatabase()
  initTables(database)
  seedDatabase(database)

  // 1. Initialize Repositories
  const problemRepository = new ProblemRepository(database)
  const attemptRepository = new AttemptRepository(database)
  const feedbackRepository = new FeedbackRepository(database)
  const draftRepository = new DraftRepository(database)

  // 2. Initialize Evaluator Strategy
  const ruleBasedEvaluator = new RuleBasedEvaluator()
  const activeEvaluator = customEvaluator || (process.env.GEMINI_API_KEY
    ? new AIEvaluator(process.env.GEMINI_API_KEY, ruleBasedEvaluator)
    : ruleBasedEvaluator)

  // 3. Initialize Services with Constructor Dependency Injection
  const problemService = new ProblemService(problemRepository)
  const attemptService = new AttemptService(attemptRepository, problemRepository, feedbackRepository)
  const evaluationService = new EvaluationService(
    activeEvaluator,
    attemptRepository,
    feedbackRepository,
    problemRepository
  )

  // 4. Initialize Controllers
  const problemController = createProblemController(problemService)
  const attemptController = createAttemptController(attemptService)
  const evaluationController = createEvaluationController(evaluationService)
  const draftController = createDraftController(draftRepository)
  const statsController = createStatsController(attemptService)

  // 5. Setup Express App
  const app = express()
  app.use(cors())
  app.use(express.json())

  // Health check
  app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', service: 'lld-arena-api' })
  })

  // Problems Routes
  app.get('/api/problems', problemController.getAllProblems)
  app.get('/api/problems/:id', problemController.getProblemById)

  // Attempts Routes
  app.get('/api/attempts', attemptController.getAllAttempts)
  app.get('/api/attempts/:id', attemptController.getAttemptById)
  app.post('/api/attempts', attemptController.createAttempt)

  // Evaluation & Retry Routes
  app.post('/api/attempts/:id/evaluate', evaluationController.evaluateAttempt)
  app.post('/api/attempts/:id/retry', attemptController.retryAttempt)

  // Drafts Routes
  app.get('/api/drafts/:problemId', draftController.getDraft)
  app.post('/api/drafts/:problemId', draftController.saveDraft)

  // Dashboard Stats Route
  app.get('/api/stats', statsController.getStats)

  // 404 handler for unknown API routes
  app.use('/api', (req, res) => {
    res.status(404).json({ error: `API route not found: ${req.method} ${req.originalUrl}` })
  })

  // Central Error Handler
  app.use((err, req, res, next) => {
    const status = err.status || 500
    res.status(status).json({
      error: err.message || 'Internal Server Error',
      status
    })
  })

  return {
    app,
    database,
    services: {
      problemService,
      attemptService,
      evaluationService
    },
    repositories: {
      problemRepository,
      attemptRepository,
      feedbackRepository,
      draftRepository
    }
  }
}
