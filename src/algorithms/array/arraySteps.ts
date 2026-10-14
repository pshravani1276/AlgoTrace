import { arrayCreationSource, runArrayCreation } from "./arrayCreation";
import { arrayDeletionSource, runArrayDeletion } from "./arrayDeletion";
import { arrayInsertionSource, runArrayInsertion } from "./arrayInsertion";
import { arraySearchingSource, runArraySearching } from "./arraySearching";
import { arraySortingSource, runArraySorting } from "./arraySorting";
import { arrayTraversalSource, runArrayTraversal } from "./arrayTraversal";
import { arrayUpdatingSource, runArrayUpdating } from "./arrayUpdating";
import type { ArrayOperation, ArrayStep, ArrayTrace, ArrayTraceOptions, ArrayTraceState } from "./types";

export type { ArrayTraceOptions } from "./types";

type TraceState = ArrayTraceState;

const ONE_D_SOURCE: Record<Extract<ArrayOperation, "create" | "traverse" | "insert" | "delete" | "search" | "update" | "reverse" | "rotate" | "sort">, string[]> = {
  create: arrayCreationSource,
  traverse: arrayTraversalSource,
  insert: arrayInsertionSource,
  delete: arrayDeletionSource,
  search: arraySearchingSource,
  update: arrayUpdatingSource,
  reverse: [
    "function reverse(values) {",
    "  let left = 0;",
    "  let right = values.length - 1;",
    "  while (left < right) {",
    "    [values[left], values[right]] = [values[right], values[left]];",
    "    left++; right--;",
    "  }",
    "  return values;",
    "}",
  ],
  rotate: [
    "function rotateRight(values, k) {",
    "  k = k % values.length;",
    "  for (let count = 0; count < k; count++) {",
    "    const last = values[values.length - 1];",
    "    for (let index = values.length - 1; index > 0; index--) {",
    "      values[index] = values[index - 1];",
    "    }",
    "    values[0] = last;",
    "  }",
    "  return values;",
    "}",
  ],
  sort: arraySortingSource,
};

const ADVANCED_SOURCE: Record<Extract<ArrayOperation, "prefix-sum" | "two-pointers" | "sliding-window" | "kadane" | "subarray-extremes">, string[]> = {
  "prefix-sum": [
    "function prefixSums(values) {",
    "  const prefix = [values[0] ?? 0];",
    "  for (let index = 1; index < values.length; index++) {",
    "    prefix[index] = prefix[index - 1] + values[index];",
    "  }",
    "  return prefix;",
    "}",
  ],
  "two-pointers": [
    "function twoSumSorted(values, target) {",
    "  let left = 0, right = values.length - 1;",
    "  while (left < right) {",
    "    const sum = values[left] + values[right];",
    "    if (sum === target) return [left, right];",
    "    if (sum < target) left++;",
    "    else right--;",
    "  }",
    "  return null;",
    "}",
  ],
  "sliding-window": [
    "function maxWindowSum(values, k) {",
    "  let windowSum = sum(values[0..k-1]);",
    "  let best = windowSum;",
    "  for (let right = k; right < values.length; right++) {",
    "    windowSum += values[right] - values[right - k];",
    "    best = Math.max(best, windowSum);",
    "  }",
    "  return best;",
    "}",
  ],
  kadane: [
    "function maxSubarray(values) {",
    "  let endingHere = values[0];",
    "  let best = values[0];",
    "  for (let index = 1; index < values.length; index++) {",
    "    endingHere = Math.max(values[index], endingHere + values[index]);",
    "    best = Math.max(best, endingHere);",
    "  }",
    "  return best;",
    "}",
  ],
  "subarray-extremes": [
    "function subarrayExtremes(values) {",
    "  let minimum = Infinity, maximum = -Infinity;",
    "  for (let start = 0; start < values.length; start++) {",
    "    let sum = 0;",
    "    for (let end = start; end < values.length; end++) {",
    "      sum += values[end];",
    "      minimum = Math.min(minimum, sum);",
    "      maximum = Math.max(maximum, sum);",
    "    }",
    "  }",
    "  return { minimum, maximum };",
    "}",
  ],
};

