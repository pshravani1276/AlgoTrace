import { algorithms } from "../data/algorithms";
import AlgorithmCard from "./AlgorithmCard";
import { TrendingUp, Sparkles } from "lucide-react";

export default function PopularAlgorithms() {
  return (
    <section className="relative mt-20">

      {/* Background Glow */}

      <div className="absolute -top-32 left-0 w-80 h-80 rounded-full bg-cyan-500/10 blur-3xl"></div>

      <div className="absolute -bottom-32 right-0 w-96 h-96 rounded-full bg-violet-500/10 blur-3xl"></div>

      {/* Header */}

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-10">

        <div>

          <div className="inline-flex items-center gap-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 px-4 py-2">

            <TrendingUp size={18} className="text-cyan-400" />

            <span className="text-cyan-300 font-semibold">
              Most Popular
            </span>

          </div>

          <h2 className="mt-5 text-4xl font-extrabold text-white">
            Popular Algorithms
          </h2>

          <p className="mt-3 max-w-2xl text-slate-400">
            Practice the most frequently used algorithms with
            interactive visualization, live variable tracking,
            code execution, complexity analysis and performance
            metrics.
          </p>

        </div>

        <button
          className="
            flex
            items-center
            gap-2
            rounded-2xl
            bg-gradient-to-r
            from-cyan-500
            to-blue-600
            px-6
            py-3
            font-semibold
            text-white
            shadow-lg
            transition-all
            duration-300
            hover:scale-105
            hover:shadow-cyan-500/40
          "
        >
          <Sparkles size={18} />

          View All

          →

        </button>

      </div>

      {/* Stats */}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-10">

        <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl p-5">

          <h3 className="text-3xl font-bold text-cyan-400">
            {algorithms.length}
          </h3>

          <p className="mt-2 text-slate-400">
            Algorithms
          </p>

        </div>

        <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl p-5">

          <h3 className="text-3xl font-bold text-green-400">
            Easy
          </h3>

          <p className="mt-2 text-slate-400">
            Beginner Friendly
          </p>

        </div>

        <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl p-5">

          <h3 className="text-3xl font-bold text-yellow-400">
            Medium
          </h3>

          <p className="mt-2 text-slate-400">
            Interview Level
          </p>

        </div>

        <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl p-5">

          <h3 className="text-3xl font-bold text-red-400">
            Hard
          </h3>

          <p className="mt-2 text-slate-400">
            Advanced
          </p>

        </div>

      </div>

      {/* Cards */}

      <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">

        {algorithms.map((algo) => (

          <AlgorithmCard
            key={algo.id}
            name={algo.name}
            difficulty={algo.difficulty}
            category={algo.category}
            complexity={algo.time}
            path={algo.path}
          />

        ))}

      </div>

    </section>
  );
}