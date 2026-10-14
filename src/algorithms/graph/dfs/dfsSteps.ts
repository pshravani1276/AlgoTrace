import {
  DEFAULT_DFS_GRAPH,
  DEFAULT_DFS_START_NODE,
  DFS_EDGES,
  DFS_NODES,
  type DFSEdge,
  type DFSStep,
} from "./dfsData";

export const DFS_SOURCE_CODE = [
  "function dfs(graph, start) {",
  "  const stack = [start];",
  "  const visited = new Set([start]);",
  "  const traversal = [];",
  "",
  "  while (stack.length > 0) {",
  "    const current = stack.pop();",
  "    traversal.push(current);",
  "",
  "    for (const neighbor of graph[current]) {",
  "      if (!visited.has(neighbor)) {",
  "        visited.add(neighbor);",
  "        stack.push(neighbor);",
  "      }",
  "    }",
  "  }",
  "",
  "  return traversal;",
  "}",
];

const clone = <T,>(items: T[]): T[] => [...items];
const getNodeLabel = (node: number): string =>
  DFS_NODES.find((item) => item.id === node)?.label ?? String(node);

function addLineSteps(
  steps: DFSStep[],
  stepNumber: number,
  codeLines: number[],
  state: Omit<DFSStep, "step" | "codeLine">,
): number {
  for (const codeLine of codeLines) {
    const sourceLine = DFS_SOURCE_CODE[codeLine - 1]?.trim();
    steps.push({
      ...state,
      step: stepNumber,
      codeLine,
      stack: clone(state.stack),
      visited: clone(state.visited),
      traversalOrder: clone(state.traversalOrder),
      discovered: clone(state.discovered),
      completed: clone(state.completed),
      traversedEdges: state.traversedEdges.map(([from, to]) => [from, to]),
      operation: `${state.operation} · line ${codeLine}`,
      condition: `${state.condition} · source line ${codeLine}`,
      explanation: `Executing line ${codeLine}: ${sourceLine}. ${state.explanation}`,
    });
    stepNumber += 1;
  }
  return stepNumber;
}

const equivalentEdge = (
  edge: DFSEdge,
  activeEdge: [number, number] | null,
): boolean =>
  activeEdge !== null &&
  ((edge.from === activeEdge[0] && edge.to === activeEdge[1]) ||
    (edge.from === activeEdge[1] && edge.to === activeEdge[0]));

export function generateDFSSteps(
  graph: Record<number, number[]> = DEFAULT_DFS_GRAPH,
  start: number = DEFAULT_DFS_START_NODE,
): DFSStep[] {
  const steps: DFSStep[] = [];
  const stack = [start];
  const visited = new Set<number>([start]);
  const traversalOrder: number[] = [];
  const discovered = [start];
  const completed: number[] = [];
  const traversedEdges: [number, number][] = [];
  let stepNumber = 1;

  const record = (
    codeLines: number[],
    operation: string,
    condition: string,
    explanation: string,
    currentNode: number | null = null,
    checkingNode: number | null = null,
    activeEdge: [number, number] | null = null,
  ) => {
    stepNumber = addLineSteps(steps, stepNumber, codeLines, {
      currentNode,
      checkingNode,
      visited: Array.from(visited),
      stack,
      traversalOrder,
      activeEdge,
      discovered,
      completed,
      traversedEdges,
      operation,
      condition,
      explanation,
    });
  };

  record([1], "Enter DFS", "dfs(graph, start)", "Depth-first search starts at the selected node.");
  record([2], "Initialize stack", `stack = [${getNodeLabel(start)}]`, "Push the starting node onto the stack.");
  record([3], "Initialize visited", `visited = {${getNodeLabel(start)}}`, "Mark the start as discovered to avoid pushing it again.");
  record([4], "Initialize traversal", "traversal = []", "Create an empty list for pop order.");

  record([6], "Check while condition", `stack.length (${stack.length}) > 0`, "The stack is nonempty, so enter the DFS loop.");

  while (stack.length > 0) {
    const current = stack.pop()!;
    record([7], `Pop ${getNodeLabel(current)}`, `stack.pop() = ${getNodeLabel(current)}`, `Remove ${getNodeLabel(current)} from the top of the stack.`, current);
    traversalOrder.push(current);
    record([8], `Visit ${getNodeLabel(current)}`, `traversal.push(${getNodeLabel(current)})`, `Append ${getNodeLabel(current)} to the traversal order.`, current);

    const neighbors = [...(graph[current] ?? [])].reverse();
    record([10], `Start neighbors of ${getNodeLabel(current)}`, `graph[${getNodeLabel(current)}] = [${neighbors.map(getNodeLabel).join(", ")}]`, `Begin checking ${getNodeLabel(current)}'s neighbors in DFS order.`, current);
    for (const neighbor of neighbors) {
      const activeEdge: [number, number] = [current, neighbor];
      record(
        [11],
        `Check ${getNodeLabel(neighbor)}`,
        `visited.has(${getNodeLabel(neighbor)}) = ${visited.has(neighbor)}`,
        visited.has(neighbor) ? `${getNodeLabel(neighbor)} was already discovered; do not push it again.` : `${getNodeLabel(neighbor)} is new and will be marked and pushed.`,
        current,
        neighbor,
        activeEdge,
      );

      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        discovered.push(neighbor);
        record([12], `Mark ${getNodeLabel(neighbor)} visited`, `visited.add(${getNodeLabel(neighbor)})`, `Mark ${getNodeLabel(neighbor)} visited before adding it to the stack.`, current, neighbor, activeEdge);
        stack.push(neighbor);
        traversedEdges.push(activeEdge);
        record([13], `Push ${getNodeLabel(neighbor)}`, `stack.push(${getNodeLabel(neighbor)})`, `Push ${getNodeLabel(neighbor)} so it will be explored by DFS.`, current, neighbor, activeEdge);
      }

      record([14], `Finish check ${getNodeLabel(neighbor)}`, `end if (${getNodeLabel(neighbor)})`, `Finish processing the visited check for ${getNodeLabel(neighbor)}.`, current, neighbor, activeEdge);
    }

    record([15], `Finish neighbors of ${getNodeLabel(current)}`, "end for", `All neighbors of ${getNodeLabel(current)} have been checked.`, current);
    completed.push(current);
    record([16], `Complete ${getNodeLabel(current)}`, "end while body", `${getNodeLabel(current)} is fully explored.`, current);

    record(
      [6],
      "Check while condition",
      `stack.length (${stack.length}) > 0`,
      stack.length > 0 ? "The stack still has nodes; start the next DFS iteration." : "The stack is empty, so exit the DFS loop.",
      current,
    );
  }

  record([18], "Return traversal", `return [${traversalOrder.map(getNodeLabel).join(", ")}]`, `DFS returns traversal order ${traversalOrder.map(getNodeLabel).join(" → ")}.`);
  record([19], "Exit DFS function", "end function", "The DFS function has returned.");

  return steps;
}

export function getDFGraphNodes() {
  return DFS_NODES.map((node) => ({ ...node }));
}

export function getDFGraphEdges() {
  return DFS_EDGES.map((edge) => ({ ...edge }));
}

export function isDFEdgeActive(
  edge: DFSEdge,
  activeEdge: [number, number] | null,
): boolean {
  return equivalentEdge(edge, activeEdge);
}
