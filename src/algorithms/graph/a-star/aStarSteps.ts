import {
  A_STAR_EDGES,
  A_STAR_HEURISTICS,
  A_STAR_NODES,
  DEFAULT_A_STAR_GOAL_NODE,
  DEFAULT_A_STAR_GRAPH,
  DEFAULT_A_STAR_START_NODE,
  type AStarEdge,
  type AStarStep,
} from "./aStarData";

export const A_STAR_SOURCE_CODE = [
  "function aStar(graph, start, goal, heuristic) {",
  "  const open = [{ node: start, g: 0, f: heuristic(start) }];",
  "  const bestCost = new Map([[start, 0]]);",
  "",
  "  while (open.length > 0) {",
  "    const current = popLowestCost(open);",
  "    if (current.node === goal) return reconstructPath(current);",
  "",
  "    for (const edge of graph[current.node]) {",
  "      const tentative = current.g + edge.weight;",
  "      if (tentative < bestCost.get(edge.to)) {",
  "        bestCost.set(edge.to, tentative);",
  "        open.push({ node: edge.to, g: tentative, f: tentative + heuristic(edge.to) });",
  "      }",
  "    }",
  "  }",
  "",
  "  return null;",
  "}",
];

const cloneFrontier = (
  frontier: Array<{ node: number; g: number; f: number; h: number }>,
) => frontier.map((item) => ({ ...item }));

function addStep(
  steps: AStarStep[],
  step: number,
  codeLine: number,
  currentNode: number | null,
  checkingNode: number | null,
  heuristic: number | null,
  visited: number[],
  frontier: Array<{ node: number; g: number; f: number; h: number }>,
  path: number[],
  activeEdge: [number, number] | null,
  completed: number[],
  traversedEdges: [number, number][],
  operation: string,
  condition: string,
  explanation: string,
): void {
  steps.push({
    step,
    codeLine,
    currentNode,
    checkingNode,
    heuristic,
    visited: [...visited],
    frontier: cloneFrontier(frontier),
    path: [...path],
    activeEdge,
    completed: [...completed],
    traversedEdges: traversedEdges.map(([from, to]) => [from, to]),
    operation,
    condition,
    explanation,
  });
}

function reconstructPath(
  current: number,
  cameFrom: Record<number, number>,
  start: number,
): number[] {
  const path = [current];
  let node = current;
  while (node !== start) {
    node = cameFrom[node];
    path.unshift(node);
  }
  return path;
}

