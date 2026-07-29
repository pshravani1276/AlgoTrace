type ArrayVisualizerProps = {
  array: number[]
  comparing: number[]
  swapping: number[]
  sorted: number[]
}

function ArrayVisualizer({
  array,
  comparing,
  swapping,
  sorted,
}: ArrayVisualizerProps) {

  return (
    <div className="h-full rounded-xl border border-slate-800 bg-slate-900 overflow-hidden">

      <div className="border-b border-slate-800 px-4 py-3">

        <h2 className="font-semibold">
          Visualization
        </h2>

        <p className="text-xs text-slate-500 mt-1">
          Array State
        </p>

      </div>

      <div className="h-[calc(100%-65px)] flex items-end justify-center gap-4 p-8">

        {array.map((value, index) => {

          let barColor = "bg-indigo-500"

          if (sorted.includes(index)) {
            barColor = "bg-green-500"
          }

          if (comparing.includes(index)) {
            barColor = "bg-yellow-500"
          }

          if (swapping.includes(index)) {
            barColor = "bg-red-500"
          }

          return (
            <div
              key={index}
              className="flex flex-col items-center justify-end h-full"
            >

              <div
                className={`w-12 rounded-t-md ${barColor} transition-all duration-300`}
                style={{
                  height: `${value * 30}px`,
                }}
              />

              <span className="mt-2 text-sm text-slate-300">
                {value}
              </span>

              <span className="text-xs text-slate-600">
                [{index}]
              </span>

            </div>
          )
        })}

      </div>

    </div>
  )
}

export default ArrayVisualizer