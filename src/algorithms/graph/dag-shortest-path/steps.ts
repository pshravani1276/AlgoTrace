import { createAdjacency, createInitialDistances, makeStepRecorder, restorePath } from "../stepUtils";
import { DAG_SHORTEST_PATH_DATA } from "./data";

export function generateDagShortestPathSteps() {
	const algorithm = DAG_SHORTEST_PATH_DATA;
	const { steps, record } = makeStepRecorder();
	const adjacency = createAdjacency(algorithm);
	const distances = createInitialDistances(algorithm);
	const parents = new Map<string, string>();
	const visited = new Set<string>();
	const topologicalOrder: string[] = [];
	const inDegree = Object.fromEntries(algorithm.nodes.map((node) => [node.id, 0]));
	for (const edge of algorithm.edges) inDegree[edge.to] += 1;
	const queue = algorithm.nodes.filter((node) => inDegree[node.id] === 0).map((node) => node.id);
	while (queue.length) {
		const node = queue.shift()!;
		topologicalOrder.push(node);
		for (const edge of adjacency.get(node) ?? []) {
			inDegree[edge.to] -= 1;
			if (inDegree[edge.to] === 0) queue.push(edge.to);
		}
	}

	record(1, "Enter DAG shortest path", "initialize DAG shortest paths", "Start the shortest-path search for a directed acyclic graph.");
	record(2, "Compute topological order", `[${topologicalOrder.join(" → ")}]`, "Order nodes so every edge points forward in the sequence.", { order: [...topologicalOrder] });
	record(3, "Initialize distances", "all vertices = ∞", "Set every distance to infinity.", { distances: { ...distances } });
	distances[algorithm.start] = 0;
	record(4, `Set d(${algorithm.start}) = 0`, `dist[${algorithm.start}] = 0`, "Set the source distance to zero.", { distances: { ...distances }, currentNode: algorithm.start });

	for (const node of topologicalOrder) {
		record(5, `Select ${node} in topological order`, `node = ${node}`, "Process the next vertex in topological order.", { currentNode: node, frontier: [...topologicalOrder] });
		const reachable = Number.isFinite(distances[node]);
		record(6, `Check reachability of ${node}`, `dist[${node}] = ${distances[node]}`, reachable ? `${node} is reachable; relax its outgoing edges.` : `${node} is unreachable; skip its edges.`, { visited: [...visited] });
		if (reachable) {
			for (const edge of adjacency.get(node) ?? []) {
				record(7, `Inspect ${edge.from} → ${edge.to}`, "iterate outgoing edges", `Process the outgoing edge ${edge.from} → ${edge.to}.`, { currentNode: node, checkingNode: edge.to, activeEdge: [edge.from, edge.to] });
				const candidate = distances[node] + edge.weight;
				record(8, `Calculate route to ${edge.to}`, `${distances[node]} + ${edge.weight} = ${candidate}`, "Add the edge weight to the current shortest distance.");
				const improves = candidate < distances[edge.to];
				record(9, `Compare route to ${edge.to}`, `${candidate} < ${distances[edge.to]}: ${improves}`, improves ? "This route improves the best known distance." : "Keep the existing shorter distance.");
				if (improves) {
					distances[edge.to] = candidate;
					parents.set(edge.to, node);
					record(10, `Update d(${edge.to})`, `dist[${edge.to}] = ${candidate}`, `Store the shorter distance to ${edge.to}.`, { distances: { ...distances }, path: restorePath(parents, algorithm.start, edge.to) });
				}
				record(11, "Finish improvement check", "end if", "Finish the distance comparison.");
				record(12, "Finish outgoing edge", "end for", "Move to the next edge from this node.", { activeEdge: null });
			}
		}
		record(13, "Finish reachability check", "end if", "Finish processing the reachable-node branch.");
		visited.add(node);
		record(14, `Finish ${node}`, "end for topological order", "Move to the next node in topological order.", { visited: [...visited] });
	}

	const path = restorePath(parents, algorithm.start, algorithm.goal);
	record(15, "Return DAG distances", `d(${algorithm.goal}) = ${distances[algorithm.goal]}`, `Return the distances. The path to ${algorithm.goal} is ${path.length ? path.join(" → ") : "unreachable"}.`, { distances: { ...distances }, path, frontier: [] });
	record(16, "Exit DAG shortest path", "end function", "The DAG shortest-path algorithm has finished.");
	return steps;
}