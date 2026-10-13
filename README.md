# LLD Arena

> **Practice Low-Level Design. Get Better Feedback.**

LLD Arena is an interactive Low-Level Design (LLD) practice and evaluation platform for software engineers. It enables developers to design object-oriented systems, draft architectural trade-offs, receive structured, explainable feedback across key design criteria, and iteratively refine their solutions over multiple attempts.

---

## The Learner Journey

LLD Arena models a continuous architectural learning loop:

```
Choose Problem ➔ Practice / Design ➔ Save Draft ➔ Submit ➔ Multi-Stage Evaluation ➔ Structured Feedback ➔ Review History ➔ Try Again (Iterative Refinement)
```

1. **Choose Problem:** Browse curated real-world system design scenarios filtered by difficulty.
2. **Review Requirements:** Inspect formal functional requirements and architectural considerations (classes, relationships, interfaces, extensibility).
3. **Practice Workspace:** Write class models, method signatures, interface abstractions, and design trade-offs in a split-screen developer environment with draft persistence.
4. **Submit Solution:** Confirm submission and observe real-time evaluation stages (*Submission received* ➔ *Checking requirements* ➔ *Analyzing responsibilities* ➔ *Generating feedback*).
5. **Receive Feedback:** Review a comprehensive design review dashboard featuring an overall score (out of 100), 6-category breakdown progress bars, strengths, areas to improve, and actionable architectural ASCII diagrams.
6. **Review History:** Track past attempts, score deltas (e.g., `64 → 78 (+14 pts)`), and evaluation dates.
7. **Try Again:** Launch a new, isolated attempt inheriting previous feedback context to refactor the design without overwriting prior submissions.

---

## Features

- **Interactive Problem Bank:** Difficulty filters (*All*, *Easy*, *Medium*, *Hard*) and keyword search.
- **Split-Pane Practice Workspace:** Live checklist tracking, design considerations reference, syntax-oriented editor with tab indentation support, and template skeleton injection.
- **SQLite Draft Persistence:** Save drafts and resume practice sessions across browser reloads.
- **Deterministic Rule-Based Evaluator:** Analyzes submitted solutions for meaningful OOP constructs, interfaces, design patterns (Strategy, State, Factory), responsibility separation, and encapsulation.
- **Safe AI Evaluator Fallback:** Evaluator abstraction designed for optional LLM evaluation that automatically falls back to the deterministic engine if no API key is provided, ensuring zero runtime crashes.
- **Comprehensive Score Breakdown:** Scores calculated across 6 foundational pillars:
  - Requirements Coverage (20 pts)
  - Responsibility Separation (20 pts)
  - Abstraction (20 pts)
  - Extensibility (15 pts)
  - Object Relationships (15 pts)
  - Design Quality (10 pts)
- **Actionable Architectural Recommendations:** Concrete suggestions showing before/after class relationships and strategy decoupling diagrams.
- **Persistent Attempt History & Score Deltas:** Every submission is saved to SQLite, tracking attempt progression over time.
- **Attempt Isolation on Retry:** Retrying a problem creates a brand new attempt while preserving previous attempts and scores.
- **Resilient Evaluation Failure Handling:** If evaluation fails, attempt status is marked `FAILED` while preserving the submitted code in the database for retry.

---

## Problems Supported

| Problem | Difficulty | Category | Key Design Concepts |
|---|---|---|---|
| **Parking Lot** | Medium | Object-Oriented Design | Spot Sizing, Vehicle Hierarchy, Strategy Pattern (Allocation & Pricing) |
| **Elevator System** | Medium | System & Concurrency | Multi-Car Dispatching, State Pattern, Scheduling Algorithms (LOOK/SCAN) |
| **Vending Machine** | Easy | State Machine Design | State Pattern (Idle, HasMoney, Dispensing), Inventory Management, Change |
| **Rate Limiter** | Medium | System Utility | Token Bucket, Sliding Window, Strategy Pattern, Concurrency |
| **Expense Sharing (Splitwise)** | Hard | Financial Modeling | Expense Modeling, Split Strategies (Equal, Exact, Percentage), Debt Simplification |

---

## Architecture Overview

