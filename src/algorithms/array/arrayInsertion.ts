import type { ArrayStepRecorder, ArrayTraceOptions, ArrayTraceState } from "./types";

export const arrayInsertionSource = [
  "function insert(values, index, value) {",
  "  if (index < 0 || index > values.length) return values;",
  "  values.push(0);",
  "  for (let cursor = values.length - 1; cursor > index; cursor--) {",
  "    values[cursor] = values[cursor - 1];",
  "  }",
  "  values[index] = value;",
  "  return values;",
  "}",
];

export function runArrayInsertion(
  state: ArrayTraceState,
  options: ArrayTraceOptions,
  index: number,
  record: ArrayStepRecorder,
): void {
  const values = state.values;
  record(1, "Start insertion", `insert(index=${options.index}, value=${options.value})`, "Insert a value at the selected index.");
  const valid = index >= 0;
  record(2, "Validate insertion index", `0 ≤ ${options.index} ≤ ${values.length}: ${valid}`, valid ? "The insertion index is valid." : "The insertion index is out of bounds.");
  if (!valid) {
    state.result = "Invalid index";
    return;
  }
  values.push(0);
  record(3, "Extend array", `length = ${values.length}`, "Create one empty slot at the end of the array.", { values: [...values] });
  for (let cursor = values.length - 1; cursor > index; cursor -= 1) {
    record(4, `Check shift index ${cursor}`, `${cursor} > ${index}`, "Check whether another value must shift right.", { variables: { cursor: String(cursor) } });
    values[cursor] = values[cursor - 1];
    record(5, `Shift index ${cursor - 1} → ${cursor}`, `values[${cursor}] = ${values[cursor]}`, `Move ${values[cursor]} one slot to the right.`, { values: [...values], activeIndices: [cursor - 1, cursor] });
  }
  record(4, "Finish right shifts", `cursor === ${index}`, "The insertion slot is open.", { activeIndices: [] });
  values[index] = options.value;
  record(7, `Write ${options.value}`, `values[${index}] = ${options.value}`, `Store ${options.value} at index ${index}.`, { values: [...values], activeIndices: [index], result: `Inserted ${options.value} at index ${index}` });
  record(8, "Return array", `[${values.join(", ")}]`, "Return the updated array.", { activeIndices: [] });
  record(9, "Exit insertion", "end function", "Insertion is complete.");
}
