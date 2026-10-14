import type { GraphAlgorithm } from "../types";

export const DAG_SHORTEST_PATH_DATA: GraphAlgorithm = {
	id: "dag-shortest-path",
	title: "Shortest Path in a DAG",
	description: "Relax weighted edges in topological order to find shortest paths.",
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
		"function dagShortestPath(graph, start) {",
		"  const order = topologicalSort(graph);",
		"  const dist = initializeDistances(graph);",
		"  dist[start] = 0;",
		"  for (const node of order) {",
		"    if (dist[node] !== Infinity) {",
		"      for (const edge of graph[node]) {",
		"        const candidate = dist[node] + edge.weight;",
		"        if (candidate < dist[edge.to]) {",
		"          dist[edge.to] = candidate;",
		"        }",
		"      }",
		"    }",
		"  }",
		"  return dist;",
		"}",
	],
	start: "A",
	goal: "F",
};