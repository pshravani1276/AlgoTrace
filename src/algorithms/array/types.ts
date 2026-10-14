export type ArraySection = "1d" | "2d" | "advanced";

export type ArrayOperation =
  | "create"
  | "traverse"
  | "insert"
  | "delete"
  | "search"
  | "update"
  | "reverse"
  | "rotate"
  | "sort"
  | "matrix-traverse"
  | "matrix-add"
  | "matrix-transpose"
  | "matrix-multiply"
  | "prefix-sum"
  | "two-pointers"
  | "sliding-window"
  | "kadane"
  | "subarray-extremes";

export interface ArrayStep {
  step: number;
  codeLine: number;
  values: number[];
  matrix: number[][];
  resultMatrix: number[][];
  activeIndices: number[];
  activeCells: [number, number][];
  variables: Record<string, string>;
  result: string;
  operation: string;
  condition: string;
  explanation: string;
}

export type ArrayTraceState = Omit<
  ArrayStep,
  "step" | "codeLine" | "operation" | "condition" | "explanation"
>;

export interface ArrayTraceOptions {
  values: number[];
  matrix: number[][];
  secondMatrix: number[][];
  index: number;
  value: number;
  target: number;
  windowSize: number;
  rotation: number;
}

export type ArrayStepRecorder = (
  codeLine: number,
  operation: string,
  condition: string,
  explanation: string,
  changes?: Partial<ArrayTraceState>,
) => void;

export interface ArrayTrace {
  title: string;
  sourceCode: string[];
  complexity: string;
  steps: ArrayStep[];
}