LLD Arena is structured as a clean, monolithic full-stack application following SOLID principles:

```
┌────────────────────────────────────────────────────────┐
│               React 19 Frontend (Vite)                 │
│   (Dashboard, Problems, Details, Workspace, Feedback)  │
└───────────────────────────┬────────────────────────────┘
                            │ REST API (/api/*)
                            ▼
┌────────────────────────────────────────────────────────┐
│             Node.js / Express 5 API Layer              │
│      Controllers ➔ Input Validation & HTTP Mapping     │
└──────────────┬───────────────────────────┬─────────────┘
               │                           │
               ▼                           ▼
┌───────────────────────────┐ ┌───────────────────────────┐
│   Application Services    │ │   Evaluator Abstraction   │
│  - ProblemService         │ │   (Strategy Pattern)      │
│  - AttemptService         │ │   ┌─────────────────────┐ │
│  - EvaluationService ─────┼─┼──>│ Evaluator (Base)    │ │
└──────────────┬────────────┘ │   ├─────────────────────┤ │
               │              │   │ RuleBasedEvaluator  │ │
               ▼              │   │ AIEvaluator         │ │
┌───────────────────────────┐ │   └─────────────────────┘ │
│    Repositories (CRUD)    │ └───────────────────────────┘
│  - ProblemRepository      │
│  - AttemptRepository      │
│  - FeedbackRepository     │
│  - DraftRepository        │
└──────────────┬────────────┘
               │
               ▼
┌───────────────────────────┐
│   SQLite Database (WAL)   │
│ (lld_arena.db via better) │
└───────────────────────────┘
```

### Dependency Inversion in Evaluation
`EvaluationService` depends strictly on the `Evaluator` abstraction rather than any concrete scoring engine. The active evaluator is injected via constructor injection, allowing new evaluators (such as external LLMs or AST parsers) to be swapped in without modifying service orchestration logic.

---

## Tech Stack

- **Frontend:**
  - React 19 (`react`, `react-dom`)
  - Vite 8 (Build tool & development server)
  - Tailwind CSS v4 (`tailwindcss`, `@tailwindcss/vite`)
  - Lucide React (Icons)
- **Backend:**
  - Node.js (v22+)
  - Express 5 (`express`)
  - CORS (`cors`)
- **Database:**
  - SQLite via `better-sqlite3` (with WAL mode and foreign key constraints)
- **Testing:**
  - Node.js Native Test Runner (`node:test`, `node:assert/strict`)

---

## Project Structure

```
lld-arena/
├── server/
│   ├── app.js                     # Express app setup, DI container & route binding
│   ├── server.js                  # Entry point (listens on port 5000)
│   ├── controllers/               # HTTP request handlers & status code mapping
│   │   ├── attemptController.js
│   │   ├── draftController.js
│   │   ├── evaluationController.js
│   │   ├── problemController.js
│   │   └── statsController.js
│   ├── data/                      # Database connection & seed script
│   │   ├── database.js
│   │   ├── lld_arena.db
│   │   └── seed.js
│   ├── domain/                    # Domain entities & business rules
│   │   ├── Attempt.js
│   │   ├── Feedback.js
│   │   └── Problem.js
│   ├── evaluators/                # Evaluator Strategy pattern implementations
│   │   ├── AIEvaluator.js
│   │   ├── Evaluator.js           # Abstract base class
│   │   └── RuleBasedEvaluator.js  # Deterministic scoring engine
│   ├── repositories/              # SQLite data access objects
│   │   ├── AttemptRepository.js
│   │   ├── DraftRepository.js
│   │   ├── FeedbackRepository.js
│   │   └── ProblemRepository.js
│   └── services/                  # Application business services
│       ├── AttemptService.js
│       ├── EvaluationService.js
│       └── ProblemService.js
├── src/
│   ├── App.jsx                    # Root view controller & navigation state
│   ├── index.css                  # Tailwind CSS imports & global styles
│   ├── main.jsx                   # React application mount
│   ├── components/                # Reusable UI components
│   │   ├── common/                # Badges, progress bars, score rings
│   │   ├── layout/                # Navbar, Footer
│   │   └── practice/              # Modals (submission confirm, evaluation progress)
│   ├── data/                      # Initial seed datasets (mockProblems, seedAttempts)
│   ├── pages/                     # Page views
│   │   ├── DashboardPage.jsx
│   │   ├── FeedbackPage.jsx
│   │   ├── HistoryPage.jsx
│   │   ├── PracticePage.jsx
│   │   ├── ProblemDetailsPage.jsx
│   │   └── ProblemsPage.jsx
│   └── services/
│       └── lldService.js          # Client API gateway (fetch calls to /api/*)
├── tests/
│   └── api.test.js                # 13 automated tests using in-memory SQLite
├── package.json
└── vite.config.js                 # Vite config with /api reverse proxy
```

