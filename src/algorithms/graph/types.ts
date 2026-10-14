export type GraphAlgorithmId =
  | "bellman-ford"
  | "topological-kahn"
  | "topological-dfs"
  | "dag-shortest-path";

export interface GraphNode {
  id: string;
  x: number;
  y: number;
}

export interface GraphEdge {
  from: string;
  to: string;
  weight: number;
}

export interface GraphAlgorithm {
  id: GraphAlgorithmId;
  title: string;
  description: string;
  sourceCode: string[];
  nodes: GraphNode[];
  edges: GraphEdge[];
  start: string;
  goal: string;
}

export interface GraphAlgorithmStep {
  step: number;
  codeLine: number;
  currentNode: string | null;
  checkingNode: string | null;
  distances: Record<string, number>;
  frontier: string[];
  order: string[];
  visited: string[];
  path: string[];
  activeEdge: [string, string] | null;
  traversedEdges: [string, string][];
  operation: string;
  condition: string;
  explanation: string;
}