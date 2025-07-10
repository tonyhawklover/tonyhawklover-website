"use client";

interface AIState {
  generation: number;
  bestScore: number;
  strategies: Array<{
    score: number;
    actions: Array<{
      type: "line" | "force";
      x: number;
      y: number;
      angle?: number;
      force?: { x: number; y: number };
    }>;
  }>;
  currentStrategy: number;
  learningRate: number;
}

export class LineRiderAI {
  private state: AIState;
  private performanceHistory: number[] = [];
  private mutationRate = 0.1;
  private maxStrategies = 10;

  constructor() {
    this.state = {
      generation: 0,
      bestScore: 0,
      strategies: [],
      currentStrategy: 0,
      learningRate: 0.1,
    };
    this.initializeStrategies();
  }

  private initializeStrategies() {
    // Create initial random strategies
    for (let i = 0; i < this.maxStrategies; i++) {
      this.state.strategies.push({
        score: 0,
        actions: this.generateRandomActions(),
      });
    }
  }

  private generateRandomActions(count: number = 10) {
    const actions = [];
    for (let i = 0; i < count; i++) {
      if (Math.random() < 0.7) {
        // Create line action
        actions.push({
          type: "line" as const,
          x: 100 + i * 50 + (Math.random() - 0.5) * 100,
          y: 200 + (Math.random() - 0.5) * 200,
          angle: ((Math.random() - 0.5) * Math.PI) / 2,
        });
      } else {
        // Create force action
        actions.push({
          type: "force" as const,
          x: 100 + i * 50,
          y: 200,
          force: {
            x: (Math.random() - 0.5) * 0.01,
            y: (Math.random() - 0.5) * 0.01,
          },
        });
      }
    }
    return actions;
  }

  public getNextAction(
    riderPosition: { x: number; y: number },
    riderVelocity: { x: number; y: number }
  ) {
    const currentStrategy = this.state.strategies[this.state.currentStrategy];
    if (!currentStrategy) return null;

    // Find the most appropriate action based on current state
    const appropriateActions = currentStrategy.actions.filter((action) => {
      const distance = Math.sqrt(
        Math.pow(action.x - riderPosition.x, 2) +
          Math.pow(action.y - riderPosition.y, 2)
      );
      return distance < 150 && distance > 50; // Within reasonable range
    });

    if (appropriateActions.length === 0) {
      // Generate a new action based on current position
      const speed = Math.sqrt(riderVelocity.x ** 2 + riderVelocity.y ** 2);
      const ahead = {
        x: riderPosition.x + riderVelocity.x * 20,
        y: riderPosition.y + riderVelocity.y * 20,
      };

      if (speed > 3) {
        // Create a ramp for tricks
        return {
          type: "line" as const,
          x: ahead.x,
          y: ahead.y - 30,
          angle: -Math.PI / 6,
        };
      } else {
        // Create a boost platform
        return {
          type: "line" as const,
          x: ahead.x,
          y: ahead.y + 10,
          angle: -Math.PI / 12,
        };
      }
    }

    return appropriateActions[
      Math.floor(Math.random() * appropriateActions.length)
    ];
  }

  public updateScore(score: number, flips: number, airTime: number) {
    const currentStrategy = this.state.strategies[this.state.currentStrategy];
    if (!currentStrategy) return;

    // Calculate fitness based on multiple factors
    const fitness = score + flips * 50 + airTime * 10;
    currentStrategy.score = Math.max(currentStrategy.score, fitness);

    if (fitness > this.state.bestScore) {
      this.state.bestScore = fitness;
    }

    this.performanceHistory.push(fitness);

    // Keep only last 100 performance records
    if (this.performanceHistory.length > 100) {
      this.performanceHistory.shift();
    }
  }

