import {
  BFS_EDGES,
  BFS_NODES,
  DEFAULT_GRAPH,
  type BFSEdge,
  type BFSStep,
} from "./bfsData";

export const BFS_SOURCE_CODE = [
  "function bfs(graph: Record<number, number[]>, start: number) {",
  "  const queue: number[] = [start];",
  "  const visited = new Set<number>([start]);",
  "  const traversalOrder: number[] = [];",
  "",
  "  while (queue.length > 0) {",
  "    const current = queue.shift()!;",
  "    traversalOrder.push(current);",
  "",
  "    for (const neighbor of graph[current]) {",
  "      if (!visited.has(neighbor)) {",
  "        visited.add(neighbor);",
  "        queue.push(neighbor);",
  "      }",
  "    }",
  "  }",
  "",
  "  return traversalOrder;",
  "}",
];

const clone = <T,>(items: T[]): T[] => [...items];

const equivalentEdge = (
  edge: BFSEdge,
  activeEdge: [number, number] | null,
): boolean =>
  activeEdge !== null &&
  ((edge.from === activeEdge[0] && edge.to === activeEdge[1]) ||
    (edge.from === activeEdge[1] && edge.to === activeEdge[0]));

function createStep(
  steps: BFSStep[],
  step: number,
  line: number,
  currentNode: number | null,
  checkingNode: number | null,
  visited: number[],
  queue: number[],
  traversalOrder: number[],
  activeEdge: [number, number] | null,
  discovered: number[],
  completed: number[],
  traversedEdges: [number, number][],
  phase: BFSStep["phase"],
  operation: string,
  condition: string,
  explanation: string,
): void {
  steps.push({
    step,
    line,
    currentNode,
    checkingNode,
    visited: clone(visited),
    queue: clone(queue),
    traversalOrder: clone(traversalOrder),
    activeEdge,
    discovered: clone(discovered),
    completed: clone(completed),
    traversedEdges: traversedEdges.map(([from, to]) => [from, to]),
    phase,
    operation,
    condition,
    explanation,
  });
}

