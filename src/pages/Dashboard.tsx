import Navbar from "../components/Navbar";
import HeroBanner from "../components/HeroBanner";
import StatsCard from "../components/StatsCard";
import CategoriesSection from "../components/CategoriesSection";
import ContinueLearning from "../components/ContinueLearning";
import PopularAlgorithms from "../components/PopularAlgorithms";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-950">

      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">

        <HeroBanner />
        <CategoriesSection />
        <ContinueLearning />
        <PopularAlgorithms />
        {/* Stats */}

        <section>

          <h2 className="text-2xl font-bold text-white mb-6">
            Dashboard Overview
          </h2>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">

            <StatsCard
              title="Algorithms"
              value="120+"
              icon="📚"
              color="bg-blue-500/20"
            />

            <StatsCard
              title="Completed"
              value="0"
              icon="✅"
              color="bg-green-500/20"
            />

            <StatsCard
              title="Bookmarks"
              value="0"
              icon="⭐"
              color="bg-yellow-500/20"
            />

            <StatsCard
              title="Learning Streak"
              value="0 Days"
              icon="🔥"
              color="bg-red-500/20"
            />

          </div>

        </section>

      </main>

    </div>
  );
}