import type { ArrayStepRecorder, ArrayTraceOptions, ArrayTraceState } from "./types";

export const arrayDeletionSource = [
  "function removeAt(values, index) {",
  "  if (index < 0 || index >= values.length) return values;",
  "  const removed = values[index];",
  "  for (let cursor = index; cursor < values.length - 1; cursor++) {",
  "    values[cursor] = values[cursor + 1];",
  "  }",
  "  values.pop();",
  "  return removed;",
  "}",
];

export function runArrayDeletion(
  state: ArrayTraceState,
  options: ArrayTraceOptions,
  index: number,
  record: ArrayStepRecorder,
): void {
  const values = state.values;
  record(1, "Start deletion", `removeAt(${options.index})`, "Remove the value at the selected index.");
  const valid = index >= 0;
  record(2, "Validate deletion index", `0 ≤ ${options.index} < ${values.length}: ${valid}`, valid ? "The deletion index is valid." : "The deletion index is out of bounds.");
  if (!valid) {
    state.result = "Invalid index";
    return;
  }
  const removed = values[index];
  record(3, `Save removed value ${removed}`, `removed = values[${index}]`, "Keep the deleted value before shifting elements.", { activeIndices: [index], variables: { removed: String(removed) } });
  for (let cursor = index; cursor < values.length - 1; cursor += 1) {
    record(4, `Check shift index ${cursor}`, `${cursor} < ${values.length - 1}`, "Check whether another value must shift left.", { variables: { cursor: String(cursor) } });
    values[cursor] = values[cursor + 1];
    record(5, `Shift index ${cursor + 1} → ${cursor}`, `values[${cursor}] = ${values[cursor]}`, `Move ${values[cursor]} one slot to the left.`, { values: [...values], activeIndices: [cursor, cursor + 1] });
  }
  record(4, "Finish left shifts", "cursor === values.length - 1", "All elements after the removed value shifted left.", { activeIndices: [] });
  values.pop();
  record(7, "Remove last duplicate slot", `length = ${values.length}`, "Remove the now-unused final slot.", { values: [...values], result: `Removed ${removed}` });
  record(8, "Return removed value", `removed = ${removed}`, "Deletion is complete.");
  record(9, "Exit deletion", "end function", "The deletion function has finished.");
}
