import { useMemo, useState } from "react";

import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Gauge,
} from "lucide-react";

import {
  generateQuickSortSteps,
} from "../algorithms/Sorting/QuickSort";

const INITIAL_ARRAY = [
  64,
  34,
  25,
  12,
  22,
  11,
  90,
];

const CODE_BY_LANGUAGE: Record<string, string[]> = {
  TypeScript: [
    "function quickSort(array: number[], low: number, high: number) {",
    "  if (low < high) {",
    "    const pivotIndex = partition(array, low, high);",
    "",
    "    quickSort(array, low, pivotIndex - 1);",
    "    quickSort(array, pivotIndex + 1, high);",
    "  }",
    "}",
    "",
    "function partition(array, low, high) {",
    "  const pivot = array[high];",
    "  let i = low - 1;",
    "",
    "  for (let j = low; j < high; j++) {",
    "    if (array[j] < pivot) {",
    "      i++;",
    "      [array[i], array[j]] = [array[j], array[i]];",
    "    }",
    "  }",
    "",
    "  [array[i + 1], array[high]] =",
    "    [array[high], array[i + 1]];",
    "",
    "  return i + 1;",
    "}",
  ],

  Java: [
    "void quickSort(int[] array, int low, int high) {",
    "    if (low < high) {",
    "        int pivotIndex = partition(array, low, high);",
    "",
    "        quickSort(array, low, pivotIndex - 1);",
    "        quickSort(array, pivotIndex + 1, high);",
    "    }",
    "}",
    "",
    "int partition(int[] array, int low, int high) {",
    "    int pivot = array[high];",
    "    int i = low - 1;",
    "",
    "    for (int j = low; j < high; j++) {",
    "        if (array[j] < pivot) {",
    "            i++;",
    "            int temp = array[i];",
    "            array[i] = array[j];",
    "            array[j] = temp;",
    "        }",
    "    }",
    "",
    "    int temp = array[i + 1];",
    "    array[i + 1] = array[high];",
    "    array[high] = temp;",
    "",
    "    return i + 1;",
    "}",
  ],

  Python: [
    "def quick_sort(array, low, high):",
    "    if low < high:",
    "        pivot_index = partition(array, low, high)",
    "",
    "        quick_sort(array, low, pivot_index - 1)",
    "        quick_sort(array, pivot_index + 1, high)",
    "",
    "def partition(array, low, high):",
    "    pivot = array[high]",
    "    i = low - 1",
    "",
    "    for j in range(low, high):",
    "        if array[j] < pivot:",
    "            i += 1",
    "            array[i], array[j] = array[j], array[i]",
    "",
    "    array[i + 1], array[high] =",
    "        array[high], array[i + 1]",
    "",
    "    return i + 1",
  ],

  C: [
    "void quickSort(int array[], int low, int high) {",
    "    if (low < high) {",
    "        int pivotIndex = partition(array, low, high);",
    "",
    "        quickSort(array, low, pivotIndex - 1);",
    "        quickSort(array, pivotIndex + 1, high);",
    "    }",
    "}",
    "",
    "int partition(int array[], int low, int high) {",
    "    int pivot = array[high];",
    "    int i = low - 1;",
    "",
    "    for (int j = low; j < high; j++) {",
    "        if (array[j] < pivot) {",
    "            i++;",
    "            int temp = array[i];",
    "            array[i] = array[j];",
    "            array[j] = temp;",
    "        }",
    "    }",
    "",
    "    int temp = array[i + 1];",
    "    array[i + 1] = array[high];",
    "    array[high] = temp;",
    "",
    "    return i + 1;",
    "}",
  ],

  "C++": [
    "void quickSort(vector& array, int low, int high) {",
    "    if (low < high) {",
    "        int pivotIndex = partition(array, low, high);",
    "",
    "        quickSort(array, low, pivotIndex - 1);",
    "        quickSort(array, pivotIndex + 1, high);",
    "    }",
    "}",
    "",
    "int partition(vector& array, int low, int high) {",
    "    int pivot = array[high];",
    "    int i = low - 1;",
    "",
    "    for (int j = low; j < high; j++) {",
    "        if (array[j] < pivot) {",
    "            i++;",
    "            swap(array[i], array[j]);",
    "        }",
    "    }",
    "",
    "    swap(array[i + 1], array[high]);",
    "    return i + 1;",
    "}",
  ],

  JavaScript: [
    "function quickSort(array, low, high) {",
    "  if (low < high) {",
    "    const pivotIndex = partition(array, low, high);",
    "",
    "    quickSort(array, low, pivotIndex - 1);",
    "    quickSort(array, pivotIndex + 1, high);",
    "  }",
    "}",
    "",
    "function partition(array, low, high) {",
    "  const pivot = array[high];",
    "  let i = low - 1;",
    "",
    "  for (let j = low; j < high; j++) {",
    "    if (array[j] < pivot) {",
    "      i++;",
    "      [array[i], array[j]] = [array[j], array[i]];",
    "    }",
    "  }",
    "",
    "  [array[i + 1], array[high]] =",
    "    [array[high], array[i + 1]];",
    "",
    "  return i + 1;",
    "}",
  ],
};

