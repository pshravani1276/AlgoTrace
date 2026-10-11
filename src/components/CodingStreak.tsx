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
import { useAuth } from "../context/AuthContext";
import {
  getUtcDateKey,
  getStreakStats,
  useLearnerProgress,
} from "../data/learnerProgress";

const REQUIRED_ACTIVITIES = [
  "merge-sort",
  "bubble-sort",
];

export default function CodingStreak() {
  const { user } = useAuth();
  const { progress, loading, error, refresh } = useLearnerProgress(
    user?.id ?? null,
  );
  const { currentStreak, longestStreak } = getStreakStats(
    progress.activityDays,
  );
  const [monthDate, setMonthDate] = useState(() => new Date());
  const [showWeeklyPerformance, setShowWeeklyPerformance] =
    useState(false);

  const [showCertificate, setShowCertificate] =
    useState(false);
  const completedActivities = progress.completedActivities;
  const certificateUnlocked =
    REQUIRED_ACTIVITIES.every((activity) =>
      completedActivities.includes(activity)
    );
  const monthLabel = monthDate.toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
  const monthYear = monthDate.getUTCFullYear();
  const monthNumber = monthDate.getUTCMonth();
  const daysInMonth = new Date(Date.UTC(monthYear, monthNumber + 1, 0)).getUTCDate();
  const firstWeekday = new Date(Date.UTC(monthYear, monthNumber, 1)).getUTCDay();
  const activeDays = new Set(
    progress.activityDays
      .filter((date) => date.startsWith(
        `${monthYear}-${String(monthNumber + 1).padStart(2, "0")}-`,
      ))
      .map((date) => Number(date.slice(-2))),
  );
  const days = Array.from({ length: daysInMonth }, (_, index) => index + 1);
  const weekStart = new Date();
  weekStart.setUTCHours(0, 0, 0, 0);
  weekStart.setUTCDate(weekStart.getUTCDate() - weekStart.getUTCDay());
  const week = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(weekStart);
    date.setUTCDate(weekStart.getUTCDate() + index);

    return {
      label: date.toLocaleDateString(undefined, {
        weekday: "long",
        timeZone: "UTC",
      }),
      active: progress.activityDays.includes(getUtcDateKey(date)),
    };
  });
  const activeDaysThisWeek = week.filter((day) => day.active).length;

  const previousMonth = () => {
    setMonthDate((previous) =>
      new Date(Date.UTC(previous.getUTCFullYear(), previous.getUTCMonth() - 1, 1)),
    );
  };
  const nextMonth = () => {
    setMonthDate((previous) =>
      new Date(Date.UTC(previous.getUTCFullYear(), previous.getUTCMonth() + 1, 1)),
    );
  };

  if (loading) {
    return (
      <div
        role="status"
        className="h-80 animate-pulse rounded-3xl border border-slate-800 bg-slate-900"
        aria-label="Loading coding streak"
      />
    );
  }

  if (error) {
    return (
      <div
        role="alert"
        className="rounded-3xl border border-red-500/30 bg-slate-900 p-6 text-sm text-red-200"
      >
        <p>{error}</p>
        <button
          type="button"
          onClick={() => void refresh()}
          className="mt-4 rounded-lg border border-red-400/30 px-3 py-2 font-semibold hover:bg-red-500/10"
        >
          Retry
        </button>
      </div>
    );
  }

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
                {currentStreak} {currentStreak === 1 ? "Day" : "Days"}
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
            {monthLabel}
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
          {Array.from({ length: firstWeekday }, (_, index) => (
            <span key={`empty-${index}`} aria-hidden="true" />
          ))}
          {days.map((day) => {
            const active = activeDays.has(day);
            const isToday =
              new Date().getUTCFullYear() === monthYear &&
              new Date().getUTCMonth() === monthNumber &&
              new Date().getUTCDate() === day;

            return (
              <div
                key={day}
                aria-label={`${monthLabel} ${day}${active ? ", activity completed" : ""}`}
                className={`
                  flex
                  h-10
                  items-center
                  justify-center
                  rounded-xl
                  text-sm
                  ${isToday ? "ring-1 ring-cyan-400" : ""}
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
              {activeDays.size}
            </span>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <span className="text-slate-400">
              Longest Streak
            </span>

            <span className="font-bold text-green-400">
              {longestStreak} Days
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
            {week.map((day) => (
              <PerformanceRow
                key={day.label}
                day={day.label}
                active={day.active}
              />
            ))}
          </div>

          <div className="mt-7 grid grid-cols-3 gap-3">
            <StatBox
              title="Algorithms"
              value={String(completedActivities.length)}
            />

            <StatBox
              title="Active days"
              value={String(activeDaysThisWeek)}
            />

            <StatBox
              title="Streak"
              value={`${currentStreak}d`}
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
  active,
}: {
  day: string;
  active: boolean;
}) {
  return (
    <div>
      <div className="mb-2 flex justify-between text-xs">
        <span className="text-slate-400">
          {day}
        </span>

        <span className="text-slate-500">
          {active ? "Practiced" : "No activity"}
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-slate-900">
        <div
          className="h-full rounded-full bg-cyan-400"
          style={{
            width: active ? "100%" : "0%",
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