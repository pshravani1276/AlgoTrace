import { ArrowLeft, ArrowRight, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

const algorithms = [
  {
    name: "Linear Search",
    path: "/searching/linear-search",
    complexity: "O(n)",
    description: "Check each element in order until the target is found.",
  },
  {
    name: "Binary Search",
    path: "/searching/binary-search",
    complexity: "O(log n)",
    description: "Find a value in a sorted array by repeatedly narrowing the range in half.",
  },
  {
    name: "Jump Search",
    path: "/searching/jump-search",
    complexity: "O(√n)",
    description: "Jump through sorted blocks, then scan the block that may contain the target.",
  },
  {
    name: "Interpolation Search",
    path: "/searching/interpolation-search",
    complexity: "O(log log n)",
    description: "Estimate the target position from the values at the range boundaries.",
  },
  {
    name: "Exponential Search",
    path: "/searching/exponential-search",
    complexity: "O(log n)",
    description: "Expand the search bound exponentially, then search within that interval.",
  },
  {
    name: "Fibonacci Search",
    path: "/searching/fibonacci-search",
    complexity: "O(log n)",
    description: "Use Fibonacci numbers to narrow a sorted-array search range.",
  },
  {
    name: "Hash Search",
    path: "/searching/hash-search",
    complexity: "O(1) avg",
    description: "Hash the target to a table slot, then resolve collisions with linear probing.",
  },
];

export default function Searching() {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-[#020617] px-6 py-8 text-white">
      <div className="mx-auto max-w-6xl">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/70 px-5 py-2.5 text-sm font-medium text-slate-300 transition hover:border-cyan-400/50 hover:bg-slate-800 hover:text-white"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <header className="mb-10 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-500/10 text-cyan-400">
            <Search size={26} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Searching Algorithms</h1>
          <p className="mt-3 text-slate-400">
            Choose an algorithm to explore with an interactive visualization.
          </p>
        </header>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {algorithms.map((algorithm) => (
            <button
              key={algorithm.path}
              type="button"
              onClick={() => navigate(algorithm.path)}
              className="group rounded-2xl border border-slate-800 bg-slate-900 p-6 text-left transition hover:-translate-y-1 hover:border-cyan-400/60 hover:shadow-[0_0_30px_rgba(34,211,238,0.12)]"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
                <Search size={25} />
              </div>
              <h2 className="text-xl font-bold transition-colors group-hover:text-cyan-300">
                {algorithm.name}
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-400">
                {algorithm.description}
              </p>
              <div className="mt-6 flex items-center justify-between">
                <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-medium text-cyan-300">
                  {algorithm.complexity}
                </span>
                <span className="flex items-center gap-2 text-sm font-medium text-cyan-400">
                  Open
                  <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}