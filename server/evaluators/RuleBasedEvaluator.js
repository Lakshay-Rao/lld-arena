import { Evaluator } from './Evaluator.js'

export class RuleBasedEvaluator extends Evaluator {
  /**
   * Evaluates the submitted solution deterministically.
   */
  async evaluate({ problem, solution, explanation = '', attemptNumber = 1 }) {
    const text = `${solution}\n${explanation}`.toLowerCase()

    // 1. Requirements Coverage (max 20)
    let reqScore = 10
    const problemId = problem?.id || 'parking-lot'

    if (problemId === 'parking-lot') {
      if (text.includes('vehicle')) reqScore += 2
      if (text.includes('bike') || text.includes('car') || text.includes('truck')) reqScore += 2
      if (text.includes('parkingspot') || text.includes('spot')) reqScore += 2
      if (text.includes('parkinglot')) reqScore += 2
      if (text.includes('fee') || text.includes('pricing') || text.includes('rate')) reqScore += 2
    } else if (problemId === 'elevator-system') {
      if (text.includes('elevatorcar') || text.includes('car')) reqScore += 2
      if (text.includes('elevatorcontroller') || text.includes('controller')) reqScore += 2
      if (text.includes('request') || text.includes('floor')) reqScore += 2
      if (text.includes('direction') || text.includes('state')) reqScore += 2
      if (text.includes('schedul') || text.includes('strategy')) reqScore += 2
    } else if (problemId === 'vending-machine') {
      if (text.includes('product') || text.includes('item')) reqScore += 2
      if (text.includes('inventory')) reqScore += 2
      if (text.includes('coin') || text.includes('cash') || text.includes('money')) reqScore += 2
      if (text.includes('state')) reqScore += 2
      if (text.includes('dispense')) reqScore += 2
    } else {
      if (text.includes('class')) reqScore += 4
      if (text.includes('interface')) reqScore += 4
      if (text.includes('method') || text.includes('public')) reqScore += 2
    }
    reqScore = Math.min(20, Math.max(8, reqScore))

    // 2. Responsibility Separation (max 20)
    let srpScore = 10
    const hasMultipleClasses = (text.match(/class\s+/g) || []).length >= 3
    if (hasMultipleClasses) srpScore += 3
    if (text.includes('srp') || text.includes('responsibility') || text.includes('separate')) srpScore += 2
    const hasStrategyOrState = text.includes('strategy') || text.includes('state')
    if (hasStrategyOrState) srpScore += 3
    if (text.includes('parkingstrategy') || text.includes('pricingstrategy')) srpScore += 2
    srpScore = Math.min(20, Math.max(8, srpScore))

    // 3. Abstraction (max 20)
    let absScore = 10
    const hasInterfaces = (text.match(/interface\s+/g) || []).length >= 1
    const hasAbstractClass = text.includes('abstract class') || text.includes('abstract ')
    if (hasInterfaces) absScore += 4
    if (hasAbstractClass) absScore += 3
    if (text.includes('implements') || text.includes('extends')) absScore += 2
    if (text.includes('polymorph') || text.includes('contract')) absScore += 1
    absScore = Math.min(20, Math.max(7, absScore))

    // 4. Extensibility (max 15)
    let extScore = 7
    if (text.includes('strategy') || text.includes('factory') || text.includes('observer')) extScore += 3
    if (text.includes('parkingstrategy') && text.includes('pricingstrategy')) extScore += 3
    if (text.includes('extensib') || text.includes('open-closed') || text.includes('pluggable')) extScore += 2
    extScore = Math.min(15, Math.max(5, extScore))

    // 5. Object Relationships (max 15)
    let relScore = 7
    if (text.includes('list<') || text.includes('map<') || text.includes('set<') || text.includes('array')) relScore += 3
    if (text.includes('composition') || text.includes('has-a') || text.includes('floors')) relScore += 2
    if (text.includes('ticket') || text.includes('spot.assign') || text.includes('request')) relScore += 2
    relScore = Math.min(15, Math.max(5, relScore))

    // 6. Design Quality (max 10)
    let qualScore = 5
    if (text.includes('private') || text.includes('encapsulation') || text.includes('getter')) qualScore += 2
    if (explanation.trim().length > 40) qualScore += 2
    if (text.includes('trade-off') || text.includes('concurrency') || text.includes('solid')) qualScore += 1
    qualScore = Math.min(10, Math.max(4, qualScore))

    // Calculate total score
    const overallScore = reqScore + srpScore + absScore + extScore + relScore + qualScore

    const scoreBreakdown = {
      requirementsCoverage: { score: reqScore, max: 20, label: 'Requirements Coverage' },
      responsibilitySeparation: { score: srpScore, max: 20, label: 'Responsibility Separation' },
      abstraction: { score: absScore, max: 20, label: 'Abstraction' },
      extensibility: { score: extScore, max: 15, label: 'Extensibility' },
      objectRelationships: { score: relScore, max: 15, label: 'Object Relationships' },
      designQuality: { score: qualScore, max: 10, label: 'Design Quality' }
    }

    // Generate Tailored Strengths
    const strengths = []
    if (text.includes('vehicle') && text.includes('spot')) {
      strengths.push('Vehicle and ParkingSpot responsibilities are clearly separated.')
    }
    if (text.includes('bike') || text.includes('car') || text.includes('truck') || text.includes('extends vehicle')) {
      strengths.push('The solution models different vehicle types with clear polymorphism.')
    } else {
      strengths.push('Core domain entities and class definitions are well structured.')
    }
    if (text.includes('parkinglot') || text.includes('controller') || text.includes('vendingmachine')) {
      strengths.push('The primary workflow and method orchestration are clearly defined.')
    }
    if (text.includes('strategy')) {
      strengths.push('Effective use of the Strategy pattern decouples algorithms from main controllers.')
    }

    // Generate Areas to Improve
    const areasToImprove = []
    const hasDecoupledStrategies = text.includes('parkingstrategy') && text.includes('pricingstrategy')

    if (!hasDecoupledStrategies && problemId === 'parking-lot') {
      areasToImprove.push('ParkingLot is handling multiple responsibilities (spot search and fee calculation).')
      areasToImprove.push('Fee calculation is tightly coupled to the parking checkout workflow.')
      areasToImprove.push('Parking allocation logic could be separated into a pluggable search strategy.')
    } else if (overallScore >= 88) {
      areasToImprove.push('Consider concurrency controls (e.g., ReentrantReadWriteLock) for simultaneous entries.')
      areasToImprove.push('Introduce an EventListener / Observer for live display board updates.')
    } else {
      areasToImprove.push('Some responsibilities could be further decoupled using dedicated interfaces.')
      areasToImprove.push('Error handling and edge case boundaries can be made more explicit.')
    }

    // Suggested Improvements
    let suggestedImprovements = {}
    if (problemId === 'parking-lot') {
      if (!hasDecoupledStrategies) {
        suggestedImprovements = {
          recommendation: 'Consider introducing:',
          patterns: ['ParkingStrategy', 'PricingStrategy'],
          asciiDiagram: `ParkingLot\n   |\n   +--- ParkingStrategy\n   |\n   +--- PricingStrategy\n   |\n   +--- ParkingSpot`,
          explanation: 'Using separate strategies would make the design easier to extend when new parking allocation or pricing rules are introduced.'
        }
      } else {
        suggestedImprovements = {
          recommendation: 'Next step: Concurrency & Observability',
          patterns: ['Observer Pattern', 'Locking Concurrency'],
          asciiDiagram: `ParkingLot\n   |\n   +--- EventBus (SpotOccupiedEvent)\n   |       |\n   |       +--- DisplayBoardListener\n   |       +--- GateControllerListener`,
          explanation: 'Introduce an Observer/Event pattern to push spot availability updates to electronic signage automatically.'
        }
      }
    } else if (problemId === 'elevator-system') {
      suggestedImprovements = {
        recommendation: 'Decouple dispatching algorithm into a pluggable ElevatorScheduler.',
        patterns: ['Strategy Pattern', 'State Pattern'],
        asciiDiagram: `ElevatorController\n   |\n   +--- ISchedulingStrategy (LOOK / SCAN / FCFS)\n   |\n   +--- List<ElevatorCar>`,
        explanation: 'Allows building managers to toggle between energy-saving and peak-traffic dispatch algorithms.'
      }
    } else {
      suggestedImprovements = {
        recommendation: 'Encapsulate machine actions using the State Pattern.',
        patterns: ['State Pattern', 'Factory Pattern'],
        asciiDiagram: `VendingMachine\n   |\n   +--- IVendingMachineState (Idle, HasMoney, Dispensing)\n   |\n   +--- CashRegister`,
        explanation: 'Prevents invalid transitions such as dispensing before receiving payment.'
      }
    }

    // Overall Feedback Summary
    let overallFeedback = ''
    if (overallScore >= 88) {
      overallFeedback =
        'Exceptional design! You cleanly decoupled core responsibilities with polymorphic strategies and high cohesion. Your architecture is modular, extensible, and adheres to SOLID design principles.'
    } else if (overallScore >= 75) {
      overallFeedback =
        'Your design has a solid object-oriented foundation. The main improvement area is separation of responsibilities. Introducing strategy abstractions would improve extensibility.'
    } else {
      overallFeedback =
        'A promising initial design. To level up, break monolithic classes into distinct domain entities with clear single responsibilities, interfaces, and encapsulation.'
    }

    return {
      overallScore,
      scoreBreakdown,
      strengths,
      areasToImprove,
      suggestedImprovements,
      overallFeedback
    }
  }
}
