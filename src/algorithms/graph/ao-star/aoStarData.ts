export interface AoStarNode {
  id: number;
  label: string;
  x: number;
  y: number;
}

export interface AoStarEdge {
  from: number;
  to: number;
  weight: number;
  group: "OR" | "AND";
}

export interface AoStarStep {
  step: number;
  codeLine: number;
  currentNode: number | null;
  checkingNode: number | null;
  visited: number[];
  solved: number[];
  frontier: Array<{ node: number; g: number; f: number; h: number; kind: "OR" | "AND" }>;
  path: number[];
  activeEdge: [number, number] | null;
  operation: string;
  condition: string;
  explanation: string;
}

export const AO_STAR_NODES: AoStarNode[] = [
  { id: 0, label: "A", x: 330, y: 60 },
  { id: 1, label: "B", x: 180, y: 180 },
  { id: 2, label: "C", x: 330, y: 180 },
  { id: 3, label: "D", x: 500, y: 180 },
  { id: 4, label: "E", x: 110, y: 330 },
  { id: 5, label: "F", x: 250, y: 330 },
  { id: 6, label: "G", x: 330, y: 330 },
  { id: 7, label: "H", x: 415, y: 330 },
  { id: 8, label: "I", x: 500, y: 330 },
  { id: 9, label: "J", x: 620, y: 330 },
];

export const AO_STAR_EDGES: AoStarEdge[] = [
  { from: 0, to: 1, weight: 1, group: "OR" },
  { from: 0, to: 2, weight: 1, group: "AND" },
  { from: 0, to: 3, weight: 1, group: "AND" },
  { from: 1, to: 4, weight: 1, group: "OR" },
  { from: 1, to: 5, weight: 1, group: "OR" },
  { from: 2, to: 6, weight: 1, group: "OR" },
  { from: 2, to: 7, weight: 1, group: "AND" },
  { from: 2, to: 8, weight: 1, group: "AND" },
  { from: 3, to: 9, weight: 1, group: "OR" },
];

export const AO_STAR_HEURISTICS: Record<number, number> = {
  0: 0,
  1: 5,
  2: 2,
  3: 4,
  4: 7,
  5: 9,
  6: 3,
  7: 0,
  8: 0,
  9: 0,
};

export const DEFAULT_AO_STAR_GRAPH = AO_STAR_EDGES;
export const DEFAULT_AO_STAR_START_NODE = 0;
export const DEFAULT_AO_STAR_GOAL_NODE = 0;
