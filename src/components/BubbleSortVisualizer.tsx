import { useMemo, useState, type ReactNode } from "react";
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

type Phase =
  | "start"
  | "initialization"
  | "outer-loop"
  | "inner-loop"
  | "condition"
  | "swap"
  | "increment-j"
  | "increment-i"
  | "return"
  | "complete";

interface BubbleStep {
  step: number;
  line: number;
  array: number[];
  i: number | null;
  j: number | null;
  n: number;
  leftValue: number | null;
  rightValue: number | null;
  comparing: number[];
  swapping: number[];
  sorted: number[];
  conditionText: string;
  conditionResult: boolean | null;
  operation: string;
  explanation: string;
  phase: Phase;
  complexity: string;
  complexityExplanation: string;
}

const INITIAL_ARRAY = [64, 34, 25, 12, 22, 11, 90];

const LANGUAGE_OPTIONS: {
  name: Language;
  symbol: string;
}[] = [
  { name: "TypeScript", symbol: "🔷" },
  { name: "JavaScript", symbol: "🟨" },
  { name: "Python", symbol: "🐍" },
  { name: "Java", symbol: "☕" },
  { name: "C", symbol: "🔵" },
  { name: "C++", symbol: "⚙️" },
];

const CODE_BY_LANGUAGE: Record<Language, string[]> = {
  TypeScript: [
    "function bubbleSort(array: number[]) {",
    "  const n = array.length;",
    "",
    "  for (let i = 0; i < n - 1; i++) {",
    "    for (let j = 0; j < n - i - 1; j++) {",
    "      if (array[j] > array[j + 1]) {",
    "        [array[j], array[j + 1]] =",
    "          [array[j + 1], array[j]];",
    "      }",
    "    }",
    "  }",
    "",
    "  return array;",
    "}",
  ],

  JavaScript: [
    "function bubbleSort(array) {",
    "  const n = array.length;",
    "",
    "  for (let i = 0; i < n - 1; i++) {",
    "    for (let j = 0; j < n - i - 1; j++) {",
    "      if (array[j] > array[j + 1]) {",
    "        [array[j], array[j + 1]] =",
    "          [array[j + 1], array[j]];",
    "      }",
    "    }",
    "  }",
    "",
    "  return array;",
    "}",
  ],

  Python: [
    "def bubble_sort(array):",
    "    n = len(array)",
    "",
    "    for i in range(n - 1):",
    "        for j in range(n - i - 1):",
    "            if array[j] > array[j + 1]:",
    "                array[j], array[j + 1] =",
    "                    array[j + 1], array[j]",
    "",
    "    return array",
  ],

  Java: [
    "void bubbleSort(int[] array) {",
    "    int n = array.length;",
    "",
    "    for (int i = 0; i < n - 1; i++) {",
    "        for (int j = 0; j < n - i - 1; j++) {",
    "            if (array[j] > array[j + 1]) {",
    "                int temp = array[j];",
    "                array[j] = array[j + 1];",
    "                array[j + 1] = temp;",
    "            }",
    "        }",
    "    }",
    "",
    "    return;",
    "}",
  ],

  C: [
    "void bubbleSort(int array[], int n) {",
    "    for (int i = 0; i < n - 1; i++) {",
    "        for (int j = 0; j < n - i - 1; j++) {",
    "            if (array[j] > array[j + 1]) {",
    "                int temp = array[j];",
    "                array[j] = array[j + 1];",
    "                array[j + 1] = temp;",
    "            }",
    "        }",
    "    }",
    "}",
  ],

  "C++": [
    "void bubbleSort(vector<int>& array) {",
    "    int n = array.size();",
    "",
    "    for (int i = 0; i < n - 1; i++) {",
    "        for (int j = 0; j < n - i - 1; j++) {",
    "            if (array[j] > array[j + 1]) {",
    "                swap(array[j], array[j + 1]);",
    "            }",
    "        }",
    "    }",
    "",
    "    return;",
    "}",
  ],
};

function createStep(
  step: number,
  line: number,
  array: number[],
  i: number | null,
  j: number | null,
  n: number,
  leftValue: number | null,
  rightValue: number | null,
  comparing: number[],
  swapping: number[],
  sorted: number[],
  conditionText: string,
  conditionResult: boolean | null,
  operation: string,
  explanation: string,
  phase: Phase,
  complexity: string,
  complexityExplanation: string,
): BubbleStep {
  return {
    step,
    line,
    array: [...array],
    i,
    j,
    n,
    leftValue,
    rightValue,
    comparing: [...comparing],
    swapping: [...swapping],
    sorted: [...sorted],
    conditionText,
    conditionResult,
    operation,
    explanation,
    phase,
    complexity,
    complexityExplanation,
  };
}

interface LanguageLineMap {
  functionStart: number;
  length: number;
  outerLoop: number;
  innerLoop: number;
  condition: number;
  swapStart: number;
  swapSecond: number;
  closingIf: number;
  closingInner: number;
  closingOuter: number;
  returnLine: number;
  closingFunction: number;
}

