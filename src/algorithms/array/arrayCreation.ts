import type { ArrayStepRecorder, ArrayTraceState } from "./types";

export const arrayCreationSource = [
  "function createArray(input) {",
  "  const values = parse(input);",
  "  return values;",
  "}",
];

export function runArrayCreation(state: ArrayTraceState, record: ArrayStepRecorder): void {
  const values = state.values;
  record(1, "Start creation", "createArray(input)", "Begin creating an array from the entered values.");
  record(2, "Parse input", `values = [${values.join(", ")}]`, "Convert each comma-separated entry to a number.");
  record(3, "Return array", `length = ${values.length}`, `Created [${values.join(", ")}].`, { result: `[${values.join(", ")}]` });
  record(4, "Finish creation", "end function", "Array creation is complete.");
}
