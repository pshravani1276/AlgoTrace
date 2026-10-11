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

type Language =
  | "TypeScript"
  | "JavaScript"
  | "Python"
  | "Java"
  | "C"
  | "C++";

interface BinarySearchStep {
  line: number;
  low: number | null;
  high: number | null;
  mid: number | null;
  midpointValue: number | null;
  target: number;
  activeRange: number[];
  foundIndex: number | null;
  conditionText: string;
  conditionResult: boolean | null;
  operation: string;
  explanation: string;
  complexity: string;
}

const ARRAY = [4, 9, 15, 21, 28, 36, 42, 57];

const LANGUAGE_OPTIONS: { name: Language; symbol: string }[] = [
  { name: "TypeScript", symbol: "🔷" },
  { name: "JavaScript", symbol: "🟨" },
  { name: "Python", symbol: "🐍" },
  { name: "Java", symbol: "☕" },
  { name: "C", symbol: "🔵" },
  { name: "C++", symbol: "⚙️" },
];

const CODE_BY_LANGUAGE: Record<Language, string[]> = {
  TypeScript: [
    "function binarySearch(array: number[], target: number): number {",
    "  let low = 0;",
    "  let high = array.length - 1;",
    "",
    "  while (low <= high) {",
    "    const mid = Math.floor((low + high) / 2);",
    "    const value = array[mid];",
    "",
    "    if (value === target) {",
    "      return mid;",
    "    }",
    "    if (value < target) {",
    "      low = mid + 1;",
    "    } else {",
    "      high = mid - 1;",
    "    }",
    "  }",
    "  return -1;",
    "}",
  ],
  JavaScript: [
    "function binarySearch(array, target) {",
    "  let low = 0;",
    "  let high = array.length - 1;",
    "",
    "  while (low <= high) {",
    "    const mid = Math.floor((low + high) / 2);",
    "    const value = array[mid];",
    "",
    "    if (value === target) {",
    "      return mid;",
    "    }",
    "    if (value < target) {",
    "      low = mid + 1;",
    "    } else {",
    "      high = mid - 1;",
    "    }",
    "  }",
    "  return -1;",
    "}",
  ],
  Python: [
    "def binary_search(array, target):",
    "    low = 0",
    "    high = len(array) - 1",
    "",
    "    while low <= high:",
    "        mid = (low + high) // 2",
    "        value = array[mid]",
    "",
    "        if value == target:",
    "            return mid",
    "",
    "        if value < target:",
    "            low = mid + 1",
    "        else:",
    "            high = mid - 1",
    "",
    "    return -1",
  ],
  Java: [
    "int binarySearch(int[] array, int target) {",
    "    int low = 0;",
    "    int high = array.length - 1;",
    "",
    "    while (low <= high) {",
    "        int mid = low + (high - low) / 2;",
    "        int value = array[mid];",
    "",
    "        if (value == target) {",
    "            return mid;",
    "        }",
    "        if (value < target) {",
    "            low = mid + 1;",
    "        } else {",
    "            high = mid - 1;",
    "        }",
    "    }",
    "    return -1;",
    "}",
  ],
  C: [
    "int binarySearch(int array[], int size, int target) {",
    "    int low = 0;",
    "    int high = size - 1;",
    "",
    "    while (low <= high) {",
    "        int mid = low + (high - low) / 2;",
    "        int value = array[mid];",
    "",
    "        if (value == target) {",
    "            return mid;",
    "        }",
    "        if (value < target) {",
    "            low = mid + 1;",
    "        } else {",
    "            high = mid - 1;",
    "        }",
    "    }",
    "    return -1;",
    "}",
  ],
  "C++": [
    "int binarySearch(const vector<int>& array, int target) {",
    "    int low = 0;",
    "    int high = static_cast<int>(array.size()) - 1;",
    "",
    "    while (low <= high) {",
    "        int mid = low + (high - low) / 2;",
    "        int value = array[mid];",
    "",
    "        if (value == target) {",
    "            return mid;",
    "        }",
    "        if (value < target) {",
    "            low = mid + 1;",
    "        } else {",
    "            high = mid - 1;",
    "        }",
    "    }",
    "    return -1;",
    "}",
  ],
};

