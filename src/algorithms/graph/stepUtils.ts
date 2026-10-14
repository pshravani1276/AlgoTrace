import type { GraphAlgorithm, GraphAlgorithmStep, GraphEdge } from "./types";

type StepState = Omit<GraphAlgorithmStep, "step" | "codeLine" | "operation" | "condition" | "explanation">;

export function makeStepRecorder(): {
  steps: GraphAlgorithmStep[];
  state: StepState;
  record: (
    codeLine: number,
    operation: string,
    condition: string,
    explanation: string,
    changes?: Partial<StepState>,
  ) => void;
} {
  const steps: GraphAlgorithmStep[] = [];
  let stepNumber = 1;
  const state: StepState = {
    currentNode: null,
    checkingNode: null,
    distances: {},
    frontier: [],
    order: [],
    visited: [],
    path: [],
    activeEdge: null,
    traversedEdges: [],
  };

  const record = (
    codeLine: number,
    operation: string,
    condition: string,
    explanation: string,
    changes: Partial<StepState> = {},
  ) => {
    Object.assign(state, changes);
    steps.push({
      ...state,
      step: stepNumber,
      codeLine,
      distances: { ...state.distances },
      frontier: [...state.frontier],
      order: [...state.order],
      visited: [...state.visited],
      path: [...state.path],
      traversedEdges: state.traversedEdges.map(([from, to]) => [from, to]),
      operation: `${operation} · line ${codeLine}`,
      condition: `${condition} · source line ${codeLine}`,
      explanation,
    });
    stepNumber += 1;
  };

  return { steps, state, record };
}

export function createAdjacency(algorithm: GraphAlgorithm): Map<string, GraphEdge[]> {
  const adjacency = new Map(algorithm.nodes.map((node) => [node.id, [] as GraphEdge[]]));
  for (const edge of algorithm.edges) adjacency.get(edge.from)?.push(edge);
  return adjacency;
}

export function createInitialDistances(algorithm: GraphAlgorithm): Record<string, number> {
  return Object.fromEntries(algorithm.nodes.map((node) => [node.id, Number.POSITIVE_INFINITY]));
}

export function restorePath(parents: Map<string, string>, start: string, goal: string): string[] {
  if (start !== goal && !parents.has(goal)) return [];
  const path = [goal];
  let current = goal;
  while (current !== start) {
    const parent = parents.get(current);
    if (!parent || path.length > parents.size + 1) return [];
    current = parent;
    path.unshift(current);
  }
  return path;
}