import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Boxes,
  Code2,
  Layers3,
  RotateCcw,
  Sparkles,
  Table2,
} from "lucide-react";
import { generateArrayTrace } from "../algorithms/array/arraySteps";
import type { ArrayOperation, ArraySection, ArrayStep } from "../algorithms/array/types";
import LanguageSelector, { type Language } from "../components/LanguageSelector";
import { translateSourceCode } from "../utils/sourceCode";

const SECTION_OPERATIONS: Record<ArraySection, ArrayOperation[]> = {
  "1d": ["create", "traverse", "insert", "delete", "search", "update", "reverse", "rotate", "sort"],
  "2d": ["matrix-traverse", "matrix-add", "matrix-transpose", "matrix-multiply"],
  advanced: ["prefix-sum", "two-pointers", "sliding-window", "kadane", "subarray-extremes"],
};

const OPERATION_INFO: Record<ArrayOperation, { label: string; description: string }> = {
  create: { label: "Array Creation", description: "Create an array with custom values." },
  traverse: { label: "Traversal", description: "Highlight each element one by one." },
  insert: { label: "Insertion", description: "Show elements shifting to the right." },
  delete: { label: "Deletion", description: "Show elements shifting to the left." },
  search: { label: "Searching", description: "Highlight elements while searching." },
  update: { label: "Updating", description: "Change the value at a selected index." },
  reverse: { label: "Reversal", description: "Swap elements from the ends inward." },
  rotate: { label: "Rotation", description: "Rotate array elements to the right." },
  sort: { label: "Sorting", description: "Animate shifting and rearranging elements." },
  "matrix-traverse": { label: "Matrix Traversal", description: "Visit each matrix cell row by row." },
  "matrix-add": { label: "Matrix Addition", description: "Add matching cells from two matrices." },
  "matrix-transpose": { label: "Matrix Transpose", description: "Flip the matrix rows and columns." },
  "matrix-multiply": { label: "Matrix Multiplication", description: "Build a product from row-column pairs." },
  "prefix-sum": { label: "Prefix Sums", description: "Build cumulative totals across the array." },
  "two-pointers": { label: "Two Pointers", description: "Find a target sum in sorted values." },
  "sliding-window": { label: "Sliding Window", description: "Track the best sum for a moving window." },
  kadane: { label: "Kadane's Algorithm", description: "Find the maximum-sum contiguous subarray." },
  "subarray-extremes": { label: "Subarray Extremes", description: "Find maximum and minimum subarray sums." },
};

const SECTION_LABELS: Record<ArraySection, string> = {
  "1d": "1D Array",
  "2d": "2D Array",
  advanced: "Advanced",
};

function parseValues(input: string): number[] {
  return input.split(/[\s,]+/).filter(Boolean).map(Number).filter(Number.isFinite);
}

function parseMatrix(input: string): number[][] {
  return input.split(/\n|;/).map((row) => parseValues(row)).filter((row) => row.length > 0);
}

function getStepStatus(step: ArrayStep, isComplete: boolean) {
  if (/invalid|not found|must equal|must have equal|requires equal/i.test(step.result)) {
    return {
      label: "Needs attention",
      tone: "border-rose-400/30 bg-rose-400/10 text-rose-200",
    };
  }
  if (isComplete) {
    return {
      label: "Complete",
      tone: "border-emerald-400/30 bg-emerald-400/10 text-emerald-200",
    };
  }
  if (step.result) {
    return {
      label: "Succeeded",
      tone: "border-emerald-400/30 bg-emerald-400/10 text-emerald-200",
    };
  }
  if (/Compare|Visit|Check|Select|Loop/.test(step.operation)) {
    return {
      label: "Inspecting",
      tone: "border-amber-400/30 bg-amber-400/10 text-amber-200",
    };
  }
  if (/Shift|Swap|Update|Write|Insert|Build|Place|Accumulate|Add cell/.test(step.operation)) {
    return {
      label: "Changing values",
      tone: "border-cyan-400/30 bg-cyan-400/10 text-cyan-200",
    };
  }
  return {
    label: "In progress",
    tone: "border-slate-700 bg-slate-900 text-slate-400",
  };
}

function InputField({
  label,
  value,
  onChange,
  type = "text",
  min,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  min?: number;
}) {
  return (
    <label className="block min-w-0">
      <span className="mb-1.5 block text-[10px] font-semibold text-slate-400">{label}</span>
      <input
        type={type}
        min={min}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
      />
    </label>
  );
}

