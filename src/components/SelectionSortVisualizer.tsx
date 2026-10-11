import { useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Gauge,
  CheckCircle2,
  Target,
  Search,
  Lock,
  Crosshair,
  ScanLine,
} from "lucide-react";

import { generateSelectionSortSteps } from "../algorithms/Sorting/SelectionSort";

const INITIAL_ARRAY = [64, 34, 25, 12, 22, 11, 90];

type Language =
  | "Java"
  | "C"
  | "Python"
  | "C++"
  | "JavaScript"
  | "TypeScript";

type SelectionSortStep = {
  step: number;
  line: number;
  array: number[];
  i: number;
  j: number;
  minIndex: number;
  comparing: number[];
  swapping: number[];
  sorted: number[];
  explanation: string;
};

const CODE: Record<Language, string[]> = {
  Java: [
    "void selectionSort(int[] array) {",
    "  int n = array.length;",
    "",
    "  for (int i = 0; i < n - 1; i++) {",
    "",
    "    int minIndex = i;",
    "",
    "    for (int j = i + 1; j < n; j++) {",
    "",
    "      if (array[j] < array[minIndex]) {",
    "        minIndex = j;",
    "      }",
    "    }",
    "",
    "    int temp = array[i];",
    "    array[i] = array[minIndex];",
    "    array[minIndex] = temp;",
    "  }",
    "}",
  ],

  C: [
    "void selectionSort(int array[], int n) {",
    "",
    "  for (int i = 0; i < n - 1; i++) {",
    "",
    "    int minIndex = i;",
    "",
    "    for (int j = i + 1; j < n; j++) {",
    "",
    "      if (array[j] < array[minIndex]) {",
    "        minIndex = j;",
    "      }",
    "    }",
    "",
    "    int temp = array[i];",
    "    array[i] = array[minIndex];",
    "    array[minIndex] = temp;",
    "  }",
    "}",
  ],

  Python: [
    "def selection_sort(array):",
    "    n = len(array)",
    "",
    "    for i in range(n - 1):",
    "",
    "        min_index = i",
    "",
    "        for j in range(i + 1, n):",
    "",
    "            if array[j] < array[min_index]:",
    "                min_index = j",
    "",
    "        array[i], array[min_index] =",
    "            array[min_index], array[i]",
    "",
    "    return array",
  ],

  "C++": [
    "void selectionSort(vector& array) {",
    "  int n = array.size();",
    "",
    "  for (int i = 0; i < n - 1; i++) {",
    "",
    "    int minIndex = i;",
    "",
    "    for (int j = i + 1; j < n; j++) {",
    "",
    "      if (array[j] < array[minIndex]) {",
    "        minIndex = j;",
    "      }",
    "    }",
    "",
    "    swap(array[i], array[minIndex]);",
    "  }",
    "}",
  ],

  JavaScript: [
    "function selectionSort(array) {",
    "  const n = array.length;",
    "",
    "  for (let i = 0; i < n - 1; i++) {",
    "",
    "    let minIndex = i;",
    "",
    "    for (let j = i + 1; j < n; j++) {",
    "",
    "      if (array[j] < array[minIndex]) {",
    "        minIndex = j;",
    "      }",
    "    }",
    "",
    "    [array[i], array[minIndex]] =",
    "      [array[minIndex], array[i]];",
    "  }",
    "}",
  ],

  TypeScript: [
    "function selectionSort(array: number[]) {",
    "  const n = array.length;",
    "",
    "  for (let i = 0; i < n - 1; i++) {",
    "",
    "    let minIndex = i;",
    "",
    "    for (let j = i + 1; j < n; j++) {",
    "",
    "      if (array[j] < array[minIndex]) {",
    "        minIndex = j;",
    "      }",
    "    }",
    "",
    "    [array[i], array[minIndex]] =",
    "      [array[minIndex], array[i]];",
    "  }",
    "}",
  ],
};

