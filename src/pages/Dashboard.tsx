import {
  Award,
  CheckCircle2,
  Flame,
  Footprints,
} from "lucide-react";

import Navbar from "../components/Navbar";
import HeroBanner from "../components/HeroBanner";
import StatsCard from "../components/StatsCard";
import CategoriesSection from "../components/CategoriesSection";
import ContinueLearning from "../components/ContinueLearning";
import { useAuth } from "../context/AuthContext";
import {
  getStreakStats,
  useLearnerProgress,
} from "../data/learnerProgress";

const TRACKED_ACTIVITIES = [
  "bubble-sort",
  "merge-sort",
  "binary-search",
  "linear-search",
  "jump-search",
  "interpolation-search",
  "exponential-search",
  "fibonacci-search",
  "hash-search",
];

const CERTIFICATE_ACTIVITIES = ["merge-sort", "bubble-sort"];

export default function Dashboard() {
  const { user } = useAuth();
  const {
    progress,
    loading,
    error,
    refresh,
  } = useLearnerProgress(user?.id ?? null);
  const completedCount = TRACKED_ACTIVITIES.filter((activity) =>
    progress.completedActivities.includes(activity),
  ).length;
  const certificateCount = CERTIFICATE_ACTIVITIES.every((activity) =>
    progress.completedActivities.includes(activity),
  )
    ? 1
    : 0;
  const { currentStreak } = getStreakStats(progress.activityDays);
  const firstName = user?.displayName.trim().split(/\s+/)[0] || "Learner";

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <main className="mx-auto max-w-7xl space-y-12 px-6 py-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-400">
            Your learning space
          </p>
          <h1 className="mt-2 text-3xl font-extrabold text-white sm:text-4xl">
            Welcome back, {firstName}
          </h1>
          <p className="mt-2 text-slate-400">
            Pick up where you left off and keep building your algorithm skills.
          </p>
        </div>

        <HeroBanner />

        <section aria-labelledby="learning-overview-heading">
          <div className="mb-6">
            <h2
              id="learning-overview-heading"
              className="text-3xl font-extrabold text-white"
            >
              Your Learning Overview
            </h2>
            <p className="mt-2 text-slate-400">
              A snapshot of your progress, updated as you learn.
            </p>
          </div>

          {error && (
            <div
              role="alert"
              className="mb-5 flex flex-col gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200 sm:flex-row sm:items-center sm:justify-between"
            >
              <span>{error}</span>
              <button
                type="button"
                onClick={() => void refresh()}
                className="rounded-lg border border-red-400/30 px-3 py-2 font-semibold hover:bg-red-500/10"
              >
                Retry
              </button>
            </div>
          )}

          {loading ? (
            <div
              role="status"
              className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4"
              aria-label="Loading learning progress"
            >
              {Array.from({ length: 4 }, (_, index) => (
                <div
                  key={index}
                  className="h-44 animate-pulse rounded-3xl border border-slate-800 bg-slate-900/70"
                />
              ))}
            </div>
          ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            <StatsCard
              title="Activities completed"
              value={`${completedCount}/${TRACKED_ACTIVITIES.length}`}
              detail="Across your algorithm library"
              progress={(completedCount / TRACKED_ACTIVITIES.length) * 100}
              icon={<CheckCircle2 size={25} />}
              color="from-green-500 to-emerald-500"
            />
            <StatsCard
              title="Current streak"
              value={`${currentStreak} ${currentStreak === 1 ? "day" : "days"}`}
              detail="Complete an activity to keep it going"
              progress={Math.min((currentStreak / 7) * 100, 100)}
              icon={<Flame size={25} />}
              color="from-orange-500 to-amber-500"
            />
            <StatsCard
              title="Certificates"
              value={`${certificateCount}/1`}
              detail={
                certificateCount
                  ? "Sorting certificate unlocked"
                  : "Complete Bubble Sort and Merge Sort"
              }
              progress={certificateCount * 100}
              icon={<Award size={25} />}
              color="from-yellow-500 to-amber-500"
            />
            <StatsCard
              title="Days practiced"
              value={String(progress.activityDays.length)}
              detail="Days with a completed activity"
              progress={Math.min((progress.activityDays.length / 30) * 100, 100)}
              icon={<Footprints size={25} />}
              color="from-cyan-500 to-blue-500"
            />
          </div>
          )}
        </section>

        <section>
          <CategoriesSection />
        </section>

        <section>
          {loading ? (
            <div
              role="status"
              className="h-80 animate-pulse rounded-3xl border border-slate-800 bg-slate-900/70"
              aria-label="Loading recommendations"
            />
          ) : error ? (
            <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 text-center">
              <h2 className="text-xl font-bold text-white">
                Progress unavailable
              </h2>
              <p className="mt-2 text-slate-400">
                Your learning history and next recommendation will appear when the service is available.
              </p>
              <button
                type="button"
                onClick={() => void refresh()}
                className="mt-5 rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-slate-950 hover:bg-cyan-400"
              >
                Retry
              </button>
            </div>
          ) : (
            <ContinueLearning
              completedActivities={progress.completedActivities}
              lastActivityId={progress.lastActivity?.id ?? null}
            />
          )}
        </section>
      </main>

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
