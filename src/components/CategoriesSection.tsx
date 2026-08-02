import {
  Search,
  ArrowUpDown,
  Network,
  Boxes,
  GitBranch,
  Cpu,
} from "lucide-react";

import CategoryCard from "./CategoryCard";

export default function CategoriesSection() {
  return (
    <section className="mt-12">

      <h2 className="text-3xl font-bold text-white mb-8">
        Choose Category
      </h2>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

        <CategoryCard
          title="Searching"
          count={6}
          icon={<Search />}
          path="/searching"
        />

        <CategoryCard
          title="Sorting"
          count={13}
          icon={<ArrowUpDown />}
          path="/sorting"
        />

        <CategoryCard
          title="Graphs"
          count={12}
          icon={<Network />}
          path="/graph"
        />

        <CategoryCard
          title="Arrays"
          count={5}
          icon={<Boxes />}
          path="/arrays"
        />

        <CategoryCard
          title="Trees"
          count={14}
          icon={<GitBranch />}
          path="/trees"
        />

        <CategoryCard
          title="Others"
          count={28}
          icon={<Cpu />}
          path="/others"
        />

      </div>

    </section>
  );
}