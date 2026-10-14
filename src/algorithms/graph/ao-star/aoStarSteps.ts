import {
  AO_STAR_EDGES,
  AO_STAR_HEURISTICS,
  AO_STAR_NODES,
  DEFAULT_AO_STAR_GRAPH,
  DEFAULT_AO_STAR_START_NODE,
  type AoStarEdge,
  type AoStarStep,
} from "./aoStarData";

export const AO_STAR_SOURCE_CODE = [
  "function estimate(node) {",
  "  const orCost = min(weight + childCost);",
  "  const andCost = sum(weight + childCost);",
  "  return min(orCost, andCost);",
  "}",
  "",
  "function aoStar(root) {",
  "  while (!isSolved(root)) {",
  "    const leaf = selectBestUnsolvedLeaf(root);",
  "    expandOrSolve(leaf);",
  "    backPropagateCosts(leaf, root);",
  "  }",
  "  return bestSolutionGraph(root);",
  "}",
];

type FrontierItem = AoStarStep["frontier"][number];

interface NodeEstimate {
  cost: number;
  selectedEdges: AoStarEdge[];
  condition: string;
}

const cloneFrontier = (frontier: FrontierItem[]) => frontier.map((item) => ({ ...item }));

function getCodeLinesForOperation(operation: string): number[] {
  if (operation.startsWith("AO* solution") || operation === "AO* stopped") return [13, 14];
  if (operation === "Loop condition") return [12, 8];
  if (operation === "Initialize AO*") return [7, 8];
  if (operation.startsWith("Select ")) return [9];
  if (operation.startsWith("Expand ")) return [10, 1, 2, 3, 4, 5];
  if (operation.startsWith("Back up ")) return [11, 1, 2, 3, 4, 5];
  return [10];
}

function addStep(
  steps: AoStarStep[],
  step: number,
  codeLine: number,
  currentNode: number | null,
  checkingNode: number | null,
  visited: number[],
  solved: number[],
  frontier: FrontierItem[],
  path: number[],
  activeEdge: [number, number] | null,
  operation: string,
  condition: string,
  explanation: string,
): void {
  steps.push({
    step,
    codeLine,
    currentNode,
    checkingNode,
    visited: [...visited],
    solved: [...solved],
    frontier: cloneFrontier(frontier),
    path: [...path],
    activeEdge,
    operation,
    condition,
    explanation,
  });
}

function getLabel(nodeId: number): string {
  return AO_STAR_NODES.find((node) => node.id === nodeId)?.label ?? String(nodeId);
}

function getFrontierItem(edge: AoStarEdge, estimates: Map<number, number>): FrontierItem {
  const h = AO_STAR_HEURISTICS[edge.to] ?? 0;
  const g = edge.weight;
  return { node: edge.to, g, h, f: g + (estimates.get(edge.to) ?? h), kind: edge.group };
}

function createEstimator(adjacency: Map<number, AoStarEdge[]>) {
  const estimates = new Map<number, number>(Object.entries(AO_STAR_HEURISTICS).map(([id, h]) => [Number(id), h]));
  const expanded = new Set<number>();

  function estimate(nodeId: number): NodeEstimate {
    const children = adjacency.get(nodeId) ?? [];
    if (!expanded.has(nodeId) || children.length === 0) {
      return {
        cost: estimates.get(nodeId) ?? AO_STAR_HEURISTICS[nodeId] ?? 0,
        selectedEdges: [],
        condition: `h(${getLabel(nodeId)}) = ${estimates.get(nodeId) ?? AO_STAR_HEURISTICS[nodeId] ?? 0}`,
      };
    }

    const orEdges = children.filter((edge) => edge.group === "OR");
    const andEdges = children.filter((edge) => edge.group === "AND");
    const options: NodeEstimate[] = [];

    if (orEdges.length > 0) {
      const costs = orEdges.map((edge) => edge.weight + (estimates.get(edge.to) ?? AO_STAR_HEURISTICS[edge.to] ?? 0));
      const bestIndex = costs.indexOf(Math.min(...costs));
      const edge = orEdges[bestIndex];
      options.push({
        cost: costs[bestIndex],
        selectedEdges: [edge],
        condition: `OR: min(${orEdges.map((item) => `${getLabel(item.to)}=${item.weight}+${estimates.get(item.to) ?? AO_STAR_HEURISTICS[item.to] ?? 0}`).join(", ")}) = ${costs[bestIndex]}`,
      });
    }

    if (andEdges.length > 0) {
      const terms = andEdges.map((edge) => edge.weight + (estimates.get(edge.to) ?? AO_STAR_HEURISTICS[edge.to] ?? 0));
      options.push({
        cost: terms.reduce((total, cost) => total + cost, 0),
        selectedEdges: andEdges,
        condition: `AND: ${andEdges.map((edge) => `${getLabel(edge.to)}=${edge.weight}+${estimates.get(edge.to) ?? AO_STAR_HEURISTICS[edge.to] ?? 0}`).join(" + ")} = ${terms.reduce((total, cost) => total + cost, 0)}`,
      });
    }

    const best = options.reduce((currentBest, option) =>
      option.cost < currentBest.cost ||
      (option.cost === currentBest.cost && option.selectedEdges[0]?.group === "AND")
        ? option
        : currentBest,
    );
    estimates.set(nodeId, best.cost);
    return { ...best, condition: `${options.map((option) => option.condition).join("; ")} → best = ${best.cost}` };
  }

  return { estimate, estimates, expanded };
}

