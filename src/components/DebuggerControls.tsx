import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
} from "lucide-react";

interface DebuggerControlsProps {
  currentStep: number;
  totalSteps: number;

  onPrevious: () => void;
  onNext: () => void;
  onReset: () => void;

  isFirstStep: boolean;
  isLastStep: boolean;
}

export default function DebuggerControls({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  onReset,
  isFirstStep,
  isLastStep,
}: DebuggerControlsProps) {
  return (
    <div
      className="
        rounded-2xl
        border
        border-slate-800
        bg-slate-950
        p-4
        shadow-xl
      "
    >
      <div
        className="
          flex
          flex-col
          gap-4
          sm:flex-row
          sm:items-center
          sm:justify-between
        "
      >

        {/* =================================================
            PREVIOUS
        ================================================== */}

        <button
          onClick={onPrevious}
          disabled={isFirstStep}
          className="
            flex
            items-center
            justify-center
            gap-2
            rounded-xl
            border
            border-slate-700
            bg-slate-900
            px-5
            py-3
            text-sm
            font-semibold
            text-slate-200
            transition

            hover:border-cyan-500/40
            hover:bg-slate-800
            hover:text-cyan-400

            disabled:cursor-not-allowed
            disabled:opacity-30
          "
        >
          <ChevronLeft size={18} />

          Previous
        </button>


        {/* =================================================
            STEP COUNTER
        ================================================== */}

        <div
          className="
            flex
            flex-col
            items-center
            justify-center
          "
        >
          <span
            className="
              text-xs
              font-semibold
              uppercase
              tracking-widest
              text-slate-500
            "
          >
            Visualization Step
          </span>

          <span
            className="
              mt-1
              text-lg
              font-bold
              text-cyan-400
            "
          >
            {currentStep + 1}
            <span className="text-slate-600">
              {" "}
              / {totalSteps}
            </span>
          </span>
        </div>


        {/* =================================================
            NEXT
        ================================================== */}

        <button
          onClick={onNext}
          disabled={isLastStep}
          className="
            flex
            items-center
            justify-center
            gap-2
            rounded-xl
            border
            border-cyan-500/30
            bg-cyan-500/10
            px-5
            py-3
            text-sm
            font-semibold
            text-cyan-400
            transition

            hover:border-cyan-400/50
            hover:bg-cyan-500/20

            disabled:cursor-not-allowed
            disabled:opacity-30
          "
        >
          Next

          <ChevronRight size={18} />
        </button>


        {/* =================================================
            RESET
        ================================================== */}

        <button
          onClick={onReset}
          className="
            flex
            items-center
            justify-center
            gap-2
            rounded-xl
            border
            border-purple-500/30
            bg-purple-500/10
            px-5
            py-3
            text-sm
            font-semibold
            text-purple-400
            transition

            hover:border-purple-400/50
            hover:bg-purple-500/20
          "
        >
          <RotateCcw size={17} />

          Reset
        </button>

      </div>


      {/* =================================================
          PROGRESS BAR
      ================================================== */}

      <div className="mt-4">

        <div
          className="
            h-1.5
            overflow-hidden
            rounded-full
            bg-slate-900
          "
        >
          <div
            className="
              h-full
              rounded-full
              bg-cyan-400
              transition-all
              duration-200
            "
            style={{
              width: `${
                totalSteps > 0
                  ? ((currentStep + 1) /
                      totalSteps) *
                    100
                  : 0
              }%`,
            }}
          />
        </div>

      </div>

    </div>
  );
}