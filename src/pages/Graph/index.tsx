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

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">

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

          <Link
            to="/graph/dfs"
            className="group block rounded-2xl border border-slate-800 bg-[#111a2f] p-6 no-underline transition-all duration-300 hover:-translate-y-1 hover:border-purple-400/60 hover:bg-[#15213a] hover:shadow-[0_0_30px_rgba(167,139,250,0.12)]"
          >
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 transition-all duration-300 group-hover:bg-violet-500/10 group-hover:text-violet-400">
              <GitBranch size={25} />
            </div>
            <h2 className="mb-3 text-lg font-bold text-white transition-colors duration-300 group-hover:text-violet-300">
              Depth First Search
            </h2>
            <p className="text-sm leading-6 text-slate-400">
              Explore DFS traversal and understand how recursion or a stack works.
            </p>
            <div className="mt-6 flex items-center justify-between">
              <span className="rounded-full bg-violet-400/10 px-3 py-1 text-xs font-medium text-violet-400">Graph</span>
              <span className="flex items-center gap-2 text-sm font-medium text-violet-400">
                Open
                <ArrowRight size={17} className="transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </div>
          </Link>

          {/* ===================================================
              A* STAR
          =================================================== */}

          <Link
            to="/graph/a-star"
            className="group block rounded-2xl border border-slate-800 bg-[#111a2f] p-6 no-underline transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/60 hover:bg-[#15213a] hover:shadow-[0_0_30px_rgba(34,211,238,0.12)]"
          >
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 transition-all duration-300 group-hover:bg-cyan-500/10 group-hover:text-cyan-400">
              <GitBranch size={25} />
            </div>
            <h2 className="mb-3 text-lg font-bold text-white transition-colors duration-300 group-hover:text-cyan-300">A* (A Star) Algorithm</h2>
            <p className="text-sm leading-6 text-slate-400">Find the shortest path using a priority queue and the cost function f(n) = g(n) + h(n).</p>
            <div className="mt-6 flex items-center justify-between">
              <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-400">Graph</span>
              <span className="flex items-center gap-2 text-sm font-medium text-cyan-400">Open <ArrowRight size={17} className="transition-transform duration-300 group-hover:translate-x-1" /></span>
            </div>
          </Link>

          {/* ===================================================
              AO* STAR
          =================================================== */}

          <Link
            to="/graph/ao-star"
            className="group block rounded-2xl border border-slate-800 bg-[#111a2f] p-6 no-underline transition-all duration-300 hover:-translate-y-1 hover:border-violet-400/60 hover:bg-[#15213a] hover:shadow-[0_0_30px_rgba(168,85,247,0.12)]"
          >
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400 transition-all duration-300 group-hover:bg-violet-500/10 group-hover:text-violet-400">
              <GitBranch size={25} />
            </div>
            <h2 className="mb-3 text-lg font-bold text-white transition-colors duration-300 group-hover:text-violet-300">AO* (A-Optimal Star) Algorithm</h2>
            <p className="text-sm leading-6 text-slate-400">
              Explore the optimal path across a graph using best-first AND/OR expansion and heuristic estimates.
            </p>
            <div className="mt-6 flex items-center justify-between">
              <span className="rounded-full bg-violet-400/10 px-3 py-1 text-xs font-medium text-violet-400">Graph</span>
              <span className="flex items-center gap-2 text-sm font-medium text-violet-400">
                Open
                <ArrowRight size={17} className="transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </div>
          </Link>

          <Link to="/graph/bellman-ford" className="group block rounded-2xl border border-slate-800 bg-[#111a2f] p-6 no-underline transition-all hover:-translate-y-1 hover:border-rose-400/60 hover:bg-[#15213a]">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400"><GitBranch size={25} /></div>
            <h2 className="mb-3 text-lg font-bold text-white group-hover:text-rose-300">Bellman–Ford Algorithm</h2>
            <p className="text-sm leading-6 text-slate-400">Find shortest paths with negative edge weights and detect negative cycles.</p>
            <div className="mt-6 flex items-center justify-between"><span className="rounded-full bg-rose-400/10 px-3 py-1 text-xs text-rose-300">Weighted graph</span><span className="flex items-center gap-2 text-sm text-rose-300">Open <ArrowRight size={17} /></span></div>
          </Link>

          <Link to="/graph/topological-kahn" className="group block rounded-2xl border border-slate-800 bg-[#111a2f] p-6 no-underline transition-all hover:-translate-y-1 hover:border-emerald-400/60 hover:bg-[#15213a]">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400"><GitBranch size={25} /></div>
            <h2 className="mb-3 text-lg font-bold text-white group-hover:text-emerald-300">Topological Sorting (Kahn’s Algorithm)</h2>
            <p className="text-sm leading-6 text-slate-400">Build a valid DAG order by repeatedly removing zero-indegree nodes.</p>
            <div className="mt-6 flex items-center justify-between"><span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300">DAG</span><span className="flex items-center gap-2 text-sm text-emerald-300">Open <ArrowRight size={17} /></span></div>
          </Link>

          <Link to="/graph/topological-dfs" className="group block rounded-2xl border border-slate-800 bg-[#111a2f] p-6 no-underline transition-all hover:-translate-y-1 hover:border-sky-400/60 hover:bg-[#15213a]">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-sky-500/10 text-sky-400"><GitBranch size={25} /></div>
            <h2 className="mb-3 text-lg font-bold text-white group-hover:text-sky-300">Topological Sorting (DFS-Based)</h2>
            <p className="text-sm leading-6 text-slate-400">Order DAG nodes by reverse DFS finishing time.</p>
            <div className="mt-6 flex items-center justify-between"><span className="rounded-full bg-sky-400/10 px-3 py-1 text-xs text-sky-300">DAG</span><span className="flex items-center gap-2 text-sm text-sky-300">Open <ArrowRight size={17} /></span></div>
          </Link>

          <Link to="/graph/dag-shortest-path" className="group block rounded-2xl border border-slate-800 bg-[#111a2f] p-6 no-underline transition-all hover:-translate-y-1 hover:border-amber-400/60 hover:bg-[#15213a]">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400"><GitBranch size={25} /></div>
            <h2 className="mb-3 text-lg font-bold text-white group-hover:text-amber-300">Shortest Path in a DAG</h2>
            <p className="text-sm leading-6 text-slate-400">Relax weighted edges in topological order to find shortest paths.</p>
            <div className="mt-6 flex items-center justify-between"><span className="rounded-full bg-amber-400/10 px-3 py-1 text-xs text-amber-300">Weighted DAG</span><span className="flex items-center gap-2 text-sm text-amber-300">Open <ArrowRight size={17} /></span></div>
          </Link>

        </div>

      </div>
    </div>
  );
}