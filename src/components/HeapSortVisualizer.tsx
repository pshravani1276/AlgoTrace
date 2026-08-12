import { useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Gauge,
  CheckCircle2,
  CircleHelp,
} from "lucide-react";

import { generateHeapSortSteps } from "../algorithms/Sorting/HeapSort";

const INITIAL_ARRAY = [64, 34, 25, 12, 22, 11, 90];

type HeapSortStep = {
  step: number;
  line: number;
  array: number[];

  i?: number;
  j?: number;
  largest?: number;
  heapSize?: number;
  phase?: string;

  comparing?: number[];
  swapping?: number[];
  sorted?: number[];

  explanation: string;
};

type Language =
  | "TypeScript"
  | "JavaScript"
  | "Python"
  | "Java"
  | "C++"
  | "C";

const CODE: Record<Language, string[]> = {
  TypeScript: [
    "function heapSort(array: number[]) {",
    "  const n = array.length;",
    "",
    "  for (let i = Math.floor(n / 2) - 1; i >= 0; i--)",
    "    heapify(array, n, i);",
    "",
    "  for (let i = n - 1; i > 0; i--) {",
    "    [array[0], array[i]] = [array[i], array[0]];",
    "",
    "    heapify(array, i, 0);",
    "  }",
    "}",
    "",
    "function heapify(array: number[], n: number, i: number) {",
    "  let largest = i;",
    "  const left = 2 * i + 1;",
    "  const right = 2 * i + 2;",
    "",
    "  if (left < n && array[left] > array[largest])",
    "    largest = left;",
    "",
    "  if (right < n && array[right] > array[largest])",
    "    largest = right;",
    "",
    "  if (largest !== i) {",
    "    [array[i], array[largest]] =",
    "      [array[largest], array[i]];",
    "",
    "    heapify(array, n, largest);",
    "  }",
    "}",
  ],

  JavaScript: [
    "function heapSort(array) {",
    "  const n = array.length;",
    "",
    "  for (let i = Math.floor(n / 2) - 1; i >= 0; i--)",
    "    heapify(array, n, i);",
    "",
    "  for (let i = n - 1; i > 0; i--) {",
    "    [array[0], array[i]] = [array[i], array[0]];",
    "",
    "    heapify(array, i, 0);",
    "  }",
    "}",
    "",
    "function heapify(array, n, i) {",
    "  let largest = i;",
    "  const left = 2 * i + 1;",
    "  const right = 2 * i + 2;",
    "",
    "  if (left < n && array[left] > array[largest])",
    "    largest = left;",
    "",
    "  if (right < n && array[right] > array[largest])",
    "    largest = right;",
    "",
    "  if (largest !== i) {",
    "    [array[i], array[largest]] =",
    "      [array[largest], array[i]];",
    "",
    "    heapify(array, n, largest);",
    "  }",
    "}",
  ],

  Python: [
    "def heap_sort(array):",
    "    n = len(array)",
    "",
    "    for i in range(n // 2 - 1, -1, -1):",
    "        heapify(array, n, i)",
    "",
    "    for i in range(n - 1, 0, -1):",
    "        array[0], array[i] = array[i], array[0]",
    "        heapify(array, i, 0)",
    "",
    "def heapify(array, n, i):",
    "    largest = i",
    "    left = 2 * i + 1",
    "    right = 2 * i + 2",
    "",
    "    if left < n and array[left] > array[largest]:",
    "        largest = left",
    "",
    "    if right < n and array[right] > array[largest]:",
    "        largest = right",
    "",
    "    if largest != i:",
    "        array[i], array[largest] = array[largest], array[i]",
    "        heapify(array, n, largest)",
  ],

  Java: [
    "void heapSort(int[] array) {",
    "  int n = array.length;",
    "",
    "  for (int i = n / 2 - 1; i >= 0; i--)",
    "    heapify(array, n, i);",
    "",
    "  for (int i = n - 1; i > 0; i--) {",
    "    int temp = array[0];",
    "    array[0] = array[i];",
    "    array[i] = temp;",
    "",
    "    heapify(array, i, 0);",
    "  }",
    "}",
    "",
    "void heapify(int[] array, int n, int i) {",
    "  int largest = i;",
    "  int left = 2 * i + 1;",
    "  int right = 2 * i + 2;",
    "",
    "  if (left < n && array[left] > array[largest])",
    "    largest = left;",
    "",
    "  if (right < n && array[right] > array[largest])",
    "    largest = right;",
    "",
    "  if (largest != i) {",
    "    int temp = array[i];",
    "    array[i] = array[largest];",
    "    array[largest] = temp;",
    "",
    "    heapify(array, n, largest);",
    "  }",
    "}",
  ],

  "C++": [
    "void heapSort(vector& array) {",
    "  int n = array.size();",
    "",
    "  for (int i = n / 2 - 1; i >= 0; i--)",
    "    heapify(array, n, i);",
    "",
    "  for (int i = n - 1; i > 0; i--) {",
    "    swap(array[0], array[i]);",
    "    heapify(array, i, 0);",
    "  }",
    "}",
    "",
    "void heapify(vector& array, int n, int i) {",
    "  int largest = i;",
    "  int left = 2 * i + 1;",
    "  int right = 2 * i + 2;",
    "",
    "  if (left < n && array[left] > array[largest])",
    "    largest = left;",
    "",
    "  if (right < n && array[right] > array[largest])",
    "    largest = right;",
    "",
    "  if (largest != i) {",
    "    swap(array[i], array[largest]);",
    "    heapify(array, n, largest);",
    "  }",
    "}",
  ],

  C: [
    "void heapSort(int array[], int n) {",
    "  for (int i = n / 2 - 1; i >= 0; i--)",
    "    heapify(array, n, i);",
    "",
    "  for (int i = n - 1; i > 0; i--) {",
    "    int temp = array[0];",
    "    array[0] = array[i];",
    "    array[i] = temp;",
    "",
    "    heapify(array, i, 0);",
    "  }",
    "}",
    "",
    "void heapify(int array[], int n, int i) {",
    "  int largest = i;",
    "  int left = 2 * i + 1;",
    "  int right = 2 * i + 2;",
    "",
    "  if (left < n && array[left] > array[largest])",
    "    largest = left;",
    "",
    "  if (right < n && array[right] > array[largest])",
    "    largest = right;",
    "",
    "  if (largest != i) {",
    "    int temp = array[i];",
    "    array[i] = array[largest];",
    "    array[largest] = temp;",
    "",
    "    heapify(array, n, largest);",
    "  }",
    "}",
  ],
};

