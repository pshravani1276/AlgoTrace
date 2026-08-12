import { useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Gauge,
  CheckCircle2,
} from "lucide-react";

import {
  generateBubbleSortSteps,
} from "../algorithms/Sorting/BubbleSort";

const INITIAL_ARRAY = [
  64,
  34,
  25,
  12,
  22,
  11,
  90,
];

type Language =
  | "Java"
  | "C"
  | "Python"
  | "C++"
  | "JavaScript"
  | "TypeScript";

type BubbleSortStep = {
  step: number;
  line: number;
  array: number[];
  i: number;
  j: number;
  comparing: number[];
  swapping: number[];
  sorted: number[];
  explanation: string;
};

const CODE: Record<Language, string[]> = {
  Java: [
    "void bubbleSort(int[] array) {",
    "  int n = array.length;",
    "",
    "  for (int i = 0; i < n - 1; i++) {",
    "",
    "    for (int j = 0; j < n - i - 1; j++) {",
    "",
    "      if (array[j] > array[j + 1]) {",
    "",
    "        int temp = array[j];",
    "        array[j] = array[j + 1];",
    "        array[j + 1] = temp;",
    "",
    "      }",
    "    }",
    "  }",
    "}",
  ],

  C: [
    "void bubbleSort(int array[], int n) {",
    "",
    "  for (int i = 0; i < n - 1; i++) {",
    "",
    "    for (int j = 0; j < n - i - 1; j++) {",
    "",
    "      if (array[j] > array[j + 1]) {",
    "",
    "        int temp = array[j];",
    "        array[j] = array[j + 1];",
    "        array[j + 1] = temp;",
    "",
    "      }",
    "    }",
    "  }",
    "}",
  ],

  Python: [
    "def bubble_sort(array):",
    "    n = len(array)",
    "",
    "    for i in range(n - 1):",
    "",
    "        for j in range(n - i - 1):",
    "",
    "            if array[j] > array[j + 1]:",
    "",
    "                array[j], array[j + 1] =",
    "                    array[j + 1], array[j]",
    "",
    "    return array",
  ],

  "C++": [
    "void bubbleSort(vector<int>& array) {",
    "  int n = array.size();",
    "",
    "  for (int i = 0; i < n - 1; i++) {",
    "",
    "    for (int j = 0; j < n - i - 1; j++) {",
    "",
    "      if (array[j] > array[j + 1]) {",
    "",
    "        swap(array[j], array[j + 1]);",
    "",
    "      }",
    "    }",
    "  }",
    "}",
  ],

  JavaScript: [
    "function bubbleSort(array) {",
    "  const n = array.length;",
    "",
    "  for (let i = 0; i < n - 1; i++) {",
    "",
    "    for (let j = 0; j < n - i - 1; j++) {",
    "",
    "      if (array[j] > array[j + 1]) {",
    "",
    "        [array[j], array[j + 1]] =",
    "          [array[j + 1], array[j]];",
    "",
    "      }",
    "    }",
    "  }",
    "}",
  ],

  TypeScript: [
    "function bubbleSort(array: number[]) {",
    "  const n = array.length;",
    "",
    "  for (let i = 0; i < n - 1; i++) {",
    "",
    "    for (let j = 0; j < n - i - 1; j++) {",
    "",
    "      if (array[j] > array[j + 1]) {",
    "",
    "        [array[j], array[j + 1]] =",
    "          [array[j + 1], array[j]];",
    "",
    "      }",
    "    }",
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

export default function BubbleSortVisualizer() {
  const steps = useMemo(() => {
    return generateBubbleSortSteps(
      INITIAL_ARRAY
    ) as BubbleSortStep[];
  }, []);

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
    step?.i ?? -1;

  const currentJ =
    step?.j ?? -1;

  const comparing =
    step?.comparing ?? [];

  const swapping =
    step?.swapping ?? [];

  const sorted =
    step?.sorted ?? [];

  const explanation =
    step?.explanation ??
    "Bubble Sort starts by comparing adjacent elements.";

  const isFirst =
    currentStep === 0;

  const isLast =
    steps.length === 0 ||
    currentStep >= steps.length - 1;

  const handlePrevious = () => {
    if (isFirst) return;

    setCurrentStep((previous) =>
      Math.max(0, previous - 1)
    );
  };

  const handleNext = () => {
    if (isLast) return;

    setCurrentStep((previous) =>
      Math.min(
        steps.length - 1,
        previous + 1
      )
    );
  };

  const handleReset = () => {
    setCurrentStep(0);
  };

  const handleLanguageChange = (
    selectedLanguage: Language
  ) => {
    setLanguage(selectedLanguage);
  };

  /*
   * The smaller of the currently compared pair.
   * This is only a visual MIN indicator and does
   * not change Bubble Sort's actual logic.
   */
  const minimumComparedIndex =
    comparing.length >= 2
      ? currentArray[comparing[0]] <=
        currentArray[comparing[1]]
        ? comparing[0]
        : comparing[1]
      : comparing.length === 1
      ? comparing[0]
      : -1;

  return (
    <main className="w-full">
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
        <div>
          <div className="flex items-center gap-2">
            <div
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-xl
                bg-cyan-500/10
                text-cyan-400
              "
            >
              <Gauge size={18} />
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
                Bubble Sort Visualizer
              </h1>

              <p
                className="
                  text-[10px]
                  text-slate-500
                "
              >
                Compare • Swap • Sort
              </p>
            </div>
          </div>
        </div>

        <div
          className="
            flex
            items-center
            gap-2
            rounded-xl
            border
            border-slate-800
            bg-slate-900
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
              text-xs
              font-bold
              text-cyan-400
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
            {Math.max(
              steps.length,
              1
            )}
          </span>
        </div>
      </div>

      {/* =====================================================
          MAIN VISUALIZATION AREA
      ====================================================== */}

      <div
        className="
          grid
          gap-4
          xl:grid-cols-[0.95fr_1.05fr]
        "
      >
        {/* =================================================
            LEFT - CODE
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

            <select
              value={language}
              onChange={(event) =>
                handleLanguageChange(
                  event.target.value as Language
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
                text-cyan-400
                outline-none
                transition
                hover:border-cyan-500/40
              "
            >
              {(
                Object.keys(
                  LANGUAGE_LABELS
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
                  lineNumber === currentLine;

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
                          ? "bg-cyan-500/10"
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
                            ? "text-cyan-400"
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
                            ? "font-bold text-cyan-300"
                            : "text-slate-400"
                        }
                      `}
                    >
                      {code || " "}
                    </span>
                  </div>
                );
              }
            )}
          </div>
        </section>

        {/* =================================================
            RIGHT - ARRAY VISUALIZATION
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
                Array Visualization
              </p>

              <p
                className="
                  mt-1
                  text-[9px]
                  text-slate-600
                "
              >
                Watch values compare and swap
              </p>
            </div>

            <span
              className="
                rounded-lg
                bg-slate-800
                px-2
                py-1
                text-[9px]
                text-slate-500
              "
            >
              {currentArray.length} elements
            </span>
          </div>

          {/* ARRAY */}

          <div
            className="
              flex
              min-h-[300px]
              items-center
              justify-center
              overflow-x-auto
              px-5
              py-10
            "
          >
            <div
              className="
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
                    minimumComparedIndex;

                  const isCurrent =
                    index === currentJ;

                  return (
                    <div
                      key={`${index}-${value}`}
                      className={`
                        relative
                        flex
                        flex-col
                        items-center
                        transition-all
                        duration-500
                        ${
                          isSwapping
                            ? "translate-y-[-10px]"
                            : ""
                        }
                      `}
                    >
                      {/* =========================
                          MIN LABEL
                      ========================== */}

                      {isComparing &&
                        isMinimum &&
                        !isSwapping &&
                        !isSorted && (
                          <div
                            className="
                              absolute
                              -top-9
                              z-20
                              whitespace-nowrap
                              rounded-md
                              border
                              border-emerald-400/40
                              bg-emerald-500/10
                              px-2
                              py-0.5
                              font-mono
                              text-[7px]
                              font-bold
                              uppercase
                              tracking-widest
                              text-emerald-300
                              animate-pulse
                            "
                          >
                            MIN
                          </div>
                        )}

                      {/* =========================
                          SWAP LABEL
                      ========================== */}

                      {isSwapping && (
                        <div
                          className="
                            absolute
                            -top-9
                            z-30
                            whitespace-nowrap
                            rounded-md
                            border
                            border-red-400/40
                            bg-red-500/10
                            px-2
                            py-0.5
                            font-mono
                            text-[7px]
                            font-bold
                            uppercase
                            tracking-widest
                            text-red-300
                            animate-bounce
                          "
                        >
                          SWAP
                        </div>
                      )}

                      {/* =========================
                          VALUE NODE
                      ========================== */}

                      <div
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
                          text-sm
                          font-bold
                          shadow-lg
                          transition-all
                          duration-500
                          sm:h-16
                          sm:w-16

                          ${
                            isSwapping
                              ? `
                                scale-125
                                rotate-3
                                border-red-400
                                bg-red-500/20
                                text-red-300
                                shadow-red-500/40
                              `
                              : isComparing
                              ? `
                                scale-110
                                border-cyan-400
                                bg-cyan-500/20
                                text-cyan-300
                                shadow-cyan-500/30
                              `
                              : isSorted
                              ? `
                                border-green-400
                                bg-green-500/20
                                text-green-300
                                shadow-green-500/20
                              `
                              : `
                                border-slate-700
                                bg-slate-800
                                text-white
                              `
                          }
                        `}
                      >
                        {/* COMPARISON ORBIT */}

                        {isComparing &&
                          !isSwapping && (
                            <>
                              <div
                                className="
                                  absolute
                                  inset-[-5px]
                                  rounded-xl
                                  border
                                  border-cyan-400/30
                                  animate-ping
                                "
                              />

                              <div
                                className="
                                  absolute
                                  inset-[-9px]
                                  rounded-2xl
                                  border
                                  border-cyan-400/10
                                  animate-[spin_3s_linear_infinite]
                                "
                              />
                            </>
                          )}

                        {/* SWAP ENERGY RING */}

                        {isSwapping && (
                          <>
                            <div
                              className="
                                absolute
                                inset-[-6px]
                                rounded-xl
                                border-2
                                border-red-400/40
                                animate-ping
                              "
                            />

                            <div
                              className="
                                absolute
                                inset-[-10px]
                                rounded-2xl
                                border
                                border-orange-400/20
                                animate-[spin_1.5s_linear_infinite]
                              "
                            />
                          </>
                        )}

                        {/* MINIMUM GLOW */}

                        {isMinimum &&
                          isComparing &&
                          !isSwapping && (
                            <div
                              className="
                                absolute
                                inset-[-3px]
                                rounded-xl
                                border
                                border-emerald-400/30
                                animate-pulse
                              "
                            />
                          )}

                        <span className="relative z-10">
                          {value}
                        </span>
                      </div>

                      {/* INDEX */}

                      <span
                        className={`
                          mt-2
                          font-mono
                          text-[8px]
                          ${
                            isCurrent
                              ? "text-cyan-400"
                              : "text-slate-600"
                          }
                        `}
                      >
                        [{index}]
                      </span>
                    </div>
                  );
                }
              )}
            </div>
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
              px-4
              py-3
            "
          >
            <Legend
              label="Comparing"
              className="bg-cyan-400"
            />

            <Legend
              label="Min"
              className="bg-emerald-400"
            />

            <Legend
              label="Swapping"
              className="bg-red-400"
            />

            <Legend
              label="Sorted"
              className="bg-green-400"
            />
          </div>

          {/* CONTROLS */}

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
                hover:border-cyan-500/40
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
                from-cyan-500
                to-indigo-600
                px-5
                py-2.5
                text-xs
                font-bold
                text-white
                shadow-lg
                shadow-cyan-500/10
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
                hover:border-cyan-500/40
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

              <span
                className="
                  text-[10px]
                  text-slate-500
                "
              >
                Speed
              </span>

              <select
                value={speed}
                onChange={(event) =>
                  setSpeed(
                    event.target.value
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
          SMALL LIVE VARIABLES + WHAT'S HAPPENING
      ====================================================== */}

      <div
        className="
          mt-4
          grid
          gap-4
          lg:grid-cols-[0.9fr_1.1fr]
        "
      >
        {/* LIVE VARIABLES */}

        <section
          className="
            rounded-2xl
            border
            border-slate-800
            bg-slate-900/80
            p-2.5
          "
        >
          <div
            className="
              mb-1.5
              flex
              items-center
              justify-between
            "
          >
            <div>
              <h2
                className="
                  text-[11px]
                  font-bold
                  text-white
                "
              >
                Live Variables
              </h2>

              <p
                className="
                  text-[7px]
                  text-slate-600
                "
              >
                Current algorithm state
              </p>
            </div>

            <span
              className="
                text-[7px]
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
              grid-cols-4
              gap-1.5
            "
          >
            <SmallVariable
              name="i"
              value={
                currentI >= 0
                  ? currentI
                  : "—"
              }
            />

            <SmallVariable
              name="j"
              value={
                currentJ >= 0
                  ? currentJ
                  : "—"
              }
            />

            <SmallVariable
              name="Comparing"
              value={
                comparing.length > 0
                  ? comparing.join(", ")
                  : "—"
              }
            />

            <SmallVariable
              name="Swapping"
              value={
                swapping.length > 0
                  ? swapping.join(", ")
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
              ?
            </div>

            <div>
              <h2
                className="
                  text-xs
                  font-bold
                  text-white
                "
              >
                What's Happening?
              </h2>

              <p
                className="
                  text-[8px]
                  text-slate-600
                "
              >
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
          border-cyan-500/20
          bg-cyan-500/[0.03]
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
            <h2
              className="
                text-xs
                font-bold
                text-cyan-300
              "
            >
              Complexity Analysis
            </h2>

            <p
              className="
                mt-1
                text-[8px]
                text-slate-600
              "
            >
              Bubble Sort performance
            </p>
          </div>

          <Gauge
            size={15}
            className="text-cyan-400"
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
            value="O(n)"
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
              text-cyan-400
            "
          >
            O(1)
          </p>
        </div>
      </section>

      {/* =====================================================
          COMPLETED
      ====================================================== */}

      {isLast &&
        steps.length > 0 && (
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
            "
          >
            <CheckCircle2 size={16} />

            Bubble Sort Completed!
          </div>
        )}
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
        min-w-0
        rounded-lg
        border
        border-slate-800
        bg-slate-950
        px-2
        py-1.5
      "
    >
      <p
        className="
          truncate
          text-[7px]
          font-semibold
          uppercase
          tracking-wide
          text-slate-600
        "
      >
        {name}
      </p>

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
    <div className="flex items-center gap-1.5">
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
    </div>
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
      <p
        className="
          text-[8px]
          text-slate-600
        "
      >
        {title}
      </p>

      <p
        className="
          mt-1
          font-mono
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