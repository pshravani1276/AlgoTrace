import {
  Timer,
  ArrowLeftRight,
  RefreshCw,
  HardDrive,
  Activity,
  Database,
} from "lucide-react";

type PerformancePanelProps = {
  executionTime: number;
  comparisons: number;
  swaps: number;
  memoryUsage: string;
  timeComplexity: string;
  spaceComplexity: string;
};

export default function PerformancePanel({
  executionTime,
  comparisons,
  swaps,
  memoryUsage,
  timeComplexity,
  spaceComplexity,
}: PerformancePanelProps) {
  const metrics = [
    {
      title: "Execution Time",
      value: `${executionTime.toFixed(2)} ms`,
      icon: <Timer size={20} />,
      color: "text-cyan-400",
    },
    {
      title: "Comparisons",
      value: comparisons,
      icon: <ArrowLeftRight size={20} />,
      color: "text-yellow-400",
    },
    {
      title: "Swaps",
      value: swaps,
      icon: <RefreshCw size={20} />,
      color: "text-pink-400",
    },
    {
      title: "Memory",
      value: memoryUsage,
      icon: <HardDrive size={20} />,
      color: "text-green-400",
    },
    {
      title: "Time Complexity",
      value: timeComplexity,
      icon: <Activity size={20} />,
      color: "text-violet-400",
    },
    {
      title: "Space Complexity",
      value: spaceComplexity,
      icon: <Database size={20} />,
      color: "text-orange-400",
    },
  ];

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/80 backdrop-blur-md p-6">

      <div className="mb-6">

        <h2 className="text-2xl font-bold text-white">
          Performance Metrics
        </h2>

        <p className="mt-2 text-slate-400">
          Live statistics during algorithm execution.
        </p>

      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

        {metrics.map((metric) => (
          <div
            key={metric.title}
            className="
              rounded-2xl
              border
              border-slate-700
              bg-slate-800/60
              p-5
              transition-all
              duration-300
              hover:border-cyan-500
              hover:shadow-[0_0_20px_rgba(34,211,238,0.15)]
            "
          >
            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-slate-400">
                  {metric.title}
                </p>

                <h3 className="mt-2 text-xl font-bold text-white">
                  {metric.value}
                </h3>
              </div>

              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 ${metric.color}`}
              >
                {metric.icon}
              </div>

            </div>
          </div>
        ))}

      </div>
    </div>
  );
}