const LINE_MAP: Record<string, number> = {
  functionStart: 1,
  initializeLow: 2,
  initializeHigh: 3,
  loop: 5,
  midpoint: 6,
  readValue: 7,
  foundCheck: 9,
  foundReturn: 10,
  lowerCheck: 12,
  updateLow: 13,
  updateHigh: 15,
  notFound: 18,
  functionEnd: 19,
};

function generateSteps(target: number, language: Language): BinarySearchStep[] {
  const code = CODE_BY_LANGUAGE[language];
  const map = { ...LINE_MAP };
  if (language === "Python") {
    map.notFound = 17;
    map.functionEnd = 0;
  }
  if (code.length < map.functionEnd) {
    map.functionEnd = 0;
  }

  const steps: BinarySearchStep[] = [];
  let low = 0;
  let high = ARRAY.length - 1;
  let foundIndex: number | null = null;

  const addStep = (
    line: number,
    operation: string,
    explanation: string,
    options: Partial<
      Pick<
        BinarySearchStep,
        | "mid"
        | "midpointValue"
        | "conditionText"
        | "conditionResult"
        | "complexity"
      >
    > = {},
  ) => {
    steps.push({
      line,
      low,
      high,
      mid: null,
      midpointValue: null,
      target,
      activeRange:
        low <= high
          ? Array.from({ length: high - low + 1 }, (_, index) => low + index)
          : [],
      foundIndex,
      conditionText: "—",
      conditionResult: null,
      operation,
      explanation,
      complexity: "O(1)",
      ...options,
    });
  };

  addStep(map.functionStart, "Enter Binary Search", "Start searching a sorted array for the target value.");
  addStep(map.initializeLow, "Initialize low pointer", "Set low to the first valid array index: 0.");
  addStep(map.initializeHigh, "Initialize high pointer", `Set high to the last valid index: ${high}.`);

  while (low <= high) {
    addStep(
      map.loop,
      `Check search range: low ≤ high (${low} ≤ ${high})`,
      "The search continues while the active range contains at least one element.",
      {
        conditionText: `low <= high  →  ${low} <= ${high}`,
        conditionResult: true,
        complexity: "O(log n)",
      },
    );

    const mid = Math.floor(low + (high - low) / 2);
    const midpointValue = ARRAY[mid];

    addStep(
      map.midpoint,
      `Calculate midpoint: mid = ${mid}`,
      `Choose the middle index of the current range [${low}, ${high}].`,
      { mid, midpointValue, complexity: "O(1)" },
    );
    addStep(
      map.readValue,
      `Read array[${mid}] = ${midpointValue}`,
      `Inspect the value at the midpoint and compare it with target ${target}.`,
      { mid, midpointValue },
    );

    const found = midpointValue === target;
    addStep(
      map.foundCheck,
      found
        ? `Target match: ${midpointValue} === ${target}`
        : `Check target match: ${midpointValue} === ${target}`,
      found
        ? `The midpoint value equals the target. The target is at index ${mid}.`
        : "The midpoint value is not the target, so check which half may contain it.",
      {
        mid,
        midpointValue,
        conditionText: `array[mid] === target  →  ${midpointValue} === ${target}`,
        conditionResult: found,
      },
    );

    if (found) {
      foundIndex = mid;
      addStep(
        map.foundReturn,
        `Return index ${mid}`,
        `Binary Search found ${target} at index ${mid}.`,
        { mid, midpointValue, complexity: "O(1)" },
      );
      break;
    }

    const targetIsHigher = midpointValue < target;
    addStep(
      map.lowerCheck,
      `Check lower half: ${midpointValue} < ${target}`,
      targetIsHigher
        ? `${target} is larger, so discard the midpoint and everything to its left.`
        : `${target} is smaller, so discard the midpoint and everything to its right.`,
      {
        mid,
        midpointValue,
        conditionText: `array[mid] < target  →  ${midpointValue} < ${target}`,
        conditionResult: targetIsHigher,
      },
    );

    if (targetIsHigher) {
      low = mid + 1;
      addStep(
        map.updateLow,
        `Move low to ${low}`,
        `Continue in the right half, starting at index ${low}.`,
        { mid, midpointValue },
      );
    } else {
      high = mid - 1;
      addStep(
        map.updateHigh,
        `Move high to ${high}`,
        `Continue in the left half, ending at index ${high}.`,
        { mid, midpointValue },
      );
    }
  }

  if (foundIndex === null) {
    addStep(
      map.loop,
      "Search range is empty",
      "low is now greater than high, so no candidate positions remain.",
      {
        conditionText: `low <= high  →  ${low} <= ${high}`,
        conditionResult: false,
        complexity: "O(1)",
      },
    );
    addStep(
      map.notFound,
      "Return -1 (not found)",
      `The target ${target} is not present in this array.`,
      { complexity: "O(1)" },
    );
  }

  if (map.functionEnd > 0) {
    addStep(
      map.functionEnd,
      "Binary Search complete",
      foundIndex === null
        ? "The function completes with -1 because the target was not found."
        : `The function completes with the matching index ${foundIndex}.`,
    );
  }

  return steps;
}

