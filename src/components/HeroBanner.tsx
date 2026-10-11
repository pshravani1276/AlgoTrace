import { ArrowRight, Sparkles, PlayCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function HeroBanner() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 35 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="
      relative
      overflow-hidden
      rounded-3xl
      border
      border-slate-800
      bg-gradient-to-br
      from-slate-900
      via-slate-950
      to-indigo-950
      p-10
      shadow-2xl
      "
    >
      {/* Background Glow */}

      <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />

      <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-cyan-500/20 blur-3xl" />

      {/* Floating Dots */}

      <div className="absolute right-10 top-10 h-3 w-3 rounded-full bg-cyan-400 animate-pulse" />

      <div className="absolute right-24 top-20 h-2 w-2 rounded-full bg-indigo-400 animate-pulse" />

      <div className="relative z-10">

        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-300">

          <Sparkles size={16} />

          Interactive Algorithm Visualizer

        </div>

        <h1 className="mt-6 max-w-3xl text-5xl font-extrabold leading-tight text-white">

          Visualize Algorithms

          <br />

          <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-500 bg-clip-text text-transparent">

            Like Never Before

          </span>

        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">

          Learn algorithms through interactive visualizations,
          recursion trees, code execution, variable tracking,
          complexity analysis and beautiful animations.

        </p>

        <div className="mt-8 flex flex-wrap gap-4">

          <Link
            to="/sorting"
            className="
            inline-flex
            items-center
            gap-2
            rounded-xl
            bg-cyan-500
            px-6
            py-3
            font-semibold
            text-slate-950
            transition
            hover:scale-105
            hover:bg-cyan-400
            "
          >
            Explore Algorithms

            <ArrowRight size={18} />

          </Link>

          <Link
            to="#continue-learning"
            className="
            inline-flex
            items-center
            gap-2
            rounded-xl
            border
            border-slate-700
            bg-slate-900/70
            px-6
            py-3
            font-semibold
            text-white
            transition
            hover:border-cyan-500
            hover:bg-slate-800
            "
          >
            <PlayCircle size={18} />

            Continue Learning

          </Link>

        </div>

        {/* Bottom Stats */}

        <div className="mt-10 grid gap-4 sm:grid-cols-3">

          <div className="rounded-2xl bg-slate-900/60 p-4 border border-slate-800">
            <p className="text-3xl font-bold text-cyan-400">30+</p>
            <p className="mt-1 text-sm text-slate-400">
              Algorithms
            </p>
          </div>

          <div className="rounded-2xl bg-slate-900/60 p-4 border border-slate-800">
            <p className="text-3xl font-bold text-indigo-400">100%</p>
            <p className="mt-1 text-sm text-slate-400">
              Interactive
            </p>
          </div>

          <div className="rounded-2xl bg-slate-900/60 p-4 border border-slate-800">
            <p className="text-3xl font-bold text-green-400">7</p>
            <p className="mt-1 text-sm text-slate-400">
              Sorting Visualizers
            </p>
          </div>

        </div>

      </div>

    </motion.section>
  );
}