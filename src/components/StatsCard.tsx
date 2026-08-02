interface Props {
  title: string;
  value: string;
  icon: string;
  color: string;
}

export default function StatsCard({
  title,
  value,
  icon,
  color,
}: Props) {
  return (
    <div
      className="
      rounded-2xl
      border
      border-slate-800
      bg-slate-900
      p-6
      hover:border-indigo-500
      transition-all
      duration-300
      hover:-translate-y-1
      "
    >
      <div className="flex items-center justify-between">

        <div>

          <p className="text-slate-400 text-sm">
            {title}
          </p>

          <h2 className="mt-2 text-3xl font-bold text-white">
            {value}
          </h2>

        </div>

        <div
          className={`h-14 w-14 rounded-xl ${color} flex items-center justify-center text-2xl`}
        >
          {icon}
        </div>

      </div>
    </div>
  );
}