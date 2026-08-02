import { Link } from "react-router-dom";
import { PlayCircle } from "lucide-react";

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
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 hover:border-indigo-500 transition">

      <span className="inline-block rounded-full bg-indigo-600/20 px-3 py-1 text-sm text-indigo-300">
        {category}
      </span>

      <h3 className="mt-4 text-2xl font-bold text-white">
        {name}
      </h3>

      <p className="mt-3 text-slate-400">
        Difficulty : {difficulty}
      </p>

      <p className="text-slate-400">
        Complexity : {complexity}
      </p>

      <Link
        to={path}
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-white hover:bg-indigo-500 transition"
      >
        <PlayCircle size={18} />

        Start Visualizer
      </Link>

    </div>
  );
}