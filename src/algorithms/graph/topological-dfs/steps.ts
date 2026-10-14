import { createAdjacency, makeStepRecorder } from "../stepUtils";
import { TOPOLOGICAL_DFS_DATA } from "./data";

export function generateDfsTopologicalSteps() {
	const algorithm = TOPOLOGICAL_DFS_DATA;
	const { steps, record } = makeStepRecorder();
	const adjacency = createAdjacency(algorithm);
	const visited = new Set<string>();
	const order: string[] = [];
	const recursionStack: string[] = [];
	const traversedEdges: [string, string][] = [];

	const visit = (node: string) => {
		visited.add(node);
		recursionStack.push(node);
		record(5, `Mark ${node} visited`, `visited.add(${node})`, `Mark ${node} before exploring its children.`, { currentNode: node, visited: [...visited], frontier: [...recursionStack] });
		for (const edge of adjacency.get(node) ?? []) {
			record(6, `Inspect ${node} → ${edge.to}`, "iterate outgoing edges", `Check the next neighbor of ${node}.`, { currentNode: node, checkingNode: edge.to, activeEdge: [node, edge.to], frontier: [...recursionStack] });
			const isUnvisited = !visited.has(edge.to);
			record(7, `Check ${edge.to}`, `visited.has(${edge.to}) = ${!isUnvisited}`, isUnvisited ? `${edge.to} has not been visited; recurse into it.` : `${edge.to} is already visited; skip recursion.`, { visited: [...visited], frontier: [...recursionStack] });
			if (isUnvisited) {
				traversedEdges.push([node, edge.to]);
				record(8, `Recurse to ${edge.to}`, `visit(${edge.to})`, `Start a depth-first visit from ${edge.to}.`, { activeEdge: [node, edge.to], frontier: [...recursionStack] });
				visit(edge.to);
				record(9, `Return to ${node}`, "end if", `The recursive visit to ${edge.to} is complete; resume at ${node}.`, { currentNode: node, checkingNode: edge.to, activeEdge: [node, edge.to], frontier: [...recursionStack] });
			}
			record(10, `Finish neighbor ${edge.to}`, "end for iteration", "Continue to the next outgoing edge.", { activeEdge: null, frontier: [...recursionStack] });
		}
		order.push(node);
		record(11, `Finish ${node}`, `order.push(${node})`, `All descendants of ${node} are finished; add it to reverse finishing order.`, { currentNode: node, order: [...order], frontier: [...recursionStack] });
		record(12, `Return from ${node}`, "end visit function", `Return from the recursive visit of ${node}.`, { currentNode: node, frontier: [...recursionStack] });
		recursionStack.pop();
	};

	record(1, "Enter DFS topological sort", "initialize ordering", "Start the DFS-based topological sort.");
	record(2, "Initialize visited set", "visited = ∅", "No vertices have been visited.", { visited: [] });
	record(3, "Initialize finish order", "order = []", "Create an empty finishing-order list.", { order: [] });
	record(4, "Define recursive visit", "function visit(node)", "Define the recursive helper used to explore and finish graph nodes.");
	for (const node of algorithm.nodes) {
		record(13, `Check outer node ${node.id}`, "iterate graph nodes", `Check whether ${node.id} has already been visited.`, { currentNode: node.id });
		const isUnvisited = !visited.has(node.id);
		record(14, `Check ${node.id}`, `visited.has(${node.id}) = ${!isUnvisited}`, isUnvisited ? `${node.id} is unvisited; begin DFS from it.` : `${node.id} was reached from another node; skip it.`, { visited: [...visited] });
		if (isUnvisited) {
			record(15, `Start visit at ${node.id}`, `visit(${node.id})`, `Visit the unvisited component rooted at ${node.id}.`, { currentNode: node.id });
			visit(node.id);
			record(16, `Finish outer check ${node.id}`, "end if", "Finish the outer unvisited test.");
		}
		record(17, `Finish graph node ${node.id}`, "end for", "Continue through graph nodes.");
	}
	const topologicalOrder = [...order].reverse();
	record(18, "Reverse finishing order", `order.reverse() = ${topologicalOrder.join(" → ")}`, "Reverse postorder to obtain a topological ordering.", { order: topologicalOrder, visited: [...visited] });
	record(19, "Exit DFS topological sort", "end function", "The DFS-based topological sort has finished.");
	return steps;
}