  public evolve() {
    // Sort strategies by score
    this.state.strategies.sort((a, b) => b.score - a.score);

    // Keep top 50% of strategies
    const survivors = this.state.strategies.slice(
      0,
      Math.floor(this.maxStrategies / 2)
    );

    // Create new generation
    const newStrategies = [...survivors];

    // Fill the rest with mutations and crossovers
    while (newStrategies.length < this.maxStrategies) {
      if (Math.random() < 0.7 && survivors.length > 1) {
        // Crossover between two good strategies
        const parent1 = survivors[Math.floor(Math.random() * survivors.length)];
        const parent2 = survivors[Math.floor(Math.random() * survivors.length)];
        const child = this.crossover(parent1, parent2);
        newStrategies.push(child);
      } else {
        // Mutate a good strategy
        const parent = survivors[Math.floor(Math.random() * survivors.length)];
        const mutated = this.mutate(parent);
        newStrategies.push(mutated);
      }
    }

    this.state.strategies = newStrategies;
    this.state.generation++;
    this.state.currentStrategy = 0;

    // Adapt learning rate based on performance
    const recentPerformance = this.performanceHistory.slice(-10);
    const averageRecent =
      recentPerformance.reduce((a, b) => a + b, 0) / recentPerformance.length;
    const olderPerformance = this.performanceHistory.slice(-20, -10);
    const averageOlder =
      olderPerformance.reduce((a, b) => a + b, 0) / olderPerformance.length;

    if (averageRecent > averageOlder) {
      this.mutationRate = Math.max(0.05, this.mutationRate * 0.9); // Reduce mutation if improving
    } else {
      this.mutationRate = Math.min(0.3, this.mutationRate * 1.1); // Increase mutation if stuck
    }
  }

  private crossover(
    parent1: AIState["strategies"][0],
    parent2: AIState["strategies"][0]
  ) {
    const child = {
      score: 0,
      actions: [] as Array<{
        type: "line" | "force";
        x: number;
        y: number;
        angle?: number;
        force?: { x: number; y: number };
      }>,
    };

    const minLength = Math.min(parent1.actions.length, parent2.actions.length);
    const crossoverPoint = Math.floor(Math.random() * minLength);

    child.actions = [
      ...parent1.actions.slice(0, crossoverPoint),
      ...parent2.actions.slice(crossoverPoint),
    ];

    return child;
  }

  private mutate(parent: AIState["strategies"][0]) {
    const child = {
      score: 0,
      actions: parent.actions.map((action) => {
        if (Math.random() < this.mutationRate) {
          // Mutate this action
          const mutated = { ...action };
          if (action.type === "line") {
            mutated.x += (Math.random() - 0.5) * 50;
            mutated.y += (Math.random() - 0.5) * 50;
            mutated.angle = (mutated.angle || 0) + (Math.random() - 0.5) * 0.5;
          } else {
            mutated.force = {
              x: (mutated.force?.x || 0) + (Math.random() - 0.5) * 0.005,
              y: (mutated.force?.y || 0) + (Math.random() - 0.5) * 0.005,
            };
          }
          return mutated;
        }
        return action;
      }),
    };

    // Sometimes add new actions
    if (Math.random() < this.mutationRate) {
      child.actions.push(...this.generateRandomActions(2));
    }

    return child;
  }

  public switchStrategy() {
    this.state.currentStrategy =
      (this.state.currentStrategy + 1) % this.state.strategies.length;
  }

  public getAIStats() {
    return {
      generation: this.state.generation,
      bestScore: this.state.bestScore,
      currentStrategy: this.state.currentStrategy,
      totalStrategies: this.state.strategies.length,
      mutationRate: this.mutationRate,
      averageScore:
        this.state.strategies.reduce((sum, s) => sum + s.score, 0) /
        this.state.strategies.length,
    };
  }

  public reset() {
    this.state.generation = 0;
    this.state.bestScore = 0;
    this.state.currentStrategy = 0;
    this.performanceHistory = [];
    this.mutationRate = 0.1;
    this.state.strategies = [];
    this.initializeStrategies();
  }
}