---

## Setup & Running Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Backend API
```bash
npm run server
```
*Backend runs on `http://localhost:5000`.*

### 3. Run the Frontend Development Server
In a separate terminal:
```bash
npm run dev
```
*Frontend runs on `http://localhost:5173` with automated `/api` reverse proxying to port 5000.*

### 4. Build for Production
```bash
npm run build
```

---

## Testing

Run the automated backend test suite:

```bash
npm test
```

### Verified Test Output
```
TAP version 13
# Subtest: LLD Arena Backend API & Domain Test Suite
    ok 1 - 1. GET /api/problems returns list of seeded problems
    ok 2 - 2. GET /api/problems/:id with invalid id returns 404
    ok 3 - 3. POST /api/attempts creates a new attempt with status SUBMITTED
    ok 4 - 4. POST /api/attempts with empty solution is rejected with 400
    ok 5 - 5. Evaluation produces deterministic score and feedback for the same solution
    ok 6 - 6. Feedback is saved in database and retrieved with attempt
    ok 7 - 7. GET /api/attempts returns all attempts saved in database
    ok 8 - 8. POST /api/attempts/:id/retry creates a new attempt with incremented attempt number
    ok 9 - 9. Retrying does not overwrite or modify the previous attempt
    ok 10 - 10. Evaluation failure sets status to FAILED while preserving the submitted solution
    ok 11 - 11. GET /api/stats returns database calculated statistics
    ok 12 - 12. POST and GET /api/drafts/:problemId persist draft solution in SQLite
    ok 13 - 13. Invalid attempt IDs are handled with 404 for GET, evaluate, and retry
# tests 13
# pass 13
# fail 0
```

---

## Evaluation System

The evaluation engine is built around the `Evaluator` abstraction:

1. **Deterministic Rule-Based Evaluator (`RuleBasedEvaluator`):**
   - Inspects the solution and explanation text for core domain entities, interface contracts, class hierarchies, encapsulation, and design patterns.
   - Calculates deterministic point values across the 6 criteria out of 100 points.
   - Ensures identical inputs consistently produce identical scores, feedback lists, and ASCII diagrams.
2. **AI Evaluator (`AIEvaluator`):**
   - Configured with an optional API key parameter.
   - If no key is set or an external call fails, it automatically falls back to `RuleBasedEvaluator`.
   - Protects the application from crashing on network or credential failures.

---

## LLD Principles Applied

- **Single Responsibility Principle (SRP):** Repositories handle database SQL; Services handle domain logic; Controllers handle HTTP request/response parsing; Evaluators handle grading.
- **Dependency Inversion Principle (DIP):** High-level `EvaluationService` depends on the `Evaluator` interface, injected at construction time.
- **Strategy Pattern:** The evaluation strategy can be swapped (`RuleBasedEvaluator` vs. `AIEvaluator`) without modifying business workflows.
- **Repository Pattern:** Database operations are isolated from domain logic, making persistence easily interchangeable.

---

## AI Usage & Engineering Decision Record

This section outlines the meaningful AI-assisted development decisions made during the design, implementation, and refinement of **LLD Arena**. Every AI suggestion was subjected to human architectural review, testing, and selective modification.

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

---

## Future Improvements

- Add support for interactive UML class diagram generation directly from solution text.
- Add multi-language AST syntax parsing (Java, Python, C++, TypeScript) for syntax validation.
- Support real-time peer reviews and mock interview collaboration sessions.

