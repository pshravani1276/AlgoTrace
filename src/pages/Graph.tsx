import { useNavigate } from "react-router-dom";
import { ArrowLeft, GitBranch } from "lucide-react";

export default function Graph() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-8 text-white">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate("/categories")}
            className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-300 transition hover:border-cyan-400/40 hover:text-cyan-300"
          >
            <ArrowLeft size={16} />
            Back
          </button>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
              <GitBranch size={22} />
            </div>

            <div>
              <h1 className="text-xl font-bold">
                Graph Algorithms
              </h1>

              <p className="text-xs text-slate-500">
                Explore graph concepts and algorithms
              </p>
            </div>
          </div>

          <div className="w-[90px]" />
        </div>

        {/* Content */}
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 transition hover:border-cyan-400/30">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
              <GitBranch size={24} />
            </div>

            <h2 className="text-lg font-bold">
              Graph Traversal
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              Learn how algorithms visit and explore vertices
              and edges in a graph.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 transition hover:border-indigo-400/30">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
              <GitBranch size={24} />
            </div>

            <h2 className="text-lg font-bold">
              Breadth First Search
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              Understand BFS traversal using a queue and
              level-by-level exploration.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 transition hover:border-purple-400/30">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
              <GitBranch size={24} />
            </div>

            <h2 className="text-lg font-bold">
              Depth First Search
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              Explore DFS traversal and understand how
              recursion or a stack works.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}