const LANGUAGE_LABELS: Record<Language, string> = {
  Java: "Java",
  C: "C",
  Python: "Python",
  "C++": "C++",
  JavaScript: "JavaScript",
  TypeScript: "TypeScript",
};

export default function SelectionSortVisualizer() {
  const steps = useMemo(
    () =>
      generateSelectionSortSteps(
        INITIAL_ARRAY,
      ) as SelectionSortStep[],
    [],
  );

  const [currentStep, setCurrentStep] = useState(0);
  const [speed, setSpeed] = useState("1x");
  const [language, setLanguage] =
    useState<Language>("TypeScript");

  const step = steps[currentStep];

  const currentArray =
    step?.array ?? INITIAL_ARRAY;

  const currentLine =
    step?.line ?? 1;

  const currentI =
    step?.i ?? 0;

  const currentJ =
    step?.j ?? 0;

  const currentMinIndex =
    step?.minIndex ?? 0;

  const comparing =
    step?.comparing ?? [];

  const swapping =
    step?.swapping ?? [];

  const sorted =
    step?.sorted ?? [];

  const explanation =
    step?.explanation ??
    "Selection Sort searches for the smallest remaining value.";

  const isFirst = currentStep === 0;

  const isLast =
    steps.length === 0 ||
    currentStep >= steps.length - 1;

  const handlePrevious = () => {
    if (isFirst) return;

    setCurrentStep((previous) =>
      Math.max(0, previous - 1),
    );
  };

  const handleNext = () => {
    if (isLast) return;

    setCurrentStep((previous) =>
      Math.min(
        steps.length - 1,
        previous + 1,
      ),
    );
  };

  const handleReset = () => {
    setCurrentStep(0);
  };

  /*
   * -------------------------------------------------------
   * ANIMATION STATE
   * -------------------------------------------------------
   */

  const isScanning =
    comparing.length > 0 &&
    swapping.length === 0 &&
    !isLast;

  const isLocking =
    swapping.length > 0;

  const sortedCount =
    sorted.length;

  const progress =
    currentArray.length > 1
      ? Math.min(
          100,
          (sortedCount /
            currentArray.length) *
            100,
        )
      : 0;

  return (
    <main className="min-h-screen w-full text-slate-200">
      {/* =====================================================
          HEADER
      ====================================================== */}

      <div
        className="
          mb-4
          flex
          flex-wrap
          items-center
          justify-between
          gap-3
        "
      >
        <div className="flex items-center gap-3">
          <div
            className="
              relative
              flex
              h-10
              w-10
              items-center
              justify-center
              overflow-hidden
              rounded-xl
              border
              border-purple-400/20
              bg-purple-500/10
              text-purple-400
              shadow-[0_0_25px_rgba(168,85,247,0.12)]
            "
          >
            <Target size={19} />

            <span
              className="
                absolute
                inset-0
                animate-ping
                rounded-xl
                border
                border-purple-400/10
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
              Selection Sort Visualizer
            </h1>

            <p className="text-[10px] text-slate-500">
              Scan • Capture Minimum • Lock • Deploy
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
            border-purple-500/20
            bg-slate-900
            px-3
            py-2
            shadow-[0_0_20px_rgba(168,85,247,0.05)]
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
              text-xs
              font-bold
              text-purple-400
            "
          >
            {steps.length === 0
              ? 0
              : currentStep + 1}
          </span>

          <span className="text-slate-700">
            /
          </span>

          <span
            className="
              font-mono
              text-xs
              text-slate-500
            "
          >
            {Math.max(steps.length, 1)}
          </span>
        </div>
      </div>

      {/* =====================================================
          MAIN
      ====================================================== */}

      <div
        className="
          grid
          gap-4
          xl:grid-cols-[0.95fr_1.05fr]
        "
      >
        {/* =================================================
            CODE PANEL
        ================================================== */}

        <section
          className="
            overflow-hidden
            rounded-2xl
            border
            border-slate-800
            bg-slate-950
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
              px-4
              py-3
            "
          >
            <div>
              <p
                className="
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-widest
                  text-slate-500
                "
              >
                Source Code
              </p>

              <p className="mt-1 text-[9px] text-slate-600">
                Current execution line
              </p>
            </div>

            <select
              value={language}
              onChange={(event) =>
                setLanguage(
                  event.target.value as Language,
                )
              }
              className="
                rounded-lg
                border
                border-slate-700
                bg-slate-900
                px-3
                py-1.5
                text-[10px]
                font-semibold
                text-purple-400
                outline-none
                transition
                hover:border-purple-400/40
              "
            >
              {(
                Object.keys(
                  LANGUAGE_LABELS,
                ) as Language[]
              ).map((item) => (
                <option
                  key={item}
                  value={item}
                >
                  {LANGUAGE_LABELS[item]}
                </option>
              ))}
            </select>
          </div>

          <div
            className="
              max-h-[430px]
              overflow-y-auto
              p-3
            "
          >
            {CODE[language].map(
              (code, index) => {
                const lineNumber =
                  index + 1;

                const active =
                  lineNumber ===
                  currentLine;

                return (
                  <div
                    key={`${language}-${lineNumber}`}
                    className={`
                      flex
                      min-h-[27px]
                      items-center
                      rounded-lg
                      px-2
                      transition-all
                      duration-300
                      ${
                        active
                          ? "bg-purple-500/10 shadow-[inset_3px_0_0_#a855f7]"
                          : ""
                      }
                    `}
                  >
                    <span
                      className={`
                        w-7
                        shrink-0
                        text-right
                        font-mono
                        text-[9px]
                        ${
                          active
                            ? "text-purple-400"
                            : "text-slate-700"
                        }
                      `}
                    >
                      {lineNumber}
                    </span>

                    <span
                      className={`
                        ml-4
                        whitespace-pre
                        font-mono
                        text-[10px]
                        ${
                          active
                            ? "font-bold text-purple-300"
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
        </section>

        {/* =================================================
            UNIQUE MINIMUM HUNTER VISUALIZATION
        ================================================== */}

        <section
          className="
            overflow-hidden
            rounded-2xl
            border
            border-slate-800
            bg-slate-950
            shadow-xl
          "
        >
          {/* VISUALIZATION HEADER */}

          <div
            className="
              flex
              items-center
              justify-between
              border-b
              border-slate-800
              px-4
              py-3
            "
          >
            <div>
              <p
                className="
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-widest
                  text-slate-500
                "
              >
                Minimum Hunter
              </p>

              <p className="mt-1 text-[9px] text-slate-600">
                Every candidate is scanned before the minimum is locked
              </p>
            </div>

            <div
              className="
                flex
                items-center
                gap-1.5
                rounded-lg
                border
                border-purple-500/20
                bg-purple-500/5
                px-2
                py-1
                text-[8px]
                font-bold
                uppercase
                tracking-widest
                text-purple-400
              "
            >
              <ScanLine size={11} />

              {isLocking
                ? "LOCK"
                : isScanning
                ? "SCAN"
                : "TRACK"}
            </div>
          </div>

          {/* =================================================
              HUNTER STAGE
          ================================================== */}

          <div
            className="
              relative
              min-h-[300px]
              overflow-hidden
              px-5
              py-10
            "
          >
            {/* GRID */}

            <div
              className="
                pointer-events-none
                absolute
                inset-0
                opacity-20
              "
              style={{
                backgroundImage:
                  "linear-gradient(rgba(168,85,247,0.10) 1px, transparent 1px), linear-gradient(90deg, rgba(168,85,247,0.10) 1px, transparent 1px)",
                backgroundSize:
                  "28px 28px",
              }}
            />

            {/* RADAR GLOW */}

            <div
              className="
                pointer-events-none
                absolute
                left-1/2
                top-1/2
                h-48
                w-48
                -translate-x-1/2
                -translate-y-1/2
                rounded-full
                bg-purple-500/[0.04]
                blur-2xl
              "
            />

            {/* SCAN LINE */}

            {isScanning && (
              <div
                className="
                  pointer-events-none
                  absolute
                  left-4
                  right-4
                  top-1/2
                  h-px
                  bg-gradient-to-r
                  from-transparent
                  via-cyan-400
                  to-transparent
                  opacity-50
                  animate-pulse
                "
              />
            )}

            {/* ARRAY */}

            <div
              className="
                relative
                z-10
                flex
                min-w-max
                items-end
                justify-center
                gap-3
                sm:gap-4
              "
            >
              {currentArray.map(
                (value, index) => {
                  const isComparing =
                    comparing.includes(index);

                  const isSwapping =
                    swapping.includes(index);

                  const isSorted =
                    sorted.includes(index);

                  const isMinimum =
                    index ===
                    currentMinIndex;

                  const isCurrent =
                    index === currentJ;

                  const isTarget =
                    index === currentI;

                  const isActiveZone =
                    index >= currentI &&
                    !isSorted;

                  return (
                    <div
                      key={`${index}-${value}`}
                      className={`
                        relative
                        flex
                        flex-col
                        items-center
                        transition-all
                        duration-700
                        ${
                          isSwapping
                            ? "z-30"
                            : ""
                        }
                      `}
                    >
                      {/* SORTED LOCK */}

                      {isSorted && (
                        <div
                          className="
                            absolute
                            -top-8
                            flex
                            items-center
                            gap-1
                            whitespace-nowrap
                            text-[7px]
                            font-bold
                            uppercase
                            tracking-widest
                            text-green-400
                          "
                        >
                          <Lock size={9} />
                          LOCKED
                        </div>
                      )}

                      {/* MINIMUM TARGET */}

                      {isMinimum &&
                        !isSorted && (
                          <div
                            className="
                              absolute
                              -top-9
                              z-20
                              flex
                              items-center
                              gap-1
                              rounded-md
                              border
                              border-purple-400/30
                              bg-purple-500/10
                              px-2
                              py-1
                              font-mono
                              text-[7px]
                              font-bold
                              uppercase
                              tracking-widest
                              text-purple-300
                              shadow-[0_0_15px_rgba(168,85,247,0.15)]
                            "
                          >
                            <Target size={9} />
                            MIN
                          </div>
                        )}

                      {/* CURRENT SCANNER */}

                      {isCurrent &&
                        !isSorted && (
                          <div
                            className="
                              absolute
                              -bottom-7
                              z-20
                              flex
                              items-center
                              gap-1
                              rounded-md
                              border
                              border-cyan-400/20
                              bg-cyan-500/5
                              px-2
                              py-0.5
                              font-mono
                              text-[7px]
                              font-bold
                              uppercase
                              tracking-widest
                              text-cyan-400
                            "
                          >
                            <Search size={8} />
                            J
                          </div>
                        )}

                      {/* TARGET I */}

                      {isTarget &&
                        !isSorted &&
                        !isMinimum && (
                          <div
                            className="
                              absolute
                              -bottom-7
                              z-20
                              rounded-md
                              border
                              border-indigo-400/20
                              bg-indigo-500/5
                              px-2
                              py-0.5
                              font-mono
                              text-[7px]
                              font-bold
                              uppercase
                              tracking-widest
                              text-indigo-300
                            "
                          >
                            I
                          </div>
                        )}

                      {/* ELEMENT */}

                      <div
                        className={`
                          relative
                          flex
                          h-14
                          w-14
                          items-center
                          justify-center
                          rounded-2xl
                          border
                          font-mono
                          text-sm
                          font-bold
                          transition-all
                          duration-700
                          sm:h-16
                          sm:w-16

                          ${
                            isSwapping
                              ? `
                                scale-125
                                rotate-[360deg]
                                border-orange-300
                                bg-orange-500/20
                                text-orange-200
                                shadow-[0_0_35px_rgba(249,115,22,0.35)]
                              `
                              : isMinimum &&
                                !isSorted
                              ? `
                                scale-110
                                border-purple-400
                                bg-purple-500/15
                                text-purple-200
                                shadow-[0_0_30px_rgba(168,85,247,0.30)]
                              `
                              : isComparing
                              ? `
                                scale-105
                                border-cyan-400
                                bg-cyan-500/10
                                text-cyan-200
                                shadow-[0_0_25px_rgba(34,211,238,0.20)]
                              `
                              : isSorted
                              ? `
                                border-green-400/60
                                bg-green-500/10
                                text-green-300
                                shadow-[0_0_20px_rgba(34,197,94,0.16)]
                              `
                              : isTarget
                              ? `
                                border-indigo-400/60
                                bg-indigo-500/10
                                text-indigo-300
                              `
                              : `
                                border-slate-700
                                bg-slate-800/80
                                text-white
                              `
                          }
                        `}
                      >
                        {/* MINIMUM ORBIT */}

                        {isMinimum &&
                          !isSorted &&
                          !isSwapping && (
                            <>
                              <span
                                className="
                                  pointer-events-none
                                  absolute
                                  inset-[-7px]
                                  rounded-[22px]
                                  border
                                  border-purple-400/30
                                  animate-spin
                                "
                                style={{
                                  animationDuration:
                                    "3s",
                                }}
                              />

                              <span
                                className="
                                  pointer-events-none
                                  absolute
                                  inset-[-12px]
                                  rounded-[26px]
                                  border
                                  border-dashed
                                  border-purple-400/20
                                  animate-spin
                                "
                                style={{
                                  animationDuration:
                                    "5s",
                                  animationDirection:
                                    "reverse",
                                }}
                              />

                              <span
                                className="
                                  pointer-events-none
                                  absolute
                                  left-1/2
                                  top-[-13px]
                                  h-2
                                  w-2
                                  -translate-x-1/2
                                  rounded-full
                                  bg-purple-400
                                  shadow-[0_0_12px_#a855f7]
                                "
                              />
                            </>
                          )}

                        {/* SCANNER RING */}

                        {isCurrent &&
                          isComparing &&
                          !isSwapping && (
                            <span
                              className="
                                pointer-events-none
                                absolute
                                inset-[-5px]
                                rounded-[18px]
                                border
                                border-cyan-400/50
                                animate-ping
                              "
                            />
                          )}

                        {/* SWAP ENERGY */}

                        {isSwapping && (
                          <>
                            <span
                              className="
                                pointer-events-none
                                absolute
                                inset-[-9px]
                                rounded-[25px]
                                border
                                border-orange-400/30
                                animate-ping
                              "
                            />

                            <span
                              className="
                                pointer-events-none
                                absolute
                                left-1/2
                                top-1/2
                                h-24
                                w-1
                                -translate-x-1/2
                                -translate-y-1/2
                                rotate-45
                                bg-gradient-to-b
                                from-transparent
                                via-orange-400/40
                                to-transparent
                                blur-sm
                              "
                            />
                          </>
                        )}

                        {/* LOCKED CORE */}

                        {isSorted && (
                          <span
                            className="
                              pointer-events-none
                              absolute
                              inset-[5px]
                              rounded-[14px]
                              border
                              border-green-400/10
                            "
                          />
                        )}

                        {value}
                      </div>

                      {/* INDEX */}

                      <span
                        className={`
                          mt-3
                          font-mono
                          text-[8px]
                          transition-colors
                          ${
                            isCurrent
                              ? "text-cyan-400"
                              : isMinimum
                              ? "text-purple-400"
                              : isSorted
                              ? "text-green-400/70"
                              : isTarget
                              ? "text-indigo-400"
                              : "text-slate-600"
                          }
                        `}
                      >
                        [{index}]
                      </span>

                      {/* SORTED FLOOR */}

                      {isSorted && (
                        <div
                          className="
                            mt-2
                            h-1
                            w-10
                            overflow-hidden
                            rounded-full
                            bg-green-500/10
                          "
                        >
                          <div
                            className="
                              h-full
                              w-full
                              rounded-full
                              bg-green-400/60
                              shadow-[0_0_10px_rgba(74,222,128,0.5)]
                            "
                          />
                        </div>
                      )}

                      {/* UNSORTED MARKER */}

                      {isActiveZone &&
                        !isSorted &&
                        index === currentI && (
                          <div
                            className="
                              absolute
                              -bottom-11
                              h-px
                              w-12
                              bg-gradient-to-r
                              from-transparent
                              via-indigo-400/50
                              to-transparent
                            "
                          />
                        )}
                    </div>
                  );
                },
              )}
            </div>

            {/* SORTED RUNWAY */}

            {sortedCount > 0 && (
              <div
                className="
                  absolute
                  bottom-5
                  left-5
                  right-5
                  h-px
                  overflow-hidden
                  bg-gradient-to-r
                  from-green-500/40
                  via-green-400/10
                  to-transparent
                "
              >
                <div
                  className="
                    h-full
                    w-1/3
                    animate-[scan_2s_linear_infinite]
                    bg-gradient-to-r
                    from-transparent
                    via-green-400
                    to-transparent
                  "
                />
              </div>
            )}

            {/* PHASE INDICATOR */}

            <div
              className="
                absolute
                bottom-3
                left-1/2
                flex
                -translate-x-1/2
                items-center
                gap-2
                whitespace-nowrap
                rounded-full
                border
                border-slate-800
                bg-slate-950/80
                px-3
                py-1.5
                text-[8px]
                font-semibold
                uppercase
                tracking-widest
                backdrop-blur-md
              "
            >
              <span
                className={`
                  h-1.5
                  w-1.5
                  rounded-full
                  ${
                    isLocking
                      ? "bg-orange-400 shadow-[0_0_8px_#fb923c]"
                      : isScanning
                      ? "bg-cyan-400 shadow-[0_0_8px_#22d3ee]"
                      : "bg-purple-400 shadow-[0_0_8px_#a855f7]"
                  }
                `}
              />

              <span className="text-slate-500">
                {isLocking
                  ? "Deploying Minimum"
                  : isScanning
                  ? "Scanning Candidates"
                  : "Tracking Minimum"}
              </span>
            </div>
          </div>

          {/* =================================================
              PROGRESS
          ================================================== */}

          <div
            className="
              border-t
              border-slate-800
              px-4
              py-3
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
              <span
                className="
                  text-[8px]
                  font-bold
                  uppercase
                  tracking-widest
                  text-slate-600
                "
              >
                Sorted Runway
              </span>

              <span
                className="
                  font-mono
                  text-[8px]
                  text-green-400
                "
              >
                {sortedCount}/
                {currentArray.length}
              </span>
            </div>

            <div
              className="
                h-1
                overflow-hidden
                rounded-full
                bg-slate-800
              "
            >
              <div
                className="
                  h-full
                  rounded-full
                  bg-gradient-to-r
                  from-green-500
                  via-emerald-400
                  to-cyan-400
                  shadow-[0_0_10px_rgba(52,211,153,0.35)]
                  transition-all
                  duration-700
                "
                style={{
                  width: `${progress}%`,
                }}
              />
            </div>
          </div>

          {/* =================================================
              LEGEND
          ================================================== */}

          <div
            className="
              flex
              flex-wrap
              items-center
              justify-center
              gap-4
              border-t
              border-slate-800
              px-4
              py-3
            "
          >
            <Legend
              label="Scanning"
              className="bg-cyan-400"
            />

            <Legend
              label="Minimum Hunter"
              className="bg-purple-400"
            />

            <Legend
              label="Deployment"
              className="bg-orange-400"
            />

            <Legend
              label="Locked"
              className="bg-green-400"
            />
          </div>

          {/* =================================================
              CONTROLS
          ================================================== */}

          <div
            className="
              flex
              flex-wrap
              items-center
              justify-center
              gap-2
              border-t
              border-slate-800
              bg-slate-950
              px-4
              py-4
            "
          >
            <button
              type="button"
              onClick={handlePrevious}
              disabled={isFirst}
              className="
                flex
                items-center
                gap-1.5
                rounded-xl
                border
                border-slate-700
                bg-slate-800
                px-4
                py-2.5
                text-xs
                font-semibold
                text-slate-300
                transition
                hover:border-purple-500/40
                hover:bg-slate-700
                disabled:cursor-not-allowed
                disabled:opacity-30
              "
            >
              <ChevronLeft size={15} />
              Previous
            </button>

            <button
              type="button"
              onClick={handleNext}
              disabled={isLast}
              className="
                flex
                items-center
                gap-1.5
                rounded-xl
                bg-gradient-to-r
                from-purple-500
                to-indigo-600
                px-5
                py-2.5
                text-xs
                font-bold
                text-white
                shadow-lg
                shadow-purple-500/10
                transition
                hover:scale-[1.02]
                disabled:cursor-not-allowed
                disabled:opacity-30
              "
            >
              Next
              <ChevronRight size={15} />
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="
                flex
                items-center
                gap-1.5
                rounded-xl
                border
                border-slate-700
                bg-slate-800
                px-4
                py-2.5
                text-xs
                font-semibold
                text-slate-300
                transition
                hover:border-purple-500/40
                hover:bg-slate-700
              "
            >
              <RotateCcw size={14} />
              Reset
            </button>

            <div
              className="
                flex
                items-center
                gap-2
                rounded-xl
                border
                border-slate-700
                bg-slate-800
                px-3
                py-2.5
              "
            >
              <Gauge
                size={14}
                className="text-purple-400"
              />

              <span className="text-[10px] text-slate-500">
                Speed
              </span>

              <select
                value={speed}
                onChange={(event) =>
                  setSpeed(
                    event.target.value,
                  )
                }
                className="
                  bg-transparent
                  text-[10px]
                  font-bold
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
        </section>
      </div>

      {/* =====================================================
          LIVE VARIABLES + WHAT'S HAPPENING
      ====================================================== */}

      <div
        className="
          mt-4
          grid
          gap-4
          lg:grid-cols-[0.85fr_1.15fr]
        "
      >
        {/* LIVE VARIABLES */}

        <section
          className="
            rounded-2xl
            border
            border-slate-800
            bg-slate-900/80
            p-3
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
              <h2 className="text-xs font-bold text-white">
                Live Variables
              </h2>

              <p className="text-[8px] text-slate-600">
                Current algorithm state
              </p>
            </div>

            <span
              className="
                text-[8px]
                font-bold
                uppercase
                tracking-widest
                text-cyan-400
              "
            >
              Live
            </span>
          </div>

          <div
            className="
              grid
              grid-cols-2
              gap-1.5
              sm:grid-cols-4
            "
          >
            <SmallVariable
              name="i"
              value={currentI}
            />

            <SmallVariable
              name="j"
              value={currentJ}
            />

            <SmallVariable
              name="Min"
              value={currentMinIndex}
            />

            <SmallVariable
              name="Compare"
              value={
                comparing.length > 0
                  ? comparing.join(", ")
                  : "—"
              }
            />
          </div>
        </section>

        {/* WHAT'S HAPPENING */}

        <section
          className="
            rounded-2xl
            border
            border-indigo-500/20
            bg-indigo-500/[0.04]
            p-3
          "
        >
          <div
            className="
              flex
              items-center
              gap-2
            "
          >
            <div
              className="
                flex
                h-7
                w-7
                items-center
                justify-center
                rounded-lg
                bg-indigo-500/10
                text-indigo-400
              "
            >
              <Crosshair size={14} />
            </div>

            <div>
              <h2 className="text-xs font-bold text-white">
                What's Happening?
              </h2>

              <p className="text-[8px] text-slate-600">
                Explanation of the current step
              </p>
            </div>
          </div>

          <p
            className="
              mt-3
              text-[10px]
              leading-5
              text-slate-400
            "
          >
            {explanation}
          </p>
        </section>
      </div>

      {/* =====================================================
          COMPLEXITY
      ====================================================== */}

      <section
        className="
          mt-4
          rounded-2xl
          border
          border-purple-500/20
          bg-purple-500/[0.03]
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
          <div>
            <h2 className="text-xs font-bold text-purple-300">
              Complexity Analysis
            </h2>

            <p className="mt-1 text-[8px] text-slate-600">
              Selection Sort performance
            </p>
          </div>

          <Target
            size={15}
            className="text-purple-400"
          />
        </div>

        <div
          className="
            mt-3
            grid
            grid-cols-3
            gap-2
          "
        >
          <ComplexityBox
            title="Best"
            value="O(n²)"
          />

          <ComplexityBox
            title="Average"
            value="O(n²)"
          />

          <ComplexityBox
            title="Worst"
            value="O(n²)"
          />
        </div>

        <div
          className="
            mt-2
            rounded-xl
            border
            border-slate-800
            bg-slate-950
            px-3
            py-2
          "
        >
          <p
            className="
              text-[8px]
              uppercase
              tracking-widest
              text-slate-600
            "
          >
            Space Complexity
          </p>

          <p
            className="
              mt-1
              font-mono
              text-[10px]
              font-bold
              text-purple-400
            "
          >
            O(1)
          </p>
        </div>
      </section>

      {/* =====================================================
          COMPLETED
      ====================================================== */}

      {isLast && steps.length > 0 && (
        <div
          className="
            mt-4
            flex
            items-center
            justify-center
            gap-2
            rounded-xl
            border
            border-green-500/20
            bg-green-500/10
            px-4
            py-2.5
            text-xs
            font-semibold
            text-green-400
            shadow-[0_0_25px_rgba(34,197,94,0.05)]
          "
        >
          <CheckCircle2 size={16} />
          Selection Sort Completed!
        </div>
      )}

      {/* =====================================================
          LOCAL ANIMATION KEYFRAMES
      ====================================================== */}

      <style>{`
        @keyframes scan {
          0% {
            transform: translateX(-150%);
          }

          100% {
            transform: translateX(450%);
          }
        }
      `}</style>
    </main>
  );
}

/* ============================================================
   SMALL VARIABLE
============================================================ */

function SmallVariable({
  name,
  value,
}: {
  name: string;
  value: string | number;
}) {
  return (
    <div
      className="
        rounded-lg
        border
        border-slate-800
        bg-slate-950
        px-2
        py-1.5
      "
    >
      <span
        className="
          text-[8px]
          font-semibold
          uppercase
          tracking-wider
          text-slate-600
        "
      >
        {name}
      </span>

      <p
        className="
          mt-0.5
          truncate
          font-mono
          text-[9px]
          font-bold
          text-cyan-400
        "
      >
        {value}
      </p>
    </div>
  );
}

/* ============================================================
   LEGEND
============================================================ */

function Legend({
  label,
  className,
}: {
  label: string;
  className: string;
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

      <span
        className="
          text-[8px]
          font-medium
          text-slate-500
        "
      >
        {label}
      </span>
    </span>
  );
}

/* ============================================================
   COMPLEXITY BOX
============================================================ */

function ComplexityBox({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div
      className="
        rounded-xl
        border
        border-slate-800
        bg-slate-950
        px-3
        py-2
      "
    >
      <span
        className="
          text-[8px]
          uppercase
          tracking-widest
          text-slate-600
        "
      >
        {title}
      </span>

      <p
        className="
          mt-1
          font-mono
          text-[10px]
          font-bold
          text-purple-400
        "
      >
        {value}
      </p>
    </div>
  );
}