export function generateBFSSteps(
  graph: Record<number, number[]> = DEFAULT_GRAPH,
  start: number = 0,
): BFSStep[] {
  const steps: BFSStep[] = [];
  const queue: number[] = [start];
  const visited = new Set<number>([start]);
  const traversalOrder: number[] = [];
  const discovered = [start];
  const completed: number[] = [];
  const traversedEdges: [number, number][] = [];
  let stepNumber = 1;

  createStep(
    steps,
    stepNumber++,
    1,
    null,
    null,
    [],
    [],
    [],
    null,
    [],
    [],
    [],
    "start",
    "Entering BFS function",
    "BFS starts from the selected starting node.",
    "BFS starts from the selected starting node.",
  );

  createStep(
    steps,
    stepNumber++,
    2,
    null,
    null,
    [],
    queue,
    traversalOrder,
    null,
    discovered,
    completed,
    traversedEdges,
    "initialize",
    "Initializing queue",
    "queue = [start]",
    "BFS starts from the selected starting node. The queue is initialized with the starting node.",
  );

  createStep(
    steps,
    stepNumber++,
    3,
    null,
    null,
    [start],
    queue,
    traversalOrder,
    null,
    discovered,
    completed,
    traversedEdges,
    "visited",
    "Marking start node as visited",
    "visited.has(start) === true",
    `Node ${start} is marked as visited and becomes the initial discovered node.`,
  );

  createStep(
    steps,
    stepNumber++,
    6,
    null,
    null,
    [start],
    queue,
    traversalOrder,
    null,
    discovered,
    completed,
    traversedEdges,
    "empty-check",
    "Checking queue state",
    "queue.length > 0",
    "The queue is checked before removing the next node from the front.",
  );

  while (queue.length > 0) {
    const current = queue.shift()!;

    createStep(
      steps,
      stepNumber++,
      7,
      current,
      null,
      Array.from(visited),
      queue,
      traversalOrder,
      null,
      discovered,
      completed,
      traversedEdges,
      "dequeue",
      `Dequeuing ${current}`,
      "queue.shift()",
      `Node ${current} is removed from the front of the queue.`,
    );

    createStep(
      steps,
      stepNumber++,
      8,
      current,
      null,
      Array.from(visited),
      queue,
      traversalOrder,
      null,
      discovered,
      completed,
      traversedEdges,
      "current",
      `Setting current node to ${current}`,
      "current = queue.shift()",
      `Node ${current} is now the current node being processed.`,
    );

    traversalOrder.push(current);

    createStep(
      steps,
      stepNumber++,
      8,
      current,
      null,
      Array.from(visited),
      queue,
      traversalOrder,
      null,
      discovered,
      completed,
      traversedEdges,
      "traversal",
      `Adding ${current} to traversal order`,
      "traversalOrder.push(current)",
      `Node ${current} is added to the traversal order.`,
    );

    createStep(
      steps,
      stepNumber++,
      10,
      current,
      null,
      Array.from(visited),
      queue,
      traversalOrder,
      null,
      discovered,
      completed,
      traversedEdges,
      "checking-edge",
      `Starting neighbor checks for node ${current}`,
      "for (const neighbor of graph[current])",
      `BFS is checking all neighbors of node ${current}.`,
    );

    for (const neighbor of graph[current] ?? []) {
      const activeEdge: [number, number] = [current, neighbor];

      createStep(
        steps,
        stepNumber++,
        11,
        current,
        neighbor,
        Array.from(visited),
        queue,
        traversalOrder,
        activeEdge,
        discovered,
        completed,
        traversedEdges,
        "checking-edge",
        `Checking edge ${current} → ${neighbor}`,
        `visited.has(${neighbor})`,
        `BFS is checking edge ${current} → ${neighbor}.`,
      );

      if (!visited.has(neighbor)) {
        const condition = `visited.has(${neighbor}) === false`;

        createStep(
          steps,
          stepNumber++,
          11,
          current,
          neighbor,
          Array.from(visited),
          queue,
          traversalOrder,
          activeEdge,
          discovered,
          completed,
          traversedEdges,
          "condition",
          `Checking whether node ${neighbor} was visited`,
          condition,
          `Node ${neighbor} has not been visited, so it is discovered.`,
        );

        visited.add(neighbor);
        if (!discovered.includes(neighbor)) {
          discovered.push(neighbor);
        }

        createStep(
          steps,
          stepNumber++,
          12,
          current,
          neighbor,
          Array.from(visited),
          queue,
          traversalOrder,
          activeEdge,
          discovered,
          completed,
          traversedEdges,
          "discover",
          `Discovering node ${neighbor}`,
          `visited.add(${neighbor})`,
          `Node ${neighbor} is marked as visited and discovered from node ${current}.`,
        );

        traversedEdges.push(activeEdge);

        queue.push(neighbor);

        createStep(
          steps,
          stepNumber++,
          13,
          current,
          neighbor,
          Array.from(visited),
          queue,
          traversalOrder,
          activeEdge,
          discovered,
          completed,
          traversedEdges,
          "enqueue",
          `Enqueuing node ${neighbor}`,
          `queue.push(${neighbor})`,
          `Node ${neighbor} is added to the back of the queue.`,
        );
      } else {
        createStep(
          steps,
          stepNumber++,
          11,
          current,
          neighbor,
          Array.from(visited),
          queue,
          traversalOrder,
          activeEdge,
          discovered,
          completed,
          traversedEdges,
          "skip",
          `Skipping already visited node ${neighbor}`,
          `visited.has(${neighbor}) === true`,
          `Node ${neighbor} has already been visited, so it is skipped.`,
        );
      }
    }

    completed.push(current);

    createStep(
      steps,
      stepNumber++,
      14,
      current,
      null,
      Array.from(visited),
      queue,
      traversalOrder,
      null,
      discovered,
      completed,
      traversedEdges,
      "complete",
      `Finished processing node ${current}`,
      "Neighbors checked",
      `Node ${current} has finished processing and is marked as completed.`,
    );
  }

  createStep(
    steps,
    stepNumber++,
    18,
    null,
    null,
    Array.from(visited),
    queue,
    traversalOrder,
    null,
    discovered,
    completed,
    traversedEdges,
    "complete",
    "BFS traversal completed",
    "queue.length === 0",
    `BFS traversal completed successfully. Traversal order: ${traversalOrder.join(" → ")}.`,
  );

  return steps.map((item, index) => ({
    ...item,
    step: index + 1,
  }));
}

export function getEdgeKey(edge: [number, number]): string {
  return `${edge[0]}-${edge[1]}`;
}

export function getGraphNodes() {
  return BFS_NODES.map((node) => ({ ...node }));
}

export function getGraphEdges() {
  return BFS_EDGES.map((edge) => ({ ...edge }));
}

export function isEdgeActive(
  edge: BFSEdge,
  activeEdge: [number, number] | null,
): boolean {
  return activeEdge !== null && equivalentEdge(edge, activeEdge);
}