const LINE_MAPS: Record<Language, LanguageLineMap> = {
  TypeScript: {
    functionStart: 1,
    length: 2,
    outerLoop: 4,
    innerLoop: 5,
    condition: 6,
    swapStart: 7,
    swapSecond: 8,
    closingIf: 9,
    closingInner: 10,
    closingOuter: 11,
    returnLine: 13,
    closingFunction: 14,
  },

  JavaScript: {
    functionStart: 1,
    length: 2,
    outerLoop: 4,
    innerLoop: 5,
    condition: 6,
    swapStart: 7,
    swapSecond: 8,
    closingIf: 9,
    closingInner: 10,
    closingOuter: 11,
    returnLine: 13,
    closingFunction: 14,
  },

  Python: {
    functionStart: 1,
    length: 2,
    outerLoop: 4,
    innerLoop: 5,
    condition: 6,
    swapStart: 7,
    swapSecond: 8,
    closingIf: 9,
    closingInner: 9,
    closingOuter: 9,
    returnLine: 11,
    closingFunction: 11,
  },

  Java: {
    functionStart: 1,
    length: 2,
    outerLoop: 4,
    innerLoop: 5,
    condition: 6,
    swapStart: 7,
    swapSecond: 8,
    closingIf: 10,
    closingInner: 11,
    closingOuter: 12,
    returnLine: 14,
    closingFunction: 15,
  },

  C: {
    functionStart: 1,
    length: 1,
    outerLoop: 2,
    innerLoop: 3,
    condition: 4,
    swapStart: 5,
    swapSecond: 6,
    closingIf: 8,
    closingInner: 9,
    closingOuter: 10,
    returnLine: 10,
    closingFunction: 10,
  },

  "C++": {
    functionStart: 1,
    length: 2,
    outerLoop: 4,
    innerLoop: 5,
    condition: 6,
    swapStart: 7,
    swapSecond: 7,
    closingIf: 8,
    closingInner: 9,
    closingOuter: 10,
    returnLine: 12,
    closingFunction: 13,
  },
};

