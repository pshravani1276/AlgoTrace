// ============================================================
// BFS GRAPH ALGORITHM
// AlgoTrace
// ============================================================

export interface GraphNode {
  id: string;
  label: string;
  x: number;
  y: number;
}

export interface GraphEdge {
  from: string;
  to: string;
}

export interface BFSVariables {
  currentNode: string | null;
  activeEdge: string | null;
  queue: string[];
  visited: string[];
  traversal: string[];
}

export interface BFSStep {
  step: number;

  // Graph currently visible on screen
  nodes: GraphNode[];
  edges: GraphEdge[];

  // BFS state
  currentNode: string | null;
  activeEdge: string | null;

  queue: string[];
  visited: string[];
  traversal: string[];

  // UI information
  line: number;
  phase:
    | "ready"
    | "create-node"
    | "visit"
    | "check-neighbor"
    | "enqueue"
    | "complete";

  explanation: string;

  variables: BFSVariables;
}

// ============================================================
// DEFAULT GRAPH
// ============================================================
//
//        A
//       / \
//      B   C
//     / \   \
//    D   E   F
//         \ /
//          G
//
// BFS:
// A → B → C → D → E → F → G
//
// ============================================================

const GRAPH_NODES: GraphNode[] = [
  {
    id: "A",
    label: "A",
    x: 50,
    y: 14,
  },

  {
    id: "B",
    label: "B",
    x: 28,
    y: 38,
  },

  {
    id: "C",
    label: "C",
    x: 72,
    y: 38,
  },

  {
    id: "D",
    label: "D",
    x: 16,
    y: 64,
  },

  {
    id: "E",
    label: "E",
    x: 40,
    y: 64,
  },

  {
    id: "F",
    label: "F",
    x: 78,
    y: 64,
  },

  {
    id: "G",
    label: "G",
    x: 59,
    y: 86,
  },
];

// ============================================================
// BFS ADJACENCY LIST
// ============================================================

const adjacency: Record<string, string[]> = {
  A: ["B", "C"],
  B: ["A", "D", "E"],
  C: ["A", "F"],
  D: ["B"],
  E: ["B", "G"],
  F: ["C", "G"],
  G: ["E", "F"],
};

// ============================================================
// HELPERS
// ============================================================

function cloneNodes(nodes: GraphNode[]): GraphNode[] {
  return nodes.map((node) => ({
    ...node,
  }));
}

function cloneEdges(edges: GraphEdge[]): GraphEdge[] {
  return edges.map((edge) => ({
    ...edge,
  }));
}

function createVariables(
  currentNode: string | null,
  activeEdge: string | null,
  queue: string[],
  visited: string[],
  traversal: string[],
): BFSVariables {
  return {
    currentNode,
    activeEdge,
    queue: [...queue],
    visited: [...visited],
    traversal: [...traversal],
  };
}

// ============================================================
// STEP GENERATOR
// ============================================================

