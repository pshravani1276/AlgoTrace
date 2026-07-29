type CodePanelProps = {
  currentLine: number
}

function CodePanel({ currentLine }: CodePanelProps) {
  const code = [
    "for (i = 0; i < n - 1; i++) {",
    "    for (j = 0; j < n - i - 1; j++) {",
    "        if (arr[j] > arr[j + 1]) {",
    "            swap(arr[j], arr[j + 1]);",
    "        }",
    "    }",
    "}",
  ]

  return (
    <div className="h-full rounded-xl border border-slate-800 bg-slate-900 overflow-hidden">

      <div className="border-b border-slate-800 px-4 py-3">
        <h2 className="font-semibold">
          Code
        </h2>

        <p className="text-xs text-slate-500 mt-1">
          C++ • Bubble Sort
        </p>
      </div>

      <div className="p-4 font-mono text-sm">

        {code.map((line, index) => {
          const lineNumber = index + 1
          const isActive = lineNumber === currentLine

          return (
            <div
              key={index}
              className={`flex rounded px-2 py-1 transition-all duration-200 ${
                isActive
                  ? "bg-indigo-500/20 text-indigo-300 border-l-2 border-indigo-500"
                  : "text-slate-400"
              }`}
            >

              <span className="w-8 text-slate-600 select-none">
                {lineNumber}
              </span>

              <span>
                {line}
              </span>

            </div>
          )
        })}

      </div>

    </div>
  )
}

export default CodePanel