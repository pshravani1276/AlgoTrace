import { useNavigate } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  BarChart3,
  GitBranch,
  Search,
  Network,
  Layers3,
} from "lucide-react";

interface CategoryCardProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  color?: string;
  path?: string;
}

const defaultIcons: Record<string, LucideIcon> = {
  Sorting: BarChart3,
  Searching: Search,
  Tree: GitBranch,
  Graph: Network,
  "Data Structures": Layers3,
};

export default function CategoryCard({
  title,
  description,
  icon,
  color = "cyan",
  path,
}: CategoryCardProps) {
  const navigate = useNavigate();

  const Icon = icon || defaultIcons[title] || Layers3;

  /*
   * =====================================================
   * CARD CLICK
   * =====================================================
   *
   * The ENTIRE category card is clickable.
   *
   * Sorting -> Merge Sort visualization
   *
   * There is NO separate Open button required.
   */
  const handleClick = () => {
    if (title === "Sorting") {
      navigate("/merge-sort");
      return;
    }

    if (path) {
      navigate(path);
      return;
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="
        group
        relative
        w-full
        overflow-hidden
        rounded-2xl
        border
        border-slate-800
        bg-slate-900/80
        p-5
        text-left
        backdrop-blur-xl
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-cyan-400/40
        hover:bg-slate-900
        hover:shadow-[0_0_35px_rgba(34,211,238,0.12)]
        focus:outline-none
        focus:ring-2
        focus:ring-cyan-400/40
        cursor-pointer
      "
    >
      {/* Glow */}
      <div
        className="
          pointer-events-none
          absolute
          -right-10
          -top-10
          h-32
          w-32
          rounded-full
          bg-cyan-400/5
          blur-3xl
          transition-all
          duration-500
          group-hover:bg-cyan-400/10
        "
      />

      {/* Icon */}
      <div
        className={`
          relative
          flex
          h-12
          w-12
          items-center
          justify-center
          rounded-xl
          border
          border-${color}-400/20
          bg-${color}-400/10
          text-${color}-400
          transition-all
          duration-300
          group-hover:scale-110
        `}
      >
        <Icon size={23} strokeWidth={1.8} />
      </div>

      {/* Content */}
      <div className="relative mt-4">
        <h3
          className="
            text-base
            font-bold
            text-white
            transition-colors
            duration-300
            group-hover:text-cyan-300
          "
        >
          {title}
        </h3>

        <p
          className="
            mt-2
            max-w-sm
            text-xs
            leading-5
            text-slate-500
          "
        >
          {description}
        </p>
      </div>

      {/* Open indicator */}
      <div
        className="
          relative
          mt-5
          flex
          items-center
          justify-between
          border-t
          border-slate-800
          pt-3
        "
      >
        <span
          className="
            text-[9px]
            font-semibold
            uppercase
            tracking-[0.18em]
            text-slate-600
            transition-colors
            group-hover:text-cyan-400
          "
        >
          Open Visualization
        </span>

        <div
          className="
            flex
            h-7
            w-7
            items-center
            justify-center
            rounded-lg
            border
            border-slate-800
            bg-slate-950
            text-slate-500
            transition-all
            duration-300
            group-hover:border-cyan-400/30
            group-hover:bg-cyan-400/10
            group-hover:text-cyan-300
          "
        >
          <ArrowRight size={14} />
        </div>
      </div>
    </button>
  );
}