const MATRIX_SOURCE: Record<Extract<ArrayOperation, "matrix-traverse" | "matrix-add" | "matrix-transpose" | "matrix-multiply">, string[]> = {
  "matrix-traverse": [
    "function traverse(matrix) {",
    "  for (let row = 0; row < matrix.length; row++) {",
    "    for (let col = 0; col < matrix[row].length; col++) {",
    "      visit(matrix[row][col]);",
    "    }",
    "  }",
    "}",
  ],
  "matrix-add": [
    "function addMatrices(A, B) {",
    "  if (A.rows !== B.rows || A.cols !== B.cols) return null;",
    "  const result = zeros(rows, cols);",
    "  for (let row = 0; row < rows; row++) {",
    "    for (let col = 0; col < cols; col++) {",
    "      result[row][col] = A[row][col] + B[row][col];",
    "    }",
    "  }",
    "  return result;",
    "}",
  ],
  "matrix-transpose": [
    "function transpose(matrix) {",
    "  const result = zeros(cols, rows);",
    "  for (let row = 0; row < rows; row++) {",
    "    for (let col = 0; col < cols; col++) {",
    "      result[col][row] = matrix[row][col];",
    "    }",
    "  }",
    "  return result;",
    "}",
  ],
  "matrix-multiply": [
    "function multiplyMatrices(A, B) {",
    "  if (A.cols !== B.rows) return null;",
    "  const result = zeros(rowsA, colsB);",
    "  for (let row = 0; row < rowsA; row++) {",
    "    for (let col = 0; col < colsB; col++) {",
    "      for (let k = 0; k < colsA; k++) {",
    "        result[row][col] += A[row][k] * B[k][col];",
    "      }",
    "    }",
    "  }",
    "  return result;",
    "}",
  ],
};

function makeTrace(title: string, sourceCode: string[], complexity: string, values: number[], matrix: number[][]) {
  const steps: ArrayStep[] = [];
  let stepNumber = 1;
  const state: Omit<ArrayStep, "step" | "codeLine" | "operation" | "condition" | "explanation"> = {
    values: [...values],
    matrix: matrix.map((row) => [...row]),
    resultMatrix: [],
    activeIndices: [],
    activeCells: [],
    variables: {},
    result: "",
  };
  const record = (
    codeLine: number,
    operation: string,
    condition: string,
    explanation: string,
    changes: Partial<typeof state> = {},
  ) => {
    Object.assign(state, changes);
    steps.push({
      ...state,
      step: stepNumber,
      codeLine,
      values: [...state.values],
      matrix: state.matrix.map((row) => [...row]),
      resultMatrix: state.resultMatrix.map((row) => [...row]),
      activeIndices: [...state.activeIndices],
      activeCells: state.activeCells.map(([row, col]) => [row, col]),
      variables: { ...state.variables },
      operation: `${operation} · line ${codeLine}`,
      condition: `${condition} · line ${codeLine}`,
      explanation,
    });
    stepNumber += 1;
  };
  return { title, sourceCode, complexity, steps, state, record };
}

function normalizeIndex(index: number, length: number, allowEnd = false): number {
  const normalized = index < 0 ? length + index : index;
  return Number.isInteger(normalized) && normalized >= 0 && normalized < length + Number(allowEnd)
    ? normalized
    : -1;
}

export function generateArrayTrace(operation: ArrayOperation, options: ArrayTraceOptions): ArrayTrace {
  const values = [...options.values];
  const matrix = options.matrix.map((row) => [...row]);
  const { title, sourceCode, complexity } = getOperationDetails(operation);
  const trace = makeTrace(title, sourceCode, complexity, values, matrix);
  const { record, state, steps } = trace;

  if (operation in ONE_D_SOURCE) {
    runOneDimensional(operation as keyof typeof ONE_D_SOURCE, options, state, record);
  } else if (operation in MATRIX_SOURCE) {
    runMatrix(operation as keyof typeof MATRIX_SOURCE, options, state, record);
  } else {
    runAdvanced(operation as keyof typeof ADVANCED_SOURCE, options, state, record);
  }

  return { title, sourceCode, complexity, steps };
}

