import { Link } from "react-router-dom";
import {
  PlayCircle,
  ArrowRight,
  Clock3,
  BarChart3,
  Sparkles,
} from "lucide-react";

interface Props {
  name: string;
  difficulty: string;
  category: string;
  complexity: string;
  path: string;
}

export default function AlgorithmCard({
  name,
  difficulty,
  category,
  complexity,
  path,
}: Props) {
  const difficultyColor = () => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "bg-green-500/20 text-green-300 border-green-500/30";

      case "medium":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";

      case "hard":
        return "bg-red-500/20 text-red-300 border-red-500/30";

      default:
        return "bg-cyan-500/20 text-cyan-300 border-cyan-500/30";
    }
  };

  return (
    <div
      className="
      group
      relative
      overflow-hidden
      rounded-3xl
      border
      border-white/10
      bg-white/5
      backdrop-blur-xl
      p-7
      transition-all
      duration-500
      hover:-translate-y-3
      hover:border-cyan-400/40
      hover:shadow-[0_0_40px_rgba(34,211,238,0.25)]
    "
    >
      {/* Glow */}

      <div className="absolute -top-20 -right-20 h-44 w-44 rounded-full bg-cyan-500/10 blur-3xl group-hover:bg-cyan-500/20 transition"></div>

      <div className="absolute -bottom-24 -left-20 h-52 w-52 rounded-full bg-violet-500/10 blur-3xl group-hover:bg-violet-500/20 transition"></div>

      <div className="relative z-10">
        {/* Top */}

        <div className="flex justify-between items-start">
          <span className="rounded-full bg-cyan-500/10 border border-cyan-500/20 px-4 py-2 text-sm font-semibold text-cyan-300">
            {category}
          </span>

          <Sparkles className="text-cyan-400 group-hover:rotate-180 transition duration-700" />
        </div>

        {/* Title */}

        <h3 className="mt-6 text-3xl font-bold text-white group-hover:text-cyan-300 transition">
          {name}
        </h3>

        {/* Difficulty */}

        <div className="mt-6 flex flex-wrap gap-3">
          <span
            className={`rounded-full border px-4 py-2 text-sm font-semibold ${difficultyColor()}`}
          >
            {difficulty}
          </span>

          <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-300 flex items-center gap-2">
            <BarChart3 size={15} />
            {complexity}
          </span>
        </div>

        {/* Description */}

        <p className="mt-6 text-slate-400 leading-7">
          Visualize every comparison, variable update, recursion,
          complexity analysis and execution flow through interactive
          animation.
        </p>

        {/* Bottom Stats */}

        <div className="mt-8 flex justify-between items-center">
          <div className="flex items-center gap-2 text-slate-400">
            <Clock3 size={17} />

            <span>5-10 min</span>
          </div>

          <span className="text-cyan-400 text-sm font-semibold">
            Interactive
          </span>
        </div>

        {/* Progress */}

        <div className="mt-6">
          <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
            <div className="h-full w-0 rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 group-hover:w-full transition-all duration-1000"></div>
          </div>
        </div>

        {/* Button */}

        <Link
          to={path}
          className="
            mt-8
            inline-flex
            w-full
            items-center
            justify-center
            gap-3
            rounded-2xl
            bg-gradient-to-r
            from-cyan-500
            to-blue-600
            px-6
            py-4
            font-bold
            text-white
            transition-all
            duration-300
            hover:scale-105
            hover:shadow-cyan-500/40
          "
        >
          <PlayCircle size={20} />

          Launch Visualizer

          <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
}