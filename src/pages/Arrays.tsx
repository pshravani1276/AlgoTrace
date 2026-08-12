import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Boxes,
  ChevronRight,
  GitBranch,
  Layers3,
  Search,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

type Algorithm = {
  name: string;
  description: string;
  path: string;
  icon: React.ReactNode;
};

const sortingAlgorithms: Algorithm[] = [
  {
    name: "Bubble Sort",
    description:
      "Repeatedly compares adjacent elements and swaps them when they are in the wrong order.",
    path: "/sorting/bubble-sort",
    icon: <BarChart3 size={20} />,
  },
  {
    name: "Selection Sort",
    description:
      "Finds the smallest element and places it in its correct position.",
    path: "/sorting/selection-sort",
    icon: <Layers3 size={20} />,
  },
  {
    name: "Insertion Sort",
    description:
      "Builds the sorted array one element at a time by inserting each value into its correct position.",
    path: "/sorting/insertion-sort",
    icon: <Boxes size={20} />,
  },
  {
    name: "Merge Sort",
    description:
      "Divides the array into smaller parts, sorts them, and merges them back together.",
    path: "/sorting/merge-sort",
    icon: <GitBranch size={20} />,
  },
  {
    name: "Quick Sort",
    description:
      "Uses a pivot to partition the array and recursively sorts the resulting sections.",
    path: "/sorting/quick-sort",
    icon: <Sparkles size={20} />,
  },
  {
    name: "Heap Sort",
    description:
      "Builds a heap structure and repeatedly extracts the largest element.",
    path: "/sorting/heap-sort",
    icon: <Layers3 size={20} />,
  },
];

export default function Arrays() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#020617] text-white">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[10%] top-[10%] h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="absolute right-[10%] top-[30%] h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl" />

        <div className="absolute bottom-[5%] left-[35%] h-72 w-72 rounded-full bg-purple-500/10 blur-3xl" />
      </div>

      {/* Main */}
      <main className="relative mx-auto max-w-7xl px-5 py-8">
        {/* Back */}
        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          className="mb-6 flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-2 text-sm text-slate-300 transition hover:border-cyan-400/50 hover:bg-slate-800 hover:text-cyan-300"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </button>

        {/* Header */}
        <section className="mb-8">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-300">
              <Boxes size={24} />
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-cyan-400">
                AlgoTrace
              </p>

              <h1 className="text-3xl font-bold tracking-tight">
                Sorting Algorithms
              </h1>
            </div>
          </div>

          <p className="max-w-2xl text-sm leading-6 text-slate-400">
            Explore sorting algorithms through interactive visualizations.
            Choose an algorithm below to see how each step works.
          </p>
        </section>

        {/* Search-like info */}
        <div className="mb-6 flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
          <div className="flex items-center gap-3">
            <Search size={18} className="text-cyan-400" />

            <div>
              <p className="text-sm font-semibold text-slate-200">
                Sorting Algorithms
              </p>

              <p className="text-xs text-slate-500">
                Bubble Sort → Selection Sort → Insertion Sort → Merge Sort →
                Quick Sort → Heap Sort
              </p>
            </div>
          </div>

          <span className="hidden rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-300 sm:block">
            {sortingAlgorithms.length} Algorithms
          </span>
        </div>

        {/* Algorithm cards */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sortingAlgorithms.map((algorithm, index) => (
            <button
              key={algorithm.name}
              type="button"
              onClick={() => navigate(algorithm.path)}
              className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 p-5 text-left shadow-xl transition duration-300 hover:-translate-y-1 hover:border-cyan-400/40 hover:bg-slate-900"
            >
              {/* Glow */}
              <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-cyan-400/5 blur-2xl transition group-hover:bg-cyan-400/10" />

              {/* Top */}
              <div className="relative flex items-start justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-300 transition group-hover:scale-110">
                  {algorithm.icon}
                </div>

                <span className="font-mono text-xs text-slate-600">
                  0{index + 1}
                </span>
              </div>

              {/* Name */}
              <h2 className="relative mt-5 text-lg font-bold text-white">
                {algorithm.name}
              </h2>

              {/* Description */}
              <p className="relative mt-2 min-h-[72px] text-xs leading-5 text-slate-400">
                {algorithm.description}
              </p>

              {/* Open */}
              <div className="relative mt-5 flex items-center justify-between border-t border-slate-800 pt-4">
                <span className="text-xs font-semibold text-cyan-400">
                  Open Visualizer
                </span>

                <ArrowRight
                  size={16}
                  className="text-slate-500 transition group-hover:translate-x-1 group-hover:text-cyan-400"
                />
              </div>
            </button>
          ))}
        </section>

        {/* Bottom */}
        <div className="mt-8 flex items-center justify-center">
          <div className="flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/70 px-4 py-2 text-[10px] uppercase tracking-widest text-slate-500">
            <Sparkles size={12} className="text-cyan-400" />
            Interactive algorithm learning
          </div>
        </div>
      </main>
    </div>
  );
}