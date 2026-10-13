export const MOCK_PROBLEMS = [
  {
    id: 'parking-lot',
    title: 'Parking Lot',
    difficulty: 'Medium',
    category: 'Object-Oriented Design',
    shortDescription: 'Design a parking lot supporting different vehicle types, parking spaces and pricing strategies.',
    fullDescription: 'Design a comprehensive parking lot system that can accommodate different types of vehicles across multiple floors, handle spot allocations dynamically, calculate hourly and tiered parking fees, and remain extensible for future vehicle and pricing rules.',
    tags: ['OOP', 'Design Patterns', 'Strategy Pattern'],
    requirements: [
      'Support Bike, Car and Truck vehicle types',
      'Support different parking spot sizes (Small, Medium, Large)',
      'Park a vehicle in the nearest or optimal available spot',
      'Remove a vehicle and free up the occupied spot',
      'Find and display available parking spaces per floor/type',
      'Calculate parking fees based on vehicle type and duration',
      'Allow the design to be extended easily with new vehicle types or pricing schemes'
    ],
    considerations: [
      { label: 'Classes', text: 'ParkingLot, ParkingFloor, ParkingSpot, Vehicle, Ticket, Payment' },
      { label: 'Responsibilities', text: 'Who allocates spots? Who handles payments? Separate coordination from state.' },
      { label: 'Relationships', text: 'Composition between ParkingLot and Floors; Association with Vehicles.' },
      { label: 'Interfaces', text: 'IParkingStrategy for allocation, IPricingStrategy for hourly/flat fees.' },
      { label: 'Design Patterns', text: 'Strategy Pattern for spot search & fees; Factory Pattern for spots/vehicles.' },
      { label: 'Extensibility', text: 'How to introduce EV spots or subscription passes without modifying core logic.' }
    ],
    thingsToThinkAbout: [
      'What objects should exist in the domain model?',
      'Who should be responsible for parking allocation?',
      'How should different vehicle types be modeled?',
      'How can pricing rules be changed later without breaking existing code?',
      'Which abstractions would make the system extensible for EV charging or multi-gate entry?'
    ],
    starterTemplate: `// Problem: Parking Lot System
// Define your core entities, interfaces, and relationships

// 1. Vehicle Enums & Hierarchy
public enum VehicleType {
    BIKE, CAR, TRUCK
}

public abstract class Vehicle {
    private String licensePlate;
    private VehicleType type;
    // Constructor and getters
}

// 2. Parking Spot Hierarchy
public abstract class ParkingSpot {
    private int spotNumber;
    private boolean isAvailable;
    private Vehicle currentVehicle;
    
    public abstract boolean canFitVehicle(Vehicle vehicle);
}

// 3. Strategy Abstractions
public interface ParkingStrategy {
    ParkingSpot findSpot(List<ParkingFloor> floors, Vehicle vehicle);
}

public interface PricingStrategy {
    double calculateFee(Ticket ticket, long durationMinutes);
}

// 4. Core System Controller
public class ParkingLot {
    private String name;
    private List<ParkingFloor> floors;
    private ParkingStrategy parkingStrategy;
    private PricingStrategy pricingStrategy;
    
    // Core workflows: parkVehicle, unparkVehicle, getAvailableSpots
}
`,
    starterExplanation: `Key Design Choices:
- Separated spot allocation into ParkingStrategy (e.g., NearestSpotStrategy) to decouple floor navigation from ParkingLot.
- Utilized Strategy Pattern for PricingStrategy to support dynamic hourly rates and vehicle discounts.
- Modeled Vehicle and ParkingSpot as abstract classes to enforce polymorphic sizing validation.`
  },
  {
    id: 'elevator-system',
    title: 'Elevator System',
    difficulty: 'Medium',
    category: 'System & Concurrency',
    shortDescription: 'Design an elevator system capable of handling multiple floor requests and multiple elevators.',
    fullDescription: 'Design an elevator controller system operating in a multi-story building. The system must dispatch elevator cars efficiently using optimal scheduling algorithms (e.g., SCAN/LOOK), handle directional internal and external requests, and support emergency stops.',
    tags: ['OOP', 'State', 'Scheduling'],
    requirements: [
      'Support multiple elevator cars across N floors',
      'Handle internal elevator button presses (destination floor)',
      'Handle external hall button presses (UP/DOWN with source floor)',
      'Dispatch the optimal elevator based on proximity and direction',
      'Operate elevator door states (OPEN, CLOSING, CLOSED)',
      'Support priority or maintenance modes',
      'Provide extensible scheduling algorithms (FCFS, LOOK, SCAN)'
    ],
    considerations: [
      { label: 'Classes', text: 'ElevatorController, ElevatorCar, Request, InternalButton, ExternalButton' },
      { label: 'Responsibilities', text: 'Car handles movement and door states; Controller handles dispatching logic.' },
      { label: 'Relationships', text: 'Controller aggregates ElevatorCars; Requests queue into Dispatcher.' },
      { label: 'Interfaces', text: 'IElevatorSchedulingStrategy (LOOK, SCAN, FCFS).' },
      { label: 'Design Patterns', text: 'State Pattern for elevator motion/doors; Observer Pattern for hall requests.' },
      { label: 'Extensibility', text: 'Pluggable scheduling algorithms and capacity management.' }
    ],
    thingsToThinkAbout: [
      'How to model elevator states (IDLE, MOVING_UP, MOVING_DOWN, MAINTENANCE)?',
      'Which scheduling algorithm minimizes user wait time and energy consumption?',
      'How to avoid starvation for requests in the opposite direction?',
      'Who is notified when a car reaches a destination floor?'
    ],
    starterTemplate: `// Problem: Multi-Car Elevator System
public enum Direction { UP, DOWN, IDLE }
public enum ElevatorState { MOVING, STOPPED, DOOR_OPEN, MAINTENANCE }

public class Request {
    private int sourceFloor;
    private int destinationFloor;
    private Direction direction;
}

public interface SchedulingStrategy {
    ElevatorCar selectBestCar(List<ElevatorCar> cars, Request request);
}

public class ElevatorCar {
    private int id;
    private int currentFloor;
    private Direction currentDirection;
    private ElevatorState state;
    private TreeSet<Integer> upRequests;
    private TreeSet<Integer> downRequests;
}

public class ElevatorController {
    private List<ElevatorCar> cars;
    private SchedulingStrategy scheduler;
}
`,
    starterExplanation: `Design Highlights:
- State pattern encapsulates door and motion transitions.
- SchedulingStrategy separates assignment algorithms (SCAN / LOOK) from the physical car logic.`
  },
  {
    id: 'vending-machine',
    title: 'Vending Machine',
    difficulty: 'Easy',
    category: 'State Machine Design',
    shortDescription: 'Design a vending machine supporting product selection, payments, change and inventory.',
    fullDescription: 'Design the software system for an automated vending machine. The system guides users through inserting money, choosing products from rack inventories, dispensing items, returning exact change, and handling refund/cancellation requests safely.',
    tags: ['OOP', 'State Pattern', 'Inventory'],
    requirements: [
      'Maintain an inventory of products with prices and quantities',
      'Accept multiple coin and bill denominations',
      'Handle state transitions: Ready -> HasMoney -> Dispensing -> Refund',
      'Dispense item upon sufficient payment and deduct inventory',
      'Return exact change using available cash reserves',
      'Support cancellation and refund prior to dispensing',
      'Provide admin capabilities to restock products and withdraw cash'
    ],
    considerations: [
      { label: 'Classes', text: 'VendingMachine, State, Product, Inventory, Coin, CashRegister' },
      { label: 'Responsibilities', text: 'States govern allowable actions; CashRegister handles change making.' },
      { label: 'Relationships', text: 'VendingMachine holds current State and CashRegister.' },
      { label: 'Interfaces', text: 'IVendingMachineState (insertCoin, selectItem, dispense, refund).' },
      { label: 'Design Patterns', text: 'State Pattern is paramount to prevent invalid transitions.' },
      { label: 'Extensibility', text: 'Support cashless payments (NFC, Card) via PaymentGateway abstraction.' }
    ],
    thingsToThinkAbout: [
      'How to prevent product dispensing if money inserted is insufficient?',
      'How does the state transition from Idle to HasMoney to Dispensing?',
      'What happens if the machine runs out of change for a high denomination bill?',
      'How can an admin mode lock user operations during restocking?'
    ],
    starterTemplate: `// Problem: Vending Machine
public interface VendingMachineState {
    void insertCoin(VendingMachine machine, Coin coin);
    void selectProduct(VendingMachine machine, String code);
    void dispense(VendingMachine machine);
    void refund(VendingMachine machine);
}

public class IdleState implements VendingMachineState { /* ... */ }
public class HasMoneyState implements VendingMachineState { /* ... */ }
public class DispensingState implements VendingMachineState { /* ... */ }

public class VendingMachine {
    private VendingMachineState currentState;
    private Inventory<Product> inventory;
    private CashRegister cashRegister;
    private double currentBalance;
}
`,
    starterExplanation: `Design Highlights:
- Pure State Pattern implementation prevents invalid actions like dispensing before payment.
- Decoupled CashRegister allows adding card/digital wallet integrations.`
  },
  {
    id: 'rate-limiter',
    title: 'Rate Limiter',
    difficulty: 'Medium',
    category: 'System Utility',
    shortDescription: 'Design a client-side or gateway rate limiter supporting token bucket and sliding window algorithms.',
    fullDescription: 'Design an extensible rate limiting utility for an API service to protect downstream resources from burst traffic and malicious floods. Support configurable limits per user, IP, or API key.',
    tags: ['OOP', 'Strategy Pattern', 'Concurrency'],
    requirements: [
      'Limit requests per key (IP, User ID, Client ID) within a time window',
      'Support Token Bucket, Leaking Bucket, and Sliding Window Counter algorithms',
      'Return allow/deny decisions with remaining quota and reset timestamps',
      'Support dynamic configuration per endpoint tier (Free vs Pro)',
      'Thread-safe execution for concurrent requests'
    ],
    considerations: [
      { label: 'Classes', text: 'RateLimiter, IRateLimitingStrategy, TokenBucket, SlidingWindow, UserConfig' },
      { label: 'Responsibilities', text: 'Limiter checks quota; Strategies track token counts and timestamps.' },
      { label: 'Relationships', text: 'RateLimiter coordinates rule matching with specific strategy instances.' },
      { label: 'Interfaces', text: 'IRateLimitingAlgorithm with isAllowed(String key, int tokensRequested).' },
      { label: 'Design Patterns', text: 'Strategy Pattern for algorithms; Factory Pattern for rule generators.' },
      { label: 'Extensibility', text: 'Pluggable distributed backends (Redis vs In-Memory).' }
    ],
    thingsToThinkAbout: [
      'Which algorithm is best for bursty traffic vs strictly smooth traffic?',
      'How to expire stale user records without memory leaks?',
      'How to expose headers like X-RateLimit-Remaining?'
    ],
    starterTemplate: `public interface RateLimitingStrategy {
    boolean allowRequest(String clientKey, int permits);
}

public class TokenBucketStrategy implements RateLimitingStrategy {
    private final long capacity;
    private final double refillRatePerSecond;
    // Token refill logic
}

public class RateLimiter {
    private RateLimitingStrategy strategy;
    public boolean handleRequest(String clientId) {
        return strategy.allowRequest(clientId, 1);
    }
}
`,
    starterExplanation: `Design Highlights:
- Strategy pattern decouples algorithms from HTTP interceptor code.`
  },
  {
    id: 'splitwise',
    title: 'Expense Sharing (Splitwise)',
    difficulty: 'Hard',
    category: 'Financial Modeling',
    shortDescription: 'Design an expense sharing system supporting equal, exact and percentage splits with debt simplification.',
    fullDescription: 'Design an expense sharing and debt tracking application like Splitwise. Users can create groups, log shared expenses with diverse split types, calculate balances, and simplify multilateral balances into minimum cash flow settlements.',
    tags: ['OOP', 'Strategy Pattern', 'Algorithms'],
    requirements: [
      'Support individual and group shared expenses',
      'Support multiple split types (Equal, Exact Amounts, Percentages)',
      'Track bilateral balances between pairs of users',
      'Settle debts between two users',
      'Optional debt simplification algorithm to reduce transactions',
      'Validate split inputs (e.g. percentages must sum to 100%)'
    ],
    considerations: [
      { label: 'Classes', text: 'ExpenseManager, User, Group, Expense, Split, ExpenseSplitStrategy' },
      { label: 'Responsibilities', text: 'Expense calculates split shares; Manager reconciles balances.' },
      { label: 'Relationships', text: 'Expense has one PaidBy user and list of Splits.' },
      { label: 'Interfaces', text: 'ISplitStrategy (EqualSplit, ExactSplit, PercentageSplit).' },
      { label: 'Design Patterns', text: 'Strategy Pattern for splits; Factory Pattern for Expense instantiation.' },
      { label: 'Extensibility', text: 'Currency conversions and receipt image attachments.' }
    ],
    thingsToThinkAbout: [
      'How to handle rounding discrepancies in equal splits ($100 divided among 3 people)?',
      'How to represent the balance sheet between users?',
      'How does the debt simplification graph algorithm work?'
    ],
    starterTemplate: `public abstract class Expense {
    private String id;
    private double amount;
    private User paidBy;
    private List<Split> splits;
    public abstract boolean validate();
}

public interface SplitStrategy {
    List<Split> calculateSplits(double totalAmount, List<User> users, List<Double> values);
}
`,
    starterExplanation: `Design Highlights:
- Strategy pattern isolates split math and validation rules from user account data.`
  }
];
