import type { GraphAlgorithm } from "../types";

export const BELLMAN_FORD_DATA: GraphAlgorithm = {
	id: "bellman-ford",
	title: "Bellman–Ford Algorithm",
	description: "Find shortest paths with negative edge weights and detect negative cycles.",
	nodes: [
		{ id: "A", x: 90, y: 90 }, { id: "B", x: 270, y: 90 }, { id: "C", x: 180, y: 230 },
		{ id: "D", x: 390, y: 230 }, { id: "E", x: 270, y: 370 }, { id: "F", x: 510, y: 370 },
	],
	edges: [
		{ from: "A", to: "B", weight: 6 }, { from: "A", to: "C", weight: 7 },
		{ from: "B", to: "C", weight: 8 }, { from: "B", to: "D", weight: 5 },
		{ from: "B", to: "E", weight: -4 }, { from: "C", to: "D", weight: -3 },
		{ from: "C", to: "E", weight: 9 }, { from: "D", to: "B", weight: -2 },
		{ from: "E", to: "D", weight: 7 }, { from: "E", to: "F", weight: 2 },
	],
	sourceCode: [
		"function bellmanFord(graph, start) {",
		"  const dist = initializeDistances(graph);",
		"  dist[start] = 0;",
		"  for (let pass = 1; pass < V; pass++) {",
		"    for (const edge of graph.edges) {",
		"      if (dist[edge.from] !== Infinity) {",
		"        const candidate = dist[edge.from] + edge.weight;",
		"        if (candidate < dist[edge.to]) {",
		"          dist[edge.to] = candidate;",
		"          parent[edge.to] = edge.from;",
		"        }",
		"      }",
		"    }",
		"  }",
		"  if (hasNegativeCycle(graph, dist)) return null;",
		"  return dist;",
		"}",
	],
	start: "A",
	goal: "F",
};