import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpDown,
  Layers,
  GitMerge,
  Shuffle,
  Boxes,
  BarChart3,
} from "lucide-react";

const algorithms = [
  {
    title: "Bubble Sort",
    description: "Compare adjacent elements and swap them.",
    icon: <ArrowUpDown size={34} />,
    color: "from-cyan-500 to-blue-600",
    path: "/sorting/bubble-sort",
    complexity: "O(n²)",
  },
  {
    title: "Selection Sort",
    description: "Find the minimum element repeatedly.",
    icon: <Layers size={34} />,
    color: "from-green-500 to-emerald-600",
    path: "/sorting/selection-sort",
    complexity: "O(n²)",
  },
  {
    title: "Insertion Sort",
    description: "Insert elements into a sorted subarray.",
    icon: <BarChart3 size={34} />,
    color: "from-orange-500 to-yellow-600",
    path: "/sorting/insertion-sort",
    complexity: "O(n²)",
  },
  {
    title: "Merge Sort",
    description: "Divide and conquer recursive algorithm.",
    icon: <GitMerge size={34} />,
    color: "from-violet-500 to-indigo-600",
    path: "/sorting/merge-sort",
    complexity: "O(n log n)",
  },
  {
    title: "Quick Sort",
    description: "Partition around a pivot element.",
    icon: <Shuffle size={34} />,
    color: "from-pink-500 to-rose-600",
    path: "/sorting/quick-sort",
    complexity: "O(n log n)",
  },
  {
    title: "Heap Sort",
    description: "Binary Heap based sorting.",
    icon: <Boxes size={34} />,
    color: "from-teal-500 to-cyan-600",
    path: "/sorting/heap-sort",
    complexity: "O(n log n)",
  },
  {
    title: "Radix Sort",
    description: "Digit-by-digit non-comparison sorting.",
    icon: <BarChart3 size={34} />,
    color: "from-red-500 to-orange-600",
    path: "/sorting/radix-sort",
    complexity: "O(nk)",
  },
];

export default function Sorting() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-12">

        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold">
            Sorting Algorithms
          </h1>

          <p className="mt-4 text-slate-400 text-lg">
            Choose an algorithm to explore with interactive visualizations.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">

          {algorithms.map((algo) => (

            <motion.div
              key={algo.title}
              onClick={() => navigate(algo.path)}
              whileHover={{
                y: -8,
                scale: 1.03,
              }}
              transition={{
                duration: 0.25,
              }}
              className="
                group
                relative
                cursor-pointer
                overflow-hidden
                rounded-3xl
                border
                border-slate-800
                bg-slate-900
                p-7
                shadow-xl
              "
            >

              <div
                className={`
                  absolute
                  -right-12
                  -top-12
                  h-44
                  w-44
                  rounded-full
                  bg-gradient-to-br
                  ${algo.color}
                  opacity-20
                  blur-3xl
                  transition
                  group-hover:opacity-40
                `}
              />

              <div className="relative z-10">

                <div
                  className={`
                    inline-flex
                    rounded-2xl
                    bg-gradient-to-br
                    ${algo.color}
                    p-4
                    text-white
                  `}
                >
                  {algo.icon}
                </div>

                <h2 className="mt-6 text-2xl font-bold">
                  {algo.title}
                </h2>

                <p className="mt-3 text-slate-400">
                  {algo.description}
                </p>

                <div className="mt-6 flex items-center justify-between">

                  <span className="rounded-full bg-slate-800 px-3 py-1 text-sm text-cyan-300">
                    {algo.complexity}
                  </span>

                  <Link
                    to={algo.path}
                    onClick={(event) => {
                      event.stopPropagation();
                    }}
                    className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300"
                  >
                    Open

                    <ArrowRight size={18} />
                  </Link>

                </div>

              </div>

            </motion.div>

          ))}

        </div>

      </div>
    </div>
  );
}