export function generateAOStarSteps(
  edges: AoStarEdge[] = DEFAULT_AO_STAR_GRAPH,
  start: number = DEFAULT_AO_STAR_START_NODE,
): AoStarStep[] {
  const adjacency = new Map<number, AoStarEdge[]>();
  for (const edge of edges) {
    const children = adjacency.get(edge.from) ?? [];
    children.push(edge);
    adjacency.set(edge.from, children);
  }

  const { estimate, estimates, expanded } = createEstimator(adjacency);
  const steps: AoStarStep[] = [];
  const visited = new Set<number>();
  const solved = new Set<number>();
  let stepNumber = 1;

  const pathTo = (target: number, node = start, path: number[] = [start]): number[] | null => {
    if (node === target) return path;
    for (const edge of estimate(node).selectedEdges) {
      const childPath = pathTo(target, edge.to, [...path, edge.to]);
      if (childPath) return childPath;
    }
    return null;
  };

  const solutionNodes = (node = start, seen = new Set<number>()): number[] => {
    if (seen.has(node)) return [];
    seen.add(node);
    return [node, ...estimate(node).selectedEdges.flatMap((edge) => solutionNodes(edge.to, seen))];
  };

  const findNextUnsolvedLeaf = (node = start, trail = new Set<number>()): number | null => {
    if (trail.has(node) || solved.has(node)) return null;
    const nextTrail = new Set(trail).add(node);
    const children = adjacency.get(node) ?? [];
    if (children.length === 0) return node;
    if (!expanded.has(node)) return node;
    for (const edge of estimate(node).selectedEdges) {
      const next = findNextUnsolvedLeaf(edge.to, nextTrail);
      if (next !== null) return next;
    }
    return null;
  };

  const record = (
    currentNode: number | null,
    checkingNode: number | null,
    frontier: FrontierItem[],
    path: number[],
    activeEdge: [number, number] | null,
    operation: string,
    condition: string,
    explanation: string,
  ) => {
    for (const codeLine of getCodeLinesForOperation(operation)) {
      const sourceLine = AO_STAR_SOURCE_CODE[codeLine - 1]?.trim();
      addStep(
        steps,
        stepNumber++,
        codeLine,
        currentNode,
        checkingNode,
        [...visited],
        [...solved],
        frontier,
        path,
        activeEdge,
        `${operation} · line ${codeLine}`,
        `${condition} · source line ${codeLine}`,
        `Executing line ${codeLine}: ${sourceLine}. ${explanation}`,
      );
    }
  };

  record(
    null,
    null,
    [{ node: start, g: 0, h: AO_STAR_HEURISTICS[start] ?? 0, f: AO_STAR_HEURISTICS[start] ?? 0, kind: "OR" }],
    [],
    null,
    "Initialize AO*",
    `start = ${getLabel(start)}`,
    `Begin at ${getLabel(start)} with heuristic h = ${AO_STAR_HEURISTICS[start] ?? 0}.`,
  );

  const maxIterations = Math.max(1, edges.length + Object.keys(AO_STAR_HEURISTICS).length + 1);
  for (let iteration = 0; iteration < maxIterations; iteration += 1) {
    const current = findNextUnsolvedLeaf();
    if (current === null) break;

    const currentPath = pathTo(current) ?? [start, current];
    const children = adjacency.get(current) ?? [];
    visited.add(current);

    record(
      current,
      null,
      [],
      currentPath,
      null,
      `Select ${getLabel(current)}`,
      `estimated cost = ${estimates.get(current) ?? AO_STAR_HEURISTICS[current] ?? 0}`,
      `Select ${getLabel(current)} as the best unsolved leaf on the current partial solution graph.`,
    );

    if (children.length === 0) {
      solved.add(current);
      record(
        current,
        null,
        [],
        currentPath,
        null,
        `Resolve terminal ${getLabel(current)}`,
        `h(${getLabel(current)}) = ${estimates.get(current) ?? AO_STAR_HEURISTICS[current] ?? 0}`,
        `${getLabel(current)} has no successors, so its terminal estimate is retained and the node is marked solved.`,
      );
    } else {
      expanded.add(current);
      const frontier = children.map((edge) => getFrontierItem(edge, estimates));
      const currentEstimate = estimate(current);
      record(
        current,
        null,
        frontier,
        currentPath,
        null,
        `Expand ${getLabel(current)}`,
        currentEstimate.condition,
        `Compare the available OR and AND decompositions using edge cost plus heuristic. AO* currently selects ${currentEstimate.selectedEdges.map((edge) => getLabel(edge.to)).join(" + ")} with estimated cost ${currentEstimate.cost}.`,
      );

      for (const edge of children) {
        record(
          current,
          edge.to,
          frontier,
          [...currentPath, edge.to],
          [edge.from, edge.to],
          `Inspect ${getLabel(edge.from)} → ${getLabel(edge.to)}`,
          `${edge.group}; edge cost = ${edge.weight}; h = ${AO_STAR_HEURISTICS[edge.to] ?? 0}`,
          `${edge.group === "AND" ? "This successor is required with the other AND successors" : "This successor is an alternative"}; its current estimated total is ${edge.weight + (estimates.get(edge.to) ?? AO_STAR_HEURISTICS[edge.to] ?? 0)}.`,
        );
      }
    }

    for (let index = currentPath.length - 1; index >= 0; index -= 1) {
      const node = currentPath[index];
      if (!expanded.has(node)) continue;

      const nodeEstimate = estimate(node);
      const allSelectedChildrenSolved = nodeEstimate.selectedEdges.length > 0 && nodeEstimate.selectedEdges.every((edge) => solved.has(edge.to));
      if (allSelectedChildrenSolved) solved.add(node);
      else solved.delete(node);

      record(
        node,
        null,
        [],
        solutionNodes(),
        null,
        `Back up ${getLabel(node)}`,
        nodeEstimate.condition,
        `Update ${getLabel(node)} to estimated cost ${nodeEstimate.cost}; the best partial solution currently contains ${nodeEstimate.selectedEdges.map((edge) => getLabel(edge.to)).join(nodeEstimate.selectedEdges.some((edge) => edge.group === "AND") ? " + " : "") || "no expanded successors"}.`,
      );
    }

    record(
      start,
      null,
      [],
      solutionNodes(),
      null,
      "Loop condition",
      solved.has(start) ? "root solved; exit loop" : "root unsolved; continue loop",
      solved.has(start) ? "The loop condition is now false, so AO* proceeds to return the solution graph." : "The root is not solved yet, so AO* begins another iteration.",
    );

    if (solved.has(start)) break;
  }

  const finalEstimate = estimate(start);
  record(
    start,
    null,
    [],
    solutionNodes(),
    null,
    solved.has(start) ? "AO* solution found" : "AO* stopped",
    `estimated cost = ${finalEstimate.cost}`,
    solved.has(start)
      ? `The selected solution graph is solved with total estimated cost ${finalEstimate.cost}.`
      : "No further unsolved node was reachable on the current best partial solution.",
  );

  return steps;
}

export function getAOStarNodes() {
  return AO_STAR_NODES.map((node) => ({ ...node }));
}

export function getAOStarEdges() {
  return AO_STAR_EDGES.map((edge) => ({ ...edge }));
}

export function isAOStarEdgeActive(
  edge: AoStarEdge,
  activeEdge: [number, number] | null,
): boolean {
  return activeEdge !== null &&
    ((edge.from === activeEdge[0] && edge.to === activeEdge[1]) ||
      (edge.from === activeEdge[1] && edge.to === activeEdge[0]));
}