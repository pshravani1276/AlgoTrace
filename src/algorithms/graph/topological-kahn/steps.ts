import { createAdjacency, makeStepRecorder } from "../stepUtils";
import { TOPOLOGICAL_KAHN_DATA } from "./data";

export function generateKahnTopologicalSteps() {
	const algorithm = TOPOLOGICAL_KAHN_DATA;
	const { steps, record } = makeStepRecorder();
	const adjacency = createAdjacency(algorithm);
	const indegree = Object.fromEntries(algorithm.nodes.map((node) => [node.id, 0]));
	for (const edge of algorithm.edges) indegree[edge.to] += 1;
	const queue: string[] = [];
	const order: string[] = [];
	const visited = new Set<string>();

	record(1, "Enter Kahn's algorithm", "initialize DAG ordering", "Start a topological sort using indegrees.");
	record(2, "Calculate indegrees", Object.entries(indegree).map(([node, count]) => `${node}:${count}`).join(", "), "Count incoming edges for every node.", { distances: { ...indegree } });
	for (const node of algorithm.nodes) {
		if (indegree[node.id] === 0) queue.push(node.id);
	}
	record(3, "Initialize zero-indegree queue", `[${queue.join(", ")}]`, "Add every node with no incoming edges to the queue.", { frontier: [...queue] });
	record(4, "Initialize topological order", "order = []", "Start with an empty result order.", { order: [] });

	while (queue.length > 0) {
		record(5, "Check queue", `queue.length = ${queue.length} > 0`, "The queue has a zero-indegree node to process.", { frontier: [...queue] });
		const node = queue.shift()!;
		visited.add(node);
		record(6, `Remove ${node} from queue`, `queue.shift() = ${node}`, `Take ${node}, the next node with indegree zero.`, { currentNode: node, frontier: [...queue], visited: [...visited] });
		order.push(node);
		record(7, `Append ${node} to order`, `order = [${order.join(", ")}]`, `Add ${node} to the topological order.`, { order: [...order] });
		for (const edge of adjacency.get(node) ?? []) {
			record(8, `Visit edge ${edge.from} → ${edge.to}`, "iterate outgoing edges", `Process ${node}'s outgoing edge to ${edge.to}.`, { currentNode: node, checkingNode: edge.to, activeEdge: [edge.from, edge.to] });
			indegree[edge.to] -= 1;
			record(9, `Decrease indegree of ${edge.to}`, `indegree[${edge.to}] = ${indegree[edge.to]}`, `Removing ${node} reduces ${edge.to}'s incoming-edge count.`, { distances: { ...indegree } });
			const becomesReady = indegree[edge.to] === 0;
			record(10, `Check ${edge.to}`, `indegree[${edge.to}] === 0: ${becomesReady}`, becomesReady ? `${edge.to} is ready to enter the queue.` : `${edge.to} still has incoming edges.`, { frontier: [...queue] });
			if (becomesReady) {
				queue.push(edge.to);
				record(11, `Queue ${edge.to}`, `queue.push(${edge.to})`, `Add ${edge.to} to the queue.`, { frontier: [...queue] });
			}
			record(12, `Finish ready check for ${edge.to}`, "end if", "Finish the zero-indegree condition.");
			record(13, `Finish edge ${edge.from} → ${edge.to}`, "end for", "Move to the next outgoing edge.", { activeEdge: null });
		}
		record(14, `Finish ${node}`, "end while body", "Finish processing this node and return to the queue check.");
	}

	record(5, "Check queue", "queue.length = 0", "The queue is empty; topological processing is complete.", { frontier: [] });
	const isDag = order.length === algorithm.nodes.length;
	record(15, "Check DAG completion", `${order.length} !== ${algorithm.nodes.length}: ${!isDag}`, isDag ? "Every node was ordered; the graph is a DAG." : "Some nodes remain, so the graph contains a cycle.");
	if (!isDag) {
		record(16, "Return cycle result", "return null", "No topological order exists for a cyclic graph.");
		record(17, "Exit Kahn's algorithm", "end function", "Kahn's algorithm returns.");
		return steps;
	}
	record(16, "Return order", `[${order.join(" → ")}]`, "Return the topological order.", { order: [...order], visited: [...visited] });
	record(17, "Exit Kahn's algorithm", "end function", "Kahn's algorithm has finished.");
	return steps;
}