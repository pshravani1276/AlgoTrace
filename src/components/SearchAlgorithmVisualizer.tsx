import { useMemo, useState } from "react";
import { markActivityCompleted } from "../data/learnerProgress";
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Code2,
  Gauge,
  Info,
  Lightbulb,
  RotateCcw,
  Search,
  Sparkles,
  Zap,
} from "lucide-react";

export type SearchAlgorithm =
  | "linear-search"
  | "jump-search"
  | "interpolation-search"
  | "exponential-search"
  | "fibonacci-search"
  | "hash-search";

type Language = "TypeScript" | "JavaScript" | "Python" | "Java" | "C" | "C++";

const LANGUAGE_OPTIONS: { name: Language; symbol: string }[] = [
  { name: "TypeScript", symbol: "🔷" },
  { name: "JavaScript", symbol: "🟨" },
  { name: "Python", symbol: "🐍" },
  { name: "Java", symbol: "☕" },
  { name: "C", symbol: "🔵" },
  { name: "C++", symbol: "⚙️" },
];

interface AlgorithmDetails {
  title: string;
  description: string;
  complexity: { best: string; average: string; worst: string; space: string };
  initialTarget: number;
}

const SEARCH_ALGORITHMS: Record<SearchAlgorithm, AlgorithmDetails> = {
  "linear-search": {
    title: "Linear Search",
    description: "Check each array element in order until the target is found.",
    complexity: { best: "O(1)", average: "O(n)", worst: "O(n)", space: "O(1)" },
    initialTarget: 22,
  },
  "jump-search": {
    title: "Jump Search",
    description: "Jump through sorted blocks, then scan the block that may contain the target.",
    complexity: { best: "O(1)", average: "O(√n)", worst: "O(√n)", space: "O(1)" },
    initialTarget: 28,
  },
  "interpolation-search": {
    title: "Interpolation Search",
    description: "Estimate the target position from the values at the range boundaries.",
    complexity: { best: "O(1)", average: "O(log log n)", worst: "O(n)", space: "O(1)" },
    initialTarget: 28,
  },
  "exponential-search": {
    title: "Exponential Search",
    description: "Expand the search bound exponentially, then use binary search in that range.",
    complexity: { best: "O(1)", average: "O(log n)", worst: "O(log n)", space: "O(1)" },
    initialTarget: 28,
  },
  "fibonacci-search": {
    title: "Fibonacci Search",
    description: "Use Fibonacci numbers to narrow a sorted-array search range.",
    complexity: { best: "O(1)", average: "O(log n)", worst: "O(log n)", space: "O(1)" },
    initialTarget: 28,
  },
  "hash-search": {
    title: "Hash Search",
    description: "Hash the target to a table slot, then probe through collisions.",
    complexity: { best: "O(1)", average: "O(1)", worst: "O(n)", space: "O(n)" },
    initialTarget: 55,
  },
};

interface SearchStep {
  line: number;
  low: number | null;
  high: number | null;
  mid: number | null;
  midpointValue: number | null;
  target: number;
  values: Array<number | null>;
  activeRange: number[];
  foundIndex: number | null;
  conditionText: string;
  conditionResult: boolean | null;
  operation: string;
  explanation: string;
  complexity: string;
}

interface AlgorithmCode {
  lines: string[];
  [key: string]: number | string[];
}

const SORTED_ARRAY = [4, 9, 15, 21, 28, 36, 42, 57];
const LINEAR_ARRAY = [64, 34, 25, 12, 22, 11, 90];
const HASH_KEYS = [21, 32, 14, 55, 23, 42];
const HASH_CAPACITY = 11;

