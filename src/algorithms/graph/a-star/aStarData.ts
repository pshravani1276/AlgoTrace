export interface AStarNode {
  id: number;
  label: string;
  x: number;
  y: number;
}

export interface AStarEdge {
  from: number;
  to: number;
  weight: number;
}

export interface AStarStep {
  step: number;
  codeLine: number;
  currentNode: number | null;
  checkingNode: number | null;
  heuristic: number | null;
  visited: number[];
  frontier: Array<{ node: number; g: number; f: number; h: number }>;
  path: number[];
  activeEdge: [number, number] | null;
  completed: number[];
  traversedEdges: [number, number][];
  operation: string;
  condition: string;
  explanation: string;
}

export const A_STAR_NODES: AStarNode[] = [
  { id: 0, label: "A", x: 230, y: 62 },
  { id: 1, label: "B", x: 120, y: 205 },
  { id: 2, label: "C", x: 145, y: 355 },
  { id: 3, label: "D", x: 330, y: 355 },
  { id: 4, label: "E", x: 245, y: 490 },
  { id: 5, label: "F", x: 515, y: 62 },
  { id: 6, label: "G", x: 420, y: 205 },
  { id: 7, label: "H", x: 590, y: 205 },
  { id: 8, label: "I", x: 520, y: 355 },
  { id: 9, label: "J", x: 540, y: 490 },
];

export const A_STAR_EDGES: AStarEdge[] = [
  { from: 0, to: 1, weight: 6 },
  { from: 0, to: 5, weight: 6 },
  { from: 1, to: 2, weight: 3 },
  { from: 1, to: 3, weight: 2 },
  { from: 2, to: 3, weight: 1 },
  { from: 2, to: 4, weight: 5 },
  { from: 3, to: 4, weight: 8 },
  { from: 3, to: 8, weight: 5 },
  { from: 4, to: 9, weight: 5 },
  { from: 5, to: 6, weight: 1 },
  { from: 5, to: 7, weight: 3 },
  { from: 6, to: 7, weight: 2 },
  { from: 6, to: 8, weight: 3 },
  { from: 8, to: 9, weight: 3 },
];

export const A_STAR_HEURISTICS: Record<number, number> = {
  0: 10,
  1: 8,
  2: 5,
  3: 7,
  4: 8,
  5: 3,
  6: 5,
  7: 3,
  8: 7,
  9: 0,
};

export const DEFAULT_A_STAR_GRAPH = A_STAR_EDGES;
export const DEFAULT_A_STAR_START_NODE = 0;
export const DEFAULT_A_STAR_GOAL_NODE = 9;
