import { useMemo, useState } from "react";

import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Gauge,
  GitMerge,
  Lightbulb,
  Activity,
  CheckCircle2,
  Sparkles,
  Zap,
  ArrowDown,
  GitBranch,
} from "lucide-react";

import {
  generateMergeSortSteps,
} from "../algorithms/Sorting/MergeSort";

const INITIAL_ARRAY = [38, 27, 43, 3, 9, 82, 10];

type Language =
  | "Java"
  | "C"
  | "Python"
  | "C++"
  | "JavaScript"
  | "TypeScript";

const LANGUAGE_OPTIONS: {
  name: Language;
  symbol: string;
}[] = [
  { name: "Java", symbol: "☕" },
  { name: "C", symbol: "🔵" },
  { name: "Python", symbol: "🐍" },
  { name: "C++", symbol: "⚙️" },
  { name: "JavaScript", symbol: "🟨" },
  { name: "TypeScript", symbol: "🔷" },
];

const CODE_BY_LANGUAGE: Record<Language, string[]> = {
  Java: [
    "void mergeSort(int[] array, int left, int right) {",
    "    if (left >= right) return;",
    "",
    "    int mid = (left + right) / 2;",
    "",
    "    mergeSort(array, left, mid);",
    "    mergeSort(array, mid + 1, right);",
    "",
    "    merge(array, left, mid, right);",
    "}",
    "",
    "void merge(int[] array, int left, int mid, int right) {",
    "    // compare both sorted halves",
    "    // place smaller value",
    "    // copy remaining values",
    "}",
  ],

  C: [
    "void mergeSort(int array[], int left, int right) {",
    "    if (left >= right) return;",
    "",
    "    int mid = (left + right) / 2;",
    "",
    "    mergeSort(array, left, mid);",
    "    mergeSort(array, mid + 1, right);",
    "",
    "    merge(array, left, mid, right);",
    "}",
    "",
    "void merge(int array[], int left, int mid, int right) {",
    "    // compare both sorted halves",
    "    // place smaller value",
    "    // copy remaining values",
    "}",
  ],

  Python: [
    "def merge_sort(array, left, right):",
    "    if left >= right:",
    "        return",
    "",
    "    mid = (left + right) // 2",
    "",
    "    merge_sort(array, left, mid)",
    "    merge_sort(array, mid + 1, right)",
    "",
    "    merge(array, left, mid, right)",
    "",
    "def merge(array, left, mid, right):",
    "    # compare both sorted halves",
    "    # place smaller value",
    "    # copy remaining values",
    "    pass",
  ],

  "C++": [
    "void mergeSort(vector& array, int left, int right) {",
    "    if (left >= right) return;",
    "",
    "    int mid = (left + right) / 2;",
    "",
    "    mergeSort(array, left, mid);",
    "    mergeSort(array, mid + 1, right);",
    "",
    "    merge(array, left, mid, right);",
    "}",
    "",
    "void merge(vector& array, int left, int mid, int right) {",
    "    // compare both sorted halves",
    "    // place smaller value",
    "    // copy remaining values",
    "}",
  ],

  JavaScript: [
    "function mergeSort(array, left, right) {",
    "  if (left >= right) return;",
    "",
    "  const mid = Math.floor((left + right) / 2);",
    "",
    "  mergeSort(array, left, mid);",
    "  mergeSort(array, mid + 1, right);",
    "",
    "  merge(array, left, mid, right);",
    "}",
    "",
    "function merge(array, left, mid, right) {",
    "  // compare both sorted halves",
    "  // place smaller value",
    "  // copy remaining values",
    "}",
  ],

  TypeScript: [
    "function mergeSort(array: number[], left: number, right: number) {",
    "  if (left >= right) return;",
    "",
    "  const mid = Math.floor((left + right) / 2);",
    "",
    "  mergeSort(array, left, mid);",
    "  mergeSort(array, mid + 1, right);",
    "",
    "  merge(array, left, mid, right);",
    "}",
    "",
    "function merge(",
    "  array: number[],",
    "  left: number,",
    "  mid: number,",
    "  right: number",
    ") {",
    "  // compare both sorted halves",
    "  // place smaller value",
    "  // copy remaining values",
    "}",
  ],
};

type AnyNode = {
  id?: string;
  values?: number[];
  level?: number;
  left?: AnyNode;
  right?: AnyNode;
};

type AnyStep = {
  step?: number;
  line?: number;
  array?: number[];
  root?: AnyNode | null;
  activeNode?: string | null;
  merging?: boolean;
  explanation?: string;

  variables?: {
    left?: number | null;
    mid?: number | null;
    right?: number | null;
    merging?: string | null;
  };
};