const CODE: Record<SearchAlgorithm, AlgorithmCode> = {
  "linear-search": {
    lines: [
      "function linearSearch(array: number[], target: number): number {",
      "  for (let i = 0; i < array.length; i++) {",
      "    if (array[i] === target) {",
      "      return i;",
      "    }",
      "  }",
      "  return -1;",
      "}",
    ],
    start: 1, loop: 2, compare: 3, returnFound: 4, notFound: 7, end: 8,
  },
  "jump-search": {
    lines: [
      "function jumpSearch(array: number[], target: number): number {",
      "  const size = Math.floor(Math.sqrt(array.length));",
      "  let start = 0;",
      "  let end = size;",
      "  while (start < array.length && array[Math.min(end, array.length) - 1] < target) {",
      "    start = end;",
      "    end += size;",
      "  }",
      "  for (let i = start; i < Math.min(end, array.length); i++) {",
      "    if (array[i] === target) {",
      "      return i;",
      "    }",
      "  }",
      "  return -1;",
      "}",
    ],
    start: 1, blockSize: 2, initStart: 3, initEnd: 4, jump: 5,
    moveStart: 6, moveEnd: 7, scan: 9, compare: 10, returnFound: 11,
    notFound: 14, end: 15,
  },
  "interpolation-search": {
    lines: [
      "function interpolationSearch(array: number[], target: number): number {",
      "  let low = 0;",
      "  let high = array.length - 1;",
      "  while (low <= high && target >= array[low] && target <= array[high]) {",
      "    const pos = low + Math.floor(((target - array[low]) * (high - low)) / (array[high] - array[low]));",
      "    if (array[pos] === target) {",
      "      return pos;",
      "    }",
      "    if (array[pos] < target) {",
      "      low = pos + 1;",
      "    } else {",
      "      high = pos - 1;",
      "    }",
      "  }",
      "  return -1;",
      "}",
    ],
    start: 1, initLow: 2, initHigh: 3, loop: 4, probe: 5, compare: 6,
    returnFound: 7, lowerCheck: 9, updateLow: 10, updateHigh: 12,
    notFound: 15, end: 16,
  },
  "exponential-search": {
    lines: [
      "function exponentialSearch(array: number[], target: number): number {",
      "  if (array[0] === target) {",
      "    return 0;",
      "  }",
      "  let bound = 1;",
      "  while (bound < array.length && array[bound] < target) {",
      "    bound *= 2;",
      "  }",
      "  let low = Math.floor(bound / 2);",
      "  let high = Math.min(bound, array.length - 1);",
      "  while (low <= high) {",
      "    const mid = low + Math.floor((high - low) / 2);",
      "    if (array[mid] === target) {",
      "      return mid;",
      "    }",
      "    if (array[mid] < target) {",
      "      low = mid + 1;",
      "    } else {",
      "      high = mid - 1;",
      "    }",
      "  }",
      "  return -1;",
      "}",
    ],
    start: 1, firstCompare: 2, firstReturn: 3, initBound: 5, expand: 6,
    doubleBound: 7, initLow: 9, initHigh: 10, loop: 11, probe: 12,
    compare: 13, returnFound: 14, lowerCheck: 16, updateLow: 17,
    updateHigh: 19, notFound: 22, end: 23,
  },
  "fibonacci-search": {
    lines: [
      "function fibonacciSearch(array: number[], target: number): number {",
      "  let fib2 = 0;",
      "  let fib1 = 1;",
      "  let fib = fib1 + fib2;",
      "  while (fib < array.length) {",
      "    [fib2, fib1] = [fib1, fib];",
      "    fib = fib1 + fib2;",
      "  }",
      "  let offset = -1;",
      "  while (fib > 1) {",
      "    const i = Math.min(offset + fib2, array.length - 1);",
      "    if (array[i] < target) {",
      "      [fib, fib1, fib2] = [fib1, fib2, fib1 - fib2];",
      "      offset = i;",
      "    } else if (array[i] > target) {",
      "      [fib, fib1, fib2] = [fib2, fib1 - fib2, fib2 - fib1];",
      "    } else {",
      "      return i;",
      "    }",
      "  }",
      "  if (fib1 > 0 && offset + 1 < array.length && array[offset + 1] === target) {",
      "    return offset + 1;",
      "  }",
      "  return -1;",
      "}",
    ],
    start: 1, initFib2: 2, initFib1: 3, initFib: 4, buildFib: 5,
    advanceFib: 6, updateFib: 7, initOffset: 9, loop: 10, probe: 11,
    lowerCheck: 12, updateLow: 13, moveOffset: 14, updateHigh: 16,
    compare: 18, returnFound: 19, finalCheck: 21, finalReturn: 22,
    notFound: 24, end: 25,
  },
  "hash-search": {
    lines: [
      "function hashSearch(table: (number | null)[], target: number): number {",
      "  let index = ((target % table.length) + table.length) % table.length;",
      "  const start = index;",
      "  while (table[index] !== null) {",
      "    if (table[index] === target) {",
      "      return index;",
      "    }",
      "    index = (index + 1) % table.length;",
      "    if (index === start) {",
      "      return -1;",
      "    }",
      "  }",
      "  return -1;",
      "}",
    ],
    start: 1, hash: 2, initStart: 3, loop: 4, compare: 5,
    returnFound: 6, probeNext: 8, fullCycle: 9, notFound: 13, end: 14,
  },
};

