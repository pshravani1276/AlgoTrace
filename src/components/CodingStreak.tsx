import {
  Flame,
  Trophy,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  Lock,
  Award,
  X,
  CheckCircle2,
} from "lucide-react";

import { useState } from "react";

const REQUIRED_ACTIVITIES = [
  "merge-sort",
  "bubble-sort",
];

export default function CodingStreak() {
  const months = [
    "January 2026",
    "February 2026",
    "March 2026",
    "April 2026",
    "May 2026",
    "June 2026",
    "July 2026",
    "August 2026",
    "September 2026",
    "October 2026",
    "November 2026",
    "December 2026",
  ];

  const [monthIndex, setMonthIndex] = useState(7);

  const [showWeeklyPerformance, setShowWeeklyPerformance] =
    useState(false);

  const [showCertificate, setShowCertificate] =
    useState(false);

  /*
   * Load completed activities when the state is created.
   *
   * This avoids calling setState() inside useEffect,
   * which was causing the React hooks ESLint error.
   */
  const [completedActivities, setCompletedActivities] =
    useState<string[]>(() => {
      if (typeof window === "undefined") {
        return [];
      }

      const saved = localStorage.getItem(
        "algotrace_completed_activities"
      );

      if (!saved) {
        return [];
      }

      try {
        const parsed: unknown = JSON.parse(saved);

        if (Array.isArray(parsed)) {
          return parsed.filter(
            (item): item is string =>
              typeof item === "string"
          );
        }

        return [];
      } catch {
        return [];
      }
    });

  /*
   * Certificate is unlocked only after
   * all required activities are completed.
   */
  const certificateUnlocked =
    REQUIRED_ACTIVITIES.every((activity) =>
      completedActivities.includes(activity)
    );

  /*
   * Current active learning days.
   */
  const activeDays = [
    2,
    3,
    4,
    6,
    9,
    10,
    11,
    12,
    13,
    16,
    17,
    20,
    23,
  ];

  /*
   * Calendar days.
   */
  const days = Array.from(
    { length: 31 },
    (_, index) => index + 1
  );

  /*
   * Previous month.
   */
  const previousMonth = () => {
    setMonthIndex((previous) =>
      previous === 0
        ? months.length - 1
        : previous - 1
    );
  };

  /*
   * Next month.
   */
  const nextMonth = () => {
    setMonthIndex((previous) =>
      previous === months.length - 1
        ? 0
        : previous + 1
    );
  };

  return (
    <>
      {/* =====================================================
          CODING STREAK
      ===================================================== */}

      <div
        className="
          w-full
          rounded-3xl
          border
          border-slate-800
          bg-slate-950
          p-6
          shadow-2xl
        "
      >
        {/* HEADER */}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-orange-500/20 p-3">
              <Flame className="text-orange-400" />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-orange-400">
                12 Days
              </h2>

              <p className="text-sm text-slate-400">
                Current Streak
              </p>
            </div>
          </div>

          <Trophy className="text-yellow-400" />
        </div>

        {/* MONTH */}

        <div className="mt-7 flex items-center justify-between">
          <button
            type="button"
            onClick={previousMonth}
            className="
              rounded-xl
              bg-slate-900
              p-2
              text-slate-400
              transition
              hover:bg-slate-800
              hover:text-white
            "
          >
            <ChevronLeft size={18} />
          </button>

          <h3 className="font-semibold text-white">
            {months[monthIndex]}
          </h3>

          <button
            type="button"
            onClick={nextMonth}
            className="
              rounded-xl
              bg-slate-900
              p-2
              text-slate-400
              transition
              hover:bg-slate-800
              hover:text-white
            "
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* WEEK DAYS */}

        <div
          className="
            mt-6
            grid
            grid-cols-7
            text-center
            text-xs
            text-slate-500
          "
        >
          {["S", "M", "T", "W", "T", "F", "S"].map(
            (day, index) => (
              <span key={`${day}-${index}`}>
                {day}
              </span>
            )
          )}
        </div>

        {/* CALENDAR */}

        <div className="mt-3 grid grid-cols-7 gap-2">
          {days.map((day) => {
            const active = activeDays.includes(day);

            return (
              <div
                key={day}
                className={`
                  flex
                  h-10
                  items-center
                  justify-center
                  rounded-xl
                  text-sm
                  ${
                    active
                      ? "bg-orange-500 text-white shadow-lg shadow-orange-500/30"
                      : "bg-slate-900 text-slate-400"
                  }
                `}
              >
                {day}
              </div>
            );
          })}
        </div>

        {/* STREAK STATS */}

        <div
          className="
            mt-6
            rounded-2xl
            border
            border-slate-800
            bg-slate-900
            p-4
          "
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-400">
              <CalendarDays size={18} />

              <span>Active Days</span>
            </div>

            <span className="font-bold text-orange-400">
              {activeDays.length}
            </span>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <span className="text-slate-400">
              Longest Streak
            </span>

            <span className="font-bold text-green-400">
              18 Days
            </span>
          </div>
        </div>

        {/* SMALL BUTTONS */}

        <div className="mt-4 grid grid-cols-2 gap-3">
          {/* WEEKLY PERFORMANCE */}

          <button
            type="button"
            onClick={() =>
              setShowWeeklyPerformance(true)
            }
            className="
              flex
              items-center
              justify-center
              gap-2
              rounded-xl
              border
              border-cyan-500/20
              bg-cyan-500/10
              px-3
              py-3
              text-xs
              font-semibold
              text-cyan-400
              transition
              hover:bg-cyan-500/20
            "
          >
            <BarChart3 size={16} />

            Weekly Performance
          </button>

          {/* CERTIFICATE */}

          <button
            type="button"
            onClick={() =>
              setShowCertificate(true)
            }
            className={`
              flex
              items-center
              justify-center
              gap-2
              rounded-xl
              border
              px-3
              py-3
              text-xs
              font-semibold
              transition
              ${
                certificateUnlocked
                  ? "border-yellow-500/30 bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20"
                  : "border-slate-700 bg-slate-900 text-slate-400 hover:bg-slate-800"
              }
            `}
          >
            {certificateUnlocked ? (
              <Award size={16} />
            ) : (
              <Lock size={16} />
            )}

            {certificateUnlocked
              ? "Certificate"
              : "Unlock Certificate"}
          </button>
        </div>
      </div>

      {/* =====================================================
          WEEKLY PERFORMANCE MODAL
      ===================================================== */}

      {showWeeklyPerformance && (
        <Modal
          onClose={() =>
            setShowWeeklyPerformance(false)
          }
        >
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-cyan-500/10 p-3">
              <BarChart3
                size={26}
                className="text-cyan-400"
              />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white">
                Weekly Performance
              </h2>

              <p className="text-sm text-slate-500">
                Your learning activity this week
              </p>
            </div>
          </div>

          <div className="mt-7 space-y-4">
            <PerformanceRow
              day="Monday"
              value={72}
            />

            <PerformanceRow
              day="Tuesday"
              value={85}
            />

            <PerformanceRow
              day="Wednesday"
              value={64}
            />

            <PerformanceRow
              day="Thursday"
              value={91}
            />

            <PerformanceRow
              day="Friday"
              value={76}
            />

            <PerformanceRow
              day="Saturday"
              value={88}
            />

            <PerformanceRow
              day="Sunday"
              value={70}
            />
          </div>

          <div className="mt-7 grid grid-cols-3 gap-3">
            <StatBox
              title="Algorithms"
              value="12"
            />

            <StatBox
              title="Steps"
              value="86"
            />

            <StatBox
              title="Streak"
              value="12d"
            />
          </div>
        </Modal>
      )}

      {/* =====================================================
          CERTIFICATE MODAL
      ===================================================== */}

      {showCertificate && (
        <Modal
          onClose={() =>
            setShowCertificate(false)
          }
        >
          {certificateUnlocked ? (
            <div className="text-center">
              <div
                className="
                  mx-auto
                  flex
                  h-20
                  w-20
                  items-center
                  justify-center
                  rounded-full
                  bg-yellow-500/10
                "
              >
                <Award
                  size={40}
                  className="text-yellow-400"
                />
              </div>

              <h2 className="mt-5 text-2xl font-bold text-white">
                Certificate Unlocked!
              </h2>

              <p className="mt-2 text-sm text-slate-400">
                Congratulations! You completed all
                required activities.
              </p>

              <button
                type="button"
                className="
                  mt-6
                  w-full
                  rounded-xl
                  bg-linear-to-r
                  from-yellow-500
                  to-orange-500
                  py-3
                  font-bold
                  text-white
                "
              >
                View Certificate
              </button>
            </div>
          ) : (
            <>
              <div className="text-center">
                <div
                  className="
                    mx-auto
                    flex
                    h-20
                    w-20
                    items-center
                    justify-center
                    rounded-full
                    bg-slate-900
                  "
                >
                  <Lock
                    size={38}
                    className="text-slate-500"
                  />
                </div>

                <h2 className="mt-5 text-2xl font-bold text-white">
                  Certificate Locked
                </h2>

                <p className="mt-2 text-sm text-slate-400">
                  Complete all required activities
                  to unlock your certificate.
                </p>
              </div>

              <div className="mt-7 space-y-3">
                <ActivityRow
                  title="Complete Merge Sort"
                  completed={completedActivities.includes(
                    "merge-sort"
                  )}
                />

                <ActivityRow
                  title="Complete Bubble Sort"
                  completed={completedActivities.includes(
                    "bubble-sort"
                  )}
                />
              </div>

              <div
                className="
                  mt-6
                  rounded-xl
                  border
                  border-orange-500/20
                  bg-orange-500/5
                  p-4
                  text-center
                "
              >
                <p className="text-xs text-orange-300">
                  🔒 Complete every required activity
                  to unlock your certificate.
                </p>
              </div>
            </>
          )}
        </Modal>
      )}
    </>
  );
}

