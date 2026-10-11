interface GraphVariablesProps {
  currentNode?: string | null;
  queue?: string[];
  visited?: string[];
  traversal?: string[];
  activeEdge?: string | null;
}

const ALL_NODES = ["A", "B", "C", "D", "E", "F", "G"];

export default function GraphVariables({
  currentNode = null,
  queue = [],
  visited = [],
  traversal = [],
  activeEdge = null,
}: GraphVariablesProps) {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-slate-800 bg-[#050b18]">

      {/* =====================================================
          COMPACT HEADER
      ===================================================== */}

      <div className="flex items-center justify-between border-b border-slate-800 px-3 py-1.5">

        <div className="flex items-center gap-2">

          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />

          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300">
            Live Variables
          </span>

        </div>

        <span className="text-[8px] text-slate-600">
          BFS STATE
        </span>

      </div>

      {/* =====================================================
          COMPACT VARIABLES
      ===================================================== */}

      <div className="grid grid-cols-4 gap-1.5 p-2">

        {/* CURRENT */}

        <div className="rounded-lg border border-slate-800 bg-slate-900/50 px-2 py-1.5">

          <div className="text-[7px] font-semibold uppercase tracking-wider text-slate-500">
            Current
          </div>

          <div className="mt-1 flex items-center gap-1.5">

            <span
              className={`flex h-6 min-w-6 items-center justify-center rounded-md border text-[9px] font-bold ${
                currentNode
                  ? "border-cyan-400/50 bg-cyan-400/10 text-cyan-300"
                  : "border-slate-700 bg-slate-800 text-slate-600"
              }`}
            >
              {currentNode ?? "—"}
            </span>

          </div>

        </div>

        {/* ACTIVE EDGE */}

        <div className="rounded-lg border border-slate-800 bg-slate-900/50 px-2 py-1.5">

          <div className="text-[7px] font-semibold uppercase tracking-wider text-slate-500">
            Edge
          </div>

          <div className="mt-1 flex h-6 items-center">

            <span className="truncate rounded-md border border-cyan-400/20 bg-cyan-400/5 px-1.5 text-[8px] font-bold text-cyan-300">
              {activeEdge ?? "—"}
            </span>

          </div>

        </div>

        {/* QUEUE */}

        <div className="rounded-lg border border-slate-800 bg-slate-900/50 px-2 py-1.5">

          <div className="text-[7px] font-semibold uppercase tracking-wider text-slate-500">
            Queue
          </div>

          <div className="mt-1 flex h-6 items-center gap-1 overflow-hidden">

            {queue.length === 0 ? (

              <span className="text-[8px] text-slate-600">
                Empty
              </span>

            ) : (

              queue.map((node, index) => (

                <span
                  key={`${node}-${index}`}
                  className="flex h-5 min-w-5 items-center justify-center rounded-md border border-purple-400/30 bg-purple-400/10 px-1 text-[8px] font-bold text-purple-300"
                >
                  {node}
                </span>

              ))

            )}

          </div>

        </div>

        {/* TRAVERSAL */}

        <div className="rounded-lg border border-slate-800 bg-slate-900/50 px-2 py-1.5">

          <div className="text-[7px] font-semibold uppercase tracking-wider text-slate-500">
            Traversal
          </div>

          <div className="mt-1 flex h-6 items-center gap-1 overflow-hidden">

            {traversal.length === 0 ? (

              <span className="text-[8px] text-slate-600">
                —
              </span>

            ) : (

              traversal.map((node, index) => (

                <span
                  key={`${node}-${index}`}
                  className="flex h-5 min-w-5 items-center justify-center rounded-md border border-emerald-400/30 bg-emerald-400/10 px-1 text-[8px] font-bold text-emerald-300"
                >
                  {node}
                </span>

              ))

            )}

          </div>

        </div>

      </div>

      {/* =====================================================
          VISITED — COMPACT
      ===================================================== */}

      <div className="border-t border-slate-800 px-2.5 py-1.5">

        <div className="flex items-center justify-between">

          <div className="flex items-center gap-1.5">

            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

            <span className="text-[8px] font-bold uppercase tracking-wider text-slate-500">
              Visited
            </span>

          </div>

          <span className="text-[8px] text-slate-600">
            {visited.length}/{ALL_NODES.length}
          </span>

        </div>

        <div className="mt-1.5 flex gap-1">

          {ALL_NODES.map((node) => {

            const isVisited =
              visited.includes(node);

            const isCurrent =
              currentNode === node;

            return (
              <div
                key={node}
                className={`flex h-5 min-w-5 items-center justify-center rounded-md border px-1 text-[8px] font-bold transition-all duration-300 ${
                  isCurrent
                    ? "border-cyan-400 bg-cyan-400/15 text-cyan-300"
                    : isVisited
                    ? "border-emerald-400/50 bg-emerald-400/10 text-emerald-300"
                    : "border-slate-700 bg-slate-900 text-slate-600"
                }`}
              >
                {node}
              </div>
            );

          })}

        </div>

      </div>

    </div>
  );
}