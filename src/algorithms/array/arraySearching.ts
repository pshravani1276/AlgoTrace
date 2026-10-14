import type { ArrayStepRecorder, ArrayTraceOptions, ArrayTraceState } from "./types";

export const arraySearchingSource = [
  "function linearSearch(values, target) {",
  "  for (let index = 0; index < values.length; index++) {",
  "    if (values[index] === target) {",
  "      return index;",
  "    }",
  "  }",
  "  return -1;",
  "}",
];

export function runArraySearching(
  state: ArrayTraceState,
  options: ArrayTraceOptions,
  record: ArrayStepRecorder,
): void {
  const values = state.values;
  record(1, "Start search", `target = ${options.target}`, `Search from left to right for ${options.target}.`);
  for (let index = 0; index < values.length; index += 1) {
    record(2, `Loop at index ${index}`, `${index} < ${values.length}`, "Check the next element.", { variables: { index: String(index) } });
    const found = values[index] === options.target;
    record(3, `Compare index ${index}`, `${values[index]} === ${options.target}: ${found}`, found ? "The target matches this element." : "This element is not the target.", { activeIndices: [index] });
    if (found) {
      record(4, "Return matching index", `return ${index}`, `Found ${options.target} at index ${index}.`, { result: `Found at index ${index}` });
      record(5, "Exit match condition", "end if", "Finish the matching branch.", { activeIndices: [] });
      record(6, "Finish search loop", "return after match", "Search stops after the first matching element.");
      record(7, "Exit search", "end function", "The search is complete.");
      return;
    }
    record(5, "Finish match condition", "end if", "Continue to the next index.", { activeIndices: [] });
  }
  record(6, "Finish search loop", "index === values.length", "The target was not found in the array.");
  record(7, "Return not found", "return -1", `${options.target} is not present.`, { result: "Not found" });
  record(8, "Exit search", "end function", "The search is complete.");
}