function ArrayStrip({
  values,
  activeIndices,
  operation,
  reducedMotion,
}: {
  values: number[];
  activeIndices: number[];
  operation: string;
  reducedMotion: boolean;
}) {
  const shift = operation.match(/Shift index (-?\d+) → (-?\d+)/);
  const shiftDirection = shift
    ? Number(shift[2]) > Number(shift[1])
      ? "right"
      : "left"
    : null;
  const isSwap = operation.startsWith("Swap");
  const isComparison = /Compare|Visit|Check|Loop/.test(operation);
  const isMutation = /Shift|Swap|Update|Write|Insert|Build|Place|Accumulate|Add cell/.test(operation);

  return values.length ? (
    <div className="flex min-h-48 flex-wrap items-center justify-center gap-2 py-8">
      {values.map((value, index) => {
        const active = activeIndices.includes(index);
        return (
          <motion.div
            key={index}
            layout
            initial={reducedMotion ? false : { opacity: 0, y: 24, rotateX: -35, scale: 0.85 }}
            animate={{
              opacity: 1,
              y: active ? (reducedMotion ? 0 : -9) : 0,
              rotateX: 0,
              scale: active ? 1.1 : 1,
              boxShadow: active
                ? isComparison
                  ? "0 12px 32px rgba(251, 191, 36, 0.2)"
                  : isMutation
                    ? "0 12px 32px rgba(52, 211, 153, 0.22)"
                    : "0 12px 32px rgba(34, 211, 238, 0.22)"
                : "0 0 0 rgba(34, 211, 238, 0)",
            }}
            transition={{
              layout: reducedMotion
                ? { duration: 0 }
                : { type: "spring", stiffness: 380, damping: 28 },
              opacity: {
                duration: reducedMotion ? 0 : 0.25,
                delay: reducedMotion ? 0 : Math.min(index * 0.045, 0.4),
              },
              y: reducedMotion ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 22 },
              scale: reducedMotion ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 20 },
              boxShadow: { duration: 0.25 },
            }}
            className={`relative flex h-16 w-16 flex-col items-center justify-center rounded-xl border font-semibold transition-colors duration-300 ${
              active && isComparison
                ? "border-amber-300 bg-gradient-to-br from-amber-400/20 to-orange-500/10 text-amber-100"
                : active && isMutation
                  ? "border-emerald-300 bg-gradient-to-br from-emerald-400/20 to-cyan-500/10 text-emerald-100"
                  : active
                    ? "border-cyan-300 bg-gradient-to-br from-cyan-400/25 to-blue-500/15 text-cyan-100"
                    : "border-slate-700 bg-slate-900 text-slate-100"
            }`}
          >
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={value}
                initial={{ opacity: 0, y: reducedMotion ? 0 : 12, scale: reducedMotion ? 1 : 0.7 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: reducedMotion ? 0 : -12, scale: reducedMotion ? 1 : 0.75 }}
                transition={reducedMotion ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 24 }}
                className="inline-block text-lg"
              >
                {value}
              </motion.span>
            </AnimatePresence>
            <span className="text-[9px] text-slate-500">[{index}]</span>
            {active && (shiftDirection || isSwap) ? (
              <motion.span
                key={`${operation}-${index}`}
                initial={{ opacity: 0, y: reducedMotion ? 0 : 5, scale: reducedMotion ? 1 : 0.5 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="absolute -top-3 flex h-5 min-w-5 items-center justify-center rounded-full border border-cyan-300/50 bg-slate-950 px-1 text-[10px] font-bold text-cyan-200 shadow-lg shadow-cyan-500/20"
              >
                {isSwap ? "↔" : shiftDirection === "right" ? "→" : "←"}
              </motion.span>
            ) : null}
          </motion.div>
        );
      })}
    </div>
  ) : (
    <div className="flex min-h-48 items-center justify-center text-xs text-slate-500">
      Enter values to create an array
    </div>
  );
}