const LANGUAGE_ICONS: Record<string, string> = {
  Java: "☕",
  Python: "🐍",
  C: "🔵",
  "C++": "🔷",
  JavaScript: "🟨",
  TypeScript: "🔷",
};

type Step = {
  step: number;
  line: number;
  array: number[];

  low: number;
  high: number;

  pivot: number | null;
  pivotIndex: number | null;

  comparing: number[];
  swapping: number[];

  sorted?: number[];

  explanation: string;
};

export default function QuickSortVisualizer() {
  const steps = useMemo(() => {
    return generateQuickSortSteps(
      INITIAL_ARRAY,
    ) as Step[];
  }, []);

  const [currentStep, setCurrentStep] =
    useState(0);

  const [speed, setSpeed] =
    useState("1x");

  const [language, setLanguage] =
    useState("TypeScript");

  const step = steps[currentStep];

  const currentArray =
    step?.array ?? INITIAL_ARRAY;

  const currentLine =
    step?.line ?? 1;

  const isFirst =
    currentStep === 0;

  const isLast =
    currentStep >= steps.length - 1;

  const codeLines =
    CODE_BY_LANGUAGE[language] ??
    CODE_BY_LANGUAGE.TypeScript;

  const next = () => {
    if (!isLast) {
      setCurrentStep(
        (previous) => previous + 1,
      );
    }
  };

  const previous = () => {
    if (!isFirst) {
      setCurrentStep(
        (previous) => previous - 1,
      );
    }
  };

  const reset = () => {
    setCurrentStep(0);
  };

  const getValue = (
    value: unknown,
  ) => {
    if (
      value === null ||
      value === undefined
    ) {
      return "-";
    }

    return String(value);
  };

  return (
    <>
      {/* =====================================================
          UNIQUE QUICK SORT ANIMATION
      ====================================================== */}

      <style>
        {`
          @keyframes quantumPulse {
            0%, 100% {
              transform: scale(1);
              opacity: .65;
            }
            50% {
              transform: scale(1.08);
              opacity: 1;
            }
          }

          @keyframes orbitSpin {
            from {
              transform: translate(-50%, -50%) rotate(0deg);
            }
            to {
              transform: translate(-50%, -50%) rotate(360deg);
            }
          }

          @keyframes radarSweep {
            0% {
              transform: translateX(-120%);
              opacity: 0;
            }
            20% {
              opacity: .8;
            }
            80% {
              opacity: .8;
            }
            100% {
              transform: translateX(420%);
              opacity: 0;
            }
          }

          @keyframes particleFloat {
            0%, 100% {
              transform: translateY(0) scale(.8);
              opacity: .25;
            }
            50% {
              transform: translateY(-12px) scale(1.2);
              opacity: .9;
            }
          }

          @keyframes pivotShockwave {
            0% {
              transform: translate(-50%, -50%) scale(.7);
              opacity: .75;
            }
            100% {
              transform: translate(-50%, -50%) scale(2.5);
              opacity: 0;
            }
          }

          @keyframes swapFlip {
            0% {
              transform: perspective(500px) rotateY(0deg) scale(1);
            }
            45% {
              transform: perspective(500px) rotateY(180deg) scale(1.12);
            }
            100% {
              transform: perspective(500px) rotateY(360deg) scale(1);
            }
          }

          @keyframes sortedLock {
            0% {
              box-shadow: 0 0 0 rgba(74,222,128,0);
            }
            50% {
              box-shadow:
                0 0 22px rgba(74,222,128,.55),
                0 0 42px rgba(34,197,94,.18);
            }
            100% {
              box-shadow:
                0 0 8px rgba(74,222,128,.2);
            }
          }

          @keyframes scanGlow {
            0%, 100% {
              opacity: .15;
            }
            50% {
              opacity: .8;
            }
          }

          .quick-orbit {
            animation: orbitSpin 2.4s linear infinite;
          }

          .quick-pulse {
            animation: quantumPulse 1.2s ease-in-out infinite;
          }

          .quick-particle {
            animation: particleFloat 1.8s ease-in-out infinite;
          }

          .quick-shockwave {
            animation: pivotShockwave 1.2s ease-out infinite;
          }

          .quick-swap {
            animation: swapFlip .65s cubic-bezier(.22,.61,.36,1);
          }

          .quick-sorted {
            animation: sortedLock 1.4s ease-in-out infinite;
          }

          .quick-scan {
            animation: radarSweep 2.8s ease-in-out infinite;
          }

          @media (prefers-reduced-motion: reduce) {
            .quick-orbit,
            .quick-pulse,
            .quick-particle,
            .quick-shockwave,
            .quick-swap,
            .quick-sorted,
            .quick-scan {
              animation: none !important;
            }
          }
        `}
      </style>

      {/* =====================================================
          HEADER
      ====================================================== */}

      <div
        className="
          mx-auto
          mb-4
          flex
          max-w-[1400px]
          items-center
          justify-between
        "
      >
        <div className="flex items-center gap-3">
          <div
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              bg-cyan-500/10
              text-cyan-400
            "
          >
            <Gauge size={20} />
          </div>

          <div>
            <h1
              className="
                text-lg
                font-bold
                text-white
              "
            >
              Quick Sort Visualizer
            </h1>

            <p
              className="
                text-[10px]
                text-slate-500
              "
            >
              Pivot • Partition • Recursion
            </p>
          </div>
        </div>

        <div
          className="
            rounded-xl
            border
            border-slate-800
            bg-slate-900
            px-4
            py-2
            text-xs
            text-slate-400
          "
        >
          STEP{" "}
          <span className="font-bold text-cyan-400">
            {currentStep + 1}
          </span>{" "}
          /{" "}
          <span className="font-bold text-white">
            {steps.length}
          </span>
        </div>
      </div>

      {/* =====================================================
          TOP AREA
      ====================================================== */}

      <div
        className="
          mx-auto
          grid
          max-w-[1400px]
          grid-cols-1
          gap-4
          lg:grid-cols-2
        "
      >
        {/* =================================================
            SOURCE CODE
        ================================================== */}

        <div
          className="
            overflow-hidden
            rounded-2xl
            border
            border-slate-800
            bg-[#050b19]
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
                  font-semibold
                  uppercase
                  tracking-widest
                  text-slate-500
                "
              >
                Source Code
              </p>

              <p
                className="
                  mt-1
                  text-[9px]
                  text-slate-600
                "
              >
                Current execution line
              </p>
            </div>

            <div className="relative">
              <select
                value={language}
                onChange={(event) =>
                  setLanguage(
                    event.target.value,
                  )
                }
                className="
                  cursor-pointer
                  appearance-none
                  rounded-xl
                  border
                  border-slate-700
                  bg-slate-900
                  py-2
                  pl-3
                  pr-9
                  text-[10px]
                  font-semibold
                  text-cyan-400
                  outline-none
                  transition
                  hover:border-cyan-500/50
                  focus:border-cyan-400
                "
              >
                {Object.keys(
                  CODE_BY_LANGUAGE,
                ).map((item) => (
                  <option
                    key={item}
                    value={item}
                    className="bg-slate-950"
                  >
                    {LANGUAGE_ICONS[item]}{" "}
                    {item}
                  </option>
                ))}
              </select>

              <span
                className="
                  pointer-events-none
                  absolute
                  right-3
                  top-1/2
                  -translate-y-1/2
                  text-[9px]
                  text-cyan-400
                "
              >
                ▼
              </span>
            </div>
          </div>

          <div
            className="
              h-[430px]
              overflow-y-auto
              p-3
              scrollbar-thin
              scrollbar-thumb-slate-700
            "
          >
            <div className="space-y-1">
              {codeLines.map(
                (code, index) => {
                  const active =
                    index + 1 ===
                    currentLine;

                  return (
                    <div
                      key={`${language}-${index}`}
                      className={`
                        flex
                        min-h-[26px]
                        items-center
                        rounded-lg
                        px-2
                        text-[10px]
                        font-mono
                        transition-all
                        duration-200
                        ${
                          active
                            ? "bg-cyan-500/10 text-cyan-300 shadow-[inset_3px_0_0_#22d3ee]"
                            : "text-slate-500"
                        }
                      `}
                    >
                      <span
                        className={`
                          mr-4
                          w-5
                          text-right
                          text-[9px]
                          ${
                            active
                              ? "text-cyan-400"
                              : "text-slate-700"
                          }
                        `}
                      >
                        {index + 1}
                      </span>

                      <span
                        className={
                          active
                            ? "font-semibold"
                            : ""
                        }
                      >
                        {code || "\u00A0"}
                      </span>
                    </div>
                  );
                },
              )}
            </div>
          </div>
        </div>

        {/* =================================================
            UNIQUE ARRAY VISUALIZATION
        ================================================== */}

        <div
          className="
            overflow-hidden
            rounded-2xl
            border
            border-slate-800
            bg-[#050b19]
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
                  font-semibold
                  uppercase
                  tracking-widest
                  text-slate-500
                "
              >
                Quantum Partition
              </p>

              <p
                className="
                  mt-1
                  text-[9px]
                  text-slate-600
                "
              >
                Pivot-driven recursive field
              </p>
            </div>

            <span
              className="
                rounded-lg
                bg-slate-800
                px-3
                py-1
                text-[9px]
                text-slate-400
              "
            >
              {currentArray.length} elements
            </span>
          </div>

          {/* =================================================
              ANIMATION AREA
          ================================================== */}

          <div
            className="
              relative
              flex
              h-[300px]
              items-center
              justify-center
              overflow-hidden
              px-5
            "
          >
            {/* BACKGROUND GRID */}

            <div
              className="
                pointer-events-none
                absolute
                inset-0
                opacity-[0.12]
                [background-image:linear-gradient(rgba(34,211,238,.3)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,.3)_1px,transparent_1px)]
                [background-size:28px_28px]
              "
            />

            {/* RADAR SCANNER */}

            <div
              className="
                quick-scan
                pointer-events-none
                absolute
                left-0
                top-0
                h-full
                w-24
                bg-gradient-to-r
                from-transparent
                via-cyan-400/10
                to-transparent
                blur-xl
              "
            />

            {/* FLOATING PARTICLES */}

            <span
              className="
                quick-particle
                absolute
                left-[10%]
                top-[18%]
                h-1
                w-1
                rounded-full
                bg-cyan-400
              "
            />

            <span
              className="
                quick-particle
                absolute
                right-[14%]
                top-[30%]
                h-1
                w-1
                rounded-full
                bg-purple-400
              "
              style={{
                animationDelay: "0.4s",
              }}
            />

            <span
              className="
                quick-particle
                absolute
                bottom-[20%]
                left-[22%]
                h-1
                w-1
                rounded-full
                bg-indigo-400
              "
              style={{
                animationDelay: "0.8s",
              }}
            />

            <div
              className="
                relative
                z-10
                flex
                min-w-max
                items-center
                justify-center
                gap-3
              "
            >
              {currentArray.map(
                (value, index) => {
                  const comparing =
                    step?.comparing?.includes(
                      index,
                    );

                  const swapping =
                    step?.swapping?.includes(
                      index,
                    );

                  const sorted =
                    step?.sorted?.includes(
                      index,
                    );

                  const pivot =
                    step?.pivotIndex ===
                    index;

                  /*
                   * Different spatial treatment for
                   * each algorithm state.
                   */

                  let translateY = 0;

                  if (pivot) {
                    translateY = -10;
                  } else if (comparing) {
                    translateY = -5;
                  } else if (swapping) {
                    translateY = 3;
                  } else if (sorted) {
                    translateY = -2;
                  }

                  return (
                    <div
                      key={index}
                      className="
                        flex
                        flex-col
                        items-center
                      "
                      style={{
                        transform:
                          `translateY(${translateY}px)`,
                        transition:
                          "transform 420ms cubic-bezier(.22,.61,.36,1)",
                        transitionDelay:
                          `${index * 18}ms`,
                      }}
                    >
                      {/* PIVOT ORBIT */}

                      <div
                        className="
                          relative
                          flex
                          h-[82px]
                          w-[70px]
                          items-center
                          justify-center
                        "
                      >
                        {pivot && (
                          <>
                            <div
                              className="
                                absolute
                                left-1/2
                                top-1/2
                                h-[78px]
                                w-[78px]
                                rounded-full
                                border
                                border-purple-400/30
                                quick-orbit
                              "
                              style={{
                                borderTopColor:
                                  "rgba(192,132,252,.9)",
                                borderRightColor:
                                  "rgba(34,211,238,.25)",
                              }}
                            />

                            <div
                              className="
                                absolute
                                left-1/2
                                top-1/2
                                h-[58px]
                                w-[58px]
                                rounded-full
                                border
                                border-purple-400/20
                                quick-shockwave
                              "
                            />

                            <div
                              className="
                                absolute
                                left-1/2
                                top-1/2
                                h-[45px]
                                w-[45px]
                                rounded-full
                                bg-purple-500/10
                                blur-xl
                                quick-pulse
                              "
                            />

                            <span
                              className="
                                absolute
                                -top-1
                                text-[8px]
                                font-black
                                tracking-[0.2em]
                                text-purple-300
                              "
                            >
                              PIVOT
                            </span>
                          </>
                        )}

                        {/* VALUE NODE */}

                        <div
                          className={`
                            relative
                            z-10
                            flex
                            h-16
                            w-16
                            items-center
                            justify-center
                            rounded-2xl
                            border
                            text-base
                            font-bold
                            transition-all
                            duration-500
                            ${
                              swapping
                                ? "quick-swap border-red-300 bg-red-500/20 text-red-200 shadow-[0_0_30px_rgba(248,113,113,.35)]"
                                : pivot
                                ? "border-purple-300 bg-purple-500/20 text-purple-100 shadow-[0_0_35px_rgba(168,85,247,.45)]"
                                : comparing
                                ? "quick-pulse border-cyan-300 bg-cyan-500/15 text-cyan-100 shadow-[0_0_28px_rgba(34,211,238,.35)]"
                                : sorted
                                ? "quick-sorted border-green-300 bg-green-500/15 text-green-100"
                                : "border-slate-700 bg-slate-900/90 text-white"
                            }
                          `}
                        >
                          {/* TOP LIGHT */}

                          <span
                            className="
                              pointer-events-none
                              absolute
                              left-2
                              right-2
                              top-1
                              h-px
                              bg-gradient-to-r
                              from-transparent
                              via-white/30
                              to-transparent
                            "
                          />

                          {value}

                          {/* COMPARISON TARGET */}

                          {comparing && (
                            <span
                              className="
                                pointer-events-none
                                absolute
                                inset-0
                                rounded-2xl
                                border
                                border-cyan-300/50
                                animate-ping
                              "
                            />
                          )}

                          {/* SWAP CORNER */}

                          {swapping && (
                            <span
                              className="
                                absolute
                                -right-1
                                -top-1
                                h-3
                                w-3
                                rounded-full
                                bg-red-300
                                shadow-[0_0_12px_rgba(248,113,113,.8)]
                              "
                            />
                          )}

                          {/* SORTED LOCK */}

                          {sorted && (
                            <span
                              className="
                                absolute
                                -bottom-1
                                -right-1
                                flex
                                h-4
                                w-4
                                items-center
                                justify-center
                                rounded-full
                                border
                                border-green-300
                                bg-green-500/20
                                text-[7px]
                                text-green-200
                              "
                            >
                              ✓
                            </span>
                          )}
                        </div>
                      </div>

                      {/* INDEX */}

                      <span
                        className={`
                          mt-1
                          font-mono
                          text-[8px]
                          transition-colors
                          duration-300
                          ${
                            pivot
                              ? "text-purple-300"
                              : comparing
                              ? "text-cyan-300"
                              : swapping
                              ? "text-red-300"
                              : sorted
                              ? "text-green-300"
                              : "text-slate-600"
                          }
                        `}
                      >
                        [{index}]
                      </span>
                    </div>
                  );
                },
              )}
            </div>

            {/* CENTRAL PARTITION LINE */}

            {step?.pivotIndex !== null &&
              step?.pivotIndex !== undefined && (
                <div
                  className="
                    pointer-events-none
                    absolute
                    bottom-6
                    left-1/2
                    z-0
                    h-px
                    w-[75%]
                    -translate-x-1/2
                    bg-gradient-to-r
                    from-transparent
                    via-purple-400/25
                    to-transparent
                  "
                />
              )}
          </div>

          {/* LEGEND */}

          <div
            className="
              flex
              flex-wrap
              items-center
              justify-center
              gap-5
              border-t
              border-slate-800
              py-3
              text-[9px]
            "
          >
            <span className="flex items-center gap-1.5 text-cyan-400">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
              Scanning
            </span>

            <span className="flex items-center gap-1.5 text-red-400">
              <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
              Swapping
            </span>

            <span className="flex items-center gap-1.5 text-purple-400">
              <span className="h-1.5 w-1.5 rounded-full bg-purple-400" />
              Pivot Orbit
            </span>

            <span className="flex items-center gap-1.5 text-green-400">
              <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
              Locked
            </span>
          </div>

          {/* BUTTONS */}

          <div
            className="
              flex
              items-center
              justify-center
              gap-2
              border-t
              border-slate-800
              px-4
              py-3
            "
          >
            <button
              type="button"
              onClick={previous}
              disabled={isFirst}
              className="
                flex
                items-center
                gap-1
                rounded-xl
                border
                border-slate-700
                bg-slate-800
                px-3
                py-2
                text-[10px]
                text-slate-300
                transition
                hover:bg-slate-700
                disabled:cursor-not-allowed
                disabled:opacity-30
              "
            >
              <ChevronLeft size={14} />
              Previous
            </button>

            <button
              type="button"
              onClick={next}
              disabled={isLast}
              className="
                flex
                items-center
                gap-1
                rounded-xl
                bg-gradient-to-r
                from-cyan-500
                to-indigo-600
                px-4
                py-2
                text-[10px]
                font-bold
                text-white
                shadow-lg
                shadow-cyan-500/10
                transition
                hover:scale-[1.02]
                disabled:cursor-not-allowed
                disabled:opacity-40
              "
            >
              Next
              <ChevronRight size={14} />
            </button>

            <button
              type="button"
              onClick={reset}
              className="
                flex
                items-center
                gap-1
                rounded-xl
                border
                border-slate-700
                bg-slate-800
                px-3
                py-2
                text-[10px]
                text-slate-300
                transition
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
                rounded-xl
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
                className="
                  cursor-pointer
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
        </div>
      </div>

      {/* =====================================================
          INFORMATION ROW
      ====================================================== */}

      <div
        className="
          mx-auto
          mt-4
          grid
          max-w-[1400px]
          grid-cols-1
          gap-4
          lg:grid-cols-2
        "
      >
        {/* LIVE VARIABLES */}

        <div
          className="
            rounded-2xl
            border
            border-slate-800
            bg-[#0c1528]
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
              <h2
                className="
                  text-sm
                  font-bold
                  text-white
                "
              >
                Live Variables
              </h2>

              <p
                className="
                  text-[8px]
                  text-slate-500
                "
              >
                Current algorithm state
              </p>
            </div>

            <span
              className="
                text-[8px]
                font-bold
                text-cyan-400
              "
            >
              LIVE
            </span>
          </div>

          <div
            className="
              grid
              grid-cols-3
              gap-2
            "
          >
            <Variable
              name="LOW"
              value={getValue(step?.low)}
            />

            <Variable
              name="HIGH"
              value={getValue(step?.high)}
            />

            <Variable
              name="PIVOT"
              value={getValue(step?.pivot)}
            />

            <Variable
              name="PIVOT INDEX"
              value={getValue(
                step?.pivotIndex,
              )}
            />

            <Variable
              name="COMPARING"
              value={
                step?.comparing?.length
                  ? step.comparing.join(", ")
                  : "-"
              }
            />

            <Variable
              name="SWAPPING"
              value={
                step?.swapping?.length
                  ? step.swapping.join(", ")
                  : "-"
              }
            />
          </div>
        </div>

        {/* WHAT'S HAPPENING */}

        <div
          className="
            rounded-2xl
            border
            border-indigo-500/20
            bg-[#0c1229]
            p-3
          "
        >
          <div
            className="
              mb-2
              flex
              items-center
              gap-3
            "
          >
            <div
              className="
                flex
                h-8
                w-8
                shrink-0
                items-center
                justify-center
                rounded-lg
                bg-indigo-500/10
                text-indigo-400
              "
            >
              ?
            </div>

            <div>
              <h2
                className="
                  text-sm
                  font-bold
                  text-white
                "
              >
                What's Happening?
              </h2>

              <p
                className="
                  text-[8px]
                  text-slate-500
                "
              >
                Explanation of the current step
              </p>
            </div>
          </div>

          <p
            className="
              min-h-[42px]
              text-[10px]
              leading-5
              text-slate-300
            "
          >
            {step?.explanation ??
              "Quick Sort starts by selecting a pivot and partitioning the array around it."}
          </p>
        </div>
      </div>

      {/* =====================================================
          COMPLEXITY
      ====================================================== */}

      <div
        className="
          mx-auto
          mt-4
          max-w-[1400px]
          rounded-2xl
          border
          border-cyan-500/20
          bg-[#0b1629]
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
            <h2
              className="
                text-sm
                font-bold
                text-cyan-400
              "
            >
              Complexity Analysis
            </h2>

            <p
              className="
                text-[8px]
                text-slate-500
              "
            >
              Quick Sort performance
            </p>
          </div>

          <Gauge
            size={16}
            className="text-cyan-400"
          />
        </div>

        <div
          className="
            grid
            grid-cols-3
            gap-2
          "
        >
          <Complexity
            title="BEST"
            value="O(n log n)"
          />

          <Complexity
            title="AVERAGE"
            value="O(n log n)"
          />

          <Complexity
            title="WORST"
            value="O(n²)"
          />
        </div>

        <div
          className="
            mt-2
            rounded-xl
            border
            border-slate-800
            bg-[#050b19]
            px-3
            py-2
          "
        >
          <p
            className="
              text-[8px]
              uppercase
              tracking-wider
              text-slate-600
            "
          >
            Space Complexity
          </p>

          <p
            className="
              mt-1
              text-[10px]
              font-bold
              text-cyan-400
            "
          >
            O(log n)
          </p>
        </div>
      </div>

      {/* COMPLETED */}

      {isLast && (
        <div
          className="
            mx-auto
            mt-3
            flex
            max-w-[1400px]
            items-center
            justify-center
            gap-2
            rounded-xl
            border
            border-green-500/20
            bg-green-500/5
            py-2
            text-[10px]
            font-semibold
            text-green-400
          "
        >
          ✓ Quick Sort Completed
        </div>
      )}
    </>
  );
}

/* =========================================================
   SMALL VARIABLE CARD
========================================================= */

function Variable({
  name,
  value,
}: {
  name: string;
  value: string;
}) {
  return (
    <div
      className="
        rounded-xl
        border
        border-slate-800
        bg-[#07101f]
        px-3
        py-2
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
          mt-1
          truncate
          text-[10px]
          font-bold
          text-cyan-400
        "
      >
        {value}
      </p>
    </div>
  );
}

/* =========================================================
   COMPLEXITY CARD
========================================================= */

function Complexity({
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
        bg-[#07101f]
        px-3
        py-2
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
        {title}
      </span>

      <p
        className="
          mt-1
          text-[10px]
          font-bold
          text-cyan-400
        "
      >
        {value}
      </p>
    </div>
  );
}