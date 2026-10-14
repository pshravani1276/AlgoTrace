export interface BFSNode {
  id: number;
  label: string;
  x: number;
  y: number;
}

export interface BFSEdge {
  from: number;
  to: number;
}

export interface BFSStep {
  step: number;
  line: number;
  currentNode: number | null;
  checkingNode: number | null;
  visited: number[];
  queue: number[];
  traversalOrder: number[];
  activeEdge: [number, number] | null;
  discovered: number[];
  completed: number[];
  traversedEdges: [number, number][];
  phase: "start" | "initialize" | "visited" | "empty-check" | "dequeue" | "current" | "traversal" | "checking-edge" | "condition" | "discover" | "enqueue" | "skip" | "complete";
  operation: string;
  condition: string;
  explanation: string;
}

export const BFS_NODES: BFSNode[] = [
  { id: 0, label: "0", x: 330, y: 54 },
  { id: 1, label: "1", x: 190, y: 180 },
  { id: 2, label: "2", x: 470, y: 180 },
  { id: 3, label: "3", x: 110, y: 340 },
  { id: 4, label: "4", x: 290, y: 340 },
  { id: 5, label: "5", x: 540, y: 340 },
  { id: 6, label: "6", x: 410, y: 390 },
];

export const BFS_EDGES: BFSEdge[] = [
  { from: 0, to: 1 },
  { from: 0, to: 2 },
  { from: 1, to: 3 },
  { from: 1, to: 4 },
  { from: 2, to: 5 },
  { from: 4, to: 6 },
];

export const DEFAULT_GRAPH: Record<number, number[]> = {
  0: [1, 2],
  1: [3, 4],
  2: [5],
  3: [],
  4: [6],
  5: [],
  6: [],
};

export const DEFAULT_START_NODE = 0;
