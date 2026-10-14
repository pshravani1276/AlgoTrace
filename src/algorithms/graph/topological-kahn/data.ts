import type { GraphAlgorithm } from "../types";

export const TOPOLOGICAL_KAHN_DATA: GraphAlgorithm = {
	id: "topological-kahn",
	title: "Topological Sorting (Kahn’s Algorithm)",
	description: "Build a valid DAG order by repeatedly removing zero-indegree nodes.",
	nodes: [
		{ id: "A", x: 90, y: 90 }, { id: "B", x: 270, y: 90 }, { id: "C", x: 180, y: 230 },
		{ id: "D", x: 390, y: 230 }, { id: "E", x: 270, y: 370 }, { id: "F", x: 510, y: 370 },
	],
	edges: [
		{ from: "A", to: "B", weight: 2 }, { from: "A", to: "C", weight: 4 },
		{ from: "B", to: "C", weight: 1 }, { from: "B", to: "D", weight: 4 },
		{ from: "C", to: "D", weight: 2 }, { from: "C", to: "E", weight: 3 },
		{ from: "D", to: "E", weight: 1 }, { from: "D", to: "F", weight: 5 },
		{ from: "E", to: "F", weight: 2 },
	],
	sourceCode: [
		"function topologicalSort(graph) {",
		"  const indegree = calculateIndegrees(graph);",
		"  const queue = allZeroIndegreeNodes(indegree);",
		"  const order = [];",
		"  while (queue.length > 0) {",
		"    const node = queue.shift();",
		"    order.push(node);",
		"    for (const next of graph[node]) {",
		"      indegree[next] -= 1;",
		"      if (indegree[next] === 0) {",
		"        queue.push(next);",
		"      }",
		"    }",
		"  }",
		"  if (order.length !== graph.size) return null;",
		"  return order;",
		"}",
	],
	start: "A",
	goal: "F",
};