function getOperationDetails(operation: ArrayOperation) {
  const allSources: Record<ArrayOperation, string[]> = { ...ONE_D_SOURCE, ...MATRIX_SOURCE, ...ADVANCED_SOURCE };
  const titles: Record<ArrayOperation, string> = {
    create: "Array Creation", traverse: "Array Traversal", insert: "Insertion", delete: "Deletion", search: "Linear Search", update: "Update Value", reverse: "Reverse Array", rotate: "Rotate Right", sort: "Insertion Sort",
    "matrix-traverse": "Matrix Traversal", "matrix-add": "Matrix Addition", "matrix-transpose": "Matrix Transpose", "matrix-multiply": "Matrix Multiplication",
    "prefix-sum": "Prefix Sums", "two-pointers": "Two Pointers", "sliding-window": "Sliding Window", kadane: "Kadane’s Maximum Subarray", "subarray-extremes": "Maximum / Minimum Subarray",
  };
  const complexities: Record<ArrayOperation, string> = {
    create: "O(n)", traverse: "O(n)", insert: "O(n)", delete: "O(n)", search: "O(n)", update: "O(1)", reverse: "O(n)", rotate: "O(nk)", sort: "O(n²)",
    "matrix-traverse": "O(rows × cols)", "matrix-add": "O(rows × cols)", "matrix-transpose": "O(rows × cols)", "matrix-multiply": "O(n³)",
    "prefix-sum": "O(n)", "two-pointers": "O(n)", "sliding-window": "O(n)", kadane: "O(n)", "subarray-extremes": "O(n²)",
  };
  return { title: titles[operation], sourceCode: allSources[operation], complexity: complexities[operation] };
}

function runOneDimensional(
  operation: keyof typeof ONE_D_SOURCE,
  options: ArrayTraceOptions,
  state: ReturnType<typeof makeTrace>["state"],
  record: ReturnType<typeof makeTrace>["record"],
): void {
  const values = state.values;
  const validIndex = normalizeIndex(options.index, values.length, operation === "insert");

  if (operation === "create") {
    runArrayCreation(state, record);
    return;
  }

  if (operation === "traverse") {
    runArrayTraversal(state, record);
    return;
  }

  if (operation === "insert") {
    runArrayInsertion(state, options, validIndex, record);
    return;
  }

  if (operation === "delete") {
    runArrayDeletion(state, options, validIndex, record);
    return;
  }

  if (operation === "search") {
    runArraySearching(state, options, record);
    return;
  }

  if (operation === "update") {
    runArrayUpdating(state, options, validIndex, record);
    return;
  }

  if (operation === "reverse") {
    let left = 0;
    let right = values.length - 1;
    record(1, "Start reverse", "reverse(values)", "Reverse the array in place using two pointers.");
    record(2, "Initialize left pointer", `left = ${left}`, "Start at the first element.", { variables: { left: String(left) } });
    record(3, "Initialize right pointer", `right = ${right}`, "Start at the last element.", { variables: { right: String(right) } });
    while (left < right) {
      record(4, "Check pointers", `${left} < ${right}: true`, "The pointers have not met; swap their elements.", { variables: { left: String(left), right: String(right) } });
      [values[left], values[right]] = [values[right], values[left]];
      record(5, `Swap indexes ${left} and ${right}`, `${values[left]} ↔ ${values[right]}`, "Swap the values at the two pointer positions.", { values: [...values], activeIndices: [left, right] });
      left += 1;
      right -= 1;
      record(6, "Move pointers inward", `left=${left}, right=${right}`, "Move both pointers one step toward the center.", { variables: { left: String(left), right: String(right) }, activeIndices: [] });
    }
    record(4, "Finish pointer loop", `${left} < ${right}: false`, "The pointers met or crossed; reversing is complete.");
    record(8, "Return reversed array", `[${values.join(", ")}]`, "Return the reversed values.", { result: `[${values.join(", ")}]` });
    record(9, "Exit reverse", "end function", "Reverse is complete.");
    return;
  }

  if (operation === "rotate") {
    const count = values.length ? ((options.rotation % values.length) + values.length) % values.length : 0;
    record(1, "Start rotation", `k = ${options.rotation}`, "Rotate the array right by k positions.");
    record(2, "Normalize rotation", `k = ${count}`, "Reduce k so it does not exceed the array length.", { variables: { k: String(count) } });
    for (let rotation = 0; rotation < count; rotation += 1) {
      record(3, `Begin rotation ${rotation + 1}`, `${rotation} < ${count}`, "Begin one right rotation.", { variables: { rotation: String(rotation) } });
      const last = values[values.length - 1];
      record(4, `Save last value ${last}`, `last = ${last}`, "Save the last value before shifting.", { variables: { last: String(last) }, activeIndices: [values.length - 1] });
      for (let index = values.length - 1; index > 0; index -= 1) {
        record(5, `Shift loop at ${index}`, `${index} > 0`, "Move one element to the right.", { variables: { index: String(index) } });
        values[index] = values[index - 1];
        record(6, `Shift index ${index - 1} → ${index}`, `values[${index}] = ${values[index]}`, "Copy the preceding value into this slot.", { values: [...values], activeIndices: [index - 1, index] });
      }
      values[0] = last;
      record(8, `Place saved value at index 0`, `values[0] = ${last}`, "Move the former last value to the front.", { values: [...values], activeIndices: [0], result: `[${values.join(", ")}]` });
    }
    record(9, "Finish rotation loop", `completed ${count} rotations`, "All requested rotations are complete.", { activeIndices: [] });
    record(10, "Return rotated array", `[${values.join(", ")}]`, "Return the rotated array.");
    record(11, "Exit rotation", "end function", "Rotation is complete.");
    return;
  }

  runArraySorting(state, record);
}

