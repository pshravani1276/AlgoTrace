import type { ArrayStepRecorder, ArrayTraceOptions, ArrayTraceState } from "./types";

export const arrayUpdatingSource = [
  "function update(values, index, value) {",
  "  if (index < 0 || index >= values.length) return values;",
  "  values[index] = value;",
  "  return values;",
  "}",
];

export function runArrayUpdating(
  state: ArrayTraceState,
  options: ArrayTraceOptions,
  index: number,
  record: ArrayStepRecorder,
): void {
  const values = state.values;
  record(1, "Start update", `update(index=${options.index})`, "Change the value at one array index.");
  const valid = index >= 0;
  record(2, "Validate update index", `0 ≤ ${options.index} < ${values.length}: ${valid}`, valid ? "The selected index exists." : "The selected index is out of bounds.");
  if (!valid) {
    state.result = "Invalid index";
    return;
  }
  const previous = values[index];
  values[index] = options.value;
  record(3, `Update index ${index}`, `${previous} → ${options.value}`, `Replace ${previous} with ${options.value}.`, { values: [...values], activeIndices: [index], result: `Updated index ${index}` });
  record(4, "Return array", `[${values.join(", ")}]`, "Return the updated array.", { activeIndices: [] });
  record(5, "Exit update", "end function", "Update is complete.");
}