/* ============================================================
   MODAL
============================================================ */

function Modal({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div
      className="
        fixed
        inset-0
        z-100
        flex
        items-center
        justify-center
        bg-black/70
        p-4
        backdrop-blur-sm
      "
    >
      <div
        className="
          relative
          w-full
          max-w-lg
          rounded-3xl
          border
          border-slate-800
          bg-slate-950
          p-7
          shadow-2xl
        "
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="
            absolute
            right-5
            top-5
            rounded-lg
            p-2
            text-slate-500
            hover:bg-slate-800
            hover:text-white
          "
        >
          <X size={20} />
        </button>

        {children}
      </div>
    </div>
  );
}

/* ============================================================
   PERFORMANCE ROW
============================================================ */

function PerformanceRow({
  day,
  value,
}: {
  day: string;
  value: number;
}) {
  return (
    <div>
      <div className="mb-2 flex justify-between text-xs">
        <span className="text-slate-400">
          {day}
        </span>

        <span className="text-slate-500">
          {value}%
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-slate-900">
        <div
          className="h-full rounded-full bg-cyan-400"
          style={{
            width: `${value}%`,
          }}
        />
      </div>
    </div>
  );
}

/* ============================================================
   STAT BOX
============================================================ */

function StatBox({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div
      className="
        rounded-xl
        border
        border-slate-800
        bg-slate-900
        p-4
        text-center
      "
    >
      <p className="text-lg font-bold text-white">
        {value}
      </p>

      <p className="mt-1 text-[11px] text-slate-500">
        {title}
      </p>
    </div>
  );
}

/* ============================================================
   ACTIVITY ROW
============================================================ */

function ActivityRow({
  title,
  completed,
}: {
  title: string;
  completed: boolean;
}) {
  return (
    <div
      className="
        flex
        items-center
        justify-between
        rounded-xl
        border
        border-slate-800
        bg-slate-900
        p-4
      "
    >
      <div className="flex items-center gap-3">
        {completed ? (
          <CheckCircle2
            size={20}
            className="text-green-400"
          />
        ) : (
          <Lock
            size={18}
            className="text-slate-500"
          />
        )}

        <span
          className={
            completed
              ? "text-sm text-green-400"
              : "text-sm text-slate-300"
          }
        >
          {title}
        </span>
      </div>

      <span
        className={
          completed
            ? "text-xs text-green-400"
            : "text-xs text-slate-500"
        }
      >
        {completed
          ? "Completed"
          : "Incomplete"}
      </span>
    </div>
  );
}