export default function MergeSortVisualizer() {
  const steps = useMemo(() => {
    return generateMergeSortSteps(INITIAL_ARRAY) as unknown as AnyStep[];
  }, []);

  const [currentStep, setCurrentStep] = useState(0);
  const [speed, setSpeed] = useState("1x");
  const [language, setLanguage] =
    useState<Language>("TypeScript");

  const step = steps[currentStep] ?? {};

  const currentArray = Array.isArray(step.array)
    ? step.array
    : INITIAL_ARRAY;

  const currentLine =
    typeof step.line === "number"
      ? step.line
      : 1;

  const explanation =
    step.explanation ??
    "Click Next to execute Merge Sort.";

  const variables = step.variables ?? {};

  const codeLines = CODE_BY_LANGUAGE[language];

  const isFirstStep = currentStep === 0;

  const isLastStep =
    steps.length === 0 ||
    currentStep === steps.length - 1;

  function handleNext() {
    if (isLastStep) return;

    setCurrentStep((prev) => {
      const next = prev + 1;

      if (next === steps.length - 1) {
        markMergeSortCompleted();
      }

      return next;
    });
  }

  function handlePrevious() {
    if (isFirstStep) return;

    setCurrentStep((prev) =>
      Math.max(0, prev - 1),
    );
  }

  function handleReset() {
    setCurrentStep(0);
  }

  const visibleTree = step.root
    ? getProgressiveTree(
        step.root,
        currentStep,
      )
    : null;

  const activeLeft =
    variables.left !== undefined &&
    variables.left !== null
      ? Number(variables.left)
      : null;

  const activeMid =
    variables.mid !== undefined &&
    variables.mid !== null
      ? Number(variables.mid)
      : null;

  const activeRight =
    variables.right !== undefined &&
    variables.right !== null
      ? Number(variables.right)
      : null;

  return (
    <main
      className="
        relative
        min-h-screen
        overflow-hidden
        bg-[#050816]
        text-white
      "
    >
      <style>{`

        /* ==========================================
           HOLOGRAPHIC MERGE FLOW
        ========================================== */

        @keyframes flowGrid {
          from {
            transform: translate(0,0);
          }
          to {
            transform: translate(40px,40px);
          }
        }

        @keyframes holoFloat {
          0%,100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-5px);
          }
        }

        @keyframes nodeAppear {
          0% {
            opacity:0;
            transform:translateY(18px) scale(.75);
            filter:blur(5px);
          }

          70% {
            opacity:1;
            transform:translateY(-3px) scale(1.05);
            filter:blur(0);
          }

          100% {
            opacity:1;
            transform:translateY(0) scale(1);
          }
        }

        @keyframes comparePulse {
          0%,100% {
            box-shadow:
              0 0 8px rgba(34,211,238,.15),
              inset 0 0 10px rgba(34,211,238,.04);
          }

          50% {
            box-shadow:
              0 0 22px rgba(34,211,238,.65),
              0 0 42px rgba(59,130,246,.25),
              inset 0 0 14px rgba(34,211,238,.12);
          }
        }

        @keyframes mergePulse {
          0%,100% {
            box-shadow:
              0 0 8px rgba(168,85,247,.15);
          }

          50% {
            box-shadow:
              0 0 25px rgba(168,85,247,.65),
              0 0 50px rgba(139,92,246,.25);
          }
        }

        @keyframes sortedPulse {
          0% {
            box-shadow:0 0 0 rgba(34,197,94,0);
          }

          50% {
            box-shadow:
              0 0 25px rgba(34,197,94,.65),
              0 0 45px rgba(34,197,94,.2);
          }

          100% {
            box-shadow:0 0 0 rgba(34,197,94,0);
          }
        }

        @keyframes scanLine {
          0% {
            transform:translateX(-120%);
            opacity:0;
          }

          20% {
            opacity:1;
          }

          80% {
            opacity:1;
          }

          100% {
            transform:translateX(120%);
            opacity:0;
          }
        }

        @keyframes mergeBeam {
          0% {
            transform:scaleX(.1);
            opacity:0;
          }

          30% {
            transform:scaleX(1);
            opacity:1;
          }

          70% {
            transform:scaleX(1);
            opacity:.8;
          }

          100% {
            transform:scaleX(.1);
            opacity:0;
          }
        }

        @keyframes particleMove {
          0% {
            transform:translateX(-35px);
            opacity:0;
          }

          30% {
            opacity:1;
          }

          70% {
            opacity:1;
          }

          100% {
            transform:translateX(35px);
            opacity:0;
          }
        }

        @keyframes verticalParticle {
          0% {
            transform:translateY(18px);
            opacity:0;
          }

          30% {
            opacity:1;
          }

          100% {
            transform:translateY(-18px);
            opacity:0;
          }
        }

        @keyframes successPulse {
          0%,100% {
            transform:scale(1);
            opacity:.7;
          }

          50% {
            transform:scale(1.08);
            opacity:1;
          }
        }

        @keyframes backgroundGlow {
          0%,100% {
            opacity:.12;
            transform:scale(1);
          }

          50% {
            opacity:.25;
            transform:scale(1.12);
          }
        }

        .flow-grid {
          background-image:
            linear-gradient(
              rgba(56,189,248,.035) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(99,102,241,.035) 1px,
              transparent 1px
            );

          background-size:40px 40px;

          animation:
            flowGrid 14s linear infinite;
        }

        .holo-float {
          animation:
            holoFloat 3s ease-in-out infinite;
        }

        .node-appear {
          animation:
            nodeAppear .45s cubic-bezier(.2,.8,.2,1);
        }

        .compare-pulse {
          animation:
            comparePulse 1.15s ease-in-out infinite;
        }

        .merge-pulse {
          animation:
            mergePulse 1.3s ease-in-out infinite;
        }

        .sorted-pulse {
          animation:
            sortedPulse 1.5s ease-out infinite;
        }

        .scan-line {
          animation:
            scanLine 1.3s ease-in-out infinite;
        }

        .merge-beam {
          animation:
            mergeBeam 1.2s ease-in-out infinite;
        }

        .particle-move {
          animation:
            particleMove 1.1s ease-in-out infinite;
        }

        .vertical-particle {
          animation:
            verticalParticle 1.1s ease-in-out infinite;
        }

        .success-pulse {
          animation:
            successPulse 1.6s ease-in-out infinite;
        }

        .background-glow {
          animation:
            backgroundGlow 5s ease-in-out infinite;
        }

      `}</style>

      {/* ==========================================
          BACKGROUND
      ========================================== */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          overflow-hidden
        "
      >
        <div
          className="
            flow-grid
            absolute
            inset-[-80px]
          "
        />

        <div
          className="
            background-glow
            absolute
            left-[8%]
            top-[12%]
            h-72
            w-72
            rounded-full
            bg-cyan-500/[0.035]
            blur-3xl
          "
        />

        <div
          className="
            background-glow
            absolute
            right-[8%]
            top-[35%]
            h-80
            w-80
            rounded-full
            bg-indigo-600/[0.035]
            blur-3xl
            [animation-delay:1s]
          "
        />

        <div
          className="
            background-glow
            absolute
            bottom-[0]
            left-[45%]
            h-72
            w-72
            rounded-full
            bg-purple-600/[0.025]
            blur-3xl
            [animation-delay:2s]
          "
        />
      </div>

      {/* ==========================================
          CONTENT
      ========================================== */}

      <div className="relative mx-auto max-w-[1600px] p-3 lg:p-5">

        {/* ========================================
            HEADER
        ======================================== */}

        <header
          className="
            mb-4
            flex
            items-center
            justify-between
            gap-3
          "
        >
          <div className="flex items-center gap-3">

            <div
              className="
                holo-float
                relative
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                border
                border-cyan-400/30
                bg-cyan-400/[0.07]
                text-cyan-300
                shadow-[0_0_25px_rgba(34,211,238,.08)]
              "
            >
              <GitMerge size={20} />

              <span
                className="
                  absolute
                  inset-[-5px]
                  rounded-xl
                  border
                  border-cyan-400/10
                "
              />
            </div>

            <div>
              <h1
                className="
                  text-lg
                  font-bold
                  tracking-tight
                  text-white
                "
              >
                Merge Sort Visualizer
              </h1>

              <p
                className="
                  text-[10px]
                  text-slate-500
                "
              >
                Split • Compare • Merge • Sort
              </p>
            </div>
          </div>

          <div
            className="
              flex
              items-center
              gap-2
              rounded-xl
              border
              border-cyan-400/10
              bg-slate-900/90
              px-3
              py-2
            "
          >
            <span
              className="
                text-[9px]
                uppercase
                tracking-widest
                text-slate-500
              "
            >
              Step
            </span>

            <span
              className="
                font-mono
                text-sm
                font-bold
                text-cyan-400
              "
            >
              {steps.length === 0
                ? 0
                : currentStep + 1}
              /
              {Math.max(steps.length, 1)}
            </span>
          </div>
        </header>

        {/* ========================================
            MAIN ONE-SCREEN GRID
        ======================================== */}

        <div
          className="
            grid
            gap-4
            xl:grid-cols-12
          "
        >

          {/* ======================================
              LEFT PANEL
          ====================================== */}

          <section
            className="
              xl:col-span-4
            "
          >

            {/* SOURCE CODE */}

            <div
              className="
                overflow-hidden
                rounded-2xl
                border
                border-slate-800
                bg-slate-900/95
                shadow-xl
              "
            >
              <div
                className="
                  flex
                  items-center
                  justify-between
                  border-b
                  border-slate-800
                  p-3
                "
              >
                <div>
                  <h2 className="text-xs font-bold">
                    Source Code
                  </h2>

                  <p
                    className="
                      mt-1
                      text-[8px]
                      text-slate-600
                    "
                  >
                    Live execution tracking
                  </p>
                </div>

                <div
                  className="
                    flex
                    items-center
                    gap-1
                    rounded-lg
                    border
                    border-slate-700
                    bg-slate-950
                    px-2
                    py-1
                  "
                >
                  <span className="text-xs">
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
                      setLanguage(
                        event.target.value as Language,
                      )
                    }
                    className="
                      cursor-pointer
                      bg-transparent
                      text-[10px]
                      font-semibold
                      text-slate-200
                      outline-none
                    "
                  >
                    {LANGUAGE_OPTIONS.map(
                      (item) => (
                        <option
                          key={item.name}
                          value={item.name}
                          className="
                            bg-slate-950
                            text-white
                          "
                        >
                          {item.symbol}{" "}
                          {item.name}
                        </option>
                      ),
                    )}
                  </select>
                </div>
              </div>

              <div
                className="
                  h-[300px]
                  overflow-y-auto
                  p-2
                "
              >
                {codeLines.map(
                  (code, index) => {
                    const line = index + 1;
                    const active =
                      line === currentLine;

                    return (
                      <div
                        key={`${language}-${line}`}
                        className={`
                          relative
                          flex
                          items-center
                          rounded-md
                          px-2
                          py-[3px]
                          transition-all
                          duration-300
                          ${
                            active
                              ? "bg-cyan-500/10 shadow-[inset_2px_0_0_rgba(34,211,238,.8)]"
                              : ""
                          }
                        `}
                      >
                        {active && (
                          <span
                            className="
                              scan-line
                              pointer-events-none
                              absolute
                              inset-y-0
                              left-0
                              w-1/3
                              bg-gradient-to-r
                              from-transparent
                              via-cyan-300/10
                              to-transparent
                            "
                          />
                        )}

                        <span
                          className={`
                            w-7
                            font-mono
                            text-[9px]
                            ${
                              active
                                ? "text-cyan-400"
                                : "text-slate-700"
                            }
                          `}
                        >
                          {line}
                        </span>

                        <span
                          className={`
                            whitespace-pre
                            font-mono
                            text-[10px]
                            ${
                              active
                                ? "font-bold text-cyan-300"
                                : "text-slate-400"
                            }
                          `}
                        >
                          {code || " "}
                        </span>
                      </div>
                    );
                  },
                )}
              </div>
            </div>

            {/* LIVE VARIABLES */}

            <div
              className="
                mt-3
                rounded-2xl
                border
                border-slate-800
                bg-slate-900/95
                p-3
              "
            >
              <div
                className="
                  mb-2
                  flex
                  items-center
                  gap-2
                "
              >
                <Activity
                  size={14}
                  className="text-cyan-400"
                />

                <h2 className="text-[11px] font-bold">
                  Live Variables
                </h2>

                <span
                  className="
                    ml-auto
                    flex
                    items-center
                    gap-1
                    rounded-full
                    border
                    border-cyan-400/10
                    px-2
                    py-1
                    text-[7px]
                    uppercase
                    tracking-widest
                    text-cyan-400
                  "
                >
                  <span
                    className="
                      h-1
                      w-1
                      animate-pulse
                      rounded-full
                      bg-cyan-400
                    "
                  />
                  Live
                </span>
              </div>

              <div
                className="
                  grid
                  grid-cols-4
                  gap-2
                "
              >
                <VariableBox
                  name="Left"
                  value={variables.left ?? "-"}
                />

                <VariableBox
                  name="Mid"
                  value={variables.mid ?? "-"}
                />

                <VariableBox
                  name="Right"
                  value={variables.right ?? "-"}
                />

                <VariableBox
                  name="Merge"
                  value={
                    variables.merging ??
                    (step.merging
                      ? "Yes"
                      : "No")
                  }
                />
              </div>
            </div>

            {/* EXPLANATION */}

            <div
              className="
                mt-3
                rounded-2xl
                border
                border-indigo-500/20
                bg-indigo-500/[0.04]
                p-3
              "
            >
              <div className="flex items-center gap-2">

                <div
                  className="
                    flex
                    h-7
                    w-7
                    items-center
                    justify-center
                    rounded-lg
                    bg-yellow-400/10
                    text-yellow-400
                  "
                >
                  <Lightbulb size={14} />
                </div>

                <div>
                  <h2 className="text-[11px] font-bold">
                    What's Happening?
                  </h2>

                  <p
                    className="
                      text-[7px]
                      text-slate-600
                    "
                  >
                    Current algorithm action
                  </p>
                </div>
              </div>

              <p
                className="
                  mt-2
                  text-[10px]
                  leading-4
                  text-slate-400
                "
              >
                {explanation}
              </p>
            </div>

            {/* COMPLEXITY */}

            <div
              className="
                mt-3
                rounded-2xl
                border
                border-cyan-500/15
                bg-cyan-500/[0.035]
                p-3
              "
            >
              <div
                className="
                  flex
                  items-center
                  justify-between
                "
              >
                <h2
                  className="
                    text-[11px]
                    font-bold
                    text-cyan-300
                  "
                >
                  Complexity Analysis
                </h2>

                <Zap
                  size={14}
                  className="text-cyan-400"
                />
              </div>

              <div
                className="
                  mt-2
                  grid
                  grid-cols-2
                  gap-2
                "
              >
                <div
                  className="
                    rounded-lg
                    border
                    border-slate-800
                    bg-slate-950/60
                    p-2
                  "
                >
                  <p
                    className="
                      text-[7px]
                      uppercase
                      tracking-widest
                      text-slate-600
                    "
                  >
                    Time
                  </p>

                  <p
                    className="
                      mt-1
                      font-mono
                      text-xs
                      font-bold
                      text-cyan-400
                    "
                  >
                    O(n log n)
                  </p>
                </div>

                <div
                  className="
                    rounded-lg
                    border
                    border-slate-800
                    bg-slate-950/60
                    p-2
                  "
                >
                  <p
                    className="
                      text-[7px]
                      uppercase
                      tracking-widest
                      text-slate-600
                    "
                  >
                    Space
                  </p>

                  <p
                    className="
                      mt-1
                      font-mono
                      text-xs
                      font-bold
                      text-purple-400
                    "
                  >
                    O(n)
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ======================================
              RIGHT PANEL
          ====================================== */}

          <section
            className="
              xl:col-span-8
            "
          >

            {/* ARRAY VISUALIZATION */}

            <div
              className="
                relative
                overflow-hidden
                rounded-2xl
                border
                border-cyan-500/15
                bg-slate-900/95
                p-4
                shadow-xl
              "
            >

              <div
                className="
                  flex
                  items-center
                  justify-between
                "
              >
                <div>
                  <div
                    className="
                      flex
                      items-center
                      gap-2
                    "
                  >
                    <GitBranch
                      size={15}
                      className="text-cyan-400"
                    />

                    <h2 className="text-xs font-bold">
                      Holographic Merge Flow
                    </h2>
                  </div>

                  <p
                    className="
                      mt-1
                      text-[8px]
                      text-slate-600
                    "
                  >
                    Watch elements split, compare and
                    merge in real time
                  </p>
                </div>

                <div
                  className="
                    rounded-full
                    border
                    border-cyan-400/10
                    bg-cyan-400/[0.03]
                    px-3
                    py-1
                    text-[7px]
                    font-bold
                    uppercase
                    tracking-widest
                    text-cyan-400
                  "
                >
                  {step.merging
                    ? "MERGING"
                    : "PROCESSING"}
                </div>
              </div>

              {/* ARRAY */}

              <div
                className="
                  relative
                  mt-4
                  overflow-hidden
                  rounded-xl
                  border
                  border-slate-800
                  bg-[#070b18]
                  px-4
                  py-7
                "
              >
                {/* FLOW LINE */}

                <div
                  className="
                    pointer-events-none
                    absolute
                    left-[7%]
                    right-[7%]
                    top-1/2
                    h-px
                    bg-gradient-to-r
                    from-transparent
                    via-cyan-400/20
                    to-transparent
                  "
                />

                {/* MOVING BEAM */}

                {step.merging && (
                  <div
                    className="
                      pointer-events-none
                      absolute
                      left-[15%]
                      right-[15%]
                      top-1/2
                      h-px
                      overflow-hidden
                    "
                  >
                    <div
                      className="
                        merge-beam
                        h-full
                        w-full
                        bg-gradient-to-r
                        from-transparent
                        via-purple-400
                        to-transparent
                      "
                    />
                  </div>
                )}

                <div
                  className="
                    relative
                    flex
                    flex-wrap
                    items-center
                    justify-center
                    gap-3
                    sm:gap-4
                  "
                >
                  {currentArray.map(
                    (value, index) => {

                      const active =
                        activeLeft !== null &&
                        activeRight !== null &&
                        index >= activeLeft &&
                        index <= activeRight;

                      const isMid =
                        activeMid !== null &&
                        index === activeMid;

                      const isLeft =
                        activeLeft !== null &&
                        index === activeLeft;

                      const isRight =
                        activeRight !== null &&
                        index === activeRight;

                      const completed =
                        isLastStep;

                      return (
                        <div
                          key={`${index}-${value}`}
                          className="
                            node-appear
                            holo-float
                            relative
                            flex
                            flex-col
                            items-center
                          "
                          style={{
                            animationDelay:
                              `${index * 0.05}s`,
                          }}
                        >

                          {/* ACTIVE CONNECTION */}

                          {active && (
                            <>
                              <span
                                className="
                                  particle-move
                                  pointer-events-none
                                  absolute
                                  left-1/2
                                  top-1/2
                                  h-1
                                  w-1
                                  rounded-full
                                  bg-cyan-300
                                "
                              />

                              <span
                                className="
                                  vertical-particle
                                  pointer-events-none
                                  absolute
                                  left-1/2
                                  top-1/2
                                  h-1
                                  w-1
                                  rounded-full
                                  bg-purple-300
                                "
                              />
                            </>
                          )}

                          {/* VALUE NODE */}

                          <div
                            className={`
                              relative
                              flex
                              h-12
                              w-12
                              items-center
                              justify-center
                              rounded-xl
                              border
                              font-mono
                              text-sm
                              font-bold
                              transition-all
                              duration-500
                              ${
                                completed
                                  ? "sorted-pulse border-green-400/60 bg-green-500/10 text-green-300"
                                  : isMid
                                  ? "merge-pulse scale-110 border-purple-400 bg-purple-500/10 text-purple-300"
                                  : isLeft ||
                                    isRight
                                  ? "compare-pulse scale-105 border-cyan-400 bg-cyan-500/10 text-cyan-300"
                                  : active
                                  ? "border-indigo-400/60 bg-indigo-500/10 text-indigo-300"
                                  : "border-slate-700 bg-slate-800/80 text-slate-200"
                              }
                            `}
                          >

                            {/* SCAN */}

                            {(active || completed) && (
                              <span
                                className="
                                  scan-line
                                  pointer-events-none
                                  absolute
                                  inset-y-0
                                  left-0
                                  w-1/2
                                  bg-gradient-to-r
                                  from-transparent
                                  via-white/10
                                  to-transparent
                                "
                              />
                            )}

                            {/* ACTIVE RING */}

                            {active && (
                              <span
                                className="
                                  pointer-events-none
                                  absolute
                                  inset-[-5px]
                                  rounded-xl
                                  border
                                  border-cyan-400/20
                                "
                              />
                            )}

                            <span className="relative">
                              {value}
                            </span>
                          </div>

                          {/* INDEX */}

                          <span
                            className={`
                              mt-1
                              font-mono
                              text-[8px]
                              ${
                                isMid
                                  ? "text-purple-400"
                                  : isLeft ||
                                    isRight
                                  ? "text-cyan-400"
                                  : "text-slate-600"
                              }
                            `}
                          >
                            [{index}]
                          </span>

                          {/* LABEL */}

                          {isMid && (
                            <span
                              className="
                                absolute
                                -bottom-7
                                whitespace-nowrap
                                rounded-full
                                border
                                border-purple-400/20
                                bg-purple-500/10
                                px-2
                                py-1
                                text-[6px]
                                font-bold
                                uppercase
                                tracking-widest
                                text-purple-300
                              "
                            >
                              MID
                            </span>
                          )}

                          {isLeft && !isMid && (
                            <span
                              className="
                                absolute
                                -bottom-7
                                whitespace-nowrap
                                rounded-full
                                border
                                border-cyan-400/20
                                bg-cyan-500/10
                                px-2
                                py-1
                                text-[6px]
                                font-bold
                                uppercase
                                tracking-widest
                                text-cyan-300
                              "
                            >
                              LEFT
                            </span>
                          )}

                          {isRight && !isMid && (
                            <span
                              className="
                                absolute
                                -bottom-7
                                whitespace-nowrap
                                rounded-full
                                border
                                border-indigo-400/20
                                bg-indigo-500/10
                                px-2
                                py-1
                                text-[6px]
                                font-bold
                                uppercase
                                tracking-widest
                                text-indigo-300
                              "
                            >
                              RIGHT
                            </span>
                          )}
                        </div>
                      );
                    },
                  )}
                </div>
              </div>

              {/* LEGEND */}

              <div
                className="
                  mt-3
                  flex
                  flex-wrap
                  justify-center
                  gap-4
                  text-[8px]
                  text-slate-500
                "
              >
                <Legend
                  className="bg-cyan-400"
                  label="Compare"
                />

                <Legend
                  className="bg-purple-400"
                  label="Merge"
                />

                <Legend
                  className="bg-green-400"
                  label="Sorted"
                />
              </div>
            </div>

            {/* ======================================
                MERGE TREE
            ====================================== */}

            <div
              className="
                mt-3
                overflow-hidden
                rounded-2xl
                border
                border-indigo-500/15
                bg-slate-900/95
                p-4
                shadow-xl
              "
            >
              <div
                className="
                  mb-2
                  flex
                  items-center
                  justify-between
                "
              >
                <div>
                  <div
                    className="
                      flex
                      items-center
                      gap-2
                    "
                  >
                    <Sparkles
                      size={14}
                      className="text-indigo-400"
                    />

                    <h2 className="text-xs font-bold">
                      Merge Tree
                    </h2>
                  </div>

                  <p
                    className="
                      mt-1
                      text-[8px]
                      text-slate-600
                    "
                  >
                    Recursive structure materialization
                  </p>
                </div>

                <span
                  className="
                    rounded-full
                    border
                    border-indigo-400/10
                    bg-indigo-500/[0.04]
                    px-2
                    py-1
                    text-[7px]
                    uppercase
                    tracking-widest
                    text-indigo-300
                  "
                >
                  Recursive
                </span>
              </div>

              <div
                className="
                  relative
                  flex
                  h-[245px]
                  justify-center
                  overflow-auto
                  rounded-xl
                  border
                  border-slate-800
                  bg-[#070b18]
                  p-4
                "
              >
                {visibleTree ? (
                  <ProgressiveTree
                    node={visibleTree}
                    activeNode={
                      step.activeNode ?? null
                    }
                  />
                ) : (
                  <p
                    className="
                      self-center
                      text-[10px]
                      text-slate-600
                    "
                  >
                    Press Next to begin
                  </p>
                )}
              </div>
            </div>

            {/* ======================================
                CONTROLS
            ====================================== */}

            <div
              className="
                mt-3
                rounded-2xl
                border
                border-slate-800
                bg-slate-900/95
                p-3
              "
            >
              <div
                className="
                  flex
                  flex-wrap
                  items-center
                  justify-center
                  gap-2
                "
              >
                <button
                  type="button"
                  onClick={handlePrevious}
                  disabled={isFirstStep}
                  className="
                    flex
                    items-center
                    gap-1
                    rounded-lg
                    border
                    border-slate-700
                    bg-slate-800
                    px-3
                    py-2
                    text-[10px]
                    transition-all
                    hover:border-cyan-400/30
                    hover:bg-slate-700
                    disabled:cursor-not-allowed
                    disabled:opacity-30
                  "
                >
                  <ChevronLeft size={13} />
                  Previous
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  disabled={isLastStep}
                  className="
                    relative
                    flex
                    items-center
                    gap-1
                    overflow-hidden
                    rounded-lg
                    bg-gradient-to-r
                    from-cyan-500
                    via-indigo-500
                    to-purple-600
                    px-5
                    py-2
                    text-[10px]
                    font-bold
                    shadow-lg
                    shadow-cyan-500/10
                    transition-all
                    hover:scale-105
                    disabled:cursor-not-allowed
                    disabled:opacity-30
                  "
                >
                  <span
                    className="
                      scan-line
                      absolute
                      inset-y-0
                      left-0
                      w-1/3
                      bg-gradient-to-r
                      from-transparent
                      via-white/20
                      to-transparent
                    "
                  />

                  <span className="relative">
                    Next
                  </span>

                  <ChevronRight
                    size={13}
                    className="relative"
                  />
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  className="
                    flex
                    items-center
                    gap-1
                    rounded-lg
                    border
                    border-slate-700
                    bg-slate-800
                    px-3
                    py-2
                    text-[10px]
                    transition-all
                    hover:border-purple-400/30
                    hover:bg-slate-700
                  "
                >
                  <RotateCcw size={13} />
                  Reset
                </button>

                <div
                  className="
                    flex
                    items-center
                    gap-2
                    rounded-lg
                    border
                    border-slate-700
                    bg-slate-800
                    px-3
                    py-2
                  "
                >
                  <Gauge
                    size={13}
                    className="text-purple-400"
                  />

                  <select
                    value={speed}
                    onChange={(event) =>
                      setSpeed(event.target.value)
                    }
                    className="
                      cursor-pointer
                      bg-transparent
                      text-[10px]
                      text-white
                      outline-none
                    "
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

              {/* COMPLETION */}

              {isLastStep &&
                steps.length > 0 && (
                  <div
                    className="
                      success-pulse
                      relative
                      mt-2
                      rounded-lg
                      border
                      border-green-500/20
                      bg-green-500/10
                      p-2
                    "
                  >
                    <div
                      className="
                        flex
                        items-center
                        justify-center
                        gap-2
                        text-[10px]
                        font-semibold
                        text-green-400
                      "
                    >
                      <CheckCircle2 size={14} />
                      Merge Sort Completed
                    </div>
                  </div>
                )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

/* =========================================================
   VARIABLE BOX
========================================================= */

function VariableBox({
  name,
  value,
}: {
  name: string;
  value: number | string;
}) {
  return (
    <div
      className="
        rounded-lg
        border
        border-slate-800
        bg-slate-950/60
        p-2
      "
    >
      <p
        className="
          text-[7px]
          uppercase
          tracking-widest
          text-slate-600
        "
      >
        {name}
      </p>

      <p
        className="
          mt-1
          font-mono
          text-xs
          font-bold
          text-cyan-400
        "
      >
        {String(value)}
      </p>
    </div>
  );
}

/* =========================================================
   LEGEND
========================================================= */

function Legend({
  className,
  label,
}: {
  className: string;
  label: string;
}) {
  return (
    <span className="flex items-center gap-1.5">
      <span
        className={`
          h-1.5
          w-1.5
          rounded-full
          ${className}
        `}
      />

      {label}
    </span>
  );
}

/* =========================================================
   COMPLETION TRACKING
========================================================= */

function markMergeSortCompleted() {
  const key =
    "algotrace_completed_activities";

  const old =
    localStorage.getItem(key);

  let data: string[] = [];

  try {
    data = old ? JSON.parse(old) : [];
  } catch {
    data = [];
  }

  if (!data.includes("merge-sort")) {
    data.push("merge-sort");

    localStorage.setItem(
      key,
      JSON.stringify(data),
    );

    window.dispatchEvent(
      new Event("storage"),
    );
  }
}

/* =========================================================
   TREE HELPERS
========================================================= */

function flattenTree(
  node: AnyNode,
): AnyNode[] {
  let result = [node];

  if (node.left) {
    result = [
      ...result,
      ...flattenTree(node.left),
    ];
  }

  if (node.right) {
    result = [
      ...result,
      ...flattenTree(node.right),
    ];
  }

  return result;
}

function getProgressiveTree(
  root: AnyNode,
  step: number,
): AnyNode {
  const nodes = flattenTree(root);

  const visible = new Set(
    nodes
      .slice(
        0,
        Math.min(
          step + 1,
          nodes.length,
        ),
      )
      .map((node) => node.id),
  );

  return cloneTree(root, visible);
}

function cloneTree(
  node: AnyNode,
  visible: Set<string | undefined>,
): AnyNode {
  const copy: AnyNode = {
    ...node,
    left: undefined,
    right: undefined,
  };

  if (
    node.left &&
    visible.has(node.left.id)
  ) {
    copy.left = cloneTree(
      node.left,
      visible,
    );
  }

  if (
    node.right &&
    visible.has(node.right.id)
  ) {
    copy.right = cloneTree(
      node.right,
      visible,
    );
  }

  return copy;
}

/* =========================================================
   PROGRESSIVE MERGE TREE
========================================================= */

function ProgressiveTree({
  node,
  activeNode,
}: {
  node: AnyNode;
  activeNode: string | null;
}) {
  const isActive =
    node.id === activeNode;

  return (
    <div
      className="
        node-appear
        relative
        flex
        flex-col
        items-center
      "
    >
      {/* ACTIVE ENERGY */}

      {isActive && (
        <>
          <div
            className="
              compare-pulse
              pointer-events-none
              absolute
              inset-[-8px]
              rounded-xl
              border
              border-cyan-400/30
            "
          />

          <div
            className="
              scan-line
              pointer-events-none
              absolute
              inset-y-0
              left-0
              w-1/3
              bg-gradient-to-r
              from-transparent
              via-cyan-300/20
              to-transparent
            "
          />
        </>
      )}

      {/* NODE */}

      <div
        className={`
          relative
          rounded-xl
          border
          px-3
          py-2
          font-mono
          text-[9px]
          font-bold
          transition-all
          duration-500
          ${
            isActive
              ? "compare-pulse scale-110 border-cyan-400 bg-cyan-500/10 text-cyan-300"
              : "border-slate-700 bg-slate-800 text-slate-300"
          }
        `}
      >
        <span className="relative">
          {node.values?.join(", ")}
        </span>
      </div>

      {/* VERTICAL CONNECTION */}

      {(node.left || node.right) && (
        <div
          className="
            relative
            h-5
            w-px
            bg-gradient-to-b
            from-cyan-400/50
            to-indigo-400/10
          "
        >
          <span
            className="
              vertical-particle
              absolute
              left-1/2
              top-1/2
              h-1
              w-1
              -translate-x-1/2
              rounded-full
              bg-cyan-300
            "
          />
        </div>
      )}

      {/* CHILDREN */}

      {(node.left || node.right) && (
        <div
          className="
            relative
            flex
            gap-5
            border-t
            border-indigo-400/10
            pt-4
          "
        >
          {node.left && (
            <div className="relative">
              <div
                className="
                  absolute
                  left-1/2
                  top-[-16px]
                  h-4
                  w-px
                  bg-gradient-to-b
                  from-indigo-400/40
                  to-transparent
                "
              />

              <ProgressiveTree
                node={node.left}
                activeNode={activeNode}
              />
            </div>
          )}

          {node.right && (
            <div className="relative">
              <div
                className="
                  absolute
                  left-1/2
                  top-[-16px]
                  h-4
                  w-px
                  bg-gradient-to-b
                  from-indigo-400/40
                  to-transparent
                "
              />

              <ProgressiveTree
                node={node.right}
                activeNode={activeNode}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}