function MatrixGrid({
  matrix,
  activeCells,
  label,
  operation,
  reducedMotion,
}: {
  matrix: number[][];
  activeCells: [number, number][];
  label: string;
  operation: string;
  reducedMotion: boolean;
}) {
  return (
    <div>
      <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">{label}</div>
      <div className="inline-grid gap-1.5">
        {matrix.map((row, rowIndex) =>
          row.map((value, colIndex) => {
            const active = activeCells.some(
              ([activeRow, activeCol]) => activeRow === rowIndex && activeCol === colIndex,
            );
            return (
              <motion.div
                key={`${rowIndex}-${colIndex}`}
                layout
                animate={{
                  scale: active ? (reducedMotion ? 1 : 1.08) : 1,
                  y: active && !reducedMotion ? -4 : 0,
                  boxShadow: active
                    ? /Compare|Visit|Check|Select/.test(operation)
                      ? "0 0 20px rgba(251, 191, 36, 0.2)"
                      : "0 0 20px rgba(52, 211, 153, 0.2)"
                    : "0 0 0 rgba(34, 211, 238, 0)",
                }}
                transition={reducedMotion ? { duration: 0 } : { type: "spring", stiffness: 360, damping: 24 }}
                className={`flex h-12 w-12 items-center justify-center rounded-md border font-mono text-sm transition-colors duration-300 ${
                  active
                    ? /Compare|Visit|Check|Select/.test(operation)
                      ? "border-amber-300 bg-amber-400/15 text-amber-100"
                      : "border-emerald-300 bg-emerald-400/15 text-emerald-100"
                    : "border-slate-700 bg-slate-900 text-slate-100"
                }`}
              >
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={value}
                    initial={{ opacity: 0, y: reducedMotion ? 0 : 8, scale: reducedMotion ? 1 : 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: reducedMotion ? 0 : -8, scale: reducedMotion ? 1 : 0.8 }}
                    transition={reducedMotion ? { duration: 0 } : { duration: 0.2 }}
                  >
                    {value}
                  </motion.span>
                </AnimatePresence>
              </motion.div>
            );
          }),
        )}
      </div>
    </div>
  );
}

