import { algorithms } from "../data/algorithms";
import AlgorithmCard from "./AlgorithmCard";

export default function PopularAlgorithms() {
  return (
    <section className="mt-14">

      <div className="flex justify-between items-center mb-8">

        <h2 className="text-3xl font-bold text-white">
          Popular Algorithms
        </h2>

        <button className="text-indigo-400 hover:text-indigo-300">
          View All →
        </button>

      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

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