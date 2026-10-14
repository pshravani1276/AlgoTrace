import type { ArrayStepRecorder, ArrayTraceState } from "./types";

export const arraySortingSource = [
  "function insertionSort(values) {",
  "  for (let index = 1; index < values.length; index++) {",
  "    const current = values[index];",
  "    let cursor = index - 1;",
  "    while (cursor >= 0 && values[cursor] > current) {",
  "      values[cursor + 1] = values[cursor];",
  "      cursor--;",
  "    }",
  "    values[cursor + 1] = current;",
  "  }",
  "  return values;",
  "}",
];

export function runArraySorting(state: ArrayTraceState, record: ArrayStepRecorder): void {
  const values = state.values;
  record(1, "Start insertion sort", "insertionSort(values)", "Sort the array by inserting each value into the sorted prefix.");
  for (let index = 1; index < values.length; index += 1) {
    record(2, `Select index ${index}`, `${index} < ${values.length}`, "Choose the next value to insert.", { variables: { index: String(index) } });
    const current = values[index];
    record(3, `Save value ${current}`, `current = ${current}`, "Save the value before shifting larger values.", { variables: { current: String(current) }, activeIndices: [index] });
    let cursor = index - 1;
    record(4, `Set cursor to ${cursor}`, `cursor = ${index} - 1`, "Start comparing from the sorted prefix's end.", { variables: { cursor: String(cursor) } });
    while (cursor >= 0 && values[cursor] > current) {
      record(5, `Compare index ${cursor}`, `${values[cursor]} > ${current}: true`, "The prefix value is larger, so it must move right.", { activeIndices: [cursor, cursor + 1] });
      values[cursor + 1] = values[cursor];
      record(6, `Shift index ${cursor} → ${cursor + 1}`, `values[${cursor + 1}] = ${values[cursor + 1]}`, "Shift the larger value one position right.", { values: [...values], activeIndices: [cursor, cursor + 1] });
      cursor -= 1;
      record(7, "Move cursor left", `cursor = ${cursor}`, "Check the previous prefix position.", { variables: { cursor: String(cursor) } });
    }
    record(5, `Stop at cursor ${cursor}`, "cursor < 0 or value ≤ current", "The insertion point has been found.", { activeIndices: [] });
    values[cursor + 1] = current;
    record(9, `Insert ${current}`, `values[${cursor + 1}] = ${current}`, "Place the saved value into its sorted position.", { values: [...values], activeIndices: [cursor + 1] });
  }
  record(10, "Finish sort loop", "index === values.length", "Every value has been inserted into the sorted prefix.", { activeIndices: [] });
  record(11, "Return sorted array", `[${values.join(", ")}]`, "Insertion sort is complete.", { result: `[${values.join(", ")}]` });
  record(12, "Exit insertion sort", "end function", "The array is sorted.");
}
