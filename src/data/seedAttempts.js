export const SEED_ATTEMPTS = [
  {
    id: 'att-pl-2',
    problemId: 'parking-lot',
    problemTitle: 'Parking Lot',
    attemptNumber: 2,
    status: 'Evaluated',
    date: 'Oct 14, 2026',
    overallScore: 78,
    previousScore: 64,
    delta: 14,
    scoreBreakdown: {
      requirementsCoverage: { score: 17, max: 20, label: 'Requirements Coverage' },
      responsibilitySeparation: { score: 16, max: 20, label: 'Responsibility Separation' },
      abstraction: { score: 15, max: 20, label: 'Abstraction' },
      extensibility: { score: 11, max: 15, label: 'Extensibility' },
      objectRelationships: { score: 11, max: 15, label: 'Object Relationships' },
      designQuality: { score: 8, max: 10, label: 'Design Quality' }
    },
    strengths: [
      'Vehicle and ParkingSpot responsibilities are clearly separated.',
      'The solution models different vehicle types with clear inheritance hierarchy.',
      'ParkingLot handles the main parking workflow method signatures accurately.'
    ],
    areasToImprove: [
      'ParkingLot is handling multiple responsibilities including spot search and fee computation.',
      'Fee calculation is tightly coupled directly inside unparkVehicle method.',
      'Parking allocation logic could be separated into a pluggable search strategy.'
    ],
    suggestedImprovements: {
      recommendation: 'Consider introducing:',
      patterns: ['ParkingStrategy', 'PricingStrategy'],
      asciiDiagram: `ParkingLot
   |
   +--- ParkingStrategy
   |
   +--- PricingStrategy
   |
   +--- ParkingSpot`,
      explanation: 'Using separate strategies would make the design easier to extend when new parking allocation or pricing rules are introduced.'
    },
    overallFeedback: 'Your design has a solid object-oriented foundation. The main improvement area is separation of responsibilities. Introducing strategy abstractions would improve extensibility.',
    solutionCode: `// Attempt #2 Solution
public class ParkingLot {
    private List<ParkingFloor> floors;
    
    public Ticket parkVehicle(Vehicle vehicle) {
        // Linear scan of floors for available spot
        for (ParkingFloor floor : floors) {
            for (ParkingSpot spot : floor.getSpots()) {
                if (spot.isAvailable() && spot.canFit(vehicle)) {
                    spot.assignVehicle(vehicle);
                    return new Ticket(vehicle, spot, System.currentTimeMillis());
                }
            }
        }
        throw new NoSpotAvailableException();
    }

    public double unparkVehicle(Ticket ticket) {
        ticket.getSpot().removeVehicle();
        // Fixed rate calculation inside ParkingLot class
        long durationHours = (System.currentTimeMillis() - ticket.getEntryTime()) / (1000 * 3600);
        return durationHours * 10.0;
    }
}`,
    explanation: 'Focused on fixing spot allocation bugs from Attempt #1 and adding multi-floor support. However, fee calculations are currently embedded directly in the unpark flow.'
  },
  {
    id: 'att-pl-1',
    problemId: 'parking-lot',
    problemTitle: 'Parking Lot',
    attemptNumber: 1,
    status: 'Evaluated',
    date: 'Oct 13, 2026',
    overallScore: 64,
    previousScore: null,
    delta: null,
    scoreBreakdown: {
      requirementsCoverage: { score: 14, max: 20, label: 'Requirements Coverage' },
      responsibilitySeparation: { score: 12, max: 20, label: 'Responsibility Separation' },
      abstraction: { score: 11, max: 20, label: 'Abstraction' },
      extensibility: { score: 9, max: 15, label: 'Extensibility' },
      objectRelationships: { score: 10, max: 15, label: 'Object Relationships' },
      designQuality: { score: 8, max: 10, label: 'Design Quality' }
    },
    strengths: [
      'Basic classes like ParkingLot, Vehicle, and ParkingSpot are established.',
      'Identified vehicle sizing needs for Car, Bike, and Truck.'
    ],
    areasToImprove: [
      'Single monolithic ParkingLot class managing spot arrays, fees, and state.',
      'Spots are not categorized by size, relying on boolean flags.',
      'No ticket or transaction model to record duration or billings.'
    ],
    suggestedImprovements: {
      recommendation: 'Model first-class entities for ParkingFloor, Ticket, and Spot types.',
      patterns: ['Composite Pattern', 'Factory Pattern'],
      asciiDiagram: `ParkingLot -> List<ParkingFloor> -> List<ParkingSpot>`,
      explanation: 'Break monolithic array tracking into a composite floor hierarchy with dedicated ticket tracking.'
    },
    overallFeedback: 'A promising initial draft. Needs decomposition of monolithic data structures into domain entities with encapsulation.',
    solutionCode: `// Attempt #1 Solution
public class ParkingLot {
    int[] spots = new int[100];
    public void park(String carNumber) {
        // basic array search
    }
}`,
    explanation: 'Initial quick layout using basic arrays and simple switch statements.'
  },
  {
    id: 'att-el-1',
    problemId: 'elevator-system',
    problemTitle: 'Elevator System',
    attemptNumber: 1,
    status: 'Evaluated',
    date: 'Oct 12, 2026',
    overallScore: 82,
    previousScore: null,
    delta: null,
    scoreBreakdown: {
      requirementsCoverage: { score: 18, max: 20, label: 'Requirements Coverage' },
      responsibilitySeparation: { score: 17, max: 20, label: 'Responsibility Separation' },
      abstraction: { score: 16, max: 20, label: 'Abstraction' },
      extensibility: { score: 12, max: 15, label: 'Extensibility' },
      objectRelationships: { score: 12, max: 15, label: 'Object Relationships' },
      designQuality: { score: 7, max: 10, label: 'Design Quality' }
    },
    strengths: [
      'Excellent separation between ElevatorCar motion and ElevatorController scheduling.',
      'State pattern appropriately modeled for door handling and directional movement.',
      'Priority queues used effectively for UP and DOWN request scheduling.'
    ],
    areasToImprove: [
      'LOOK/SCAN algorithm is hardcoded inside the controller rather than extracted to a strategy interface.',
      'Capacity limits and overweight sensor alerts are missing from the car model.'
    ],
    suggestedImprovements: {
      recommendation: 'Decouple dispatching algorithm into a pluggable ElevatorScheduler.',
      patterns: ['Strategy Pattern', 'Observer Pattern'],
      asciiDiagram: `ElevatorController
   |
   +--- ISchedulingStrategy (LOOK / SCAN / FCFS)
   |
   +--- List<ElevatorCar>`,
      explanation: 'Allows building managers to toggle between energy-saving and peak-traffic dispatch algorithms.'
    },
    overallFeedback: 'Strong object-oriented architecture with clean concurrency awareness. Extracting the scheduling algorithm into a strategy pattern will make it production grade.',
    solutionCode: `public class ElevatorController {
    List<ElevatorCar> cars;
    public void dispatch(Request req) {
        // selects nearest idle car
    }
}`,
    explanation: 'Designed with multi-car support and state-based door transitions.'
  }
];