export function generateAStarSteps(
  edges: AStarEdge[] = DEFAULT_A_STAR_GRAPH,
  start: number = DEFAULT_A_STAR_START_NODE,
  goal: number = DEFAULT_A_STAR_GOAL_NODE,
): AStarStep[] {
  const adjacency = new Map<number, Array<AStarEdge>>();
  for (const edge of edges) {
    const existing = adjacency.get(edge.from) ?? [];
    existing.push(edge);
    adjacency.set(edge.from, existing);

    const reverseEdges = adjacency.get(edge.to) ?? [];
    reverseEdges.push({ from: edge.to, to: edge.from, weight: edge.weight });
    adjacency.set(edge.to, reverseEdges);
  }

  const heuristics = A_STAR_HEURISTICS;
  const bestCost = new Map<number, number>([[start, 0]]);
  const cameFrom: Record<number, number> = {};
  const visited: number[] = [];
  const completed: number[] = [];
  const traversedEdges: [number, number][] = [];
  let frontier = [
    {
      node: start,
      g: 0,
      f: heuristics[start] ?? 0,
      h: heuristics[start] ?? 0,
    },
  ];
  const steps: AStarStep[] = [];
  let stepNumber = 1;

  const record = (
    codeLine: number,
    currentNode: number | null,
    checkingNode: number | null,
    heuristic: number | null,
    path: number[],
    activeEdge: [number, number] | null,
    operation: string,
    condition: string,
    explanation: string,
  ) => {
    addStep(
      steps,
      stepNumber++,
      codeLine,
      currentNode,
      checkingNode,
      heuristic,
      visited,
      frontier,
      path,
      activeEdge,
      completed,
      traversedEdges,
      `${operation} · line ${codeLine}`,
      `${condition} · source line ${codeLine}`,
      `Executing line ${codeLine}: ${A_STAR_SOURCE_CODE[codeLine - 1]?.trim()}. ${explanation}`,
    );
  };

  record(1, null, null, null, [], null, "Enter A*", "aStar(graph, start, goal, heuristic)", "Start the A* search function.");
  record(2, null, null, null, [], null, "Initialize open set", `open = [${start}]`, `Add the start node with g = 0 and f = h(${start}) = ${heuristics[start] ?? 0}.`);
  record(3, null, null, null, [], null, "Initialize best cost", `bestCost[${start}] = 0`, "Record the lowest known cost to reach the start node.");

  while (frontier.length > 0) {
    record(5, null, null, null, [], null, "Check open set", `open.length = ${frontier.length} > 0`, "The open set contains a node, so continue the search loop.");
    const current = frontier
      .slice()
      .sort((left, right) => left.f - right.f || left.g - right.g)[0];
    if (!current) break;

    frontier = frontier.filter((item) => item.node !== current.node);
    visited.push(current.node);
    completed.push(current.node);

    record(6, current.node, null, current.h, reconstructPath(current.node, cameFrom, start), null, `Pop node ${current.node}`, `popLowestCost(open) = ${current.node}`, `Remove the node with the lowest f = ${current.f} (g = ${current.g}, h = ${current.h}).`);
    const goalReached = current.node === goal;
    const goalPath = goalReached ? reconstructPath(current.node, cameFrom, start) : [];
    record(7, current.node, null, current.h, goalPath.length > 0 ? goalPath : reconstructPath(current.node, cameFrom, start), null, goalReached ? "Return goal path" : "Check goal", `${current.node} === ${goal}: ${goalReached}`, goalReached ? `The goal was reached; return path ${goalPath.join(" → ")}.` : "The current node is not the goal; inspect its outgoing edges.");

    if (goalReached) {
      return steps;
    }

    for (const edge of adjacency.get(current.node) ?? []) {
      const activeEdge: [number, number] = [edge.from, edge.to];
      record(9, current.node, edge.to, current.h, reconstructPath(current.node, cameFrom, start), activeEdge, `Iterate edge ${edge.from} → ${edge.to}`, `edge.to = ${edge.to}`, "Inspect the next outgoing edge from the current node.");

      const tentativeCost = current.g + edge.weight;
      const previousBest = bestCost.get(edge.to);
      record(10, current.node, edge.to, current.h, reconstructPath(current.node, cameFrom, start), activeEdge, `Calculate cost to ${edge.to}`, `tentative = ${current.g} + ${edge.weight} = ${tentativeCost}`, "Add the current path cost and this edge's weight.");

      const improvesBest = previousBest === undefined || tentativeCost < previousBest;
      record(11, current.node, edge.to, current.h, reconstructPath(current.node, cameFrom, start), activeEdge, `Compare cost for ${edge.to}`, `${tentativeCost} < ${previousBest ?? "∞"}: ${improvesBest}`, improvesBest ? "This route improves the best known cost." : "This route is not better; skip the cost update and push.");

      if (improvesBest) {
        bestCost.set(edge.to, tentativeCost);
        cameFrom[edge.to] = current.node;
        record(12, current.node, edge.to, current.h, reconstructPath(edge.to, cameFrom, start), activeEdge, `Update best cost for ${edge.to}`, `bestCost[${edge.to}] = ${tentativeCost}`, `Save ${tentativeCost} as the best known cost to node ${edge.to}.`);

        const h = heuristics[edge.to] ?? 0;
        const candidate = { node: edge.to, g: tentativeCost, f: tentativeCost + h, h };
        frontier.push(candidate);
        traversedEdges.push(activeEdge);
        record(13, current.node, edge.to, current.h, reconstructPath(edge.to, cameFrom, start), activeEdge, `Push node ${edge.to}`, `g = ${tentativeCost}; h = ${h}; f = ${candidate.f}`, `Add node ${edge.to} to open with priority f = g + h = ${candidate.f}.`);
      }

      record(14, current.node, edge.to, current.h, reconstructPath(edge.to, cameFrom, start), activeEdge, `Finish edge ${edge.from} → ${edge.to}`, `end if (${improvesBest ? "updated" : "not improved"})`, "Finish processing this edge's cost condition.");
    }

    record(15, current.node, null, current.h, reconstructPath(current.node, cameFrom, start), null, `Finish edges of ${current.node}`, "end for", "All outgoing edges of the current node have been checked.");
    record(16, current.node, null, current.h, reconstructPath(current.node, cameFrom, start), null, "Finish search iteration", "end while body", "Finish this iteration and check the open set again.");
  }

  record(5, null, null, null, [], null, "Exit search loop", "open.length = 0", "There are no more candidates; the search loop ends.");
  record(16, null, null, null, [], null, "Close search loop", "end while", "The while loop is complete.");
  record(18, null, null, null, [], null, "Return no path", "open is empty and goal was not reached", "No path from the start node to the goal was found.");
  record(19, null, null, null, [], null, "Exit A* function", "end function", "The A* function returns with no path.");

  return steps;
}

export function getAStarNodes() {
  return A_STAR_NODES.map((node) => ({ ...node }));
}

export function getAStarEdges() {
  return A_STAR_EDGES.map((edge) => ({ ...edge }));
}

export function isAStarEdgeActive(
  edge: AStarEdge,
  activeEdge: [number, number] | null,
): boolean {
  return activeEdge !== null &&
    ((edge.from === activeEdge[0] && edge.to === activeEdge[1]) ||
      (edge.from === activeEdge[1] && edge.to === activeEdge[0]));
}
