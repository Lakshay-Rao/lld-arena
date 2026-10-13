# AI Usage & Engineering Decision Record

This document outlines the meaningful AI-assisted development decisions made during the design, implementation, and refinement of **LLD Arena**. Every AI suggestion was subjected to human architectural review, testing, and selective modification.

---

### Decision 1: Evaluator Strategy Pattern & Dependency Inversion

1. **What AI Was Used For:**
   Designing the evaluation subsystem interface to support both deterministic rule-based scoring and future AI evaluation.
2. **What Suggestion/Output Was Considered:**
   The AI initially proposed hardcoding `RuleBasedEvaluator` directly inside the Express attempt route handler (`router.post('/attempts/:id/evaluate', ...)`), with an inline `if (process.env.GEMINI_API_KEY)` check inside the grading logic.
3. **What Was Accepted:**
   The concept of having both a deterministic rule engine and an AI evaluator with seamless fallback.
4. **What Was Rejected or Changed:**
   - **Rejected:** Inline evaluation logic inside route handlers and tight coupling to concrete evaluator classes.
   - **Adopted:** Extracted an explicit `Evaluator` abstract base class (`server/evaluators/Evaluator.js`). Created `RuleBasedEvaluator` and `AIEvaluator` as discrete strategy implementations. Injected the active `Evaluator` into `EvaluationService` via constructor dependency injection.
5. **Why:**
   In object-oriented system design, high-level business services must depend on abstractions, not concrete implementations (Dependency Inversion Principle). Decoupling the evaluator makes the application cleanly testable with mock/faulty evaluators and allows new evaluation models to be introduced without touching controller code.

---

### Decision 2: Submission Lifecycle & Data Preservation on Failure

1. **What AI Was Used For:**
   Architecting the submission and evaluation lifecycle between the frontend client and the backend SQLite database.
2. **What Suggestion/Output Was Considered:**
   The AI suggested a single synchronous endpoint `POST /api/attempts` that simultaneously validated the solution, evaluated it, and saved the result directly with status `EVALUATED`.
3. **What Was Accepted:**
   The multi-stage evaluation experience and progress indicators shown to the learner.
4. **What Was Rejected or Changed:**
   - **Rejected:** Combining attempt creation and evaluation into a single atomic operation.
   - **Adopted:** Separated the workflow into two distinct steps:
     1. `POST /api/attempts`: Validates input and persists the attempt in SQLite with status `SUBMITTED`.
     2. `POST /api/attempts/:id/evaluate`: Transitions status to `EVALUATING`, executes the evaluator, saves feedback, and transitions status to `EVALUATED` (or `FAILED` if an error occurs).
5. **Why:**
   If evaluation takes time, encounters a timeout, or crashes, saving the attempt first ensures the learner's written solution is never lost. The code remains safely stored in SQLite and can be re-evaluated without requiring the learner to rewrite their design.

---

### Decision 3: Repository Pattern vs. Direct SQL in Route Handlers

1. **What AI Was Used For:**
   Structuring database interactions with SQLite (`better-sqlite3`).
2. **What Suggestion/Output Was Considered:**
   The AI suggested placing raw SQL statements (`db.prepare(...)`) directly inside Express route controllers (`attemptController.js`, `problemController.js`).
3. **What Was Accepted:**
   Using `better-sqlite3` with synchronous execution, Write-Ahead Logging (WAL), and foreign key constraints for performance and simplicity.
4. **What Was Rejected or Changed:**
   - **Rejected:** Embedding SQL statements directly in controllers.
   - **Adopted:** Created dedicated repository classes (`ProblemRepository`, `AttemptRepository`, `FeedbackRepository`, `DraftRepository`) that encapsulate all query preparation and row-to-domain mapping. Controllers interact exclusively with Application Services, which delegate persistence to Repositories.
5. **Why:**
   Embedding database queries in controllers violates the Single Responsibility Principle and couples HTTP transport with storage technology. The Repository pattern isolates SQL queries and facilitates automated testing using in-memory databases.

---

### Decision 4: In-Memory Database Isolation for Test Execution

1. **What AI Was Used For:**
   Structuring the automated test suite for backend APIs and domain rules.
2. **What Suggestion/Output Was Considered:**
   The AI proposed running integration tests directly against the local development database file (`lld_arena.db`) and executing cleanup/rollback queries after each test.
3. **What Was Accepted:**
   Using Node.js native test runner (`node:test` and `node:assert/strict`) to eliminate unnecessary third-party testing dependencies (like Jest or Mocha).
4. **What Was Rejected or Changed:**
   - **Rejected:** Running tests against the development database file on disk.
   - **Adopted:** Configured `tests/api.test.js` to initialize an ephemeral SQLite instance using `:memory:`.
5. **Why:**
   Using in-memory SQLite isolates test runs from development data, prevents accidental test pollution of live attempts, guarantees identical starting seed state, and executes the entire 13-test suite in under 800 milliseconds.

---

### Decision 5: Frontend State Architecture & Draft Recovery

1. **What AI Was Used For:**
   Handling practice workspace draft saving and page transitions.
2. **What Suggestion/Output Was Considered:**
   An initial AI proposal suggested relying purely on `localStorage` for drafts and client-side history to avoid backend round-trips.
3. **What Was Accepted:**
   The responsive split-pane practice layout and instant draft-saving feedback.
4. **What Was Rejected or Changed:**
   - **Rejected:** Relying on `localStorage` as a primary storage layer.
   - **Adopted:** Replaced local storage mock code with real REST endpoints (`GET /api/drafts/:problemId`, `POST /api/drafts/:problemId`) backed by SQLite. Deleted `src/services/storage.js` and added an active synchronization hook in `PracticePage.jsx` so unsubmitted work survives browser reloads and device switches.
5. **Why:**
   An MVP intended to demonstrate full-stack architecture must make the relational database the single source of truth for persistent application state rather than relying on browser-local storage.

---

### Verification & Human Oversight

All AI-generated code and documentation were verified through:
- **Automated Verification:** 13/13 backend tests passing via `npm test`.
- **Build Verification:** Successful production bundling via `npm run build`.
- **Manual End-to-End Walkthrough:** Complete verification of the 19-step learner journey from Dashboard through Problem Details, Practice, Submission, Evaluation, History, and Try Again retry isolation.
