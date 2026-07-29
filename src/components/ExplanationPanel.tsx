type ExplanationPanelProps = {
  explanation: string
}

function ExplanationPanel({
  explanation,
}: ExplanationPanelProps) {

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">

      <div className="flex items-start gap-3">

        <div className="text-xl">
          💡
        </div>

        <div>

          <h3 className="font-semibold text-slate-200">
            What's happening?
          </h3>

          <p className="mt-1 text-sm text-slate-400">
            {explanation}
          </p>

        </div>

      </div>

    </div>
  )
}

export default ExplanationPanel