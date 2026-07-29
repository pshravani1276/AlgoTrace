type Variables = {
  i: number | null
  j: number | null
  comparisons: number
  swaps: number
}

type VariablePanelProps = {
  variables: Variables
}

function VariablePanel({ variables }: VariablePanelProps) {

  const displayedVariables = [
    {
      name: "i",
      value: variables.i ?? "-",
    },
    {
      name: "j",
      value: variables.j ?? "-",
    },
    {
      name: "comparisons",
      value: variables.comparisons,
    },
    {
      name: "swaps",
      value: variables.swaps,
    },
  ]

  return (
    <div className="h-full rounded-xl border border-slate-800 bg-slate-900 overflow-hidden">

      <div className="border-b border-slate-800 px-4 py-3">

        <h2 className="font-semibold">
          Variables
        </h2>

        <p className="text-xs text-slate-500 mt-1">
          Live execution state
        </p>

      </div>

      <div className="p-4 space-y-3">

        {displayedVariables.map((variable) => (

          <div
            key={variable.name}
            className="flex items-center justify-between rounded-lg bg-slate-800/60 px-3 py-2"
          >

            <span className="font-mono text-sm text-slate-400">
              {variable.name}
            </span>

            <span className="font-mono font-semibold text-indigo-400">
              {variable.value}
            </span>

          </div>

        ))}

      </div>

    </div>
  )
}

export default VariablePanel