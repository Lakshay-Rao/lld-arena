import { describe, it, before, after } from 'node:test'
import assert from 'node:assert/strict'
import Database from 'better-sqlite3'
import { createApp } from '../server/app.js'
import { Evaluator } from '../server/evaluators/Evaluator.js'

describe('LLD Arena Backend API & Domain Test Suite', () => {
  let appInstance
  let server
  let baseUrl

  before(async () => {
    // Create an in-memory database for isolated, reproducible testing
    const testDb = new Database(':memory:')
    appInstance = createApp(testDb)

    await new Promise((resolve) => {
      server = appInstance.app.listen(0, () => {
        const port = server.address().port
        baseUrl = `http://localhost:${port}/api`
        resolve()
      })
    })
  })

  after(() => {
    if (server) server.close()
    if (appInstance?.database) appInstance.database.close()
  })

  // 1. GET problems works
  it('1. GET /api/problems returns list of seeded problems', async () => {
    const res = await fetch(`${baseUrl}/problems`)
    assert.equal(res.status, 200)
    const problems = await res.json()
    assert.ok(Array.isArray(problems))
    assert.ok(problems.length >= 3)
    const titles = problems.map((p) => p.title)
    assert.ok(titles.includes('Parking Lot'))
    assert.ok(titles.includes('Elevator System'))
    assert.ok(titles.includes('Vending Machine'))
  })

  // 2. Invalid problem returns 404
  it('2. GET /api/problems/:id with invalid id returns 404', async () => {
    const res = await fetch(`${baseUrl}/problems/non-existent-problem-xyz`)
    assert.equal(res.status, 404)
    const data = await res.json()
    assert.ok(data.error.includes('not found'))
  })

  // 3. Create attempt works
  it('3. POST /api/attempts creates a new attempt with status SUBMITTED', async () => {
    const res = await fetch(`${baseUrl}/attempts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        problemId: 'parking-lot',
        solution: 'class Vehicle { String licensePlate; }\nclass ParkingLot { List<ParkingSpot> spots; }',
        explanation: 'Initial object model'
      })
    })

    assert.equal(res.status, 201)
    const attempt = await res.json()
    assert.ok(attempt.id)
    assert.equal(attempt.problemId, 'parking-lot')
    assert.equal(attempt.status, 'SUBMITTED')
    assert.ok(attempt.attemptNumber > 0)
  })

  // 4. Empty solution is rejected
  it('4. POST /api/attempts with empty solution is rejected with 400', async () => {
    const res = await fetch(`${baseUrl}/attempts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        problemId: 'parking-lot',
        solution: '   ',
        explanation: 'empty'
      })
    })

    assert.equal(res.status, 400)
    const data = await res.json()
    assert.ok(data.error.includes('Solution cannot be empty'))
  })

  // 5. Evaluation produces deterministic feedback
  it('5. Evaluation produces deterministic score and feedback for the same solution', async () => {
    const solutionText = `
      public interface ParkingStrategy { ParkingSpot findSpot(List<ParkingFloor> floors, Vehicle vehicle); }
      public interface PricingStrategy { double calculateFee(Ticket ticket, long duration); }
      public class ParkingLot {
        private ParkingStrategy strategy;
        private PricingStrategy pricing;
      }
    `

    // Run evaluator 1
    const res1 = await fetch(`${baseUrl}/attempts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        problemId: 'parking-lot',
        solution: solutionText,
        explanation: 'Decoupled strategies'
      })
    })
    const attempt1 = await res1.json()

    const evalRes1 = await fetch(`${baseUrl}/attempts/${attempt1.id}/evaluate`, {
      method: 'POST'
    })
    const evalData1 = await evalRes1.json()

    // Run evaluator 2 on another attempt with identical content
    const res2 = await fetch(`${baseUrl}/attempts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        problemId: 'parking-lot',
        solution: solutionText,
        explanation: 'Decoupled strategies'
      })
    })
    const attempt2 = await res2.json()

    const evalRes2 = await fetch(`${baseUrl}/attempts/${attempt2.id}/evaluate`, {
      method: 'POST'
    })
    const evalData2 = await evalRes2.json()

    // Both must yield the exact same deterministic score & feedback breakdown
    assert.equal(evalData1.attempt.score, evalData2.attempt.score)
    assert.deepEqual(evalData1.feedback.scoreBreakdown, evalData2.feedback.scoreBreakdown)
    assert.deepEqual(evalData1.feedback.strengths, evalData2.feedback.strengths)
  })

  // 6. Feedback is saved
  it('6. Feedback is saved in database and retrieved with attempt', async () => {
    const res = await fetch(`${baseUrl}/attempts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        problemId: 'elevator-system',
        solution: 'public class ElevatorCar { int floor; Direction dir; }\npublic class ElevatorController { List<ElevatorCar> cars; }',
        explanation: 'Basic car model'
      })
    })
    const attempt = await res.json()

    await fetch(`${baseUrl}/attempts/${attempt.id}/evaluate`, { method: 'POST' })

    const fetchRes = await fetch(`${baseUrl}/attempts/${attempt.id}`)
    assert.equal(fetchRes.status, 200)
    const fetched = await fetchRes.json()
    assert.equal(fetched.status, 'EVALUATED')
    assert.ok(fetched.score > 0)
    assert.ok(fetched.feedback)
    assert.ok(fetched.feedback.scoreBreakdown)
  })

  // 7. Attempt history works
  it('7. GET /api/attempts returns all attempts saved in database', async () => {
    const res = await fetch(`${baseUrl}/attempts`)
    assert.equal(res.status, 200)
    const attempts = await res.json()
    assert.ok(Array.isArray(attempts))
    assert.ok(attempts.length >= 3)
    for (const att of attempts) {
      assert.ok(att.id)
      assert.ok(att.problemId)
      assert.ok(att.attemptNumber)
      assert.ok(att.status)
    }
  })

  // 8. Retry creates a new attempt
  it('8. POST /api/attempts/:id/retry creates a new attempt with incremented attempt number', async () => {
    // Pick existing attempt
    const attemptsRes = await fetch(`${baseUrl}/attempts`)
    const attempts = await attemptsRes.json()
    const target = attempts[0]

    const retryRes = await fetch(`${baseUrl}/attempts/${target.id}/retry`, { method: 'POST' })
    assert.equal(retryRes.status, 201)
    const newAttempt = await retryRes.json()

    assert.notEqual(newAttempt.id, target.id)
    assert.equal(newAttempt.problemId, target.problemId)
    assert.ok(newAttempt.attemptNumber > target.attemptNumber)
    assert.equal(newAttempt.status, 'SUBMITTED')
  })

  // 9. Previous attempts remain unchanged
  it('9. Retrying does not overwrite or modify the previous attempt', async () => {
    const attemptsRes = await fetch(`${baseUrl}/attempts`)
    const attempts = await attemptsRes.json()
    const target = attempts[0]

    const retryRes = await fetch(`${baseUrl}/attempts/${target.id}/retry`, { method: 'POST' })
    const newAttempt = await retryRes.json()

    // Verify original target still exists and is unmodified
    const checkOriginal = await fetch(`${baseUrl}/attempts/${target.id}`)
    const original = await checkOriginal.json()
    assert.equal(original.id, target.id)
    assert.equal(original.attemptNumber, target.attemptNumber)
    assert.equal(original.status, target.status)
    assert.notEqual(original.id, newAttempt.id)
  })

  // 10. Evaluation failure preserves the attempt
  it('10. Evaluation failure sets status to FAILED while preserving the submitted solution', async () => {
    // Create an isolated app instance with a faulty evaluator to test failure preservation
    class FailingEvaluator extends Evaluator {
      async evaluate() {
        throw new Error('Simulated evaluation model failure')
      }
    }

    const failDb = new Database(':memory:')
    const failApp = createApp(failDb, new FailingEvaluator())

    const failServer = await new Promise((resolve) => {
      const s = failApp.app.listen(0, () => resolve(s))
    })
    const failUrl = `http://localhost:${failServer.address().port}/api`

    try {
      const createRes = await fetch(`${failUrl}/attempts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemId: 'parking-lot',
          solution: 'CRITICAL SOLUTION MUST BE PRESERVED: class SafeSolution {}',
          explanation: 'Preservation test'
        })
      })
      const created = await createRes.json()

      const evalRes = await fetch(`${failUrl}/attempts/${created.id}/evaluate`, { method: 'POST' })
      assert.equal(evalRes.status, 500)

      // The attempt must still exist and retain its solution text!
      const checkRes = await fetch(`${failUrl}/attempts/${created.id}`)
      assert.equal(checkRes.status, 200)
      const preserved = await checkRes.json()
      assert.equal(preserved.id, created.id)
      assert.equal(preserved.status, 'FAILED')
      assert.equal(preserved.solution, 'CRITICAL SOLUTION MUST BE PRESERVED: class SafeSolution {}')
    } finally {
      failServer.close()
      failDb.close()
    }
  })

  // 11. GET /api/stats returns dynamic database metrics
  it('11. GET /api/stats returns database calculated statistics', async () => {
    const res = await fetch(`${baseUrl}/stats`)
    assert.equal(res.status, 200)
    const stats = await res.json()
    assert.ok(stats.totalAttempts >= 3)
    assert.ok(stats.averageScore > 0)
    assert.ok(stats.bestScore >= 70)
    assert.ok(stats.problemsSolved >= 1)
  })

  // 12. Draft endpoints save and retrieve from SQLite
  it('12. POST and GET /api/drafts/:problemId persist draft solution in SQLite', async () => {
    const saveRes = await fetch(`${baseUrl}/drafts/parking-lot`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        solution: '// In-progress draft solution\nclass DraftVehicle {}',
        explanation: 'Work in progress'
      })
    })
    assert.equal(saveRes.status, 200)

    const getRes = await fetch(`${baseUrl}/drafts/parking-lot`)
    assert.equal(getRes.status, 200)
    const draft = await getRes.json()
    assert.equal(draft.problemId, 'parking-lot')
    assert.ok(draft.solution.includes('DraftVehicle'))
  })

  // 13. Invalid attempt IDs are handled with 404
  it('13. Invalid attempt IDs are handled with 404 for GET, evaluate, and retry', async () => {
    const resGet = await fetch(`${baseUrl}/attempts/non-existent-attempt-xyz`)
    assert.equal(resGet.status, 404)
    const errGet = await resGet.json()
    assert.ok(errGet.error.includes('not found'))

    const resEval = await fetch(`${baseUrl}/attempts/non-existent-attempt-xyz/evaluate`, { method: 'POST' })
    assert.equal(resEval.status, 404)
    const errEval = await resEval.json()
    assert.ok(errEval.error.includes('not found'))

    const resRetry = await fetch(`${baseUrl}/attempts/non-existent-attempt-xyz/retry`, { method: 'POST' })
    assert.equal(resRetry.status, 404)
    const errRetry = await resRetry.json()
    assert.ok(errRetry.error.includes('not found'))
  })
})
