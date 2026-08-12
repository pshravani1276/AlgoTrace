import Navbar from "../components/Navbar";
import HeroBanner from "../components/HeroBanner";
import StatsCard from "../components/StatsCard";
import CategoriesSection from "../components/CategoriesSection";
import ContinueLearning from "../components/ContinueLearning";

import {
  Award,
  BookOpen,
  Bookmark,
  CheckCircle2,
} from "lucide-react";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* =====================================================
          NAVBAR
      ====================================================== */}

      <Navbar />

      {/* =====================================================
          MAIN DASHBOARD
      ====================================================== */}

      <main className="mx-auto max-w-7xl space-y-12 px-6 py-8">
        {/* =================================================
            HERO
        ================================================== */}

        <HeroBanner />

        {/* =================================================
            LEARNING OVERVIEW
        ================================================== */}

        <section>
          <div className="mb-6">
            <h2 className="text-3xl font-extrabold text-white">
              Learning Overview
            </h2>

            <p className="mt-2 text-slate-400">
              Track your algorithm learning progress.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            <StatsCard
              title="Certificates"
              value="03"
              icon={<Award size={25} />}
              color="from-yellow-500 to-amber-500"
            />

            <StatsCard
              title="Completed"
              value="18"
              icon={<CheckCircle2 size={25} />}
              color="from-green-500 to-emerald-500"
            />

            <StatsCard
              title="Bookmarks"
              value="09"
              icon={<Bookmark size={25} />}
              color="from-cyan-500 to-blue-500"
            />

            <StatsCard
              title="Algorithms"
              value="25"
              icon={<BookOpen size={25} />}
              color="from-purple-500 to-indigo-500"
            />
          </div>
        </section>

        {/* =================================================
            CATEGORIES
        ================================================== */}

        <section>
          <CategoriesSection />
        </section>

        {/* =================================================
            CONTINUE LEARNING
        ================================================== */}

        <section>
          <ContinueLearning />
        </section>

        {/* =================================================
            IMPORTANT
            CodingStreak is intentionally NOT rendered here.

            It remains available from the Navbar Streak button.
        ================================================== */}
      </main>

      {/* =====================================================
          FOOTER
      ====================================================== */}

      <footer className="mt-16 border-t border-slate-800 bg-slate-950">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-8 text-center sm:flex-row sm:text-left">
          <div>
            <h3 className="text-lg font-extrabold">
              Algo<span className="text-cyan-400">Trace</span>
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              Don&apos;t memorize. Just visualize.
            </p>
          </div>

          <p className="text-xs text-slate-600">
            © 2026 AlgoTrace • Interactive Algorithm Learning Platform
          </p>
        </div>
      </footer>
    </div>
  );
}