export default function HeapSortVisualizer() {
  const steps = useMemo(() => {
    return generateHeapSortSteps(
      INITIAL_ARRAY
    ) as unknown as HeapSortStep[];
  }, []);

  const [currentStep, setCurrentStep] = useState(0);
  const [language, setLanguage] =
    useState<Language>("TypeScript");
  const [speed, setSpeed] = useState("1x");

  const step = steps[currentStep];

  const array =
    step?.array ?? INITIAL_ARRAY;

  const comparing =
    step?.comparing ?? [];

  const swapping =
    step?.swapping ?? [];

  const sorted =
    step?.sorted ?? [];

  const heapSize =
    step?.heapSize !== undefined &&
    step.heapSize >= 0
      ? Math.min(
          step.heapSize,
          array.length
        )
      : array.length;

  const phase =
    step?.phase ?? "build";

  const line =
    step?.line ?? 1;

  const getCleanJ = (): string | number => {
    if (
      step?.j !== undefined &&
      step.j >= 0
    ) {
      return step.j;
    }

    if (
      comparing.length >= 2 &&
      comparing[1] >= 0
    ) {
      return comparing[1];
    }

    if (
      swapping.length >= 2 &&
      swapping[1] >= 0
    ) {
      return swapping[1];
    }

    if (
      step?.largest !== undefined &&
      step.largest >= 0
    ) {
      return step.largest;
    }

    if (
      step?.i !== undefined &&
      step.i >= 0
    ) {
      const left =
        2 * step.i + 1;

      const right =
        2 * step.i + 2;

      if (left < heapSize) {
        return left;
      }

      if (right < heapSize) {
        return right;
      }
    }

    return "-";
  };

  const liveJ = getCleanJ();

  const liveI =
    step?.i !== undefined &&
    step.i >= 0
      ? step.i
      : "-";

  const explanation =
    step?.explanation ??
    "Heap Sort starts by building a max heap.";

  const firstStep =
    currentStep === 0;

  const lastStep =
    steps.length === 0 ||
    currentStep >= steps.length - 1;

  const handleNext = () => {
    if (!lastStep) {
      setCurrentStep((value) =>
        Math.min(
          value + 1,
          steps.length - 1
        )
      );
    }
  };

  const handlePrevious = () => {
    if (!firstStep) {
      setCurrentStep((value) =>
        Math.max(value - 1, 0)
      );
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
  };

  const sortedHeapArray =
    array.map((value, index) => ({
      value,
      index,
      isSorted:
        sorted.includes(index),
      isComparing:
        comparing.includes(index),
      isSwapping:
        swapping.includes(index),
    }));

  /*
   * IMPORTANT:
   *
   * Step 0 intentionally shows an EMPTY TREE.
   * The tree starts appearing only after Next.
   */
  const showTree = currentStep > 0;

  return (
    <div className="w-full">

      {/* =====================================================
          TOP
      ====================================================== */}

      <div
        className="
          mb-3
          flex
          items-center
          justify-between
        "
      >
        <div>
          <h1
            className="
              text-lg
              font-bold
              tracking-tight
            "
          >
            Heap Sort Visualizer
          </h1>

          <p
            className="
              text-[9px]
              text-slate-500
            "
          >
            Build → Heapify → Extract Maximum
          </p>
        </div>

        <div
          className="
            rounded-lg
            border
            border-slate-800
            bg-slate-900
            px-3
            py-1.5
          "
        >
          <span
            className="
              text-[9px]
              text-slate-600
            "
          >
            STEP{" "}
          </span>

          <span
            className="
              font-mono
              text-[10px]
              font-bold
              text-cyan-400
            "
          >
            {steps.length
              ? currentStep + 1
              : 0}
          </span>

          <span className="text-slate-700">
            {" "} / {" "}
          </span>

          <span
            className="
              font-mono
              text-[10px]
              text-slate-500
            "
          >
            {steps.length}
          </span>
        </div>
      </div>

      {/* =====================================================
          ONE SCREEN
      ====================================================== */}

      <div
        className="
          grid
          gap-3
          xl:grid-cols-[540px_1fr]
        "
      >

        {/* ===================================================
            LEFT
        ==================================================== */}

        <div className="space-y-3">

          {/* CODE PANEL */}

          <div
            className="
              overflow-hidden
              rounded-2xl
              border
              border-slate-800
              bg-[#0b1226]
            "
          >
            <div
              className="
                flex
                items-center
                justify-between
                border-b
                border-slate-800
                px-3
                py-2
              "
            >
              <div>
                <p
                  className="
                    text-[10px]
                    font-bold
                    text-slate-300
                  "
                >
                  Heap Sort Code
                </p>

                <p
                  className="
                    text-[7px]
                    text-slate-600
                  "
                >
                  Active execution line
                </p>
              </div>

              <select
                value={language}
                onChange={(e) =>
                  setLanguage(
                    e.target.value as Language
                  )
                }
                className="
                  rounded-lg
                  border
                  border-slate-700
                  bg-slate-900
                  px-2
                  py-1
                  text-[9px]
                  text-cyan-400
                  outline-none
                "
              >
                {(
                  Object.keys(
                    CODE
                  ) as Language[]
                ).map((item) => (
                  <option
                    key={item}
                    value={item}
                    className="bg-slate-900"
                  >
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div
              className="
                h-[350px]
                overflow-y-auto
                p-2
              "
            >
              {CODE[language].map(
                (codeLine, index) => {
                  const lineNumber =
                    index + 1;

                  const active =
                    lineNumber === line;

                  return (
                    <div
                      key={lineNumber}
                      className={`
                        flex
                        min-h-[25px]
                        items-center
                        rounded-md
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
                          text-right
                          font-mono
                          text-[8px]
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
                          ml-3
                          whitespace-pre
                          font-mono
                          text-[9px]
                          ${
                            active
                              ? "font-bold text-cyan-300"
                              : "text-slate-500"
                          }
                        `}
                      >
                        {codeLine || " "}
                      </span>
                    </div>
                  );
                }
              )}
            </div>
          </div>

          {/* =================================================
              SMALL LIVE VARIABLES
          ================================================== */}

          <div
            className="
              rounded-2xl
              border
              border-slate-800
              bg-[#0b1226]
              p-2.5
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
                <p
                  className="
                    text-[10px]
                    font-bold
                    text-white
                  "
                >
                  Live Variables
                </p>

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
                LIVE
              </span>
            </div>

            <div
              className="
                grid
                grid-cols-4
                gap-2
              "
            >
              <MiniVariable
                label="I"
                value={liveI}
              />

              <MiniVariable
                label="J"
                value={liveJ}
              />

              <MiniVariable
                label="COMPARING"
                value={
                  comparing.length
                    ? comparing.join(", ")
                    : "-"
                }
              />

              <MiniVariable
                label="SWAPPING"
                value={
                  swapping.length
                    ? swapping.join(", ")
                    : "-"
                }
              />
            </div>
          </div>

          {/* =================================================
              WHAT'S HAPPENING
          ================================================== */}

          <div
            className="
              rounded-2xl
              border
              border-indigo-500/20
              bg-[#0b1028]
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
              <CircleHelp
                size={15}
                className="text-yellow-400"
              />

              <div>
                <p
                  className="
                    text-[10px]
                    font-bold
                    text-white
                  "
                >
                  What's Happening?
                </p>

                <p
                  className="
                    text-[7px]
                    text-slate-600
                  "
                >
                  Current heap operation
                </p>
              </div>
            </div>

            <p
              className="
                mt-2
                text-[9px]
                leading-5
                text-slate-400
              "
            >
              {explanation}
            </p>
          </div>
        </div>

        {/* ===================================================
            RIGHT
        ==================================================== */}

        <div
          className="
            overflow-hidden
            rounded-2xl
            border
            border-slate-800
            bg-[#0b1226]
          "
        >

          {/* HEAP HEADER */}

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
                  text-slate-300
                "
              >
                Heap Visualization
              </p>

              <p
                className="
                  mt-1
                  font-mono
                  text-[8px]
                  text-slate-600
                "
              >
                phase ={" "}
                <span className="text-cyan-400">
                  {phase}
                </span>
              </p>
            </div>

            <p
              className="
                font-mono
                text-[9px]
                text-slate-500
              "
            >
              heap size ={" "}
              <span className="text-cyan-400">
                {heapSize}
              </span>
            </p>
          </div>

          {/* =================================================
              ATTRACTIVE PROGRESSIVE HEAP TREE
          ================================================== */}

          <div
            className="
              relative
              flex
              h-[285px]
              items-center
              justify-center
              overflow-hidden
              bg-[#090d1b]
              px-4
            "
          >

            {/* Background glow */}

            <div
              className="
                pointer-events-none
                absolute
                left-1/2
                top-1/2
                h-44
                w-44
                -translate-x-1/2
                -translate-y-1/2
                rounded-full
                bg-cyan-500/5
                blur-3xl
              "
            />

            {!showTree ? (
              <div
                className="
                  relative
                  flex
                  flex-col
                  items-center
                  justify-center
                  text-center
                "
              >
                <div
                  className="
                    flex
                    h-14
                    w-14
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-dashed
                    border-slate-700
                    bg-slate-900/70
                    text-slate-600
                  "
                >
                  <span
                    className="
                      font-mono
                      text-lg
                    "
                  >
                    ∅
                  </span>
                </div>

                <p
                  className="
                    mt-3
                    text-[10px]
                    font-semibold
                    text-slate-500
                  "
                >
                  Heap not created yet
                </p>

                <p
                  className="
                    mt-1
                    text-[8px]
                    text-slate-700
                  "
                >
                  Click Next to build the tree
                </p>
              </div>
            ) : (
              <ProgressiveHeapTree
                array={array}
                heapSize={heapSize}
                comparing={comparing}
                swapping={swapping}
                sorted={sorted}
              />
            )}
          </div>

          {/* =================================================
              SORTED HEAP ARRAY
          ================================================== */}

          <div
            className="
              border-t
              border-slate-800
              px-4
              py-4
            "
          >
            <div className="mb-3 text-center">
              <p
                className="
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-widest
                  text-slate-300
                "
              >
                Sorted Heap Array
              </p>

              <p
                className="
                  mt-1
                  text-[7px]
                  text-slate-600
                "
              >
                Reflects the exact current visualization state
              </p>
            </div>

            <div
              className="
                flex
                items-center
                justify-center
                gap-2
              "
            >
              {sortedHeapArray.map(
                (item) => (
                  <div
                    key={`${item.index}-${item.value}`}
                    className={`
                      flex
                      h-12
                      min-w-[48px]
                      flex-col
                      items-center
                      justify-center
                      rounded-xl
                      border
                      transition-all
                      duration-300
                      ${
                        item.isSwapping
                          ? "scale-110 border-red-400 bg-red-500/20 text-red-300"
                          : item.isComparing
                          ? "scale-105 border-cyan-400 bg-cyan-500/20 text-cyan-300"
                          : item.isSorted
                          ? "border-green-400 bg-green-500/10 text-green-300"
                          : "border-slate-700 bg-slate-900 text-white"
                      }
                    `}
                  >
                    <span
                      className="
                        font-mono
                        text-xs
                        font-bold
                      "
                    >
                      {item.value}
                    </span>

                    <span
                      className="
                        mt-0.5
                        font-mono
                        text-[7px]
                        text-slate-600
                      "
                    >
                      {item.index}
                    </span>
                  </div>
                )
              )}
            </div>
          </div>

          {/* =================================================
              CONTROLS
          ================================================== */}

          <div
            className="
              flex
              items-center
              justify-center
              gap-2
              border-t
              border-slate-800
              px-4
              py-4
            "
          >
            <button
              type="button"
              onClick={handlePrevious}
              disabled={firstStep}
              className="
                flex
                items-center
                gap-1
                rounded-xl
                border
                border-slate-700
                bg-slate-900
                px-4
                py-2.5
                text-[9px]
                font-bold
                text-slate-400
                transition
                hover:border-cyan-500/40
                disabled:cursor-not-allowed
                disabled:opacity-30
              "
            >
              <ChevronLeft size={14} />
              Previous
            </button>

            <button
              type="button"
              onClick={handleNext}
              disabled={lastStep}
              className="
                flex
                items-center
                gap-1
                rounded-xl
                bg-gradient-to-r
                from-cyan-500
                to-indigo-600
                px-5
                py-2.5
                text-[9px]
                font-bold
                text-white
                transition
                hover:scale-[1.02]
                disabled:cursor-not-allowed
                disabled:opacity-30
              "
            >
              Next
              <ChevronRight size={14} />
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="
                flex
                items-center
                gap-1
                rounded-xl
                border
                border-slate-700
                bg-slate-900
                px-4
                py-2.5
                text-[9px]
                font-bold
                text-slate-400
                transition
                hover:border-cyan-500/40
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
                bg-slate-900
                px-3
                py-2.5
              "
            >
              <Gauge
                size={13}
                className="text-purple-400"
              />

              <select
                value={speed}
                onChange={(e) =>
                  setSpeed(e.target.value)
                }
                className="
                  bg-transparent
                  text-[9px]
                  font-bold
                  text-slate-300
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
          COMPLEXITY
      ====================================================== */}

      <div
        className="
          mt-3
          grid
          grid-cols-3
          gap-2
          rounded-2xl
          border
          border-slate-800
          bg-[#0b1226]
          p-3
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
          value="O(n log n)"
        />
      </div>

      {lastStep &&
        steps.length > 0 && (
          <div
            className="
              mt-3
              flex
              items-center
              justify-center
              gap-2
              rounded-xl
              border
              border-green-500/20
              bg-green-500/10
              py-2
              text-[10px]
              font-bold
              text-green-400
            "
          >
            <CheckCircle2 size={14} />
            Heap Sort Completed
          </div>
        )}
    </div>
  );
}

/* ============================================================
   PROGRESSIVE HEAP TREE
============================================================ */

function ProgressiveHeapTree({
  array,
  heapSize,
  comparing,
  swapping,
  sorted,
}: {
  array: number[];
  heapSize: number;
  comparing: number[];
  swapping: number[];
  sorted: number[];
}) {
  const size = Math.min(
    heapSize,
    array.length
  );

  if (size <= 0) {
    return (
      <div
        className="
          flex
          flex-col
          items-center
          justify-center
        "
      >
        <div
          className="
            h-10
            w-10
            rounded-full
            border
            border-dashed
            border-slate-700
          "
        />

        <p
          className="
            mt-2
            text-[8px]
            text-slate-600
          "
        >
          Empty Heap
        </p>
      </div>
    );
  }

  /*
   * Fixed positions preserve your original
   * tree layout while giving it a more attractive
   * futuristic appearance.
   */

  const positions: Record<
    number,
    {
      left: string;
      top: string;
    }
  > = {
    0: {
      left: "50%",
      top: "25px",
    },

    1: {
      left: "28%",
      top: "95px",
    },

    2: {
      left: "72%",
      top: "95px",
    },

    3: {
      left: "14%",
      top: "165px",
    },

    4: {
      left: "38%",
      top: "165px",
    },

    5: {
      left: "62%",
      top: "165px",
    },

    6: {
      left: "86%",
      top: "165px",
    },
  };

  return (
    <div
      className="
        relative
        h-[220px]
        w-full
        max-w-[600px]
      "
    >

      {/* ==============================
          CONNECTION LINES
      =============================== */}

      <svg
        className="
          pointer-events-none
          absolute
          inset-0
          h-full
          w-full
        "
        viewBox="0 0 600 220"
        preserveAspectRatio="none"
      >
        {size > 1 && (
          <AnimatedTreeLine
            x1={300}
            y1={48}
            x2={168}
            y2={110}
            active={
              comparing.includes(0) ||
              comparing.includes(1) ||
              swapping.includes(0) ||
              swapping.includes(1)
            }
          />
        )}

        {size > 2 && (
          <AnimatedTreeLine
            x1={300}
            y1={48}
            x2={432}
            y2={110}
            active={
              comparing.includes(0) ||
              comparing.includes(2) ||
              swapping.includes(0) ||
              swapping.includes(2)
            }
          />
        )}

        {size > 3 && (
          <AnimatedTreeLine
            x1={168}
            y1={120}
            x2={84}
            y2={180}
            active={
              comparing.includes(1) ||
              comparing.includes(3) ||
              swapping.includes(1) ||
              swapping.includes(3)
            }
          />
        )}

        {size > 4 && (
          <AnimatedTreeLine
            x1={168}
            y1={120}
            x2={228}
            y2={180}
            active={
              comparing.includes(1) ||
              comparing.includes(4) ||
              swapping.includes(1) ||
              swapping.includes(4)
            }
          />
        )}

        {size > 5 && (
          <AnimatedTreeLine
            x1={432}
            y1={120}
            x2={372}
            y2={180}
            active={
              comparing.includes(2) ||
              comparing.includes(5) ||
              swapping.includes(2) ||
              swapping.includes(5)
            }
          />
        )}

        {size > 6 && (
          <AnimatedTreeLine
            x1={432}
            y1={120}
            x2={516}
            y2={180}
            active={
              comparing.includes(2) ||
              comparing.includes(6) ||
              swapping.includes(2) ||
              swapping.includes(6)
            }
          />
        )}
      </svg>

      {/* ==============================
          NODES
      =============================== */}

      {Array.from({
        length: size,
      }).map((_, index) => {
        const position =
          positions[index];

        if (!position) {
          return null;
        }

        const isComparing =
          comparing.includes(index);

        const isSwapping =
          swapping.includes(index);

        const isSorted =
          sorted.includes(index);

        return (
          <div
            key={`${index}-${array[index]}`}
            className="
              absolute
              -translate-x-1/2
              transition-all
              duration-500
            "
            style={{
              left: position.left,
              top: position.top,
            }}
          >

            {/* NODE GLOW */}

            <div
              className={`
                absolute
                -inset-2
                rounded-full
                blur-md
                transition-all
                duration-500
                ${
                  isSwapping
                    ? "bg-red-500/30"
                    : isComparing
                    ? "bg-cyan-400/30"
                    : isSorted
                    ? "bg-green-400/20"
                    : "bg-indigo-500/10"
                }
              `}
            />

            {/* NODE */}

            <div
              className={`
                relative
                flex
                h-[42px]
                w-[42px]
                items-center
                justify-center
                rounded-full
                border
                font-mono
                text-[10px]
                font-bold
                transition-all
                duration-500
                ${
                  isSwapping
                    ? `
                      scale-125
                      border-red-400
                      bg-gradient-to-br
                      from-red-500/30
                      to-orange-500/10
                      text-red-200
                      shadow-[0_0_25px_rgba(248,113,113,0.55)]
                    `
                    : isComparing
                    ? `
                      scale-125
                      border-cyan-300
                      bg-gradient-to-br
                      from-cyan-400/30
                      to-blue-500/10
                      text-cyan-100
                      shadow-[0_0_25px_rgba(34,211,238,0.55)]
                    `
                    : isSorted
                    ? `
                      scale-105
                      border-green-400
                      bg-gradient-to-br
                      from-green-500/25
                      to-emerald-500/10
                      text-green-200
                      shadow-[0_0_18px_rgba(74,222,128,0.35)]
                    `
                    : `
                      border-indigo-400/50
                      bg-gradient-to-br
                      from-indigo-500/20
                      via-slate-900
                      to-cyan-500/10
                      text-white
                      shadow-[0_0_14px_rgba(99,102,241,0.18)]
                    `
                }
              `}
            >
              {array[index]}

              {/* TOP DOT */}

              <span
                className={`
                  absolute
                  -top-1
                  left-1/2
                  h-1
                  w-1
                  -translate-x-1/2
                  rounded-full
                  ${
                    isSwapping
                      ? "bg-red-300 shadow-[0_0_8px_rgba(248,113,113,0.8)]"
                      : isComparing
                      ? "bg-cyan-300 shadow-[0_0_8px_rgba(34,211,238,0.8)]"
                      : "bg-indigo-300"
                  }
                `}
              />
            </div>

            {/* INDEX */}

            <div
              className="
                mt-1
                text-center
                font-mono
                text-[6px]
                text-slate-600
              "
            >
              index {index}
            </div>
          </div>
        );
      })}

      {/* TREE LABEL */}

      <div
        className="
          absolute
          left-1
          top-0
          rounded-md
          border
          border-slate-800
          bg-slate-950/80
          px-2
          py-1
          font-mono
          text-[7px]
          text-slate-600
          backdrop-blur
        "
      >
        HEAP TREE
      </div>

      <div
        className="
          absolute
          right-1
          top-0
          rounded-md
          border
          border-cyan-500/10
          bg-cyan-500/5
          px-2
          py-1
          font-mono
          text-[7px]
          text-cyan-500/70
        "
      >
        {size} NODES
      </div>
    </div>
  );
}

/* ============================================================
   ANIMATED TREE LINE
============================================================ */

function AnimatedTreeLine({
  x1,
  y1,
  x2,
  y2,
  active,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  active: boolean;
}) {
  return (
    <>
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={
          active
            ? "rgba(34,211,238,0.75)"
            : "rgba(71,85,105,0.45)"
        }
        strokeWidth={active ? 2 : 1.5}
        strokeLinecap="round"
        className="
          transition-all
          duration-500
        "
      />

      {active && (
        <circle
          r="3"
          fill="#67e8f9"
          className="
            animate-pulse
          "
        >
          <animateMotion
            dur="0.9s"
            repeatCount="indefinite"
            path={`M ${x1} ${y1} L ${x2} ${y2}`}
          />
        </circle>
      )}
    </>
  );
}

/* ============================================================
   MINI VARIABLE
============================================================ */

function MiniVariable({
  label,
  value,
}: {
  label: string;
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
          text-[7px]
          font-bold
          uppercase
          tracking-wider
          text-slate-600
        "
      >
        {label}
      </p>

      <p
        className="
          mt-1
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
   COMPLEXITY
============================================================ */

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
        bg-slate-950
        px-3
        py-2
        text-center
      "
    >
      <p
        className="
          text-[7px]
          font-bold
          uppercase
          tracking-widest
          text-slate-600
        "
      >
        {title}
      </p>

      <p
        className="
          mt-1
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