function generateBubbleSortSteps(
  input: number[],
  language: Language,
): BubbleStep[] {
  const steps: BubbleStep[] = [];

  const array = [...input];
  const n = array.length;

  const code = CODE_BY_LANGUAGE[language];
  const map = LINE_MAPS[language];

  let stepNumber = 1;

  const sorted: number[] = [];

  /*
   * IMPORTANT:
   * This is the actual source-code condition shown in
   * the CONDITION inspector.
   *
   * Example:
   * if (array[j] > array[j + 1]) {
   */
  const sourceCondition =
    code[map.condition - 1]?.trim() ||
    "if (array[j] > array[j + 1]) {";

  const pushLine = (
    line: number,
    i: number | null,
    j: number | null,
    phase: Phase,
    operation: string,
    explanation: string,
    conditionText?: string,
    conditionResult: boolean | null = null,
    comparing: number[] = [],
    swapping: number[] = [],
    leftValue: number | null = null,
    rightValue: number | null = null,
    complexity = "O(1)",
    complexityExplanation = "This individual debugging step takes constant time.",
  ) => {
    if (line < 1 || line > code.length) {
      return;
    }

    /*
     * IMPORTANT FIX:
     *
     * When the current source line is the condition line,
     * always use the REAL SOURCE CODE condition instead of
     * "Line 6", "Line 4", etc.
     */
    let finalConditionText = conditionText ?? "—";

    if (line === map.condition) {
      finalConditionText = sourceCondition;

      if (conditionResult !== null) {
        finalConditionText = `${sourceCondition} → ${
          conditionResult ? "TRUE" : "FALSE"
        }`;
      }
    }

    steps.push(
      createStep(
        stepNumber++,
        line,
        array,
        i,
        j,
        n,
        leftValue,
        rightValue,
        comparing,
        swapping,
        sorted,
        finalConditionText,
        conditionResult,
        operation,
        explanation,
        phase,
        complexity,
        complexityExplanation,
      ),
    );
  };

  /*
   * INITIAL SOURCE-CODE WALK
   *
   * Every displayed source line is visited.
   */

  for (let line = 1; line <= code.length; line++) {
    let phase: Phase = "start";
    let operation: string;
    let explanation: string;

    if (line === map.functionStart) {
      phase = "start";
      operation = "Entering Bubble Sort function";
      explanation =
        "The Bubble Sort function is entered and execution begins.";
    } else if (line === map.length) {
      phase = "initialization";
      operation = "Reading array length";
      explanation = `The algorithm prepares the array length. n = ${n}.`;
    } else if (code[line - 1].trim() === "") {
      phase = "start";
      operation = `Debugging blank source line ${line}`;
      explanation =
        "This source line is blank, but the debugger still visits it so every source line is traceable.";
    } else {
      operation = `Debugging source line ${line}`;
      explanation =
        `The debugger is checking source-code line ${line} before continuing execution.`;
    }

    /*
     * IMPORTANT:
     * If the initial source walk reaches the condition line,
     * display the actual condition instead of "Line X".
     */
    pushLine(
      line,
      null,
      null,
      phase,
      operation,
      explanation,
      line === map.condition
        ? sourceCondition
        : code[line - 1].trim() || "—",
      null,
      [],
      [],
      null,
      null,
      "O(1)",
      "Reading or stepping through one source line is constant time.",
    );
  }

  /*
   * ACTUAL BUBBLE SORT EXECUTION
   */

  for (let i = 0; i < n - 1; i++) {
    pushLine(
      map.outerLoop,
      i,
      null,
      "outer-loop",
      `Checking outer loop: i = ${i}`,
      `The outer loop begins pass ${i + 1}.`,
      code[map.outerLoop - 1]?.trim() || "Outer loop",
      i < n - 1,
      [],
      [],
      null,
      null,
      "O(n)",
      "The outer loop can execute up to n - 1 times.",
    );

    for (let j = 0; j < n - i - 1; j++) {
      const left = array[j];
      const right = array[j + 1];

      pushLine(
        map.innerLoop,
        i,
        j,
        "inner-loop",
        `Checking inner loop: j = ${j}`,
        `The inner loop selects adjacent positions ${j} and ${j + 1}.`,
        code[map.innerLoop - 1]?.trim() || "Inner loop",
        j < n - i - 1,
        [],
        [],
        left,
        right,
        "O(n²)",
        "The inner loop executes across adjacent elements during every outer pass.",
      );

      /*
       * CONDITION
       *
       * This is the important part.
       *
       * CONDITION inspector receives:
       *
       * if (array[j] > array[j + 1]) { → TRUE
       *
       * OR
       *
       * if (array[j] > array[j + 1]) { → FALSE
       */

      const shouldSwap = left > right;

      pushLine(
        map.condition,
        i,
        j,
        "condition",
        shouldSwap
          ? `Condition TRUE: ${left} > ${right}`
          : `Condition FALSE: ${left} > ${right}`,
        shouldSwap
          ? `${left} is greater than ${right}, so the two adjacent values must be swapped.`
          : `${left} is not greater than ${right}, so the current order is already correct.`,
        sourceCondition,
        shouldSwap,
        [j, j + 1],
        [],
        left,
        right,
        "O(1)",
        "Comparing two adjacent values takes constant time.",
      );

      if (shouldSwap) {
        pushLine(
          map.swapStart,
          i,
          j,
          "swap",
          `Preparing swap: ${left} ↔ ${right}`,
          `The swap operation starts for positions ${j} and ${j + 1}.`,
          sourceCondition,
          true,
          [j, j + 1],
          [j, j + 1],
          left,
          right,
          "O(1)",
          "Starting a swap is a constant-time operation.",
        );

        const temp = array[j];

        array[j] = array[j + 1];
        array[j + 1] = temp;

        if (language === "TypeScript" || language === "JavaScript") {
          pushLine(
            map.swapSecond,
            i,
            j,
            "swap",
            "Writing swapped values",
            "The two adjacent values have exchanged their positions.",
            sourceCondition,
            null,
            [j, j + 1],
            [j, j + 1],
            array[j],
            array[j + 1],
            "O(1)",
            "Writing two values takes constant time.",
          );
        }

        if (language === "Java" || language === "C") {
          pushLine(
            map.swapSecond,
            i,
            j,
            "swap",
            "Writing second swapped value",
            "The second assignment of the swap is executed.",
            sourceCondition,
            null,
            [j, j + 1],
            [j, j + 1],
            array[j],
            array[j + 1],
            "O(1)",
            "A single assignment is constant time.",
          );
        }

        if (language === "C++") {
          pushLine(
            map.swapStart,
            i,
            j,
            "swap",
            `swap(array[${j}], array[${j + 1}])`,
            "The C++ swap operation exchanges the two adjacent values.",
            sourceCondition,
            true,
            [j, j + 1],
            [j, j + 1],
            array[j],
            array[j + 1],
            "O(1)",
            "Swapping two values is constant time.",
          );
        }

        if (map.closingIf <= code.length) {
          pushLine(
            map.closingIf,
            i,
            j,
            "swap",
            "Closing swap condition",
            "The swap block has completed and execution returns to the inner loop.",
            sourceCondition,
            null,
            [],
            [],
            null,
            null,
            "O(1)",
            "Closing a conditional block is constant time.",
          );
        }
      } else {
        if (
          map.closingIf <= code.length &&
          map.closingIf !== map.swapSecond
        ) {
          pushLine(
            map.closingIf,
            i,
            j,
            "condition",
            "Skipping swap block",
            "The condition was false, so the swap block is skipped.",
            sourceCondition,
            false,
            [j, j + 1],
            [],
            left,
            right,
            "O(1)",
            "No swap is performed.",
          );
        }
      }

      if (
        map.closingInner <= code.length &&
        map.closingInner !== map.closingIf
      ) {
        pushLine(
          map.closingInner,
          i,
          j,
          "increment-j",
          `Completing inner-loop iteration j = ${j}`,
          `The current inner-loop iteration is complete. The debugger prepares to move toward j = ${
            j + 1
          }.`,
          code[map.closingInner - 1]?.trim() || "Inner loop completed",
          null,
          [],
          [],
          null,
          null,
          "O(1)",
          "Advancing the loop variable is constant time.",
        );
      }

      pushLine(
        map.innerLoop,
        i,
        j + 1,
        "increment-j",
        `Moving to j = ${j + 1}`,
        "The inner loop advances to the next adjacent pair.",
        code[map.innerLoop - 1]?.trim() || "Inner loop",
        null,
        [],
        [],
        null,
        null,
        "O(1)",
        "Incrementing j takes constant time.",
      );
    }

    const sortedIndex = n - i - 1;

    if (!sorted.includes(sortedIndex)) {
      sorted.push(sortedIndex);
    }

    if (
      map.closingOuter <= code.length &&
      map.closingOuter !== map.closingInner
    ) {
      pushLine(
        map.closingOuter,
        i,
        null,
        "increment-i",
        `Completing outer pass ${i + 1}`,
        `The largest remaining value has bubbled into index ${sortedIndex}.`,
        code[map.closingOuter - 1]?.trim() || "Outer loop completed",
        null,
        [],
        [],
        null,
        null,
        "O(1)",
        "Completing one outer-loop pass is constant time.",
      );
    }

    pushLine(
      map.outerLoop,
      i + 1,
      null,
      "increment-i",
      `Moving to i = ${i + 1}`,
      `The outer loop advances to the next pass. Index ${sortedIndex} is now fixed.`,
      code[map.outerLoop - 1]?.trim() || "Outer loop",
      null,
      [],
      [],
      null,
      null,
      "O(1)",
      "Incrementing i is constant time.",
    );
  }

  const finalSorted = Array.from(
    { length: n },
    (_, index) => index,
  );

  sorted.length = 0;
  sorted.push(...finalSorted);

  pushLine(
    map.returnLine,
    n - 1,
    null,
    "return",
    "Returning sorted array",
    "All elements are now in their final positions.",
    code[map.returnLine - 1]?.trim() || "return",
    true,
    [],
    [],
    null,
    null,
    "O(1)",
    "Returning the final array reference is constant time.",
  );

  if (
    map.closingFunction <= code.length &&
    map.closingFunction !== map.returnLine
  ) {
    pushLine(
      map.closingFunction,
      n - 1,
      null,
      "complete",
      "Bubble Sort function completed",
      "The Bubble Sort function has reached its final source line.",
      code[map.closingFunction - 1]?.trim() || "Function completed",
      true,
      [],
      [],
      null,
      null,
      "O(1)",
      "Function completion is constant time.",
    );
  }

  /*
   * GUARANTEE EVERY SOURCE LINE IS REPRESENTED
   */

  const visitedLines = new Set(
    steps.map((item) => item.line),
  );

  const missingLines: number[] = [];

  for (let line = 1; line <= code.length; line++) {
    if (!visitedLines.has(line)) {
      missingLines.push(line);
    }
  }

  if (missingLines.length > 0) {
    const finalArray = [...array];

    for (const missingLine of missingLines) {
      const missingCondition =
        missingLine === map.condition
          ? sourceCondition
          : code[missingLine - 1]?.trim() || "—";

      steps.splice(
        Math.max(0, steps.length - 1),
        0,
        createStep(
          0,
          missingLine,
          finalArray,
          n - 1,
          null,
          n,
          null,
          null,
          [],
          [],
          finalSorted,
          missingCondition,
          null,
          `Visiting source line ${missingLine}`,
          `The debugger explicitly visits source-code line ${missingLine} so no line is skipped.`,
          "complete",
          "O(1)",
          "This debugging checkpoint is constant time.",
        ),
      );
    }
  }

  return steps.map((item, index) => ({
    ...item,
    step: index + 1,
  }));
}

