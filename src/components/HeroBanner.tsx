import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function HeroBanner() {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-violet-600 to-blue-600 p-10">

      {/* Background Circles */}

      <div className="absolute -top-16 -right-16 h-64 w-64 rounded-full bg-white/10"></div>

      <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-white/10"></div>

      <div className="relative z-10">

        <p className="text-indigo-100 text-lg">
          Welcome Back 👋
        </p>

        <h1 className="mt-3 text-5xl font-bold text-white">
          Learn Algorithms
          <br />
          Like Never Before.
        </h1>

        <p className="mt-5 max-w-2xl text-indigo-100 text-lg">
          Step through every line of code, inspect variables,
          visualize data structures and truly understand how
          algorithms execute.
        </p>

        <Link
          to="/sorting"
          className="inline-flex items-center gap-2 mt-8 rounded-xl bg-white px-6 py-3 font-semibold text-indigo-700 transition hover:scale-105"
        >
          Start Learning

          <ArrowRight size={20} />
        </Link>

      </div>

    </section>
  );
}