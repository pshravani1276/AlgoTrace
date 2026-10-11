import {
  ArrowLeft,
  GitBranch,
  Network,
  ArrowRight,
} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";

export default function Graph() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#020617] px-6 py-8 text-white">
      <div className="mx-auto max-w-6xl">

        {/* =====================================================
            BACK BUTTON
        ===================================================== */}

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/70 px-5 py-2.5 text-sm font-medium text-slate-300 transition-all duration-300 hover:border-cyan-400/50 hover:bg-slate-800 hover:text-white"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="mb-8 flex items-center justify-center gap-4">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/10">
            <Network
              size={25}
              className="text-cyan-400"
            />
          </div>

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Graph Algorithms
            </h1>

            <p className="text-sm text-slate-500">
              Explore graph concepts and algorithms
            </p>
          </div>

        </div>

        {/* =====================================================
            GRAPH ALGORITHM CARDS
        ===================================================== */}

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

          {/* ===================================================
              GRAPH TRAVERSAL
          =================================================== */}

          <div className="rounded-2xl border border-slate-800 bg-[#111a2f] p-6 transition-all duration-300 hover:border-cyan-400/30">

            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
              <GitBranch size={25} />
            </div>

            <h2 className="mb-3 text-lg font-bold text-white">
              Graph Traversal
            </h2>

            <p className="text-sm leading-6 text-slate-400">
              Learn how algorithms visit and explore vertices and edges in a graph.
            </p>

          </div>

          {/* ===================================================
              BREADTH FIRST SEARCH
          =================================================== */}

          <Link
            to="/graph/bfs"
            className="group block rounded-2xl border border-slate-800 bg-[#111a2f] p-6 no-underline transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/60 hover:bg-[#15213a] hover:shadow-[0_0_30px_rgba(34,211,238,0.12)]"
          >

            {/* ICON */}

            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 transition-all duration-300 group-hover:bg-cyan-500/10 group-hover:text-cyan-400">
              <GitBranch size={25} />
            </div>

            {/* TITLE */}

            <h2 className="mb-3 text-lg font-bold text-white transition-colors duration-300 group-hover:text-cyan-300">
              Breadth First Search
            </h2>

            {/* DESCRIPTION */}

            <p className="text-sm leading-6 text-slate-400">
              Understand BFS traversal using a queue and level-by-level exploration.
            </p>

            {/* OPEN */}

            <div className="mt-6 flex items-center justify-between">

              <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-400">
                Graph
              </span>

              <span className="flex items-center gap-2 text-sm font-medium text-cyan-400">
                Open
                <ArrowRight
                  size={17}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </span>

            </div>

          </Link>

          {/* ===================================================
              DEPTH FIRST SEARCH
          =================================================== */}

          <div className="rounded-2xl border border-slate-800 bg-[#111a2f] p-6 transition-all duration-300 hover:border-purple-400/30">

            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
              <GitBranch size={25} />
            </div>

            <h2 className="mb-3 text-lg font-bold text-white">
              Depth First Search
            </h2>

            <p className="text-sm leading-6 text-slate-400">
              Explore DFS traversal and understand how recursion or a stack works.
            </p>

            <div className="mt-6 flex items-center justify-end">

              <span className="text-sm text-slate-600">
                Coming soon
              </span>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}