export default function BinarySearchVisualizer() {
  const [language, setLanguage] = useState<Language>("TypeScript");
  const [targetInput, setTargetInput] = useState("28");
  const [currentStep, setCurrentStep] = useState(0);
  const [speed, setSpeed] = useState("1x");
  const parsedTarget = Number(targetInput);
  const target = Number.isFinite(parsedTarget) ? parsedTarget : 0;
  const steps = useMemo(
    () => generateSteps(target, language),
    [target, language],
  );
  const step = steps[Math.min(currentStep, steps.length - 1)];
  const code = CODE_BY_LANGUAGE[language];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;
  const speedDuration =
    speed === "0.5x" ? 700 : speed === "1x" ? 450 : speed === "1.5x" ? 300 : 180;

  function handleNext() {
    if (isLastStep) {
      markBinarySearchCompleted();
      return;
    }
    const nextStep = currentStep + 1;
    setCurrentStep(nextStep);
    if (nextStep === steps.length - 1) markBinarySearchCompleted();
  }

  function handleTargetChange(value: string) {
    setTargetInput(value);
    setCurrentStep(0);
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
              <h1 className="text-lg font-bold">Binary Search</h1>
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
                  <p className="mt-1 text-[9px] text-slate-600">Every-line debugging</p>
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
                      key={`${language}-${lineNumber}`}
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
              <div className="mt-3 grid grid-cols-3 gap-2">
                <ComplexityCard title="Best" value="O(1)" />
                <ComplexityCard title="Average" value="O(log n)" />
                <ComplexityCard title="Space" value="O(1)" />
              </div>
              <p className="mt-3 text-[10px] leading-4 text-slate-400">
                Binary Search needs a sorted array. Each comparison discards half of the remaining range.
              </p>
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
                    <LiveVariable name="low" value={step.low ?? "-"} active />
                    <LiveVariable name="high" value={step.high ?? "-"} active />
                    <LiveVariable name="mid" value={step.mid ?? "-"} active={step.mid !== null} />
                    <LiveVariable name="array[mid]" value={step.midpointValue ?? "-"} active={step.midpointValue !== null} />
                    <LiveVariable name="target" value={step.target} active />
                    <LiveVariable name="result" value={step.foundIndex ?? (isLastStep ? "-1" : "—")} active={step.foundIndex !== null || isLastStep} />
                  </div>
                </div>
                <div className="mt-3 rounded-xl border border-slate-800 bg-slate-900/60 p-3">
                  <p className="mb-2 text-[9px] font-bold uppercase tracking-widest text-slate-500">POINTERS</p>
                  <div className="flex flex-wrap gap-1.5">
                    <IndexBadge label="low" value={step.low} color="text-cyan-300" />
                    <IndexBadge label="mid" value={step.mid} color="text-yellow-300" />
                    <IndexBadge label="high" value={step.high} color="text-purple-300" />
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
                    <p className="text-[9px] text-slate-600">Live Binary Search execution</p>
                  </div>
                </div>
                <span className="rounded-full border border-slate-800 bg-slate-900 px-2.5 py-1 text-[9px] text-slate-500">
                  Sorted array · {ARRAY.length} elements
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
                  <span className="text-[9px] uppercase tracking-widest text-slate-600">Array Visualization</span>
                  <label className="flex items-center gap-2 text-[10px] text-slate-400">
                    Search target
                    <input
                      type="number"
                      value={targetInput}
                      onChange={(event) => handleTargetChange(event.currentTarget.value)}
                      className="w-20 rounded-lg border border-cyan-500/30 bg-slate-900 px-2 py-1.5 font-mono text-sm font-bold text-cyan-300 outline-none focus:border-cyan-400"
                      aria-label="Search target value"
                    />
                  </label>
                </div>
                <div className="flex min-h-[165px] items-center justify-center gap-2 overflow-x-auto px-1 pb-3 pt-2">
                  {ARRAY.map((value, index) => {
                    const isMid = index === step.mid;
                    const isInRange = step.activeRange.includes(index);
                    const isFound = index === step.foundIndex;
                    return (
                      <div key={index} className="flex shrink-0 flex-col items-center">
                        <div
                          style={{ transitionDuration: `${speedDuration}ms` }}
                          className={`relative flex h-14 w-14 items-center justify-center rounded-xl border font-mono text-base font-bold transition-all ${
                            isFound
                              ? "border-green-400 bg-green-500/15 text-green-300 shadow-[0_0_28px_rgba(74,222,128,.3)]"
                              : isMid
                                ? "search-pulse border-yellow-400 bg-yellow-500/15 text-yellow-200"
                                : isInRange
                                  ? "border-cyan-400/50 bg-cyan-500/10 text-cyan-200"
                                  : "border-slate-800 bg-slate-900/50 text-slate-600 opacity-50"
                          }`}
                        >
                          {isMid && !isFound && <span className="absolute -top-2 rounded-full bg-yellow-400 px-1.5 py-0.5 text-[7px] font-bold text-slate-950">MID</span>}
                          {isFound && <span className="absolute -top-2 rounded-full bg-green-400 px-1.5 py-0.5 text-[7px] font-bold text-slate-950">FOUND</span>}
                          {value}
                        </div>
                        <span className="mt-3 font-mono text-[9px] text-slate-600">[{index}]</span>
                        <span className={`mt-1 text-[8px] font-bold ${index === step.low ? "text-cyan-300" : index === step.high ? "text-purple-300" : "text-transparent"}`}>
                          {index === step.low ? "LOW" : index === step.high ? "HIGH" : "—"}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div className="flex flex-wrap justify-center gap-4 border-t border-slate-800 pt-3">
                  <LegendDot label="Active range" className="bg-cyan-400" />
                  <LegendDot label="Midpoint" className="bg-yellow-400" />
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
                  <div
                    className="h-full rounded-full bg-cyan-400 transition-all duration-200"
                    style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                  />
                </div>
                <p className="mt-2 text-center text-[9px] text-slate-600">
                  Step {currentStep + 1} of {steps.length}
                </p>
              </div>

              {isLastStep && (
                <div className="mt-3 flex items-center justify-center gap-2 rounded-xl border border-green-500/20 bg-green-500/5 p-3 text-sm font-semibold text-green-300">
                  <CheckCircle2 size={16} />
                  {step.foundIndex === null
                    ? `Target ${target} is not in the array`
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

function markBinarySearchCompleted() {
  markActivityCompleted("binary-search");
}
