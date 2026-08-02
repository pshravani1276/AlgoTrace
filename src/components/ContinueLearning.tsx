import { Link } from "react-router-dom";
import { PlayCircle, Clock3 } from "lucide-react";

export default function ContinueLearning() {
  return (
    <section className="mt-14">

      <div className="flex items-center justify-between mb-6">

        <h2 className="text-3xl font-bold text-white">
          Continue Learning
        </h2>

        <Link
          to="/sorting"
          className="text-indigo-400 hover:text-indigo-300"
        >
          View All →
        </Link>

      </div>

      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 hover:border-indigo-500 transition">

        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-8">

          <div>

            <span className="inline-block rounded-full bg-indigo-600/20 px-3 py-1 text-indigo-400 text-sm mb-4">
              Sorting
            </span>

            <h3 className="text-3xl font-bold text-white">
              Bubble Sort
            </h3>

            <p className="mt-4 text-slate-400 max-w-xl">
              Learn Bubble Sort step by step with interactive
              visualization, live variable tracking and
              line-by-line debugging.
            </p>

            <div className="mt-6 flex items-center gap-6 text-slate-400">

              <div className="flex items-center gap-2">
                <Clock3 size={18} />
                10 mins
              </div>

              <div>
                Beginner
              </div>

            </div>

          </div>

          <Link
            to="/sorting"
            className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-8 py-4 font-semibold text-white hover:bg-indigo-500 transition"
          >
            <PlayCircle size={22} />

            Continue
          </Link>

        </div>

      </div>

    </section>
  );
}