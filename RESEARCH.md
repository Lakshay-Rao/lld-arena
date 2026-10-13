# Research Note: Designing an LLD Practice and Feedback Platform

## 1. The Challenge of Evaluating Low-Level Design

Traditional automated coding platforms (e.g., LeetCode, HackerRank) evaluate software solutions using input/output test cases. An algorithmic solution either produces the expected stdout for a given stdin within resource limits or it does not.

This binary model fails when evaluating **Low-Level Design (LLD)** and **Object-Oriented Architecture**:
- In LLD, the objective is not simply achieving the correct computational output, but designing maintainable, decoupled, and extensible software structures.
- A single monolithic class containing 500 lines of switch statements may pass functional input/output tests, yet represents an architectural failure that violates the Single Responsibility Principle and Open-Closed Principle.
- Conversely, an elegant design that models clean abstractions might fail brittle input/output tests due to minor signature differences.

Consequently, an effective LLD practice platform must evaluate **architectural qualities**—such as encapsulation, modularity, abstraction contracts, and pattern suitability—rather than mere functional execution.

---

## 2. What Makes an LLD Solution Meaningful?

A high-quality object-oriented design balances several interrelated qualities:

1. **Separation of Responsibilities (SRP):** Each class should have a single, well-defined reason to change. In a parking lot system, coordinating vehicle admissions, calculating tiered billing, and searching for empty spots should not be coupled into one monolithic class.
2. **Clear Abstraction Contracts:** Interfaces and abstract base classes define behavioral contracts that decouple callers from concrete implementations (e.g., `ParkingStrategy` or `PricingStrategy`).
3. **Explicit Object Relationships:** Systems should prefer composition over deep inheritance. Aggregating floors into a parking lot and associating tickets with vehicles models real-world domain boundaries cleanly.
4. **Extensibility (OCP):** Systems must accommodate new requirements (e.g., introducing EV charging spots or weekend surge pricing) without requiring modifications to existing core controllers.
5. **Architectural Trade-offs:** Every design choice incurs trade-offs. Introducing the Strategy pattern adds indirection but increases flexibility. A meaningful solution must articulate *why* specific trade-offs were made.

---

## 3. Evaluation Approaches: A Comparative Analysis

| Approach | Strengths | Limitations | Best Use Case |
|---|---|---|---|
| **A. Deterministic / Rule-Based** | • Instantaneous response time.<br>• 100% reproducible and predictable.<br>• Zero external API costs or rate limits.<br>• Immune to hallucination or non-deterministic variance. | • Requires domain-specific heuristics.<br>• Limited ability to understand subtle idiomatic phrasing or novel naming conventions. | Core automated grading, baseline verification, and low-latency feedback. |
| **B. LLM / AI-Based** | • Exceptional semantic understanding of code and text.<br>• Generates conversational, nuanced feedback.<br>• Handles free-form pseudo-code and multiple programming languages easily. | • Potential for non-deterministic scoring variance between runs.<br>• External API latency (2–6 seconds).<br>• Network failure risks and credential dependencies. | Personalized coaching, conversational explanations, and advanced critique. |
| **C. Hybrid Evaluation** | • Combines deterministic consistency for scores with LLM semantic depth for prose.<br>• Can gracefully fall back to rules when network or AI quotas fail. | • Higher implementation complexity.<br>• Requires arbitration between rule metrics and model insights. | Production learning platforms requiring both reliability and depth. |

---

## 4. Accommodating Multiple Valid Solutions

Software architecture is rarely a problem with a single "correct" answer. Consider a parking lot:
- **Approach 1:** Strategy pattern for spot assignment (e.g., `NearestSpotStrategy`, `BestFitStrategy`).
- **Approach 2:** Floor-level delegation where each `ParkingFloor` manages its own sub-allocation.
- **Approach 3:** Event-driven architecture with an `Observer` notifying display boards upon spot occupancy.

All three designs are architecturally sound. An LLD evaluation platform must not enforce a brittle golden template. Instead, it must grade **structural qualities**:
- Are responsibilities distributed?
- Are behaviors hidden behind interfaces?
- Can new behavior be introduced without breaking existing classes?

Evaluating structural principles rather than exact class names allows learners the creative freedom necessary to develop genuine engineering judgement.

---

## 5. Designing Actionable Architectural Feedback

A single numerical score (e.g., "78/100") provides no educational value. To facilitate learning, feedback must be explainable and decomposed into three tiers:

1. **Category Breakdown:** Dissecting the score into core pillars (Requirements Coverage, Responsibility Separation, Abstraction, Extensibility, Object Relationships, Design Quality) pinpoints precisely where the solution fell short.
2. **Recognized Strengths:** Reinforcing sound design decisions (e.g., *"Vehicle and ParkingSpot responsibilities are clearly separated"*) confirms good instincts.
3. **Actionable Suggestions & Structural Diagrams:** Pointing out tight coupling is insufficient; the platform must suggest concrete refactoring options with diagrams:
   ```
   ParkingLot ──► ParkingStrategy (decouple spot search)
              ──► PricingStrategy (decouple fee rules)
   ```
This bridges the gap between evaluation and revision.

---

## 6. System Reliability and Resilience

Evaluation processes (whether AST-based or AI-assisted) are prone to edge cases, parsing failures, and network timeouts. In educational software, learner trust is destroyed if submitted work is lost.

To guarantee reliability:
- **Persist Before Evaluating:** Solutions must be written to durable storage with a `SUBMITTED` state prior to invoking the evaluation pipeline.
- **Graceful Failure States:** If evaluation crashes or times out, the attempt transitions to `FAILED` without deleting the submitted code, allowing learners to retry without retyping.
- **Attempt Immutability:** Retries must always generate new attempts (`Attempt #2`, `Attempt #3`) rather than overwriting previous records, preserving progress history.

---

## 7. Extensibility Considerations

A scalable LLD platform architecture must anticipate three dimensions of growth:
1. **Expanding the Problem Catalog:** Decoupling problem specifications into database-driven schemas ensures new challenges can be added without modifying controller code.
2. **Pluggable Evaluation Strategies:** Using the Strategy pattern and Dependency Inversion enables teams to swap deterministic rules for AI models or language-specific AST linters effortlessly.
3. **Polyglot Submissions:** Supporting pseudo-code, UML specifications, and real language snippets requires format-agnostic evaluation contracts.

---

## 8. Conclusion and LLD Arena Alignment

The architectural decisions implemented in **LLD Arena** directly reflect these research principles:
- **Strategy Pattern & DIP:** Implemented via `Evaluator`, `RuleBasedEvaluator`, and `AIEvaluator`, allowing the platform to run deterministically with zero external API dependencies while remaining extensible for future AI backends.
- **Multi-Pillar Rubric:** The 6-category, 100-point rubric provides explainable, reproducible feedback tailored to object-oriented principles.
- **Durable Lifecycle:** SQLite persistence guarantees that every submission is stored before evaluation, protecting learner work and enabling iterative "Try Again" progression.
