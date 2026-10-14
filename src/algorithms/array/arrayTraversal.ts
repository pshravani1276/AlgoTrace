import type { ArrayStepRecorder, ArrayTraceState } from "./types";

export const arrayTraversalSource = [
  "function traverse(values) {",
  "  for (let index = 0; index < values.length; index++) {",
  "    visit(values[index]);",
  "  }",
  "  return values;",
  "}",
];

export function runArrayTraversal(state: ArrayTraceState, record: ArrayStepRecorder): void {
  const values = state.values;
  record(1, "Start traversal", "traverse(values)", "Visit elements from the first index to the last.");
  for (let index = 0; index < values.length; index += 1) {
    record(2, `Loop at index ${index}`, `${index} < ${values.length}`, "Move to the next array index.", { variables: { index: String(index) } });
    record(3, `Visit value ${values[index]}`, `values[${index}] = ${values[index]}`, `Read element ${values[index]} at index ${index}.`, { activeIndices: [index] });
  }
  record(4, "Finish traversal loop", "index === values.length", "Every element has been visited.", { activeIndices: [] });
  record(5, "Return array", `length = ${values.length}`, "Traversal is complete.", { result: `Visited ${values.length} elements` });
  record(6, "Exit traversal", "end function", "The traversal function has finished.");
}
