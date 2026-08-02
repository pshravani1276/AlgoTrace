import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

interface Props {
  title: string;
  icon: React.ReactNode;
  count: number;
  path: string;
}

export default function CategoryCard({
  title,
  icon,
  count,
  path,
}: Props) {
  return (
    <Link
      to={path}
      className="group rounded-2xl border border-slate-800 bg-slate-900 p-6 transition-all duration-300 hover:border-indigo-500 hover:-translate-y-1"
    >
      <div className="flex justify-between items-start">

        <div className="text-indigo-400 text-3xl">
          {icon}
        </div>

        <ChevronRight
          className="text-slate-500 group-hover:text-indigo-400"
          size={18}
        />

      </div>

      <h3 className="mt-6 text-xl font-semibold text-white">
        {title}
      </h3>

      <p className="mt-2 text-slate-400">
        {count} Algorithms
      </p>
    </Link>
  );
}