function runMatrix(
  operation: keyof typeof MATRIX_SOURCE,
  options: ArrayTraceOptions,
  state: TraceState,
  record: ReturnType<typeof makeTrace>["record"],
): void {
  const matrix = state.matrix;
  const second = options.secondMatrix;
  const rows = matrix.length;
  const cols = matrix[0]?.length ?? 0;
  const result = operation === "matrix-transpose" ? Array.from({ length: cols }, () => Array(rows).fill(0)) : Array.from({ length: rows }, () => Array(operation === "matrix-multiply" ? second[0]?.length ?? 0 : cols).fill(0));

  record(1, "Start matrix operation", operation, `Begin ${operation.replace("matrix-", "").replace("-", " ")} on the matrix.`);
  if (operation === "matrix-traverse") {
    for (let row = 0; row < rows; row += 1) {
      record(2, `Select row ${row}`, `${row} < ${rows}`, "Move to the next row.", { variables: { row: String(row) } });
      for (let col = 0; col < cols; col += 1) {
        record(3, `Select cell (${row}, ${col})`, `${col} < ${cols}`, "Move to the next column in this row.", { variables: { row: String(row), col: String(col) } });
        record(4, `Visit ${matrix[row][col]}`, `matrix[${row}][${col}] = ${matrix[row][col]}`, "Read this matrix cell.", { activeCells: [[row, col]] });
      }
    }
    record(7, "Finish matrix traversal", "all rows visited", "Every matrix cell has been visited.", { activeCells: [], result: `Visited ${rows * cols} cells` });
    return;
  }

  record(2, "Initialize result matrix", `rows=${result.length}`, "Create a result matrix filled with zeros.", { resultMatrix: result.map((row) => [...row]) });
  if (operation === "matrix-add") {
    const compatible = second.length === rows && second.every((row) => row.length === cols);
    record(2, "Check matrix dimensions", `A=${rows}×${cols}; B=${second.length}×${second[0]?.length ?? 0}: ${compatible}`, compatible ? "Both matrices have matching dimensions." : "Matrix addition requires equal dimensions.");
    if (!compatible) {
      state.result = "Matrices must have equal dimensions";
      return;
    }
    record(3, "Initialize result matrix", `rows=${result.length}`, "Create a result matrix filled with zeros.", { resultMatrix: result.map((row) => [...row]) });
    for (let row = 0; row < rows; row += 1) {
      record(4, `Select row ${row}`, `${row} < ${rows}`, "Move to the next row.");
      for (let col = 0; col < cols; col += 1) {
        record(5, `Select cell (${row}, ${col})`, `${col} < ${cols}`, "Move to the next column.", { activeCells: [[row, col]] });
        result[row][col] = matrix[row][col] + second[row][col];
        record(6, "Add cell values", `${matrix[row][col]} + ${second[row][col]} = ${result[row][col]}`, "Add the matching cells from both matrices.", { resultMatrix: result.map((line) => [...line]) });
      }
      record(7, `Finish row ${row}`, "end for columns", "Move to the next matrix row.");
    }
    record(8, "Finish addition loops", "all rows processed", "Every matching pair of cells has been added.");
    record(9, "Return sum matrix", "all cells added", "Matrix addition is complete.", { resultMatrix: result.map((row) => [...row]), activeCells: [], result: "A + B" });
    record(10, "Exit matrix addition", "end function", "Matrix addition is complete.");
    return;
  }

  if (operation === "matrix-transpose") {
    for (let row = 0; row < rows; row += 1) {
      record(3, `Select source row ${row}`, `${row} < ${rows}`, "Move to the next source row.");
      for (let col = 0; col < cols; col += 1) {
        record(4, `Select source cell (${row}, ${col})`, `${col} < ${cols}`, "Move to the next source column.", { activeCells: [[row, col]] });
        result[col][row] = matrix[row][col];
        record(5, `Copy to (${col}, ${row})`, `result[${col}][${row}] = ${matrix[row][col]}`, "Write this value at the transposed row and column.", { resultMatrix: result.map((line) => [...line]), activeCells: [[row, col]] });
      }
    }
    record(8, "Return transpose", "all cells copied", "Matrix transpose is complete.", { resultMatrix: result.map((row) => [...row]), activeCells: [], result: "Transposed matrix" });
    return;
  }

  const innerLength = matrix[0]?.length ?? 0;
  const secondRowsHaveSameWidth = second.every((row) => row.length === (second[0]?.length ?? 0));
  const compatible = second.length > 0 && secondRowsHaveSameWidth && innerLength === second.length;
  record(2, "Check multiplication dimensions", `A.cols=${innerLength}; B.rows=${second.length}: ${compatible}`, compatible ? "A's columns match B's rows." : "Matrix multiplication requires A columns to equal B rows.");
  if (!compatible) {
    state.result = "A columns must equal B rows";
    return;
  }
  record(3, "Initialize product matrix", `${rows}×${second[0].length}`, "Create a zero matrix for the product.", { resultMatrix: result.map((row) => [...row]) });
  for (let row = 0; row < rows; row += 1) {
    record(4, `Select result row ${row}`, `${row} < ${rows}`, "Begin the next result row.");
    for (let col = 0; col < (second[0]?.length ?? 0); col += 1) {
      record(5, `Select result cell (${row}, ${col})`, `${col} < ${second[0]?.length ?? 0}`, "Begin calculating one result cell.");
      for (let k = 0; k < innerLength; k += 1) {
        record(6, `Select factor k=${k}`, `${k} < ${innerLength}`, "Select the next pair of factors.", { activeCells: [[row, k], [k, col]], variables: { row: String(row), col: String(col), k: String(k) } });
        result[row][col] += matrix[row][k] * (second[k]?.[col] ?? 0);
        record(7, "Accumulate product", `${matrix[row][k]} × ${second[k][col]} → ${result[row][col]}`, "Multiply the factors and add the product to the result cell.", { resultMatrix: result.map((line) => [...line]) });
      }
      record(8, `Finish result cell (${row}, ${col})`, "end for factors", "Finish accumulating this result cell.");
    }
    record(9, `Finish result row ${row}`, "end for columns", "Move to the next result row.");
  }
  record(10, "Finish multiplication loops", "all rows processed", "Every result cell has been calculated.");
  record(11, "Return product matrix", "all result cells calculated", "Matrix multiplication is complete.", { resultMatrix: result.map((row) => [...row]), activeCells: [], result: "A × B" });
  record(12, "Exit matrix multiplication", "end function", "Matrix multiplication is complete.");
}