export default function Arrays() {
  const reducedMotion = useReducedMotion() ?? false;
  const [section, setSection] = useState<ArraySection>("1d");
  const [operation, setOperation] = useState<ArrayOperation>("create");
  const [showVisualizer, setShowVisualizer] = useState(false);
  const [valuesInput, setValuesInput] = useState("10, 20, 30, 40, 50");
  const [matrixInput, setMatrixInput] = useState("1, 2\n3, 4");
  const [secondMatrixInput, setSecondMatrixInput] = useState("5, 6\n7, 8");
  const [indexInput, setIndexInput] = useState("2");
  const [valueInput, setValueInput] = useState("99");
  const [targetInput, setTargetInput] = useState("30");
  const [windowInput, setWindowInput] = useState("3");
  const [rotationInput, setRotationInput] = useState("2");
  const [currentStep, setCurrentStep] = useState(0);
  const [language, setLanguage] = useState<Language>("TypeScript");

  const values = useMemo(() => parseValues(valuesInput), [valuesInput]);
  const matrix = useMemo(() => parseMatrix(matrixInput), [matrixInput]);
  const secondMatrix = useMemo(() => parseMatrix(secondMatrixInput), [secondMatrixInput]);
  const trace = useMemo(
    () =>
      generateArrayTrace(operation, {
        values,
        matrix,
        secondMatrix,
        index: Number(indexInput),
        value: Number(valueInput),
        target: Number(targetInput),
        windowSize: Number(windowInput),
        rotation: Number(rotationInput),
      }),
    [operation, values, matrix, secondMatrix, indexInput, valueInput, targetInput, windowInput, rotationInput],
  );
  const stepIndex = Math.min(currentStep, trace.steps.length - 1);
  const step = trace.steps[stepIndex];
  const stepStatus = getStepStatus(step, stepIndex === trace.steps.length - 1);
  const sourceCode = useMemo(
    () => translateSourceCode(trace.sourceCode, language),
    [trace.sourceCode, language],
  );

  const changeSection = (nextSection: ArraySection) => {
    setSection(nextSection);
    setOperation(SECTION_OPERATIONS[nextSection][0]);
    setCurrentStep(0);
  };

  const updateOperation = (nextOperation: ArrayOperation) => {
    setOperation(nextOperation);
    setCurrentStep(0);
    setShowVisualizer(true);
  };

  const updateInput = (setter: (value: string) => void) => (value: string) => {
    setter(value);
    setCurrentStep(0);
  };

  const isMatrix = section === "2d";
  const isArrayInput = section === "1d" || section === "advanced";

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1500px]">
        {!showVisualizer ? (
          <>
            <header className="mb-10 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-300">
                <Boxes size={24} />
              </div>
              <h1 className="text-3xl font-bold sm:text-5xl">Array Operations</h1>
              <p className="mt-3 text-sm text-slate-400 sm:text-lg">
                Choose an operation to explore with interactive visualizations.
              </p>
            </header>

            <div className="mx-auto mb-8 grid max-w-2xl grid-cols-3 gap-1 rounded-xl border border-slate-800 bg-slate-900/80 p-1">
              {(Object.keys(SECTION_LABELS) as ArraySection[]).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => changeSection(item)}
                  className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-xs font-semibold transition ${
                    section === item
                      ? "bg-cyan-500/15 text-cyan-200"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {item === "2d" ? (
                    <Table2 size={14} />
                  ) : item === "advanced" ? (
                    <Sparkles size={14} />
                  ) : (
                    <Layers3 size={14} />
                  )}
                  {SECTION_LABELS[item]}
                </button>
              ))}
            </div>

            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {SECTION_OPERATIONS[section].map((item, index) => {
                const info = OPERATION_INFO[item];
                const complexity = generateArrayTrace(item, {
                  values,
                  matrix,
                  secondMatrix,
                  index: Number(indexInput),
                  value: Number(valueInput),
                  target: Number(targetInput),
                  windowSize: Number(windowInput),
                  rotation: Number(rotationInput),
                }).complexity;

                return (
                  <motion.button
                    key={item}
                    type="button"
                    onClick={() => updateOperation(item)}
                    whileHover={{ y: -5, scale: 1.015 }}
                    transition={{ duration: 0.2 }}
                    className="group relative min-h-56 overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 p-7 text-left shadow-xl"
                  >
                    <div
                      className={`absolute -right-12 -top-12 h-44 w-44 rounded-full blur-3xl transition-opacity group-hover:opacity-30 ${
                        index % 3 === 0
                          ? "bg-cyan-500/15"
                          : index % 3 === 1
                            ? "bg-violet-500/15"
                            : "bg-emerald-500/15"
                      }`}
                    />
                    <div className="relative z-10">
                      <div className="inline-flex rounded-2xl border border-cyan-400/20 bg-cyan-500/10 p-4 text-cyan-300">
                        {section === "2d" ? (
                          <Table2 size={30} />
                        ) : section === "advanced" ? (
                          <Sparkles size={30} />
                        ) : (
                          <Boxes size={30} />
                        )}
                      </div>
                      <h2 className="mt-5 text-xl font-bold">{info.label}</h2>
                      <p className="mt-2 min-h-10 text-sm leading-5 text-slate-400">{info.description}</p>
                      <div className="mt-5 flex items-center justify-between">
                        <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-cyan-300">
                          {complexity}
                        </span>
                        <span className="flex items-center gap-2 text-sm font-medium text-cyan-400 group-hover:text-cyan-300">
                          Open <ArrowRight size={17} />
                        </span>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </>
        ) : (
          <>
            <header className="mb-5 flex items-center justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowVisualizer(false)}
                  aria-label="Back to array operations"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-700 bg-slate-900 text-slate-300 transition hover:border-cyan-400/50 hover:text-white"
                >
                  <ArrowLeft size={17} />
                </button>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-300">
                  <Code2 size={19} />
                </div>
                <div className="min-w-0">
                  <h1 className="truncate text-lg font-bold sm:text-xl">{trace.title}</h1>
                  <p className="text-[10px] text-slate-500">Step-by-step array operation visualizer</p>
                </div>
              </div>
              <div className={`shrink-0 rounded-lg border px-3 py-2 text-[10px] ${stepStatus.tone}`}>
                STEP <span className="ml-1 font-bold">{step.step}/{trace.steps.length}</span>
              </div>
            </header>

            <div className="grid items-start gap-4 xl:grid-cols-[minmax(250px,0.95fr)_minmax(440px,1.9fr)_minmax(250px,0.95fr)]">
              <aside className="space-y-3">
                <section className="rounded-2xl border border-slate-800 bg-[#050b18] p-4">
                  <div className="mb-3 flex items-center gap-2 text-xs font-bold text-slate-200">
                    <Boxes size={15} className="text-cyan-400" />
                    Input
                  </div>
                  {isArrayInput ? (
                    <div className="space-y-3">
                      <InputField label="Array values" value={valuesInput} onChange={updateInput(setValuesInput)} />
                      {operation === "insert" || operation === "delete" || operation === "update" ? (
                        <InputField label="Index" value={indexInput} onChange={updateInput(setIndexInput)} type="number" min={0} />
                      ) : null}
                      {operation === "insert" || operation === "update" ? (
                        <InputField label="Value" value={valueInput} onChange={updateInput(setValueInput)} type="number" />
                      ) : null}
                      {operation === "search" ? (
                        <InputField label="Search value" value={targetInput} onChange={updateInput(setTargetInput)} type="number" />
                      ) : null}
                      {operation === "rotate" ? (
                        <InputField label="Rotate right by" value={rotationInput} onChange={updateInput(setRotationInput)} type="number" min={0} />
                      ) : null}
                      {operation === "two-pointers" ? (
                        <InputField label="Target sum (ascending array)" value={targetInput} onChange={updateInput(setTargetInput)} type="number" />
                      ) : null}
                      {operation === "sliding-window" ? (
                        <InputField label="Window size" value={windowInput} onChange={updateInput(setWindowInput)} type="number" min={1} />
                      ) : null}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <label className="block">
                        <span className="mb-1.5 block text-[10px] font-semibold text-slate-400">Matrix A</span>
                        <textarea
                          value={matrixInput}
                          onChange={(event) => updateInput(setMatrixInput)(event.target.value)}
                          rows={3}
                          className="w-full resize-y rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 font-mono text-xs text-white"
                        />
                      </label>
                      {operation === "matrix-add" || operation === "matrix-multiply" ? (
                        <label className="block">
                          <span className="mb-1.5 block text-[10px] font-semibold text-slate-400">Matrix B</span>
                          <textarea
                            value={secondMatrixInput}
                            onChange={(event) => updateInput(setSecondMatrixInput)(event.target.value)}
                            rows={3}
                            className="w-full resize-y rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 font-mono text-xs text-white"
                          />
                        </label>
                      ) : null}
                    </div>
                  )}
                </section>

                <section className="rounded-2xl border border-slate-800 bg-[#050b18] p-4">
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                      <Code2 size={15} className="text-cyan-400" />
                      Source Code
                    </div>
                    <LanguageSelector value={language} onChange={setLanguage} />
                  </div>
                  <div className="max-h-[360px] overflow-auto font-mono text-[10px] leading-6">
                    {sourceCode.map((line, index) => {
                      const active = index + 1 === step.codeLine;
                      return (
                        <div
                          key={index}
                          aria-current={active ? "step" : undefined}
                              className={`relative flex gap-2 rounded border-l-2 px-2 py-0.5 ${
                            active
                              ? "border-cyan-400 bg-cyan-400/10 text-cyan-100"
                              : "border-transparent text-slate-400"
                          }`}
                        >
                              {active ? (
                                <motion.span
                                  layoutId="array-active-code-line"
                                  transition={reducedMotion ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 32 }}
                                  className="absolute inset-0 rounded bg-cyan-400/5"
                                />
                              ) : null}
                              <span className="w-5 shrink-0 text-right text-slate-600">{index + 1}</span>
                              <span className="relative whitespace-pre">{line}</span>
                        </div>
                      );
                    })}
                  </div>
                </section>

                <section className="rounded-2xl border border-slate-800 bg-[#050b18] p-4">
                  <div className="mb-2 text-xs font-bold text-cyan-300">Complexity Analysis</div>
                  <div className="font-mono text-sm text-slate-200">{trace.complexity}</div>
                  <p className="mt-2 text-[10px] leading-4 text-slate-500">
                    Update the input to generate a new trace. Each step highlights its source line.
                  </p>
                </section>
              </aside>

              <section className="min-w-0 rounded-2xl border border-slate-800 bg-[#050b18] p-4 sm:p-5">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-sm font-bold text-slate-200">Visualization</h2>
                    <p className="mt-1 text-[10px] text-slate-500">Live array operation execution</p>
                  </div>
                  <span className="rounded-full border border-slate-800 bg-slate-900 px-3 py-1 text-[10px] text-slate-400">
                    {isMatrix ? `${step.matrix.flat().length} cells` : `${step.values.length} elements`}
                  </span>
                </div>

                <motion.div
                  key={`explanation-${step.step}`}
                  initial={{ opacity: 0, y: reducedMotion ? 0 : 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={reducedMotion ? { duration: 0 } : { duration: 0.22 }}
                  className="mb-3 rounded-xl border border-slate-800 bg-slate-950/70 p-4"
                >
                  <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-slate-200">
                    <span className="flex h-6 w-6 items-center justify-center rounded-md bg-amber-400/10 text-amber-300">!</span>
                    What's Happening?
                  </div>
                  <p aria-live="polite" className="text-xs leading-5 text-slate-400">{step.explanation}</p>
                </motion.div>

                <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                  <div className="mb-2 flex items-center justify-between text-[9px] uppercase tracking-widest text-slate-600">
                    <span>{isMatrix ? "Matrix visualization" : "Array visualization"}</span>
                    <span className="font-mono text-cyan-400">{step.operation}</span>
                  </div>
                  {isMatrix ? (
                    <div className="flex min-h-48 flex-wrap items-start justify-center gap-8 py-5">
                      <MatrixGrid matrix={step.matrix} activeCells={step.activeCells} label="Input A" operation={step.operation} reducedMotion={reducedMotion} />
                      {operation === "matrix-add" || operation === "matrix-multiply" ? (
                        <MatrixGrid matrix={secondMatrix} activeCells={step.activeCells} label="Input B" operation={step.operation} reducedMotion={reducedMotion} />
                      ) : null}
                      {step.resultMatrix.length > 0 ? (
                        <MatrixGrid matrix={step.resultMatrix} activeCells={step.activeCells} label="Result" operation={step.operation} reducedMotion={reducedMotion} />
                      ) : null}
                    </div>
                  ) : (
                    <ArrayStrip
                      values={step.values}
                      activeIndices={step.activeIndices}
                      operation={step.operation}
                      reducedMotion={reducedMotion}
                    />
                  )}
                  <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 border-t border-slate-800 pt-3 text-[9px] text-slate-500">
                    <span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-cyan-400" />Active</span>
                    <span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-slate-600" />Inactive</span>
                    <span className="text-slate-600">Indexes are shown below each value</span>
                  </div>
                </div>

                <motion.div
                  key={`result-${step.step}`}
                  initial={{ opacity: 0, y: reducedMotion ? 0 : 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={reducedMotion ? { duration: 0 } : { duration: 0.2 }}
                  className={`mt-3 rounded-lg border px-3 py-2 text-center text-xs ${stepStatus.tone}`}
                >
                  <span className="mr-2 text-[9px] font-bold uppercase tracking-wider">{stepStatus.label}</span>
                  {step.result || step.operation}
                </motion.div>

                <div className="mt-3 rounded-xl border border-slate-800 bg-slate-950/70 p-3">
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    <motion.button
                      type="button"
                      disabled={stepIndex === 0}
                      onClick={() => setCurrentStep((current) => Math.max(0, current - 1))}
                      whileHover={stepIndex === 0 || reducedMotion ? undefined : { y: -1 }}
                      whileTap={stepIndex === 0 || reducedMotion ? undefined : { scale: 0.97 }}
                      className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-xs text-slate-200 disabled:opacity-40"
                    >
                      Previous
                    </motion.button>
                    <motion.button
                      type="button"
                      disabled={stepIndex >= trace.steps.length - 1}
                      onClick={() => setCurrentStep((current) => Math.min(trace.steps.length - 1, current + 1))}
                      whileHover={stepIndex >= trace.steps.length - 1 || reducedMotion ? undefined : { y: -1 }}
                      whileTap={stepIndex >= trace.steps.length - 1 || reducedMotion ? undefined : { scale: 0.97 }}
                      className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2 text-xs font-bold text-white disabled:opacity-40"
                    >
                      Next <ArrowRight size={14} />
                    </motion.button>
                    <motion.button
                      type="button"
                      onClick={() => setCurrentStep(0)}
                      whileHover={reducedMotion ? undefined : { rotate: -4 }}
                      whileTap={reducedMotion ? undefined : { scale: 0.96 }}
                      className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-xs text-slate-200"
                    >
                      <RotateCcw size={14} /> Reset
                    </motion.button>
                  </div>
                  <div className="mt-3 h-1 overflow-hidden rounded-full bg-slate-900">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500"
                      animate={{ width: `${((stepIndex + 1) / trace.steps.length) * 100}%` }}
                      transition={{ type: "spring", stiffness: 140, damping: 24 }}
                    />
                  </div>
                </div>
              </section>

              <aside className="space-y-3">
                <section className="rounded-2xl border border-slate-800 bg-[#050b18] p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="text-xs font-bold text-slate-200">Inspector</div>
                    <span className={`rounded-full border px-2 py-1 text-[9px] ${stepStatus.tone}`}>
                      Line {step.codeLine}
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
                      <div className="text-[9px] font-semibold uppercase tracking-wider text-slate-600">Current Operation</div>
                      <AnimatePresence mode="wait" initial={false}>
                        <motion.p
                          key={`operation-${step.step}`}
                          initial={{ opacity: 0, x: reducedMotion ? 0 : 6 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: reducedMotion ? 0 : -6 }}
                          transition={reducedMotion ? { duration: 0 } : { duration: 0.16 }}
                          className="mt-2 text-xs leading-5 text-slate-200"
                        >
                          {step.operation}
                        </motion.p>
                      </AnimatePresence>
                    </div>
                    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
                      <div className="text-[9px] font-semibold uppercase tracking-wider text-slate-600">Condition</div>
                      <AnimatePresence mode="wait" initial={false}>
                        <motion.p
                          key={`condition-${step.step}`}
                          initial={{ opacity: 0, x: reducedMotion ? 0 : 6 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: reducedMotion ? 0 : -6 }}
                          transition={reducedMotion ? { duration: 0 } : { duration: 0.16 }}
                          className="mt-2 break-words font-mono text-[10px] leading-5 text-slate-300"
                        >
                          {step.condition}
                        </motion.p>
                      </AnimatePresence>
                    </div>
                  </div>
                </section>

                <section className="rounded-2xl border border-slate-800 bg-[#050b18] p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="text-xs font-bold text-slate-200">Live Variables</div>
                    <span className="flex items-center gap-1.5 text-[9px] text-emerald-400">
                      <i className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> LIVE
                    </span>
                  </div>
                  {Object.entries(step.variables).length ? (
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(step.variables).map(([name, value]) => (
                        <motion.div
                          key={name}
                          layout
                          initial={{ opacity: 0, y: reducedMotion ? 0 : 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={reducedMotion ? { duration: 0 } : { duration: 0.18 }}
                          className="min-w-0 rounded-xl border border-slate-800 bg-slate-900/60 p-3"
                        >
                          <div className="truncate text-[9px] uppercase tracking-wider text-slate-600">{name}</div>
                          <AnimatePresence mode="popLayout" initial={false}>
                            <motion.div
                              key={value}
                              initial={{ opacity: 0, y: reducedMotion ? 0 : 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: reducedMotion ? 0 : -5 }}
                              transition={reducedMotion ? { duration: 0 } : { duration: 0.16 }}
                              className="mt-1 break-all font-mono text-xs text-cyan-200"
                            >
                              {value}
                            </motion.div>
                          </AnimatePresence>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 text-xs text-slate-500">
                      No variables in this step
                    </div>
                  )}
                </section>

                <section className="rounded-2xl border border-slate-800 bg-[#050b18] p-4">
                  <div className="mb-3 text-xs font-bold text-slate-200">Array Positions</div>
                  {step.activeIndices.length ? (
                    <div className="flex flex-wrap gap-2">
                      <AnimatePresence mode="popLayout">
                        {step.activeIndices.map((index) => (
                          <motion.span
                            key={index}
                            layout
                            initial={{ opacity: 0, scale: reducedMotion ? 1 : 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: reducedMotion ? 1 : 0.8 }}
                            className="rounded-lg border border-cyan-400/30 bg-cyan-400/10 px-3 py-2 font-mono text-xs text-cyan-200"
                          >
                            [{index}] {step.values[index] ?? "—"}
                          </motion.span>
                        ))}
                      </AnimatePresence>
                    </div>
                  ) : step.activeCells.length ? (
                    <div className="flex flex-wrap gap-2">
                      <AnimatePresence mode="popLayout">
                        {step.activeCells.map(([row, col]) => (
                          <motion.span
                            key={`${row}-${col}`}
                            layout
                            initial={{ opacity: 0, scale: reducedMotion ? 1 : 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: reducedMotion ? 1 : 0.8 }}
                            className="rounded-lg border border-cyan-400/30 bg-cyan-400/10 px-3 py-2 font-mono text-xs text-cyan-200"
                          >
                            [{row}][{col}]
                          </motion.span>
                        ))}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 text-xs text-slate-500">
                      No active positions
                    </div>
                  )}
                </section>
              </aside>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
