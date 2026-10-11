import { Link } from "react-router-dom";
import {
  ArrowRight,
  Clock3,
  PlayCircle,
  Trophy,
  Flame,
  Code2,
} from "lucide-react";
import { motion } from "framer-motion";

interface Activity {
  id: string;
  name: string;
  title: string;
  description: string;
  path: string;
  duration: string;
  difficulty: string;
}

const ACTIVITIES: Activity[] = [
  {
    id: "bubble-sort",
    name: "Bubble Sort",
    title: "Bubble Sort Visualization",
    description:
      "Learn how repeated comparisons and swaps gradually move each value into its sorted position.",
    path: "/sorting/bubble-sort",
    duration: "10 min",
    difficulty: "Beginner",
  },
  {
    id: "merge-sort",
    name: "Merge Sort",
    title: "Merge Sort Visualization",
    description:
      "Explore divide and conquer with recursive trees, live variables, merge animations, and complexity analysis.",
    path: "/sorting/merge-sort",
    duration: "15 min",
    difficulty: "Intermediate",
  },
  {
    id: "binary-search",
    name: "Binary Search",
    title: "Binary Search Visualization",
    description:
      "See how a sorted array is narrowed down by halving the search range at every step.",
    path: "/searching/binary-search",
    duration: "8 min",
    difficulty: "Beginner",
  },
  {
    id: "linear-search",
    name: "Linear Search",
    title: "Linear Search Visualization",
    description:
      "Follow a simple sequential scan and understand its behavior on unsorted data.",
    path: "/searching/linear-search",
    duration: "8 min",
    difficulty: "Beginner",
  },
  {
    id: "jump-search",
    name: "Jump Search",
    title: "Jump Search Visualization",
    description:
      "Compare block jumps and a final local scan while searching a sorted collection.",
    path: "/searching/jump-search",
    duration: "10 min",
    difficulty: "Intermediate",
  },
  {
    id: "interpolation-search",
    name: "Interpolation Search",
    title: "Interpolation Search Visualization",
    description:
      "Watch value estimates guide the search through a uniformly distributed sorted array.",
    path: "/searching/interpolation-search",
    duration: "10 min",
    difficulty: "Intermediate",
  },
  {
    id: "exponential-search",
    name: "Exponential Search",
    title: "Exponential Search Visualization",
    description:
      "Find a useful search range quickly, then narrow it down with binary search.",
    path: "/searching/exponential-search",
    duration: "10 min",
    difficulty: "Intermediate",
  },
  {
    id: "fibonacci-search",
    name: "Fibonacci Search",
    title: "Fibonacci Search Visualization",
    description:
      "Use Fibonacci offsets to reduce a sorted search space step by step.",
    path: "/searching/fibonacci-search",
    duration: "12 min",
    difficulty: "Advanced",
  },
  {
    id: "hash-search",
    name: "Hash Search",
    title: "Hash Search Visualization",
    description:
      "Explore hash-based lookup, collisions, and probing through an interactive table.",
    path: "/searching/hash-search",
    duration: "12 min",
    difficulty: "Intermediate",
  },
];

interface Props {
  completedActivities: string[];
  lastActivityId: string | null;
}

export default function ContinueLearning({
  completedActivities,
  lastActivityId,
}: Props) {
  const lastIndex = ACTIVITIES.findIndex(
    (activity) => activity.id === lastActivityId,
  );
  const recommended = lastIndex >= 0
    ? ACTIVITIES.slice(lastIndex + 1).find(
        (activity) => !completedActivities.includes(activity.id),
      ) ??
      ACTIVITIES.find(
        (activity) => !completedActivities.includes(activity.id),
      ) ??
      ACTIVITIES[lastIndex]
    : ACTIVITIES.find(
        (activity) => !completedActivities.includes(activity.id),
      ) ?? ACTIVITIES[0];
  const completedCount = ACTIVITIES.filter((activity) =>
    completedActivities.includes(activity.id),
  ).length;
  const progressPercent = Math.round(
    (completedCount / ACTIVITIES.length) * 100,
  );
  const allComplete = completedCount === ACTIVITIES.length;

  return (
    <section id="continue-learning" className="scroll-mt-24">
      <div className="mb-7">
        <h2 className="text-3xl font-extrabold text-white">
          Continue Learning
        </h2>
        <p className="mt-2 text-slate-400">
          {allComplete
            ? "You have completed every tracked activity. Revisit one or explore another category."
            : completedCount > 0
              ? `You have completed ${completedCount} of ${ACTIVITIES.length} activities. Here is a good next step.`
              : "Start with a guided activity. Your progress will shape what we recommend next."}
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950 p-6 shadow-2xl sm:p-8"
      >
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />

        <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-300">
              <Code2 size={16} />
              {recommended.name}
            </div>

            <h3 className="mt-5 text-3xl font-extrabold text-white sm:text-4xl">
              {allComplete ? "Revisit a favorite" : recommended.title}
            </h3>
            <p className="mt-4 leading-7 text-slate-400">
              {recommended.description}
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-3">
                <Clock3 size={18} className="text-cyan-400" />
                <span className="text-sm text-slate-300">
                  {recommended.duration}
                </span>
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-3">
                <Trophy size={18} className="text-yellow-400" />
                <span className="text-sm text-slate-300">
                  {recommended.difficulty}
                </span>
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-3">
                <Flame size={18} className="text-orange-400" />
                <span className="text-sm text-slate-300">
                  {completedCount} completed
                </span>
              </div>
            </div>
          </div>

          <div className="w-full max-w-sm rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
            <div className="flex justify-between">
              <span className="text-slate-400">Your progress</span>
              <span className="font-bold text-cyan-400">
                {progressPercent}%
              </span>
            </div>
            <div
              className="mt-4 h-3 overflow-hidden rounded-full bg-slate-800"
              role="progressbar"
              aria-label="Learning activities completed"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progressPercent}
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 1.2 }}
                className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500"
              />
            </div>

            <Link
              to={recommended.path}
              className="mt-8 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-4 font-bold text-slate-950 transition hover:scale-[1.02]"
            >
              <PlayCircle size={20} />
              {allComplete ? "Review Activity" : "Start Recommended"}
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