function getSourceLines(algorithm: SearchAlgorithm, language: Language): string[] {
  const source = CODE[algorithm].lines;
  if (language === "TypeScript") return source;

  const signature = source[0].match(/function\s+(\w+)\((\w+):/);
  const functionName = signature?.[1] ?? "search";
  const parameterName = algorithm === "hash-search" ? "table" : "array";
  const isHashSearch = algorithm === "hash-search";

  if (language === "Python") {
    return source.map((sourceLine, index) => {
      if (index === 0) return `def ${functionName}(${parameterName}, target):`;
      const leadingSpaces = sourceLine.match(/^ */)?.[0].length ?? 0;
      let body = sourceLine.trim();
      if (body === "}") return "";
      if (body.startsWith("} else if (")) {
        body = `elif ${body.slice(11).replace(/\) \{$/, ":")}`;
        return `${" ".repeat(Math.max(0, leadingSpaces - 2) * 2)}${body}`;
      }
      if (body === "} else {") {
        return `${" ".repeat(Math.max(0, leadingSpaces - 2) * 2)}else:`;
      }
      body = body
        .replace(/^for \(let i = 0; i < array\.length; i\+\+\) \{$/, "for i in range(len(array)):")
        .replace(/^for \(let i = start; i < Math\.min\(end, array\.length\); i\+\+\) \{$/, "for i in range(start, min(end, len(array))):")
        .replace(/^for \(let i = start; i < high; i\+\+\) \{$/, "for i in range(start, high):")
        .replace(/^while \((.*)\) \{$/, "while $1:")
        .replace(/^if \((.*)\) \{$/, "if $1:")
        .replace(/^(?:const|let) /, "")
        .replace(/Math\.floor\(Math\.sqrt\(array\.length\)\)/, "int(len(array) ** 0.5)")
        .replace(/Math\.floor\(/g, "int(")
        .replace(/Math\.min\(/g, "min(")
        .replace(/Math\.max\(/g, "max(")
        .replace(/\.length\b/g, (match, offset: number, whole: string) => {
          const variable = whole.slice(0, offset).match(/(?:array|table)$/)?.[0];
          return variable ? `len(${variable})` : match;
        })
        .replace(/!==/g, "!=")
        .replace(/===/g, "==")
        .replace(/&&/g, "and")
        .replace(/\bnull\b/g, "None")
        .replace(/;$/, "")
        .replace(/\) \{$/, ":");
      return `${" ".repeat(leadingSpaces * 2)}${body}`;
    });
  }

  if (language === "JavaScript") {
    return source.map((sourceLine, index) =>
      index === 0
        ? `function ${functionName}(${parameterName}, target) {`
        : sourceLine
          .replace(/: number\[\]/g, "")
          .replace(/: \(number \| null\)\[\]/g, "")
          .replace(/: number\b/g, "")
          .replace(/\bnull\b/g, "null"),
    );
  }

  const cFamily = language === "C" || language === "C++";
  const functionParameters = isHashSearch
    ? language === "Java"
      ? "Integer[] table, int target"
      : cFamily
        ? language === "C++"
          ? "const vector<int>& table, int capacity, int target"
          : "int table[], int capacity, int target"
        : "int[] table, int target"
    : cFamily
      ? language === "C++"
        ? "const vector<int>& array, int length, int target"
        : "int array[], int length, int target"
      : "int[] array, int target";

  return source.map((sourceLine, index) => {
    if (index === 0) return `int ${functionName}(${functionParameters}) {`;
    let body = sourceLine
      .replace(/\bconst\b|\blet\b/g, "int")
      .replace(/: number\[\]/g, "")
      .replace(/: \(number \| null\)\[\]/g, "")
      .replace(/: number\b/g, "")
      .replace(/\.length\b/g, (match, offset: number, whole: string) => {
        const variable = whole.slice(0, offset).match(/(?:array|table)$/)?.[0];
        if (!variable) return match;
        if (cFamily) return isHashSearch ? "capacity" : "length";
        return `${variable}.length`;
      })
      .replace(/Math\.floor\(Math\.sqrt\(array\.length\)\)/g,
        language === "Java" ? "(int) Math.sqrt(array.length)" : cFamily ? "(int) sqrt(length)" : "0")
      .replace(/Math\.floor\(/g, language === "Java" ? "(int) Math.floor(" : "(int) (")
      .replace(/Math\.sqrt\(/g, language === "C++" ? "sqrt(" : language === "Java" ? "Math.sqrt(" : "sqrt(")
      .replace(/Math\.min\(/g, language === "C++" ? "min(" : language === "Java" ? "Math.min(" : "fmin(")
      .replace(/Math\.max\(/g, language === "C++" ? "max(" : language === "Java" ? "Math.max(" : "fmax(")
      .replace(/!==/g, "!=")
      .replace(/===/g, "==")
      .replace(/\bnull\b/g, cFamily ? "-1" : "null");

    if (algorithm === "hash-search" && cFamily) {
      body = body.replace("number | null", "int");
    }
    if (algorithm === "fibonacci-search") {
      body = body
        .replace("[fib2, fib1] = [fib1, fib];", "int previousFib = fib1; fib1 = fib; fib2 = previousFib;")
        .replace("[fib, fib1, fib2] = [fib1, fib2, fib1 - fib2];", "int oldFib = fib; int oldFib1 = fib1; fib = oldFib1; fib1 = fib2; fib2 = oldFib1 - fib2;")
        .replace("[fib, fib1, fib2] = [fib2, fib1 - fib2, fib2 - fib1];", "int oldFib = fib; int oldFib1 = fib1; int oldFib2 = fib2; fib = oldFib2; fib1 = oldFib1 - oldFib2; fib2 = oldFib2 - oldFib1;")
        .replace("[fib, fib1, fib2] = [fib1, fib2, fib1 - fib2];", "int oldFib = fib; int oldFib1 = fib1; fib = oldFib1; fib1 = fib2; fib2 = oldFib1 - fib2;");
    }
    return body;
  });
}

function createHashTable(): Array<number | null> {
  const table: Array<number | null> = Array(HASH_CAPACITY).fill(null);
  for (const key of HASH_KEYS) {
    let index = key % HASH_CAPACITY;
    while (table[index] !== null) index = (index + 1) % HASH_CAPACITY;
    table[index] = key;
  }
  return table;
}

function generateSteps(
  algorithm: SearchAlgorithm,
  target: number,
): SearchStep[] {
  const definition = CODE[algorithm];
  const line = (name: string) => Number(definition[name]);
  const values =
    algorithm === "linear-search"
      ? [...LINEAR_ARRAY]
      : algorithm === "hash-search"
        ? createHashTable()
        : [...SORTED_ARRAY];
  const steps: SearchStep[] = [];
  let low = 0;
  let high = values.length - 1;
  let foundIndex: number | null = null;

  const push = (
    lineNumber: number,
    operation: string,
    explanation: string,
    options: Partial<
      Pick<
        SearchStep,
        "low" | "high" | "mid" | "midpointValue" | "conditionText" | "conditionResult" | "complexity"
      >
    > = {},
  ) => {
    const stepLow = options.low === undefined ? low : options.low;
    const stepHigh = options.high === undefined ? high : options.high;
    const activeRange =
      stepLow !== null && stepHigh !== null && stepLow <= stepHigh
        ? Array.from({ length: stepHigh - stepLow + 1 }, (_, index) => stepLow + index)
        : [];
    steps.push({
      line: lineNumber,
      low: stepLow,
      high: stepHigh,
      mid: options.mid ?? null,
      midpointValue: options.midpointValue ?? null,
      target,
      values: [...values],
      activeRange,
      foundIndex,
      conditionText: options.conditionText ?? "—",
      conditionResult: options.conditionResult ?? null,
      operation,
      explanation,
      complexity: options.complexity ?? "O(1)",
    });
  };

  const found = (index: number, sourceLine: number) => {
    foundIndex = index;
    push(
      sourceLine,
      `Return index ${index}`,
      `The target ${target} is found at index ${index}.`,
      { low: index, high: index, mid: index, midpointValue: values[index] },
    );
  };

  const notFound = () =>
    push(
      line("notFound"),
      "Return -1 (not found)",
      `The target ${target} is not present in this ${algorithm === "hash-search" ? "hash table" : "array"}.`,
      { low: null, high: null },
    );

  push(line("start"), `Enter ${SEARCH_ALGORITHMS[algorithm].title}`, SEARCH_ALGORITHMS[algorithm].description);

  if (algorithm === "linear-search") {
    for (let index = 0; index < values.length; index++) {
      low = index;
      high = values.length - 1;
      const value = values[index];
      push(line("loop"), `Check index ${index}`, `Visit array[${index}] in order.`, {
        low: index, high, mid: index, midpointValue: value,
        conditionText: `i < array.length  →  ${index} < ${values.length}`,
        conditionResult: true, complexity: "O(n)",
      });
      const match = value === target;
      push(line("compare"), `Compare ${value} with ${target}`, match
        ? `array[${index}] matches the target.`
        : `array[${index}] does not match; continue to the next index.`, {
        low: index, high, mid: index, midpointValue: value,
        conditionText: `array[${index}] === target  →  ${value} === ${target}`,
        conditionResult: match,
      });
      if (match) {
        found(index, line("returnFound"));
        break;
      }
    }
  } else if (algorithm === "jump-search") {
    const blockSize = Math.floor(Math.sqrt(values.length));
    let start = 0;
    let end = blockSize;
    low = start;
    high = Math.min(end, values.length) - 1;
    push(line("blockSize"), `Set jump size to ${blockSize}`, `Use floor(√${values.length}) = ${blockSize} as the block size.`);
    push(line("initStart"), "Initialize block start", `Begin at index ${start}.`);
    push(line("initEnd"), "Initialize block end", `The first block ends at index ${high}.`);

    while (start < values.length) {
      const blockEnd = Math.min(end, values.length) - 1;
      low = start;
      high = blockEnd;
      const blockValue = values[blockEnd] ?? null;
      const skipBlock = typeof blockValue === "number" && blockValue < target;
      push(line("jump"), `Check block ending at ${blockEnd}`, skipBlock
        ? `${blockValue} is below ${target}; skip this block.`
        : `This block may contain ${target}, so scan it linearly.`, {
        low: start, high: blockEnd, mid: blockEnd, midpointValue: blockValue,
        conditionText: `array[${blockEnd}] < target  →  ${blockValue} < ${target}`,
        conditionResult: skipBlock, complexity: "O(√n)",
      });
      if (!skipBlock) break;

      start = end;
      end += blockSize;
      push(line("moveStart"), `Move start to ${start}`, "Advance the left boundary to the next block.", {
        low: start, high: Math.min(end, values.length) - 1,
      });
      push(line("moveEnd"), `Move end to ${end}`, "Advance the right boundary by one jump.", {
        low: start, high: Math.min(end, values.length) - 1,
      });
      if (start >= values.length) break;
    }

    if (start < values.length) {
      high = Math.min(end, values.length);
      for (let index = start; index < high; index++) {
        low = start;
        const value = values[index];
        push(line("scan"), `Scan index ${index}`, `Check the next value in the candidate block [${start}, ${high - 1}].`, {
          low: start, high: high - 1, mid: index, midpointValue: value,
        });
        const match = value === target;
        push(line("compare"), `Compare ${value} with ${target}`, match
          ? "The value matches the target."
          : "The value does not match; keep scanning the block.", {
          low: start, high: high - 1, mid: index, midpointValue: value,
          conditionText: `array[${index}] === target  →  ${value} === ${target}`,
          conditionResult: match,
        });
        if (match) {
          found(index, line("returnFound"));
          break;
        }
        if (typeof value === "number" && value > target) break;
      }
    }
  } else if (algorithm === "interpolation-search") {
    low = 0;
    high = values.length - 1;
    push(line("initLow"), "Initialize low", "Set low to the first array index.");
    push(line("initHigh"), "Initialize high", `Set high to the last array index, ${high}.`);
    while (low <= high) {
      const lowEntry = values[low];
      const highEntry = values[high];
      if (typeof lowEntry !== "number" || typeof highEntry !== "number") break;
      const lowValue = lowEntry;
      const highValue = highEntry;
      const targetWithinBounds = target >= lowValue && target <= highValue;
      push(line("loop"), `Check range [${low}, ${high}]`, targetWithinBounds
        ? "The target is within the values at the range boundaries."
        : "The target is outside the remaining boundary values.", {
        low, high, conditionText: `low <= high and array[low] <= target <= array[high]`,
        conditionResult: targetWithinBounds, complexity: "O(log log n)",
      });
      if (!targetWithinBounds) break;
      if (lowValue === highValue) {
        const match = lowValue === target;
        if (match) found(low, line("returnFound"));
        break;
      }
      const position = low + Math.floor(((target - lowValue) * (high - low)) / (highValue - lowValue));
      const value = values[position] as number;
      push(line("probe"), `Estimate position: pos = ${position}`, `Interpolate between ${lowValue} and ${highValue} to estimate where ${target} belongs.`, {
        low, high, mid: position, midpointValue: value,
      });
      const match = value === target;
      push(line("compare"), `Compare ${value} with ${target}`, match
        ? "The estimated position contains the target."
        : "The estimated position is not the target.", {
        low, high, mid: position, midpointValue: value,
        conditionText: `array[${position}] === target  →  ${value} === ${target}`,
        conditionResult: match,
      });
      if (match) {
        found(position, line("returnFound"));
        break;
      }
      const goRight = value < target;
      push(line("lowerCheck"), `Check ${value} < ${target}`, goRight
        ? "The target is larger; continue to the right of pos."
        : "The target is smaller; continue to the left of pos.", {
        low, high, mid: position, midpointValue: value,
        conditionText: `array[pos] < target  →  ${value} < ${target}`,
        conditionResult: goRight,
      });
      if (goRight) {
        low = position + 1;
        push(line("updateLow"), `Move low to ${low}`, "Discard the positions up to the probe.", { low, high });
      } else {
        high = position - 1;
        push(line("updateHigh"), `Move high to ${high}`, "Discard the positions from the probe to the right.", { low, high });
      }
    }
  } else if (algorithm === "exponential-search") {
    const firstValue = values[0] as number;
    const firstMatch = firstValue === target;
    push(line("firstCompare"), `Check first value ${firstValue}`, firstMatch
      ? "The first element is the target."
      : "The target is not at the first index; expand the bound.", {
      low: 0, high: values.length - 1, mid: 0, midpointValue: firstValue,
      conditionText: `array[0] === target  →  ${firstValue} === ${target}`,
      conditionResult: firstMatch,
    });
    if (firstMatch) {
      found(0, line("firstReturn"));
    } else {
      let bound = 1;
      push(line("initBound"), "Initialize bound to 1", "Start with a small interval and double it as needed.");
      while (bound < values.length && (values[bound] as number) < target) {
        low = Math.floor(bound / 2);
        high = bound;
        push(line("expand"), `Check index ${bound}`, `array[${bound}] is still below ${target}; expand the range.`, {
          low, high, mid: bound, midpointValue: values[bound] as number,
          conditionText: `bound < n and array[bound] < target`,
          conditionResult: true, complexity: "O(log n)",
        });
        bound *= 2;
        push(line("doubleBound"), `Double bound to ${bound}`, "Double the bound to grow the candidate interval exponentially.", {
          low: Math.floor(bound / 2), high: Math.min(bound, values.length - 1),
        });
      }
      low = Math.floor(bound / 2);
      high = Math.min(bound, values.length - 1);
      push(line("initLow"), `Set low to ${low}`, "Start binary search halfway back from the expanded bound.", { low, high });
      push(line("initHigh"), `Set high to ${high}`, "Cap the upper bound at the last array index.", { low, high });
      while (low <= high) {
        const mid = low + Math.floor((high - low) / 2);
        const value = values[mid] as number;
        push(line("loop"), `Check interval [${low}, ${high}]`, "Binary-search only the interval found by exponential expansion.", {
          low, high, conditionText: `low <= high  →  ${low} <= ${high}`,
          conditionResult: true, complexity: "O(log n)",
        });
        push(line("probe"), `Calculate midpoint: mid = ${mid}`, `Inspect the middle of the candidate interval; array[${mid}] = ${value}.`, {
          low, high, mid, midpointValue: value,
        });
        const match = value === target;
        push(line("compare"), `Compare ${value} with ${target}`, match
          ? "The midpoint contains the target."
          : "The midpoint is not the target.", {
          low, high, mid, midpointValue: value,
          conditionText: `array[mid] === target  →  ${value} === ${target}`,
          conditionResult: match,
        });
        if (match) {
          found(mid, line("returnFound"));
          break;
        }
        const goRight = value < target;
        if (goRight) {
          low = mid + 1;
          push(line("updateLow"), `Move low to ${low}`, "Continue in the right half of the candidate interval.", { low, high });
        } else {
          high = mid - 1;
          push(line("updateHigh"), `Move high to ${high}`, "Continue in the left half of the candidate interval.", { low, high });
        }
      }
    }
  } else if (algorithm === "fibonacci-search") {
    let fib2 = 0;
    let fib1 = 1;
    let fib = fib1 + fib2;
    push(line("initFib2"), "Initialize Fibonacci numbers", "Start with fib2 = 0 and fib1 = 1.");
    push(line("initFib1"), "Set fib1 = 1", "Prepare the previous Fibonacci number.");
    push(line("initFib"), "Calculate fib = 1", "The initial Fibonacci range is 1.");
    while (fib < values.length) {
      push(line("buildFib"), `Grow Fibonacci range to ${fib}`, `Increase the range until it covers all ${values.length} elements.`, {
        low: 0, high: values.length - 1, conditionText: `${fib} < ${values.length}`,
        conditionResult: true,
      });
      [fib2, fib1] = [fib1, fib];
      fib = fib1 + fib2;
      push(line("advanceFib"), `Advance Fibonacci values`, `The next range size is ${fib}.`);
      push(line("updateFib"), `Update range size to ${fib}`, "Continue until the Fibonacci range reaches the array length.");
    }
    let offset = -1;
    push(line("initOffset"), "Initialize offset to -1", "No positions have been ruled out yet.");
    while (fib > 1) {
      const index = Math.min(offset + fib2, values.length - 1);
      const value = values[index] as number;
      low = offset + 1;
      high = Math.min(offset + fib, values.length - 1);
      push(line("loop"), `Check Fibonacci range [${low}, ${high}]`, "A Fibonacci offset remains, so inspect the corresponding probe.", {
        low, high, conditionText: `fib > 1  →  ${fib} > 1`, conditionResult: true,
        complexity: "O(log n)",
      });
      push(line("probe"), `Probe index ${index}`, `Use fib2 to choose index ${index} within the remaining range.`, {
        low, high, mid: index, midpointValue: value,
      });
      if (value < target) {
        push(line("lowerCheck"), `Check ${value} < ${target}`, "The target is to the right of this probe.", {
          low, high, mid: index, midpointValue: value,
          conditionText: `array[i] < target  →  ${value} < ${target}`, conditionResult: true,
        });
        [fib, fib1, fib2] = [fib1, fib2, fib1 - fib2];
        push(line("updateLow"), "Reduce Fibonacci range", "Discard the left portion and use the smaller Fibonacci range.");
        offset = index;
        push(line("moveOffset"), `Move offset to ${offset}`, "Remember the last position eliminated on the left.");
      } else if (value > target) {
        push(line("lowerCheck"), `Check ${value} > ${target}`, "The target is to the left of this probe.", {
          low, high, mid: index, midpointValue: value,
          conditionText: `array[i] > target  →  ${value} > ${target}`, conditionResult: true,
        });
        [fib, fib1, fib2] = [fib2, fib1 - fib2, fib2 - (fib1 - fib2)];
        push(line("updateHigh"), "Reduce Fibonacci range", "Discard the right portion and use the smaller Fibonacci range.");
      } else {
        push(line("compare"), `Compare ${value} with ${target}`, "The Fibonacci probe matches the target.", {
          low, high, mid: index, midpointValue: value,
          conditionText: `array[i] === target  →  ${value} === ${target}`,
          conditionResult: true,
        });
        found(index, line("returnFound"));
        break;
      }
    }
    if (foundIndex === null && fib1 > 0 && offset + 1 < values.length) {
      const finalIndex = offset + 1;
      const value = values[finalIndex] as number;
      const match = value === target;
      push(line("finalCheck"), `Check final index ${finalIndex}`, match
        ? "The remaining element is the target."
        : "The final candidate does not match.", {
        low: finalIndex, high: finalIndex, mid: finalIndex, midpointValue: value,
        conditionText: `array[offset + 1] === target  →  ${value} === ${target}`,
        conditionResult: match,
      });
      if (match) found(finalIndex, line("finalReturn"));
    }
  } else {
    let index = ((target % values.length) + values.length) % values.length;
    const start = index;
    low = 0;
    high = values.length - 1;
    push(line("hash"), `Hash target to slot ${index}`, `Compute ${target} % ${values.length} to find the initial table slot.`, {
      low: index, high: index, mid: index, midpointValue: values[index],
    });
    push(line("initStart"), `Remember starting slot ${start}`, "Keep the initial slot to detect a full-table cycle.");
    let probes = 0;
    while (values[index] !== null && probes < values.length) {
      const value = values[index] as number;
      low = index;
      high = (index + values.length - 1) % values.length;
      const match = value === target;
      push(line("loop"), `Inspect occupied slot ${index}`, `Slot ${index} contains ${value}; compare it with the target.`, {
        low: index, high: index, mid: index, midpointValue: value,
        conditionText: `table[${index}] !== null  →  ${value} !== null`,
        conditionResult: true,
      });
      push(line("compare"), `Compare ${value} with ${target}`, match
        ? "The key matches the target."
        : "This is a collision; continue to the next slot.", {
        low: index, high: index, mid: index, midpointValue: value,
        conditionText: `table[${index}] === target  →  ${value} === ${target}`,
        conditionResult: match,
      });
      if (match) {
        found(index, line("returnFound"));
        break;
      }
      index = (index + 1) % values.length;
      probes++;
      push(line("probeNext"), `Probe next slot ${index}`, "Use linear probing to move to the next slot, wrapping around the table if needed.", {
        low: index, high: index, mid: index, midpointValue: values[index],
      });
      if (index === start) {
        push(line("fullCycle"), "A full table cycle was checked", "The probe returned to its start without finding the target.", {
          low: null, high: null, conditionText: `index === start  →  ${index} === ${start}`,
          conditionResult: true,
        });
        break;
      }
    }
    if (foundIndex === null && probes < values.length && values[index] === null) {
      push(line("loop"), `Slot ${index} is empty`, "An empty slot means the target was not inserted into this probe sequence.", {
        low: index, high: index, mid: index, midpointValue: null,
        conditionText: `table[${index}] !== null  →  null !== null`,
        conditionResult: false,
      });
    }
  }

  if (foundIndex === null) notFound();
  push(
    line("end"),
    `${SEARCH_ALGORITHMS[algorithm].title} complete`,
    foundIndex === null
      ? "The search finished without finding the target."
      : `The target was found at index ${foundIndex}.`,
  );
  return steps;
}

function markSearchCompleted(algorithm: SearchAlgorithm) {
  markActivityCompleted(algorithm);
}

export default function SearchAlgorithmVisualizer({
  algorithm,
}: {
  algorithm: SearchAlgorithm;
}) {
  const details = SEARCH_ALGORITHMS[algorithm];
  const [language, setLanguage] = useState<Language>("TypeScript");
  const code = useMemo(() => getSourceLines(algorithm, language), [algorithm, language]);
  const [targetInput, setTargetInput] = useState(String(details.initialTarget));
  const [currentStep, setCurrentStep] = useState(0);
  const [speed, setSpeed] = useState("1x");
  const numericTarget = Number(targetInput);
  const target = Number.isFinite(numericTarget) ? numericTarget : details.initialTarget;
  const steps = useMemo(() => generateSteps(algorithm, target), [algorithm, target]);
  const step = steps[Math.min(currentStep, steps.length - 1)];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;
  const speedDuration =
    speed === "0.5x" ? 700 : speed === "1x" ? 450 : speed === "1.5x" ? 300 : 180;
  const isHashSearch = algorithm === "hash-search";

  function handleNext() {
    if (isLastStep) {
      markSearchCompleted(algorithm);
      return;
    }
    const nextStep = currentStep + 1;
    setCurrentStep(nextStep);
    if (nextStep === steps.length - 1) markSearchCompleted(algorithm);
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#020617] text-white">
      <style>{`
        @keyframes gridMove { to { transform: translate(40px, 40px); } }
        @keyframes searchPulse {
          0%,100% { box-shadow: 0 0 10px rgba(34,211,238,.12); }
          50% { box-shadow: 0 0 30px rgba(34,211,238,.42), 0 0 70px rgba(99,102,241,.15); }
        }
        .algo-grid {
          background-image: linear-gradient(rgba(56,189,248,.035) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,.035) 1px, transparent 1px);
          background-size: 40px 40px;
          animation: gridMove 12s linear infinite;
        }
        .search-pulse { animation: searchPulse 1.2s ease-in-out infinite; }
      `}</style>
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="algo-grid absolute inset-[-80px]" />
        <div className="absolute left-[5%] top-[10%] h-64 w-64 rounded-full bg-cyan-500/[0.035] blur-3xl" />
        <div className="absolute bottom-[10%] right-[8%] h-72 w-72 rounded-full bg-indigo-500/[0.035] blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-[1550px] p-4 lg:p-5">
        <header className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-500/10 text-cyan-300">
              <Search size={19} />
            </div>
            <div>
              <h1 className="text-lg font-bold">{details.title}</h1>
              <p className="text-[10px] text-slate-500">Step-by-step execution visualizer</p>
            </div>
          </div>
          <div className="rounded-xl border border-cyan-400/10 bg-slate-900/90 px-3 py-2">
            <span className="text-[9px] uppercase tracking-widest text-slate-600">STEP</span>
            <span className="ml-2 font-mono text-sm font-bold text-cyan-400">
              {currentStep + 1}/{steps.length}
            </span>
          </div>
        </header>

        <div className="grid items-start gap-4 lg:grid-cols-12">
          <section className="space-y-3 lg:col-span-3">
            <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/95 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 p-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Code2 size={15} className="text-cyan-400" />
                    <h2 className="text-sm font-bold">Source Code</h2>
                  </div>
                  <p className="mt-1 text-[9px] text-slate-600">{language} · line-by-line execution</p>
                </div>
                <select
                  value={language}
                  onChange={(event) => {
                    setLanguage(event.target.value as Language);
                    setCurrentStep(0);
                  }}
                  className="max-w-32 rounded-lg border border-slate-700 bg-slate-900 px-2 py-1.5 text-[10px] text-white outline-none"
                  aria-label="Programming language"
                >
                  {LANGUAGE_OPTIONS.map((option) => (
                    <option key={option.name} value={option.name}>
                      {option.symbol} {option.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="h-[430px] overflow-auto p-2.5">
                {code.map((lineText, index) => {
                  const lineNumber = index + 1;
                  const active = lineNumber === step.line;
                  return (
                    <div
                      key={`${algorithm}-${lineNumber}`}
                      className={`flex min-h-[26px] items-start rounded-md border-l-2 px-2 py-1 transition-all ${
                        active
                          ? "border-cyan-400 bg-cyan-400/10 shadow-[0_0_22px_rgba(34,211,238,.1)]"
                          : "border-transparent"
                      }`}
                    >
                      <span className={`w-8 shrink-0 font-mono text-[11px] ${active ? "font-bold text-cyan-400" : "text-slate-700"}`}>
                        {lineNumber}
                      </span>
                      <span className={`whitespace-pre-wrap font-mono text-[11px] leading-5 ${active ? "font-bold text-cyan-200" : "text-slate-500"}`}>
                        {lineText || " "}
                      </span>
                      {active && <span className="ml-auto mt-1.5 h-2 w-2 shrink-0 rounded-full bg-cyan-400" />}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-2xl border border-cyan-500/15 bg-cyan-500/[0.035] p-3 shadow-xl">
              <div className="flex items-center gap-2">
                <Zap size={15} className="text-cyan-400" />
                <div>
                  <h2 className="text-sm font-bold text-cyan-300">Complexity Analysis</h2>
                  <p className="text-[9px] text-slate-600">Current operation: {step.complexity}</p>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <ComplexityCard title="Best" value={details.complexity.best} />
                <ComplexityCard title="Average" value={details.complexity.average} />
                <ComplexityCard title="Worst" value={details.complexity.worst} />
                <ComplexityCard title="Space" value={details.complexity.space} />
              </div>
              <p className="mt-3 text-[10px] leading-4 text-slate-400">{details.description}</p>
            </div>
          </section>

          <section className="lg:col-span-3 lg:col-start-10 lg:row-start-1">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/95 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 p-3">
                <div className="flex items-center gap-2">
                  <Info size={16} className="text-purple-400" />
                  <div>
                    <h2 className="text-sm font-bold">Inspector</h2>
                    <p className="text-[8px] text-slate-600">Current execution state</p>
                  </div>
                </div>
                <span className="rounded-full border border-slate-800 bg-slate-900 px-2 py-1 text-[8px] text-slate-500">
                  Line {step.line}
                </span>
              </div>
              <div className="p-3">
                <InspectorBox title="CURRENT OPERATION">
                  <p className="text-[10px] leading-5 text-slate-300">{step.operation}</p>
                </InspectorBox>
                <div className="mt-3 rounded-xl border border-slate-800 bg-slate-900/70 p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-[8px] font-bold uppercase tracking-widest text-slate-600">CONDITION</span>
                    {step.conditionResult !== null && (
                      <span className={`rounded-full px-2 py-1 text-[8px] font-bold ${step.conditionResult ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>
                        {step.conditionResult ? "TRUE" : "FALSE"}
                      </span>
                    )}
                  </div>
                  <p className="break-words font-mono text-[10px] leading-5 text-slate-300">{step.conditionText}</p>
                </div>
                <div className="mt-3">
                  <div className="mb-2 flex items-center gap-2">
                    <Activity size={14} className="text-cyan-400" />
                    <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500">LIVE VARIABLES</span>
                    <span className="ml-auto text-[8px] text-green-400">● LIVE</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <LiveVariable name={isHashSearch ? "slot" : "low / start"} value={step.low ?? "—"} active />
                    <LiveVariable name={isHashSearch ? "table size" : "high / end"} value={isHashSearch ? step.values.length : step.high ?? "—"} active />
                    <LiveVariable name="probe / mid" value={step.mid ?? "—"} active={step.mid !== null} />
                    <LiveVariable name="value" value={step.midpointValue ?? "—"} active={step.midpointValue !== null} />
                    <LiveVariable name="target" value={step.target} active />
                    <LiveVariable name="result" value={step.foundIndex ?? (isLastStep ? "-1" : "—")} active={step.foundIndex !== null || isLastStep} />
                  </div>
                </div>
                <div className="mt-3 rounded-xl border border-slate-800 bg-slate-900/60 p-3">
                  <p className="mb-2 text-[9px] font-bold uppercase tracking-widest text-slate-500">
                    {isHashSearch ? "PROBE POSITION" : "SEARCH RANGE"}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    <IndexBadge label={isHashSearch ? "slot" : "low"} value={step.low} color="text-cyan-300" />
                    {!isHashSearch && <IndexBadge label="mid" value={step.mid} color="text-yellow-300" />}
                    <IndexBadge label={isHashSearch ? "start" : "high"} value={step.high} color="text-purple-300" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="lg:col-span-6 lg:col-start-4 lg:row-start-1">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/95 p-4 shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="text-cyan-400" />
                  <div>
                    <h2 className="text-sm font-bold">Visualization</h2>
                    <p className="text-[9px] text-slate-600">Live {details.title} execution</p>
                  </div>
                </div>
                <span className="rounded-full border border-slate-800 bg-slate-900 px-2.5 py-1 text-[9px] text-slate-500">
                  {isHashSearch ? "Hash table" : `${step.values.length} elements`}
                </span>
              </div>
              <div className="mt-3 rounded-xl border border-indigo-400/15 bg-indigo-500/[0.04] p-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-yellow-400/10 text-yellow-400">
                    <Lightbulb size={15} />
                  </div>
                  <div>
                    <h3 className="text-[11px] font-bold">What&apos;s Happening?</h3>
                    <p className="text-[8px] text-slate-600">Current execution intelligence</p>
                  </div>
                </div>
                <p className="mt-2 text-[11px] leading-5 text-slate-400">{step.explanation}</p>
              </div>

              <div className="mt-3 rounded-xl border border-slate-800 bg-[#030712] p-4">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <span className="text-[9px] uppercase tracking-widest text-slate-600">
                    {isHashSearch ? "Hash Table · Linear Probing" : "Array Visualization"}
                  </span>
                  <label className="flex items-center gap-2 text-[10px] text-slate-400">
                    Search target
                    <input
                      type="number"
                      value={targetInput}
                      onChange={(event) => {
                        setTargetInput(event.currentTarget.value);
                        setCurrentStep(0);
                      }}
                      className="w-20 rounded-lg border border-cyan-500/30 bg-slate-900 px-2 py-1.5 font-mono text-sm font-bold text-cyan-300 outline-none focus:border-cyan-400"
                      aria-label="Search target value"
                    />
                  </label>
                </div>
                <div className="flex min-h-[165px] items-center justify-center gap-2 overflow-x-auto px-1 pb-3 pt-2">
                  {step.values.map((value, index) => {
                    const isProbe = index === step.mid;
                    const isInRange = step.activeRange.includes(index);
                    const isFound = index === step.foundIndex;
                    return (
                      <div key={index} className="flex shrink-0 flex-col items-center">
                        <div
                          style={{ transitionDuration: `${speedDuration}ms` }}
                          className={`relative flex h-14 w-14 items-center justify-center rounded-xl border font-mono text-sm font-bold transition-all ${
                            isFound
                              ? "border-green-400 bg-green-500/15 text-green-300 shadow-[0_0_28px_rgba(74,222,128,.3)]"
                              : isProbe
                                ? "search-pulse border-yellow-400 bg-yellow-500/15 text-yellow-200"
                                : isInRange
                                  ? "border-cyan-400/50 bg-cyan-500/10 text-cyan-200"
                                  : "border-slate-800 bg-slate-900/50 text-slate-600 opacity-50"
                          }`}
                        >
                          {isProbe && !isFound && <span className="absolute -top-2 rounded-full bg-yellow-400 px-1.5 py-0.5 text-[7px] font-bold text-slate-950">PROBE</span>}
                          {isFound && <span className="absolute -top-2 rounded-full bg-green-400 px-1.5 py-0.5 text-[7px] font-bold text-slate-950">FOUND</span>}
                          {value ?? "∅"}
                        </div>
                        <span className="mt-3 font-mono text-[9px] text-slate-600">[{index}]</span>
                      </div>
                    );
                  })}
                </div>
                <div className="flex flex-wrap justify-center gap-4 border-t border-slate-800 pt-3">
                  <LegendDot label="Candidate range" className="bg-cyan-400" />
                  <LegendDot label="Current probe" className="bg-yellow-400" />
                  <LegendDot label="Found" className="bg-green-400" />
                  <LegendDot label="Discarded" className="bg-slate-600" />
                </div>
              </div>

              <div className="mt-3 rounded-xl border border-slate-800 bg-slate-900/70 p-3">
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => setCurrentStep((previous) => Math.max(0, previous - 1))}
                    disabled={isFirstStep}
                    className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-[10px] font-semibold transition hover:border-cyan-400/30 hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <ArrowLeft size={14} /> Previous
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={isLastStep}
                    className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 px-5 py-2 text-[10px] font-bold shadow-lg shadow-cyan-500/10 transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    Next <ArrowRight size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(0)}
                    className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-[10px] font-semibold transition hover:border-purple-400/30 hover:bg-slate-700"
                  >
                    <RotateCcw size={14} /> Reset
                  </button>
                  <div className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-3 py-2">
                    <Gauge size={14} className="text-purple-400" />
                    <span className="text-[9px] text-slate-500">Speed</span>
                    <select
                      value={speed}
                      onChange={(event) => setSpeed(event.target.value)}
                      className="cursor-pointer bg-transparent text-[10px] font-bold text-white outline-none"
                      aria-label="Animation speed"
                    >
                      {["0.5x", "1x", "1.5x", "2x"].map((option) => (
                        <option key={option} value={option} className="bg-slate-900">{option}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-950">
                  <div className="h-full rounded-full bg-cyan-400 transition-all duration-200" style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }} />
                </div>
                <p className="mt-2 text-center text-[9px] text-slate-600">
                  Step {currentStep + 1} of {steps.length}
                </p>
              </div>

              {isLastStep && (
                <div className={`mt-3 flex items-center justify-center gap-2 rounded-xl border p-3 text-sm font-semibold ${step.foundIndex === null ? "border-amber-500/20 bg-amber-500/5 text-amber-300" : "border-green-500/20 bg-green-500/5 text-green-300"}`}>
                  <CheckCircle2 size={16} />
                  {step.foundIndex === null
                    ? `Target ${target} is not in the ${isHashSearch ? "table" : "array"}`
                    : `Found ${target} at index ${step.foundIndex}`}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function InspectorBox({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-3">
      <p className="mb-2 text-[8px] font-bold uppercase tracking-widest text-slate-600">{title}</p>
      {children}
    </div>
  );
}

function LiveVariable({ name, value, active }: { name: string; value: string | number; active: boolean }) {
  return (
    <div className={`rounded-lg border p-2 ${active ? "border-cyan-500/20 bg-cyan-500/[0.04]" : "border-slate-800 bg-slate-900/60"}`}>
      <p className="text-[8px] uppercase tracking-wider text-slate-600">{name}</p>
      <p className={`mt-1 truncate font-mono text-[11px] font-bold ${active ? "text-cyan-300" : "text-slate-500"}`}>{value}</p>
    </div>
  );
}

function IndexBadge({ label, value, color }: { label: string; value: number | null; color: string }) {
  return (
    <span className={`rounded-md bg-slate-950 px-2 py-1 font-mono text-[9px] ${color}`}>
      {label}: {value ?? "—"}
    </span>
  );
}

function LegendDot({ label, className }: { label: string; className: string }) {
  return (
    <span className="flex items-center gap-1.5 text-[9px] text-slate-500">
      <span className={`h-2 w-2 rounded-full ${className}`} />
      {label}
    </span>
  );
}

function ComplexityCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-2">
      <span className="text-[9px] text-slate-600">{title}</span>
      <p className="mt-1 font-mono text-[11px] font-bold text-white">{value}</p>
    </div>
  );
}
