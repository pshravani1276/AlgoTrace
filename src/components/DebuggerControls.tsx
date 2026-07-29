type DebuggerControlsProps = {
  currentStep: number
  totalSteps: number
  onNext: () => void
  onPrevious: () => void
  onReset: () => void
}

function DebuggerControls({
  currentStep,
  totalSteps,
  onNext,
  onPrevious,
  onReset,
}: DebuggerControlsProps) {

  const isFirstStep = currentStep === 0
  const isLastStep = currentStep === totalSteps - 1

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 rounded-xl border border-slate-800 bg-slate-900 p-3">

      <button
        onClick={onPrevious}
        disabled={isFirstStep}
        className="rounded-lg bg-slate-800 px-4 py-2 text-sm hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
      >
        ← Previous
      </button>

      <button
        onClick={onNext}
        disabled={isLastStep}
        className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Next →
      </button>

      <button
        onClick={onReset}
        className="rounded-lg bg-slate-800 px-4 py-2 text-sm hover:bg-slate-700"
      >
        ↻ Reset
      </button>

      <div className="ml-4 text-sm text-slate-400">
        Step {currentStep + 1} / {totalSteps}
      </div>

    </div>
  )
}

export default DebuggerControls