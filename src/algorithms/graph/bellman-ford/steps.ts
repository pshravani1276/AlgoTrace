import { createInitialDistances, makeStepRecorder, restorePath } from "../stepUtils";
import { BELLMAN_FORD_DATA } from "./data";

export function generateBellmanFordSteps() {
	const algorithm = BELLMAN_FORD_DATA;
	const { steps, record } = makeStepRecorder();
	const distances = createInitialDistances(algorithm);
	const parents = new Map<string, string>();
	const visited = new Set<string>();
	const traversedEdges: [string, string][] = [];
	const { nodes, edges, start, goal } = algorithm;

	record(1, "Enter Bellman–Ford", "initialize graph search", "Start the Bellman–Ford shortest-path search.");
	record(2, "Initialize distances", "all vertices = ∞", "Set each node's distance to infinity before relaxation.", { distances: { ...distances } });
	distances[start] = 0;
	record(3, `Set d(${start}) = 0`, `dist[${start}] = 0`, "The source has zero cost to reach itself.", { distances: { ...distances }, currentNode: start });

	for (let pass = 1; pass < nodes.length; pass += 1) {
		record(4, `Start pass ${pass}`, `${pass} < ${nodes.length}`, `Begin relaxation pass ${pass} of ${nodes.length - 1}.`, { frontier: [`Pass ${pass}/${nodes.length - 1}`] });
		for (const edge of edges) {
			record(5, `Inspect ${edge.from} → ${edge.to}`, `edge weight = ${edge.weight}`, `Check edge ${edge.from} → ${edge.to} with weight ${edge.weight}.`, { currentNode: edge.from, checkingNode: edge.to, activeEdge: [edge.from, edge.to] });
			const reachable = Number.isFinite(distances[edge.from]);
			record(6, `Check reachability of ${edge.from}`, `dist[${edge.from}] = ${distances[edge.from]}`, reachable ? `${edge.from} is reachable, so its outgoing edge can be relaxed.` : `${edge.from} is unreachable; skip this relaxation.`, { visited: [...visited, edge.from] });
			if (reachable) {
				const candidate = distances[edge.from] + edge.weight;
				record(7, `Calculate route to ${edge.to}`, `${distances[edge.from]} + ${edge.weight} = ${candidate}`, `Calculate the cost of reaching ${edge.to} through ${edge.from}.`);
				const improves = candidate < distances[edge.to];
				record(8, `Compare route to ${edge.to}`, `${candidate} < ${distances[edge.to]}: ${improves}`, improves ? "This route improves the current best distance." : "This route does not improve the current distance.");
				if (improves) {
					distances[edge.to] = candidate;
					parents.set(edge.to, edge.from);
					visited.add(edge.to);
					traversedEdges.push([edge.from, edge.to]);
					record(9, `Update d(${edge.to})`, `dist[${edge.to}] = ${candidate}`, `Store the improved shortest distance to ${edge.to}.`, { distances: { ...distances }, path: restorePath(parents, start, edge.to), visited: [...visited] });
					record(10, `Set parent of ${edge.to}`, `parent[${edge.to}] = ${edge.from}`, `Record ${edge.from} as the predecessor of ${edge.to}.`);
				}
				record(11, "Finish improvement check", "end if", "Finish the distance-improvement branch.");
			}
			record(12, "Finish reachability check", "end if", "Finish the source-reachability branch.");
			record(13, "Finish edge", "end for edge", "Move to the next graph edge.", { activeEdge: null });
		}
		record(14, `Finish pass ${pass}`, "end for pass", "All edges have been relaxed for this pass.", { frontier: [] });
	}

	record(15, "Check for negative cycle", "test every reachable edge for further improvement", "A further improvement would mean a reachable negative-weight cycle.");
	const hasNegativeCycle = edges.some((edge) =>
		Number.isFinite(distances[edge.from]) && distances[edge.from] + edge.weight < distances[edge.to],
	);
	if (hasNegativeCycle) {
		record(15, "Negative cycle found", "relaxation remains possible", "The graph contains a reachable negative-weight cycle, so finite shortest paths do not exist.");
		record(16, "Return cycle result", "return null", "Stop because a reachable negative cycle was detected.");
		record(17, "Exit Bellman–Ford", "end function", "Bellman–Ford returns the negative-cycle result.");
		return steps;
	}

	const path = restorePath(parents, start, goal);
	record(16, "Return distances", `d(${goal}) = ${distances[goal]}`, `Return shortest distances. The path to ${goal} is ${path.length ? path.join(" → ") : "unreachable"}.`, { distances: { ...distances }, path, frontier: [] });
	record(17, "Exit Bellman–Ford", "end function", "Bellman–Ford has finished.");
	return steps;
}