export function generateBFSSteps(): BFSStep[] {
  const steps: BFSStep[] = [];

  let stepNumber = 0;

  // ==========================================================
  // STEP 0
  // ==========================================================
  //
  // Nothing is rendered.
  //
  // This is important for the visualizer.
  //
  // ==========================================================

  steps.push({
    step: stepNumber++,

    nodes: [],

    edges: [],

    currentNode: null,

    activeEdge: null,

    queue: [],

    visited: [],

    traversal: [],

    line: 1,

    phase: "ready",

    explanation:
      "BFS is ready. Press Next to create the starting node A.",

    variables: createVariables(
      null,
      null,
      [],
      [],
      [],
    ),
  });

  // ==========================================================
  // STEP 1
  // CREATE A
  // ==========================================================

  const visibleNodes: GraphNode[] = [
    GRAPH_NODES.find((node) => node.id === "A")!,
  ];
  const visibleEdges: GraphEdge[] = [];
  let currentNode: string | null = null;
  const queue: string[] = ["A"];
  const visited: string[] = [];
  const traversal: string[] = [];

  steps.push({
    step: stepNumber++,

    nodes: cloneNodes(visibleNodes),

    edges: [],

    currentNode: null,

    activeEdge: null,

    queue: [],

    visited: [],

    traversal: [],

    line: 2,

    phase: "create-node",

    explanation:
      "The starting node A is created.",

    variables: createVariables(
      null,
      null,
      [],
      [],
      [],
    ),
  });

  // ==========================================================
  // STEP 2
  // ENQUEUE A
  // ==========================================================

  steps.push({
    step: stepNumber++,

    nodes: cloneNodes(visibleNodes),

    edges: [],

    currentNode: null,

    activeEdge: null,

    queue: [...queue],

    visited: [],

    traversal: [],

    line: 4,

    phase: "enqueue",

    explanation:
      "A is inserted into the BFS queue.",

    variables: createVariables(
      null,
      null,
      queue,
      [],
      [],
    ),
  });

  // ==========================================================
  // BFS EXECUTION
  // ==========================================================

  const created = new Set<string>();

  created.add("A");

  while (queue.length > 0) {
    // --------------------------------------------------------
    // REMOVE FRONT NODE
    // --------------------------------------------------------

    currentNode = queue.shift()!;

    // --------------------------------------------------------
    // VISIT NODE
    // --------------------------------------------------------

    if (!visited.includes(currentNode)) {
      visited.push(currentNode);
      traversal.push(currentNode);

      steps.push({
        step: stepNumber++,

        nodes: cloneNodes(visibleNodes),

        edges: cloneEdges(visibleEdges),

        currentNode,

        activeEdge: null,

        queue: [...queue],

        visited: [...visited],

        traversal: [...traversal],

        line: 6,

        phase: "visit",

        explanation:
          `BFS visits node ${currentNode}.`,

        variables: createVariables(
          currentNode,
          null,
          queue,
          visited,
          traversal,
        ),
      });
    }

    // --------------------------------------------------------
    // CHECK EACH NEIGHBOR
    // --------------------------------------------------------

    const neighbors = adjacency[currentNode] ?? [];

    for (const neighbor of neighbors) {
      const edgeKey =
        `${currentNode}-${neighbor}`;

      // ------------------------------------------------------
      // CHECK WHETHER NODE ALREADY EXISTS
      // ------------------------------------------------------

      if (!created.has(neighbor)) {
        // ----------------------------------------------------
        // SHOW EDGE
        // ----------------------------------------------------

        const edgeAlreadyExists =
          visibleEdges.some(
            (edge) =>
              (edge.from === currentNode &&
                edge.to === neighbor) ||
              (edge.from === neighbor &&
                edge.to === currentNode),
          );

        if (!edgeAlreadyExists) {
          visibleEdges.push({
            from: currentNode,
            to: neighbor,
          });
        }

        // ----------------------------------------------------
        // CREATE NEIGHBOR NODE
        // ----------------------------------------------------

        const node =
          GRAPH_NODES.find(
            (item) => item.id === neighbor,
          );

        if (node) {
          visibleNodes.push({
            ...node,
          });

          created.add(neighbor);

          steps.push({
            step: stepNumber++,

            nodes: cloneNodes(visibleNodes),

            edges: cloneEdges(visibleEdges),

            currentNode,

            activeEdge: edgeKey,

            queue: [...queue],

            visited: [...visited],

            traversal: [...traversal],

            line: 8,

            phase: "create-node",

            explanation:
              `Node ${neighbor} is discovered from ${currentNode}.`,

            variables: createVariables(
              currentNode,
              edgeKey,
              queue,
              visited,
              traversal,
            ),
          });
        }

        // ----------------------------------------------------
        // ENQUEUE NODE
        // ----------------------------------------------------

        queue.push(neighbor);

        steps.push({
          step: stepNumber++,

          nodes: cloneNodes(visibleNodes),

          edges: cloneEdges(visibleEdges),

          currentNode,

          activeEdge: edgeKey,

          queue: [...queue],

          visited: [...visited],

          traversal: [...traversal],

          line: 10,

          phase: "enqueue",

          explanation:
            `Node ${neighbor} is added to the queue.`,

          variables: createVariables(
            currentNode,
            edgeKey,
            queue,
            visited,
            traversal,
          ),
        });
      } else {
        // ----------------------------------------------------
        // EXISTING NODE
        // ----------------------------------------------------

        const edgeAlreadyExists =
          visibleEdges.some(
            (edge) =>
              (edge.from === currentNode &&
                edge.to === neighbor) ||
              (edge.from === neighbor &&
                edge.to === currentNode),
          );

        if (!edgeAlreadyExists) {
          visibleEdges.push({
            from: currentNode,
            to: neighbor,
          });
        }

        // ----------------------------------------------------
        // CHECK EXISTING NODE
        // ----------------------------------------------------

        steps.push({
          step: stepNumber++,

          nodes: cloneNodes(visibleNodes),

          edges: cloneEdges(visibleEdges),

          currentNode,

          activeEdge: edgeKey,

          queue: [...queue],

          visited: [...visited],

          traversal: [...traversal],

          line: 8,

          phase: "check-neighbor",

          explanation:
            `BFS checks ${neighbor}, but it has already been discovered.`,

          variables: createVariables(
            currentNode,
            edgeKey,
            queue,
            visited,
            traversal,
          ),
        });
      }
    }

    // --------------------------------------------------------
    // CLEAR ACTIVE EDGE
    // --------------------------------------------------------

    steps.push({
      step: stepNumber++,

      nodes: cloneNodes(visibleNodes),

      edges: cloneEdges(visibleEdges),

      currentNode,

      activeEdge: null,

      queue: [...queue],

      visited: [...visited],

      traversal: [...traversal],

      line: 12,

      phase: "check-neighbor",

      explanation:
        `Finished checking the neighbors of ${currentNode}.`,

      variables: createVariables(
        currentNode,
        null,
        queue,
        visited,
        traversal,
      ),
    });
  }

  // ==========================================================
  // FINAL STEP
  // ==========================================================

  steps.push({
    step: stepNumber,

    nodes: cloneNodes(visibleNodes),

    edges: cloneEdges(visibleEdges),

    currentNode: null,

    activeEdge: null,

    queue: [],

    visited: [...visited],

    traversal: [...traversal],

    line: 15,

    phase: "complete",

    explanation:
      `BFS complete. Traversal order: ${traversal.join(
        " → ",
      )}.`,

    variables: createVariables(
      null,
      null,
      [],
      visited,
      traversal,
    ),
  });

  return steps;
}

// ============================================================
// DEFAULT EXPORT
// ============================================================

export default generateBFSSteps;