export default function BubbleSortVisualizer() {
  const [language, setLanguage] =
    useState<Language>("TypeScript");

  const steps = useMemo(
    () =>
      generateBubbleSortSteps(
        INITIAL_ARRAY,
        language,
      ),
    [language],
  );

  const [currentStep, setCurrentStep] = useState(0);
  const [speed, setSpeed] = useState("1x");

  const step =
    steps[
      Math.min(
        currentStep,
        Math.max(0, steps.length - 1),
      )
    ];

  const code = CODE_BY_LANGUAGE[language];

  const isFirstStep = currentStep === 0;

  const isLastStep =
    currentStep === steps.length - 1;

  const speedDuration =
    speed === "0.5x"
      ? 700
      : speed === "1x"
        ? 450
        : speed === "1.5x"
          ? 300
          : 180;

  function handleNext() {
    if (isLastStep) {
      markBubbleSortCompleted();
      return;
    }

    const nextStep = currentStep + 1;

    setCurrentStep(nextStep);

    if (nextStep === steps.length - 1) {
      markBubbleSortCompleted();
    }
  }

  function handlePrevious() {
    if (isFirstStep) {
      return;
    }

    setCurrentStep((previous) =>
      Math.max(0, previous - 1),
    );
  }

  function handleReset() {
    setCurrentStep(0);
  }

  function handleLanguageChange(
    nextLanguage: Language,
  ) {
    setLanguage(nextLanguage);
    setCurrentStep(0);
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#020617] text-white">
      <style>{`
        @keyframes gridMove {
          0% {
            transform: translate(0, 0);
          }

          100% {
            transform: translate(40px, 40px);
          }
        }

        @keyframes comparePulse {
          0%,100% {
            box-shadow:
              0 0 10px rgba(34,211,238,.12),
              0 0 0 rgba(34,211,238,0);
          }

          50% {
            box-shadow:
              0 0 30px rgba(34,211,238,.42),
              0 0 70px rgba(99,102,241,.15);
          }
        }

        @keyframes swapPulse {
          0% {
            transform: translateY(0) scale(1);
          }

          25% {
            transform: translateY(-8px) scale(1.08);
          }

          50% {
            transform: translateY(4px) scale(.98);
          }

          75% {
            transform: translateY(-4px) scale(1.04);
          }

          100% {
            transform: translateY(0) scale(1);
          }
        }

        @keyframes livePulse {
          0%,100% {
            opacity: .45;
            transform: scale(.8);
          }

          50% {
            opacity: 1;
            transform: scale(1.25);
          }
        }

        @keyframes successPulse {
          0% {
            transform: scale(.6);
            opacity: .8;
          }

          100% {
            transform: scale(2);
            opacity: 0;
          }
        }

        @keyframes quantumGlow {
          0%,100% {
            opacity: .15;
            transform: scale(1) rotate(0deg);
          }

          25% {
            opacity: .35;
            transform: scale(1.05) rotate(90deg);
          }

          50% {
            opacity: .2;
            transform: scale(1.12) rotate(180deg);
          }

          75% {
            opacity: .4;
            transform: scale(1.04) rotate(270deg);
          }
        }

        @keyframes quantumOrbit {
          from {
            transform: rotate(0deg) translateX(18px) rotate(0deg);
          }

          to {
            transform: rotate(360deg) translateX(18px) rotate(-360deg);
          }
        }

        @keyframes scanLine {
          0% {
            transform: translateY(-100%);
            opacity: 0;
          }

          15% {
            opacity: .4;
          }

          85% {
            opacity: .4;
          }

          100% {
            transform: translateY(100%);
            opacity: 0;
          }
        }

        .algo-grid {
          background-image:
            linear-gradient(
              rgba(56,189,248,.035) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(56,189,248,.035) 1px,
              transparent 1px
            );

          background-size: 40px 40px;

          animation:
            gridMove
            12s linear infinite;
        }

        .compare-pulse {
          animation:
            comparePulse
            1.2s
            ease-in-out infinite;
        }

        .swap-pulse {
          animation:
            swapPulse
            .45s
            ease-in-out;
        }

        .live-dot {
          animation:
            livePulse
            1.3s
            ease-in-out infinite;
        }

        .success-pulse {
          animation:
            successPulse
            1.5s
            ease-out infinite;
        }

        .quantum-glow {
          animation:
            quantumGlow
            7s
            ease-in-out infinite;
        }

        .quantum-orbit {
          animation:
            quantumOrbit
            4s
            linear infinite;
        }

        .scan-line {
          animation:
            scanLine
            4s
            ease-in-out infinite;
        }
      `}</style>

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="algo-grid absolute inset-[-80px]" />

        <div className="absolute left-[5%] top-[10%] h-64 w-64 rounded-full bg-cyan-500/[0.035] blur-3xl" />

        <div className="absolute bottom-[10%] right-[8%] h-72 w-72 rounded-full bg-indigo-500/[0.035] blur-3xl" />

        <div className="quantum-glow absolute left-[30%] top-[30%] h-40 w-40 rounded-full border border-cyan-400/10" />

        <div className="quantum-glow absolute right-[30%] top-[20%] h-52 w-52 rounded-full border border-indigo-400/10" />

        <div className="absolute left-[30%] top-[30%]">
          <div className="quantum-orbit h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_20px_rgba(34,211,238,.9)]" />
        </div>

        <div className="scan-line absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-transparent via-cyan-400/[0.035] to-transparent" />
      </div>

      <div className="relative mx-auto max-w-[1550px] p-4 lg:p-5">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-500/10 text-cyan-300">
              <Code2 size={19} />

              <span className="absolute inset-0 rounded-xl border border-cyan-400/20 opacity-40" />
            </div>

            <div>
              <h1 className="text-lg font-bold">
                Bubble Sort
              </h1>

              <p className="text-[10px] text-slate-500">
                Step-by-step execution visualizer
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-cyan-400/10 bg-slate-900/90 px-3 py-2">
            <span className="text-[9px] uppercase tracking-widest text-slate-600">
              STEP
            </span>

            <span className="ml-2 font-mono text-sm font-bold text-cyan-400">
              {currentStep + 1}/{steps.length}
            </span>
          </div>
        </div>

        <div className="grid items-start gap-4 lg:grid-cols-12">
          <section className="lg:col-span-3">
            <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/95 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 p-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Code2
                      size={15}
                      className="text-cyan-400"
                    />

                    <h2 className="text-sm font-bold">
                      Source Code
                    </h2>
                  </div>

                  <p className="mt-1 text-[9px] text-slate-600">
                    Every-line debugging
                  </p>
                </div>

                <div className="flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-900 px-2 py-1.5">
                  <span className="text-sm">
                    {
                      LANGUAGE_OPTIONS.find(
                        (item) =>
                          item.name === language,
                      )?.symbol
                    }
                  </span>

                  <select
                    value={language}
                    onChange={(event) =>
                      handleLanguageChange(
                        event.target.value as Language,
                      )
                    }
                    className="cursor-pointer bg-transparent text-[10px] font-semibold text-slate-200 outline-none"
                  >
                    {LANGUAGE_OPTIONS.map(
                      (item) => (
                        <option
                          key={item.name}
                          value={item.name}
                          className="bg-slate-950 text-white"
                        >
                          {item.symbol}{" "}
                          {item.name}
                        </option>
                      ),
                    )}
                  </select>
                </div>
              </div>

              <div className="h-[430px] overflow-hidden p-2.5">
                {code.map((lineText, index) => {
                  const lineNumber = index + 1;

                  const active =
                    lineNumber === step.line;

                  return (
                    <div
                      key={`${language}-${lineNumber}`}
                      className={`
                        relative
                        flex
                        min-h-[26px]
                        items-start
                        rounded-md
                        px-2
                        py-1
                        transition-all
                        duration-300
                        ${
                          active
                            ? "border-l-2 border-cyan-400 bg-cyan-400/10 shadow-[0_0_22px_rgba(34,211,238,.1)]"
                            : "border-l-2 border-transparent"
                        }
                      `}
                    >
                      {active && (
                        <span className="pointer-events-none absolute inset-0 rounded-md bg-cyan-400/[0.025]" />
                      )}

                      <span
                        className={`
                          relative
                          w-8
                          shrink-0
                          font-mono
                          text-[11px]
                          ${
                            active
                              ? "font-bold text-cyan-400"
                              : "text-slate-700"
                          }
                        `}
                      >
                        {lineNumber}
                      </span>

                      <span
                        className={`
                          relative
                          whitespace-pre-wrap
                          font-mono
                          text-[11px]
                          leading-5
                          ${
                            active
                              ? "font-bold text-cyan-200"
                              : "text-slate-500"
                          }
                        `}
                      >
                        {lineText || " "}
                      </span>

                      {active && (
                        <span className="relative ml-auto mt-1.5 h-2 w-2 shrink-0 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,.9)]" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-3 rounded-2xl border border-cyan-500/15 bg-cyan-500/[0.035] p-3 shadow-xl">
              <div className="flex items-center gap-2">
                <Zap
                  size={15}
                  className="text-cyan-400"
                />

                <div>
                  <h2 className="text-sm font-bold text-cyan-300">
                    Complexity Analysis
                  </h2>

                  <p className="text-[9px] text-slate-600">
                    Current operation complexity
                  </p>
                </div>

                <span className="ml-auto rounded-full border border-cyan-400/20 bg-cyan-400/10 px-2.5 py-1 font-mono text-[10px] font-bold text-cyan-300">
                  {step.complexity}
                </span>
              </div>

              <div className="mt-2 rounded-xl border border-slate-800 bg-slate-950/70 p-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] uppercase tracking-widest text-slate-600">
                    Current Line
                  </span>

                  <span className="font-mono text-[10px] text-cyan-400">
                    Line {step.line}
                  </span>
                </div>

                <p className="mt-1.5 text-[10px] leading-4 text-slate-400">
                  {step.complexityExplanation}
                </p>
              </div>

              <div className="mt-2 grid grid-cols-3 gap-2">
                <ComplexityCard
                  title="Best"
                  value="O(n)"
                />

                <ComplexityCard
                  title="Average"
                  value="O(n²)"
                />

                <ComplexityCard
                  title="Space"
                  value="O(1)"
                />
              </div>
            </div>
          </section>

          <section className="lg:col-span-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/95 p-4 shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles
                    size={16}
                    className="text-cyan-400"
                  />

                  <div>
                    <h2 className="text-sm font-bold">
                      Visualization
                    </h2>

                    <p className="text-[9px] text-slate-600">
                      Live Bubble Sort execution
                    </p>
                  </div>
                </div>

                <span className="rounded-full border border-slate-800 bg-slate-900 px-2.5 py-1 text-[9px] text-slate-500">
                  {INITIAL_ARRAY.length} elements
                </span>
              </div>

              <div className="mt-3 rounded-xl border border-indigo-400/15 bg-indigo-500/[0.04] p-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-yellow-400/10 text-yellow-400">
                    <Lightbulb size={15} />
                  </div>

                  <div>
                    <h3 className="text-[11px] font-bold">
                      What's Happening?
                    </h3>

                    <p className="text-[8px] text-slate-600">
                      Current execution intelligence
                    </p>
                  </div>
                </div>

                <p className="mt-2 text-[11px] leading-5 text-slate-400">
                  {step.explanation}
                </p>
              </div>

              <div className="mt-3 rounded-xl border border-slate-800 bg-[#030712] p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-[9px] uppercase tracking-widest text-slate-600">
                    Array Visualization
                  </span>

                  <span className="font-mono text-[10px] text-cyan-400">
                    i={step.i ?? "-"} j={step.j ?? "-"}
                  </span>
                </div>

                <div className="flex min-h-[145px] items-center justify-center gap-2 overflow-x-auto pb-3">
                  {step.array.map(
                    (value, index) => {
                      const isComparing =
                        step.comparing.includes(
                          index,
                        );

                      const isSwapping =
                        step.swapping.includes(
                          index,
                        );

                      const isSorted =
                        step.sorted.includes(
                          index,
                        );

                      return (
                        <div
                          key={`${index}-${value}-${currentStep}`}
                          className="flex shrink-0 flex-col items-center"
                        >
                          <div
                            style={{
                              transitionDuration: `${speedDuration}ms`,
                            }}
                            className={`
                              relative
                              flex
                              h-14
                              w-14
                              items-center
                              justify-center
                              rounded-xl
                              border
                              font-mono
                              text-base
                              font-bold
                              transition-all
                              ${
                                isSwapping
                                  ? "swap-pulse border-red-400 bg-red-500/15 text-red-300 shadow-[0_0_28px_rgba(248,113,113,.35)]"
                                  : isComparing
                                    ? "compare-pulse border-cyan-400 bg-cyan-500/15 text-cyan-300"
                                    : isSorted
                                      ? "border-green-400/50 bg-green-500/10 text-green-300"
                                      : "border-slate-700 bg-slate-900 text-slate-300"
                              }
                            `}
                          >
                            {isComparing && (
                              <span className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-full bg-cyan-400 px-1.5 py-0.5 text-[7px] font-bold text-slate-950">
                                COMPARE
                              </span>
                            )}

                            {isSwapping && (
                              <span className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-full bg-red-400 px-1.5 py-0.5 text-[7px] font-bold text-slate-950">
                                SWAP
                              </span>
                            )}

                            {isSorted && (
                              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-green-400 px-1.5 py-0.5 text-[7px] font-bold text-slate-950">
                                SORTED
                              </span>
                            )}

                            {value}
                          </div>

                          <span className="mt-3 font-mono text-[9px] text-slate-600">
                            [{index}]
                          </span>
                        </div>
                      );
                    },
                  )}
                </div>

                <div className="mt-1 rounded-lg border border-slate-800 bg-slate-950/60 p-2">
                  <div className="flex flex-wrap justify-center gap-1.5">
                    {step.array.map(
                      (value, index) => (
                        <div
                          key={`value-${index}`}
                          className={`
                            rounded-md
                            border
                            px-2
                            py-1.5
                            font-mono
                            text-[9px]
                            ${
                              step.comparing.includes(
                                index,
                              )
                                ? "border-cyan-400/40 bg-cyan-400/10 text-cyan-300"
                                : step.swapping.includes(
                                      index,
                                    )
                                  ? "border-red-400/40 bg-red-400/10 text-red-300"
                                  : "border-slate-800 bg-slate-900 text-slate-400"
                            }
                          `}
                        >
                          [{index}] {value}
                        </div>
                      ),
                    )}
                  </div>
                </div>

                <div className="mt-2 flex flex-wrap justify-center gap-4 border-t border-slate-800 pt-2">
                  <LegendDot
                    label="Comparing"
                    className="bg-cyan-400"
                  />

                  <LegendDot
                    label="Swapping"
                    className="bg-red-400"
                  />

                  <LegendDot
                    label="Sorted"
                    className="bg-green-400"
                  />

                  <LegendDot
                    label="Unsorted"
                    className="bg-slate-500"
                  />
                </div>
              </div>

              <div className="mt-3 rounded-xl border border-slate-800 bg-slate-900/70 p-3">
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={handlePrevious}
                    disabled={isFirstStep}
                    className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-[10px] font-semibold transition hover:border-cyan-400/30 hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <ArrowLeft size={14} />
                    Previous
                  </button>

                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={isLastStep}
                    className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 px-5 py-2 text-[10px] font-bold shadow-lg shadow-cyan-500/10 transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    Next
                    <ArrowRight size={14} />
                  </button>

                  <button
                    type="button"
                    onClick={handleReset}
                    className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-[10px] font-semibold transition hover:border-purple-400/30 hover:bg-slate-700"
                  >
                    <RotateCcw size={14} />
                    Reset
                  </button>

                  <div className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-3 py-2">
                    <Gauge
                      size={14}
                      className="text-purple-400"
                    />

                    <span className="text-[9px] text-slate-500">
                      Speed
                    </span>

                    <select
                      value={speed}
                      onChange={(event) =>
                        setSpeed(
                          event.target.value,
                        )
                      }
                      className="cursor-pointer bg-transparent text-[10px] font-bold text-white outline-none"
                    >
                      <option
                        value="0.5x"
                        className="bg-slate-900"
                      >
                        0.5x
                      </option>

                      <option
                        value="1x"
                        className="bg-slate-900"
                      >
                        1x
                      </option>

                      <option
                        value="1.5x"
                        className="bg-slate-900"
                      >
                        1.5x
                      </option>

                      <option
                        value="2x"
                        className="bg-slate-900"
                      >
                        2x
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="lg:col-span-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/95 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 p-3">
                <div className="flex items-center gap-2">
                  <Info
                    size={16}
                    className="text-purple-400"
                  />

                  <div>
                    <h2 className="text-sm font-bold">
                      Inspector
                    </h2>

                    <p className="text-[8px] text-slate-600">
                      Current execution state
                    </p>
                  </div>
                </div>

                <span className="rounded-full border border-slate-800 bg-slate-900 px-2 py-1 text-[8px] text-slate-500">
                  Line {step.line}
                </span>
              </div>

              <div className="p-3">
                <InspectorBox title="CURRENT OPERATION">
                  <p className="text-[10px] leading-5 text-slate-300">
                    {step.operation}
                  </p>
                </InspectorBox>

                <div className="mt-3 rounded-xl border border-slate-800 bg-slate-900/70 p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-[8px] font-bold uppercase tracking-widest text-slate-600">
                      CONDITION
                    </span>

                    {step.conditionResult !==
                      null && (
                      <span
                        className={`
                          rounded-full
                          px-2
                          py-1
                          text-[8px]
                          font-bold
                          ${
                            step.conditionResult
                              ? "bg-green-500/10 text-green-400"
                              : "bg-red-500/10 text-red-400"
                          }
                        `}
                      >
                        {step.conditionResult
                          ? "TRUE"
                          : "FALSE"}
                      </span>
                    )}
                  </div>

                  <p className="font-mono text-[10px] leading-5 text-slate-300 break-words">
                    {step.conditionText}
                  </p>
                </div>

                <div className="mt-3">
                  <div className="mb-2 flex items-center gap-2">
                    <Activity
                      size={14}
                      className="text-cyan-400"
                    />

                    <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500">
                      LIVE VARIABLES
                    </span>

                    <span className="ml-auto flex items-center gap-1 text-[8px] text-green-400">
                      <span className="live-dot h-1.5 w-1.5 rounded-full bg-green-400" />
                      LIVE
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <LiveVariable
                      name="i"
                      value={
                        step.i === null
                          ? "-"
                          : step.i
                      }
                      active={
                        step.phase ===
                          "outer-loop" ||
                        step.phase ===
                          "increment-i"
                      }
                    />

                    <LiveVariable
                      name="j"
                      value={
                        step.j === null
                          ? "-"
                          : step.j
                      }
                      active={
                        step.phase ===
                          "inner-loop" ||
                        step.phase ===
                          "increment-j" ||
                        step.phase ===
                          "condition" ||
                        step.phase === "swap"
                      }
                    />

                    <LiveVariable
                      name="n"
                      value={step.n}
                      active={
                        step.phase ===
                        "initialization"
                      }
                    />

                    <LiveVariable
                      name="left"
                      value={
                        step.leftValue === null
                          ? "-"
                          : step.leftValue
                      }
                      active={
                        step.phase ===
                          "condition" ||
                        step.phase === "swap"
                      }
                    />

                    <LiveVariable
                      name="right"
                      value={
                        step.rightValue === null
                          ? "-"
                          : step.rightValue
                      }
                      active={
                        step.phase ===
                          "condition" ||
                        step.phase === "swap"
                      }
                    />

                    <LiveVariable
                      name="phase"
                      value={step.phase}
                      active
                    />
                  </div>
                </div>

                <div className="mt-3">
                  <div className="mb-2">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500">
                      ARRAY POSITIONS
                    </span>
                  </div>

                  <PositionBox
                    title="COMPARING"
                    values={step.comparing}
                    type="compare"
                  />

                  <PositionBox
                    title="SWAPPING"
                    values={step.swapping}
                    type="swap"
                  />

                  <PositionBox
                    title="SORTED"
                    values={step.sorted}
                    type="sorted"
                  />
                </div>

                <div className="mt-3 rounded-xl border border-slate-800 bg-slate-900/60 p-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[8px] uppercase tracking-widest text-slate-600">
                      EXECUTION PHASE
                    </span>

                    <span className="ml-auto rounded-full bg-cyan-400/10 px-2 py-1 text-[8px] font-bold uppercase text-cyan-300">
                      {step.phase}
                    </span>
                  </div>
                </div>

                <div className="mt-3 rounded-xl border border-slate-800 bg-slate-900/60 p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[8px] uppercase tracking-widest text-slate-600">
                      EXECUTION PROGRESS
                    </span>

                    <span className="font-mono text-[9px] text-cyan-400">
                      {currentStep + 1} /{" "}
                      {steps.length}
                    </span>
                  </div>

                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-800">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300"
                      style={{
                        width: `${
                          ((currentStep + 1) /
                            steps.length) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                </div>

                {isLastStep && (
                  <div className="relative mt-3 overflow-hidden rounded-xl border border-green-500/20 bg-green-500/10 p-3">
                    <div className="success-pulse pointer-events-none absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-green-400/40" />

                    <div className="relative flex items-center justify-center gap-2 text-[10px] font-bold text-green-400">
                      <CheckCircle2 size={15} />

                      Bubble Sort Completed
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function LegendDot({
  label,
  className,
}: {
  label: string;
  className: string;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <span
        className={`h-2 w-2 rounded-full ${className}`}
      />

      <span className="text-[8px] text-slate-500">
        {label}
      </span>
    </div>
  );
}

function InspectorBox({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-3">
      <span className="text-[8px] font-bold uppercase tracking-widest text-slate-600">
        {title}
      </span>

      <div className="mt-2">
        {children}
      </div>
    </div>
  );
}

function LiveVariable({
  name,
  value,
  active,
}: {
  name: string;
  value: number | string;
  active: boolean;
}) {
  return (
    <div
      className={`
        rounded-xl
        border
        p-2.5
        transition-all
        duration-300
        ${
          active
            ? "border-cyan-400/30 bg-cyan-400/[0.07] shadow-[0_0_18px_rgba(34,211,238,.08)]"
            : "border-slate-800 bg-slate-900/60"
        }
      `}
    >
      <div className="flex items-center justify-between">
        <span className="text-[8px] uppercase tracking-widest text-slate-600">
          {name}
        </span>

        {active && (
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,.9)]" />
        )}
      </div>

      <p
        className={`
          mt-1
          truncate
          font-mono
          text-[11px]
          font-bold
          ${
            active
              ? "text-cyan-300"
              : "text-slate-400"
          }
        `}
      >
        {String(value)}
      </p>
    </div>
  );
}

function PositionBox({
  title,
  values,
  type,
}: {
  title: string;
  values: number[];
  type: "compare" | "swap" | "sorted";
}) {
  const styles = {
    compare:
      "border-cyan-400/20 bg-cyan-400/[0.04] text-cyan-300",

    swap:
      "border-red-400/20 bg-red-400/[0.04] text-red-300",

    sorted:
      "border-green-400/20 bg-green-400/[0.04] text-green-300",
  };

  return (
    <div
      className={`
        mb-2
        flex
        min-h-[38px]
        items-center
        justify-between
        rounded-xl
        border
        p-2
        ${styles[type]}
      `}
    >
      <span className="text-[8px] font-bold uppercase tracking-widest">
        {title}
      </span>

      <div className="flex max-w-[70%] flex-wrap justify-end gap-1">
        {values.length === 0 ? (
          <span className="text-[9px] text-slate-700">
            —
          </span>
        ) : (
          values.map((value) => (
            <span
              key={value}
              className="rounded-md bg-slate-950 px-2 py-1 font-mono text-[9px]"
            >
              [{value}]
            </span>
          ))
        )}
      </div>
    </div>
  );
}

function ComplexityCard({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-2">
      <span className="text-[9px] text-slate-600">
        {title}
      </span>

      <p className="mt-1 font-mono text-[11px] font-bold text-white">
        {value}
      </p>
    </div>
  );
}

function markBubbleSortCompleted() {
  markActivityCompleted("bubble-sort");
}