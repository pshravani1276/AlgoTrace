import { useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Gauge,
  CheckCircle2,
  ArrowDown,
  ArrowRight,
  Sparkles,
  CircleDot,
  MoveRight,
} from "lucide-react";

import {
  generateInsertionSortSteps,
  type InsertionSortStep,
} from "../algorithms/Sorting/InsertionSort";

const INITIAL_ARRAY = [12, 11, 13, 5, 6, 8, 3];

type Language =
  | "Java"
  | "C"
  | "Python"
  | "C++"
  | "JavaScript"
  | "TypeScript";

const CODE: Record<Language, string[]> = {
  Java: [
    "void insertionSort(int[] array) {",
    "  int n = array.length;",
    "",
    "  for (int i = 1; i < n; i++) {",
    "    int key = array[i];",
    "    int j = i - 1;",
    "",
    "    while (j >= 0 && array[j] > key) {",
    "      array[j + 1] = array[j];",
    "      j--;",
    "    }",
    "",
    "    array[j + 1] = key;",
    "  }",
    "}",
  ],

  C: [
    "void insertionSort(int array[], int n) {",
    "",
    "  for (int i = 1; i < n; i++) {",
    "    int key = array[i];",
    "    int j = i - 1;",
    "",
    "    while (j >= 0 && array[j] > key) {",
    "      array[j + 1] = array[j];",
    "      j--;",
    "    }",
    "",
    "    array[j + 1] = key;",
    "  }",
    "}",
  ],

  Python: [
    "def insertion_sort(array):",
    "    n = len(array)",
    "",
    "    for i in range(1, n):",
    "        key = array[i]",
    "        j = i - 1",
    "",
    "        while j >= 0 and array[j] > key:",
    "            array[j + 1] = array[j]",
    "            j -= 1",
    "",
    "        array[j + 1] = key",
    "",
    "    return array",
  ],

  "C++": [
    "void insertionSort(vector<int>& array) {",
    "  int n = array.size();",
    "",
    "  for (int i = 1; i < n; i++) {",
    "    int key = array[i];",
    "    int j = i - 1;",
    "",
    "    while (j >= 0 && array[j] > key) {",
    "      array[j + 1] = array[j];",
    "      j--;",
    "    }",
    "",
    "    array[j + 1] = key;",
    "  }",
    "}",
  ],

  JavaScript: [
    "function insertionSort(array) {",
    "  const n = array.length;",
    "",
    "  for (let i = 1; i < n; i++) {",
    "    const key = array[i];",
    "    let j = i - 1;",
    "",
    "    while (j >= 0 && array[j] > key) {",
    "      array[j + 1] = array[j];",
    "      j--;",
    "    }",
    "",
    "    array[j + 1] = key;",
    "  }",
    "}",
  ],

  TypeScript: [
    "function insertionSort(array: number[]) {",
    "  const n = array.length;",
    "",
    "  for (let i = 1; i < n; i++) {",
    "    const key = array[i];",
    "    let j = i - 1;",
    "",
    "    while (j >= 0 && array[j] > key) {",
    "      array[j + 1] = array[j];",
    "      j--;",
    "    }",
    "",
    "    array[j + 1] = key;",
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

export default function InsertionSortVisualizer() {
  const steps = useMemo(() => {
    return generateInsertionSortSteps(
      INITIAL_ARRAY
    ) as InsertionSortStep[];
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
    step?.i ?? 0;

  /*
   * IMPORTANT:
   * If the algorithm gives j = -1,
   * display 0 instead.
   *
   * This fixes the actual -1 value coming
   * from InsertionSort.ts, not just the fallback.
   */
  const currentJ =
    step?.j === undefined ||
    step?.j === null ||
    step.j < 0
      ? 0
      : step.j;

  const currentKey =
    step?.key ?? -1;

  const comparing =
    step?.comparing ?? [];

  const shifting =
    step?.shifting ?? [];

  const inserted =
    step?.inserted ?? [];

  const sorted =
    step?.sorted ?? [];

  const explanation =
    step?.explanation ??
    "Insertion Sort begins by treating the first element as sorted.";

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

  /*
   * Determine the current insertion position.
   * j is normalized above so it will never be -1.
   */
  const insertionPosition =
    currentJ >= 0
      ? Math.max(
          0,
          Math.min(
            currentJ + 1,
            currentArray.length - 1
          )
        )
      : currentI >= 0
      ? currentI
      : 0;

  return (
    <main
      className="
        relative
        min-h-screen
        overflow-hidden
        bg-[#020617]
        px-3
        py-3
        text-white
        sm:px-5
        lg:px-6
      "
    >
      {/* =====================================================
          FUTURISTIC BACKGROUND
      ====================================================== */}

      <style>{`
        @keyframes neuralGrid {
          0% {
            transform: translate3d(0,0,0);
          }
          100% {
            transform: translate3d(40px,40px,0);
          }
        }

        @keyframes dataPulse {
          0%,100% {
            opacity:.15;
            transform:scaleX(.75);
          }
          50% {
            opacity:.8;
            transform:scaleX(1);
          }
        }

        @keyframes capsuleFloat {
          0%,100% {
            transform:translateY(0) rotate(-1deg);
          }
          50% {
            transform:translateY(-7px) rotate(1deg);
          }
        }

        @keyframes portalSpin {
          from {
            transform:rotate(0deg);
          }
          to {
            transform:rotate(360deg);
          }
        }

        @keyframes portalSpinReverse {
          from {
            transform:rotate(360deg);
          }
          to {
            transform:rotate(0deg);
          }
        }

        @keyframes scanLine {
          0% {
            transform:translateX(-140%);
            opacity:0;
          }
          25% {
            opacity:1;
          }
          75% {
            opacity:1;
          }
          100% {
            transform:translateX(140%);
            opacity:0;
          }
        }

        @keyframes energyFlow {
          0% {
            transform:translateX(-100%);
            opacity:0;
          }
          20% {
            opacity:1;
          }
          80% {
            opacity:1;
          }
          100% {
            transform:translateX(100%);
            opacity:0;
          }
        }

        @keyframes shiftGlow {
          0% {
            box-shadow:
              0 0 0 rgba(249,115,22,0);
          }
          50% {
            box-shadow:
              0 0 25px rgba(249,115,22,.35);
          }
          100% {
            box-shadow:
              0 0 0 rgba(249,115,22,0);
          }
        }

        @keyframes insertFlash {
          0% {
            opacity:0;
            transform:scale(.6);
          }
          45% {
            opacity:1;
            transform:scale(1);
          }
          100% {
            opacity:0;
            transform:scale(1.3);
          }
        }

        @keyframes orbit {
          from {
            transform:rotate(0deg) translateX(24px) rotate(0deg);
          }
          to {
            transform:rotate(360deg) translateX(24px) rotate(-360deg);
          }
        }

        @keyframes tinyParticle {
          0% {
            transform:translateY(0);
            opacity:.1;
          }
          50% {
            opacity:.7;
          }
          100% {
            transform:translateY(-18px);
            opacity:0;
          }
        }

        .neural-grid {
          background-image:
            linear-gradient(
              rgba(139,92,246,.045) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(139,92,246,.045) 1px,
              transparent 1px
            );
          background-size:40px 40px;
          animation:neuralGrid 12s linear infinite;
        }

        .data-pulse {
          animation:dataPulse 1.8s ease-in-out infinite;
        }

        .capsule-float {
          animation:capsuleFloat 2.4s ease-in-out infinite;
        }

        .portal-spin {
          animation:portalSpin 5s linear infinite;
        }

        .portal-spin-reverse {
          animation:portalSpinReverse 3.5s linear infinite;
        }

        .scan-line {
          animation:scanLine 1.4s ease-in-out infinite;
        }

        .energy-flow {
          animation:energyFlow 1.2s ease-in-out infinite;
        }

        .shift-glow {
          animation:shiftGlow 1s ease-in-out infinite;
        }

        .insert-flash {
          animation:insertFlash 1s ease-out infinite;
        }

        .orbit-dot {
          animation:orbit 2.5s linear infinite;
        }

        .tiny-particle {
          animation:tinyParticle 2s ease-out infinite;
        }
      `}</style>

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="neural-grid absolute inset-[-80px]" />

        <div className="absolute left-[15%] top-[18%] h-40 w-40 rounded-full bg-purple-600/[0.035] blur-3xl" />

        <div className="absolute right-[12%] top-[42%] h-52 w-52 rounded-full bg-cyan-500/[0.025] blur-3xl" />

        <span className="tiny-particle absolute left-[18%] top-[55%] h-1 w-1 rounded-full bg-purple-400" />

        <span className="tiny-particle absolute left-[42%] top-[70%] h-1 w-1 rounded-full bg-cyan-400 [animation-delay:.6s]" />

        <span className="tiny-particle absolute right-[25%] top-[30%] h-1 w-1 rounded-full bg-indigo-400 [animation-delay:1s]" />
      </div>

      <div className="relative">

        {/* =====================================================
            HEADER
        ====================================================== */}

        <div
          className="
            mb-3
            flex
            flex-wrap
            items-center
            justify-between
            gap-3
          "
        >
          <div className="flex items-center gap-2">

            <div
              className="
                relative
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-xl
                border
                border-purple-400/20
                bg-purple-500/10
                text-purple-400
                shadow-lg
                shadow-purple-500/10
              "
            >
              <Sparkles size={17} />

              <span
                className="
                  absolute
                  inset-[-4px]
                  rounded-xl
                  border
                  border-purple-400/10
                  data-pulse
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
                Insertion Sort Visualizer
              </h1>

              <p className="text-[10px] text-slate-500">
                Pick • Scan • Shift • Insert
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
              border-slate-800
              bg-slate-900/90
              px-3
              py-2
              shadow-lg
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
              {Math.max(
                steps.length,
                1
              )}
            </span>
          </div>
        </div>

        {/* =====================================================
            MAIN
        ====================================================== */}

        <div
          className="
            grid
            gap-3
            xl:grid-cols-[0.95fr_1.05fr]
          "
        >

          {/* ===================================================
              SOURCE CODE
          ==================================================== */}

          <section
            className="
              overflow-hidden
              rounded-2xl
              border
              border-slate-800
              bg-slate-950/95
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
                  setLanguage(
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
                  text-purple-400
                  outline-none
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
                max-h-[400px]
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
                        min-h-[25px]
                        items-center
                        rounded-lg
                        px-2
                        transition-all
                        duration-300
                        ${
                          active
                            ? "bg-purple-500/10 shadow-[inset_2px_0_0_rgba(168,85,247,.8)]"
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
                }
              )}
            </div>
          </section>

          {/* ===================================================
              NEURAL INSERTION RAIL
          ==================================================== */}

          <section
            className="
              relative
              overflow-hidden
              rounded-2xl
              border
              border-purple-500/20
              bg-slate-950/95
              shadow-xl
            "
          >

            <div
              className="
                pointer-events-none
                absolute
                left-1/2
                top-1/2
                h-56
                w-56
                -translate-x-1/2
                -translate-y-1/2
                rounded-full
                bg-purple-600/[0.045]
                blur-3xl
              "
            />

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
                  Neural Insertion Rail
                </p>

                <p
                  className="
                    mt-1
                    text-[9px]
                    text-slate-600
                  "
                >
                  Key searches for its stable memory position
                </p>
              </div>

              <span
                className="
                  rounded-lg
                  border
                  border-purple-400/10
                  bg-purple-500/[0.06]
                  px-2
                  py-1
                  text-[9px]
                  text-purple-300
                "
              >
                {currentArray.length} nodes
              </span>
            </div>

            {/* ===============================================
                VISUALIZATION
            ================================================ */}

            <div
              className="
                relative
                flex
                min-h-[330px]
                items-center
                justify-center
                overflow-x-auto
                px-5
                py-8
              "
            >

              <div className="min-w-max">

                {/* ===========================================
                    KEY DATA CAPSULE
                ============================================ */}

                {currentKey !== -1 && (
                  <div
                    className="
                      capsule-float
                      mb-7
                      flex
                      justify-center
                    "
                  >
                    <div
                      className="
                        relative
                        flex
                        items-center
                        gap-3
                        rounded-2xl
                        border
                        border-yellow-400/30
                        bg-yellow-500/[0.07]
                        px-4
                        py-2
                        shadow-lg
                        shadow-yellow-500/10
                      "
                    >

                      <div
                        className="
                          relative
                          flex
                          h-7
                          w-7
                          items-center
                          justify-center
                          rounded-full
                          border
                          border-yellow-400/40
                          bg-yellow-400/10
                          text-yellow-300
                        "
                      >
                        <CircleDot size={14} />

                        <span
                          className="
                            absolute
                            inset-[-5px]
                            rounded-full
                            border
                            border-yellow-400/10
                            portal-spin
                          "
                        />
                      </div>

                      <div>
                        <p
                          className="
                            text-[7px]
                            font-bold
                            uppercase
                            tracking-[0.25em]
                            text-yellow-500/60
                          "
                        >
                          Active Data
                        </p>

                        <p
                          className="
                            font-mono
                            text-xs
                            font-bold
                            text-yellow-300
                          "
                        >
                          KEY = {currentKey}
                        </p>
                      </div>

                      <ArrowDown
                        size={13}
                        className="
                          text-yellow-400
                          animate-bounce
                        "
                      />

                      <span
                        className="
                          absolute
                          inset-0
                          overflow-hidden
                          rounded-2xl
                        "
                      >
                        <span
                          className="
                            scan-line
                            absolute
                            left-0
                            top-0
                            h-full
                            w-1/3
                            bg-gradient-to-r
                            from-transparent
                            via-yellow-300/10
                            to-transparent
                          "
                        />
                      </span>
                    </div>
                  </div>
                )}

                {/* ===========================================
                    INSERTION PORTAL LABEL
                ============================================ */}

                {insertionPosition >= 0 &&
                  currentKey !== -1 && (
                    <div
                      className="
                        mb-3
                        flex
                        items-center
                        justify-center
                        gap-2
                      "
                    >
                      <div
                        className="
                          h-px
                          w-8
                          bg-gradient-to-r
                          from-transparent
                          to-purple-400/50
                        "
                      />

                      <span
                        className="
                          rounded-full
                          border
                          border-purple-400/20
                          bg-purple-500/[0.05]
                          px-3
                          py-1
                          text-[7px]
                          font-bold
                          uppercase
                          tracking-[0.2em]
                          text-purple-400
                        "
                      >
                        Insertion Corridor
                      </span>

                      <div
                        className="
                          h-px
                          w-8
                          bg-gradient-to-l
                          from-transparent
                          to-purple-400/50
                        "
                      />
                    </div>
                  )}

                {/* ===========================================
                    ARRAY RAIL
                ============================================ */}

                <div
                  className="
                    relative
                    rounded-3xl
                    border
                    border-slate-800
                    bg-slate-900/40
                    px-5
                    py-8
                  "
                >

                  <div
                    className="
                      pointer-events-none
                      absolute
                      left-5
                      right-5
                      top-1/2
                      h-px
                      -translate-y-1/2
                      overflow-hidden
                      rounded-full
                      bg-slate-800
                    "
                  >
                    <div
                      className="
                        energy-flow
                        h-full
                        w-1/3
                        bg-gradient-to-r
                        from-transparent
                        via-purple-400/70
                        to-transparent
                      "
                    />
                  </div>

                  <div
                    className="
                      relative
                      flex
                      items-center
                      justify-center
                      gap-3
                      sm:gap-4
                    "
                  >

                    {currentArray.map(
                      (value, index) => {

                        const isComparing =
                          comparing.includes(index);

                        const isShifting =
                          shifting.includes(index);

                        const isInserted =
                          inserted.includes(index);

                        const isSorted =
                          sorted.includes(index);

                        const isKey =
                          index === currentI &&
                          currentKey !== -1;

                        const isInsertionSlot =
                          insertionPosition === index &&
                          currentKey !== -1;

                        let boxClass =
                          "border-slate-700 bg-slate-800 text-white";

                        let movementClass =
                          "";

                        if (isShifting) {
                          boxClass = `
                            border-orange-400/80
                            bg-orange-500/10
                            text-orange-300
                          `;

                          movementClass = `
                            -translate-y-5
                            scale-105
                            shift-glow
                          `;
                        } else if (isComparing) {
                          boxClass = `
                            border-cyan-400/80
                            bg-cyan-500/10
                            text-cyan-300
                          `;

                          movementClass = `
                            translate-y-[-3px]
                            scale-105
                          `;
                        } else if (isInserted) {
                          boxClass = `
                            border-purple-400
                            bg-purple-500/15
                            text-purple-300
                          `;

                          movementClass = `
                            scale-110
                            -translate-y-2
                          `;
                        } else if (isKey) {
                          boxClass = `
                            border-yellow-400
                            bg-yellow-500/15
                            text-yellow-300
                          `;

                          movementClass = `
                            scale-110
                            -translate-y-3
                          `;
                        } else if (isSorted) {
                          boxClass = `
                            border-green-400/60
                            bg-green-500/[0.08]
                            text-green-300
                          `;
                        }

                        return (
                          <div
                            key={`${index}-${value}-${currentStep}`}
                            className="
                              relative
                              flex
                              flex-col
                              items-center
                            "
                          >

                            {isInsertionSlot &&
                              !isSorted && (
                                <div
                                  className="
                                    pointer-events-none
                                    absolute
                                    -top-7
                                    left-1/2
                                    z-10
                                    -translate-x-1/2
                                  "
                                >
                                  <div
                                    className="
                                      relative
                                      h-5
                                      w-5
                                      rounded-full
                                      border
                                      border-purple-400/60
                                      bg-purple-500/10
                                      portal-spin
                                    "
                                  >
                                    <div
                                      className="
                                        absolute
                                        inset-[4px]
                                        rounded-full
                                        bg-purple-400/60
                                        blur-[2px]
                                      "
                                    />
                                  </div>
                                </div>
                              )}

                            {isComparing && (
                              <div
                                className="
                                  pointer-events-none
                                  absolute
                                  -top-2
                                  left-1/2
                                  h-16
                                  w-px
                                  -translate-x-1/2
                                  overflow-hidden
                                  bg-cyan-400/10
                                "
                              >
                                <div
                                  className="
                                    scan-line
                                    h-1/2
                                    w-full
                                    bg-cyan-400
                                    blur-[1px]
                                  "
                                />
                              </div>
                            )}

                            {isShifting && (
                              <div
                                className="
                                  pointer-events-none
                                  absolute
                                  left-1/2
                                  top-1/2
                                  h-1
                                  w-20
                                  -translate-x-1/2
                                  bg-gradient-to-r
                                  from-transparent
                                  via-orange-400/60
                                  to-transparent
                                  blur-sm
                                "
                              />
                            )}

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
                                shadow-xl
                                transition-all
                                duration-500
                                ease-out
                                sm:h-16
                                sm:w-16
                                ${boxClass}
                                ${movementClass}
                              `}
                            >

                              {isKey && (
                                <>
                                  <div
                                    className="
                                      absolute
                                      inset-[-6px]
                                      rounded-2xl
                                      border
                                      border-yellow-400/20
                                      portal-spin
                                    "
                                  />

                                  <div
                                    className="
                                      absolute
                                      inset-[-11px]
                                      rounded-3xl
                                      border
                                      border-dashed
                                      border-yellow-400/10
                                      portal-spin-reverse
                                    "
                                  />

                                  <span
                                    className="
                                      orbit-dot
                                      absolute
                                      left-1/2
                                      top-1/2
                                      h-1.5
                                      w-1.5
                                      rounded-full
                                      bg-yellow-300
                                    "
                                  />
                                </>
                              )}

                              {isComparing && (
                                <div
                                  className="
                                    absolute
                                    inset-[-5px]
                                    rounded-2xl
                                    border
                                    border-cyan-400/30
                                    animate-pulse
                                  "
                                />
                              )}

                              {isShifting && (
                                <div
                                  className="
                                    absolute
                                    inset-[-6px]
                                    rounded-2xl
                                    border
                                    border-orange-400/20
                                    animate-ping
                                  "
                                />
                              )}

                              {isInserted && (
                                <div
                                  className="
                                    insert-flash
                                    pointer-events-none
                                    absolute
                                    inset-[-8px]
                                    rounded-3xl
                                    border
                                    border-purple-400/40
                                  "
                                />
                              )}

                              {value}
                            </div>

                            <span
                              className={`
                                mt-2
                                font-mono
                                text-[8px]
                                ${
                                  isKey
                                    ? "text-yellow-400"
                                    : isInserted
                                    ? "text-purple-400"
                                    : isShifting
                                    ? "text-orange-400"
                                    : isComparing
                                    ? "text-cyan-400"
                                    : isSorted
                                    ? "text-green-400"
                                    : "text-slate-600"
                                }
                              `}
                            >
                              [{index}]
                            </span>

                            {(isKey ||
                              isShifting ||
                              isComparing ||
                              isInserted) && (
                              <span
                                className="
                                  absolute
                                  -bottom-8
                                  whitespace-nowrap
                                  rounded-md
                                  border
                                  border-slate-800
                                  bg-slate-950
                                  px-1.5
                                  py-0.5
                                  text-[6px]
                                  font-bold
                                  uppercase
                                  tracking-widest
                                "
                              >
                                {isKey
                                  ? "KEY"
                                  : isShifting
                                  ? "SHIFT"
                                  : isComparing
                                  ? "SCAN"
                                  : "LOCK"}
                              </span>
                            )}
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>

                {/* ===========================================
                    PROCESS INDICATOR
                ============================================ */}

                <div
                  className="
                    mt-8
                    flex
                    items-center
                    justify-center
                    gap-2
                  "
                >
                  <div
                    className="
                      flex
                      items-center
                      gap-1.5
                      rounded-full
                      border
                      border-cyan-400/10
                      bg-cyan-400/[0.03]
                      px-3
                      py-1
                    "
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />

                    <span
                      className="
                        text-[7px]
                        font-bold
                        uppercase
                        tracking-widest
                        text-cyan-400/70
                      "
                    >
                      Scan
                    </span>
                  </div>

                  <MoveRight
                    size={11}
                    className="text-slate-700"
                  />

                  <div
                    className="
                      flex
                      items-center
                      gap-1.5
                      rounded-full
                      border
                      border-orange-400/10
                      bg-orange-400/[0.03]
                      px-3
                      py-1
                    "
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-orange-400 animate-pulse" />

                    <span
                      className="
                        text-[7px]
                        font-bold
                        uppercase
                        tracking-widest
                        text-orange-400/70
                      "
                    >
                      Shift
                    </span>
                  </div>

                  <MoveRight
                    size={11}
                    className="text-slate-700"
                  />

                  <div
                    className="
                      flex
                      items-center
                      gap-1.5
                      rounded-full
                      border
                      border-purple-400/10
                      bg-purple-400/[0.03]
                      px-3
                      py-1
                    "
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-purple-400 animate-pulse" />

                    <span
                      className="
                        text-[7px]
                        font-bold
                        uppercase
                        tracking-widest
                        text-purple-400/70
                      "
                    >
                      Insert
                    </span>
                  </div>
                </div>
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
                py-2.5
              "
            >
              <Legend
                label="Scanning"
                className="bg-cyan-400"
              />

              <Legend
                label="Shifting"
                className="bg-orange-400"
              />

              <Legend
                label="Key"
                className="bg-yellow-400"
              />

              <Legend
                label="Inserted"
                className="bg-purple-400"
              />

              <Legend
                label="Sorted"
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
                py-3
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
                  py-2
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
                  py-2
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
                  py-2
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
                  py-2
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
                    setSpeed(event.target.value)
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
            mt-3
            grid
            gap-2
            lg:grid-cols-[0.7fr_1.3fr]
          "
        >

          {/* LIVE VARIABLES */}

          <section
            className="
              min-w-0
              rounded-xl
              border
              border-slate-800
              bg-slate-900/80
              px-2.5
              py-2
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
              <div className="flex items-center gap-2">
                <h2
                  className="
                    text-[10px]
                    font-bold
                    text-white
                  "
                >
                  Live Variables
                </h2>

                <span
                  className="
                    rounded-md
                    bg-purple-500/10
                    px-1.5
                    py-0.5
                    text-[7px]
                    font-bold
                    uppercase
                    tracking-wider
                    text-purple-400
                  "
                >
                  Live
                </span>
              </div>
            </div>

            <div
              className="
                grid
                grid-cols-3
                gap-1.5
              "
            >
              <TinyVariable
                name="i"
                value={currentI}
              />

              <TinyVariable
                name="j"
                value={currentJ}
              />

              <TinyVariable
                name="Key"
                value={
                  currentKey === -1
                    ? "-"
                    : currentKey
                }
              />

              <TinyVariable
                name="Compare"
                value={
                  comparing.length > 0
                    ? comparing.join(",")
                    : "-"
                }
              />

              <TinyVariable
                name="Shift"
                value={
                  shifting.length > 0
                    ? shifting.join(",")
                    : "-"
                }
              />

              <TinyVariable
                name="Insert"
                value={
                  inserted.length > 0
                    ? inserted.join(",")
                    : "-"
                }
              />
            </div>
          </section>

          {/* WHAT'S HAPPENING */}

          <section
            className="
              min-w-0
              rounded-xl
              border
              border-indigo-500/20
              bg-indigo-500/[0.04]
              px-3
              py-2.5
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
                  shrink-0
                  items-center
                  justify-center
                  rounded-lg
                  bg-indigo-500/10
                  text-indigo-400
                "
              >
                <ArrowRight size={14} />
              </div>

              <div className="min-w-0">
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
                mt-2
                text-[10px]
                leading-4
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
            mt-3
            rounded-xl
            border
            border-purple-500/20
            bg-purple-500/[0.03]
            px-3
            py-2.5
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
                  text-purple-300
                "
              >
                Complexity Analysis
              </h2>

              <p
                className="
                  mt-0.5
                  text-[8px]
                  text-slate-600
                "
              >
                Insertion Sort performance
              </p>
            </div>

            <Gauge
              size={15}
              className="text-purple-400"
            />
          </div>

          <div
            className="
              mt-2
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
              rounded-lg
              border
              border-slate-800
              bg-slate-950
              px-3
              py-1.5
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
                mt-0.5
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

        {isLast &&
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
                px-4
                py-2
                text-xs
                font-semibold
                text-green-400
                shadow-lg
                shadow-green-500/5
              "
            >
              <CheckCircle2 size={16} />
              Insertion Sort Completed!
            </div>
          )}
      </div>
    </main>
  );
}

/* ============================================================
   TINY LIVE VARIABLE
============================================================ */

function TinyVariable({
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
      <div
        className="
          text-[7px]
          font-bold
          uppercase
          tracking-widest
          text-slate-600
        "
      >
        {name}
      </div>

      <div
        className="
          mt-0.5
          truncate
          font-mono
          text-[9px]
          font-bold
          leading-3
          text-purple-400
        "
      >
        {value}
      </div>
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
        rounded-lg
        border
        border-slate-800
        bg-slate-950
        px-3
        py-1.5
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
        {title}
      </p>

      <p
        className="
          mt-0.5
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