function runAdvanced(
  operation: keyof typeof ADVANCED_SOURCE,
  options: ArrayTraceOptions,
  state: TraceState,
  record: ReturnType<typeof makeTrace>["record"],
): void {
  const values = state.values;
  record(1, "Start algorithm", operation, `Begin ${getOperationDetails(operation).title}.`);

  if (operation === "prefix-sum") {
    const prefix = values.length ? [values[0]] : [];
    record(2, "Initialize prefix array", `[${prefix.join(", ")}]`, "The first prefix sum is the first array value.", { resultMatrix: [prefix], variables: { prefix: `[${prefix.join(", ")}]` } });
    for (let index = 1; index < values.length; index += 1) {
      record(3, `Loop at index ${index}`, `${index} < ${values.length}`, "Process the next value.", { variables: { index: String(index) } });
      prefix[index] = prefix[index - 1] + values[index];
      record(4, `Build prefix[${index}]`, `${prefix[index - 1]} + ${values[index]} = ${prefix[index]}`, "Add the current value to the previous prefix sum.", { resultMatrix: [prefix], activeIndices: [index], variables: { prefix: `[${prefix.join(", ")}]` } });
    }
    record(6, "Return prefix sums", `[${prefix.join(", ")}]`, "The prefix array can answer range-sum queries.", { result: `[${prefix.join(", ")}]`, activeIndices: [] });
    return;
  }

  if (operation === "two-pointers") {
    let left = 0;
    let right = values.length - 1;
    const sorted = values.every((value, index) => index === 0 || values[index - 1] <= value);
    record(2, "Validate sorted input", `ascending: ${sorted}`, sorted ? "Input is ascending, so the two-pointer method applies." : "Sort the input first; two pointers requires ascending values.");
    if (!sorted) {
      record(10, "Stop on unsorted input", "input is not ascending", "No pair result is produced until the values are sorted.", { result: "Sort values ascending first" });
      return;
    }
    record(3, "Initialize pointers", `left=${left}, right=${right}`, "Start at both ends of the sorted array.", { variables: { left: String(left), right: String(right) } });
    while (left < right) {
      record(4, "Check pointers", `${left} < ${right}`, "There are still two distinct values to compare.", { variables: { left: String(left), right: String(right) } });
      const sum = values[left] + values[right];
      record(5, "Sum endpoints", `${values[left]} + ${values[right]} = ${sum}`, "Add the values currently under the pointers.", { activeIndices: [left, right], variables: { left: String(left), right: String(right), sum: String(sum) } });
      if (sum === options.target) {
        record(6, "Target found", `sum === ${options.target}`, `Found the target pair at indexes ${left} and ${right}.`, { result: `Indexes ${left}, ${right}` });
        return;
      }
      if (sum < options.target) {
        left += 1;
        record(7, "Move left pointer", `sum < ${options.target}`, "The sum is small, so move left forward to increase it.", { variables: { left: String(left), right: String(right) }, activeIndices: [left, right] });
      } else {
        right -= 1;
        record(8, "Move right pointer", `sum > ${options.target}`, "The sum is large, so move right backward to decrease it.", { variables: { left: String(left), right: String(right) }, activeIndices: [left, right] });
      }
    }
    record(9, "Finish pointer loop", "left >= right", "No two distinct values remain to compare.", { activeIndices: [] });
    record(10, "Return no pair", "no pair sums to target", "No pair sums to the target.", { result: "No pair found" });
    record(11, "Exit two pointers", "end function", "The two-pointer search is complete.");
    return;
  }

  if (operation === "sliding-window") {
    const size = Math.max(1, Math.min(options.windowSize, values.length));
    let windowSum = values.slice(0, size).reduce((sum, value) => sum + value, 0);
    let best = windowSum;
    let bestStart = 0;
    record(2, "Initialize first window", `windowSum = ${windowSum}`, `Sum the first ${size} values.`, { activeIndices: values.slice(0, size).map((_, index) => index), variables: { k: String(size), windowSum: String(windowSum), best: String(best) } });
    record(3, "Initialize best sum", `best = ${best}`, "The first window is the initial maximum.", { variables: { best: String(best) } });
    for (let right = size; right < values.length; right += 1) {
      record(4, `Expand to index ${right}`, `${right} < ${values.length}`, "Slide the window one position to the right.", { variables: { right: String(right) } });
      windowSum += values[right] - values[right - size];
      record(5, "Update window sum", `+${values[right]} - ${values[right - size]} = ${windowSum}`, "Add the entering value and remove the leaving value.", { activeIndices: Array.from({ length: size }, (_, index) => right - size + 1 + index), variables: { windowSum: String(windowSum) } });
      if (windowSum > best) {
        best = windowSum;
        bestStart = right - size + 1;
      }
      record(6, "Update best sum", `best = ${best}`, "Keep the largest window sum encountered.", { variables: { best: String(best), bestStart: String(bestStart) } });
    }
    record(8, "Return maximum window", `best = ${best}`, `Maximum sum is ${best} at indexes ${bestStart}–${bestStart + size - 1}.`, { result: String(best) });
    return;
  }

  if (operation === "kadane") {
    if (!values.length) {
      record(8, "Return empty result", "array is empty", "Kadane's algorithm needs at least one value.", { result: "Empty array" });
      return;
    }
    let endingHere = values[0];
    let best = values[0];
    let start = 0;
    let bestStart = 0;
    let bestEnd = 0;
    record(2, "Initialize current sum", `endingHere = ${endingHere}`, "Start with the first element.", { variables: { endingHere: String(endingHere) } });
    record(3, "Initialize best sum", `best = ${best}`, "The first element is the initial best subarray.", { variables: { best: String(best) } });
    for (let index = 1; index < values.length; index += 1) {
      record(4, `Loop at index ${index}`, `${index} < ${values.length}`, "Extend or restart the current subarray.", { variables: { index: String(index) } });
      if (values[index] > endingHere + values[index]) start = index;
      endingHere = Math.max(values[index], endingHere + values[index]);
      record(5, "Update current sum", `endingHere = ${endingHere}`, "Choose between starting here and extending the previous subarray.", { activeIndices: [start, index], variables: { endingHere: String(endingHere), start: String(start) } });
      if (endingHere > best) {
        best = endingHere;
        bestStart = start;
        bestEnd = index;
      }
      record(6, "Update best sum", `best = ${best}`, "Keep the largest sum seen so far.", { activeIndices: [bestStart, bestEnd], variables: { best: String(best), bestStart: String(bestStart), bestEnd: String(bestEnd) } });
    }
    record(8, "Return maximum subarray", `best = ${best}`, `Maximum sum ${best} comes from [${values.slice(bestStart, bestEnd + 1).join(", ")}].`, { result: String(best), activeIndices: Array.from({ length: bestEnd - bestStart + 1 }, (_, index) => bestStart + index) });
    return;
  }

  let minimum = Number.POSITIVE_INFINITY;
  let maximum = Number.NEGATIVE_INFINITY;
  let minRange: [number, number] = [0, 0];
  let maxRange: [number, number] = [0, 0];
  record(2, "Initialize extremes", "min = ∞; max = -∞", "Prepare to compare every contiguous subarray.", { variables: { minimum: "∞", maximum: "-∞" } });
  for (let start = 0; start < values.length; start += 1) {
    record(3, `Choose start ${start}`, `${start} < ${values.length}`, "Begin subarrays starting at this index.", { variables: { start: String(start) } });
    let sum = 0;
    record(4, "Reset sum", "sum = 0", "Start a fresh subarray sum.", { variables: { sum: "0" } });
    for (let end = start; end < values.length; end += 1) {
      record(5, `Extend to ${end}`, `${end} < ${values.length}`, "Extend the current subarray by one element.", { variables: { start: String(start), end: String(end) } });
      sum += values[end];
      record(6, "Add element", `sum = ${sum}`, "Add the new element to the running sum.", { activeIndices: Array.from({ length: end - start + 1 }, (_, index) => start + index), variables: { sum: String(sum) } });
      if (sum < minimum) {
        minimum = sum;
        minRange = [start, end];
      }
      record(7, "Update minimum", `minimum = ${minimum}`, "Keep the smallest contiguous-subarray sum.", { variables: { minimum: String(minimum) } });
      if (sum > maximum) {
        maximum = sum;
        maxRange = [start, end];
      }
      record(8, "Update maximum", `maximum = ${maximum}`, "Keep the largest contiguous-subarray sum.", { variables: { maximum: String(maximum) } });
    }
  }
  record(11, "Return extremes", `min=${minimum}; max=${maximum}`, `Minimum [${values.slice(minRange[0], minRange[1] + 1).join(", ")}], maximum [${values.slice(maxRange[0], maxRange[1] + 1).join(", ")}].`, { result: `Min ${minimum}; Max ${maximum}`, activeIndices: [] });
}