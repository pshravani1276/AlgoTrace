import {
  Search,
  ArrowUpDown,
  Network,
  GitBranch,
  ChevronRight,
} from "lucide-react";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface Category {
  title: string;
  icon: React.ReactNode;
  algorithms: string[];
}

const categories: Category[] = [
  {
    title: "Searching",
    icon: <Search size={26} />,
    algorithms: [
      "Linear Search",
      "Binary Search",
      "Jump Search",
    ],
  },

  {
    title: "Sorting",
    icon: <ArrowUpDown size={26} />,
    algorithms: [
      "Bubble Sort",
      "Merge Sort",
      "Quick Sort",
      "Insertion Sort",
      "Radix Sort",
    ],
  },

  {
    title: "Graph",
    icon: <Network size={26} />,
    algorithms: [
      "BFS Traversal",
      "DFS Traversal",
      "Dijkstra Algorithm",
    ],
  },

  {
    title: "Trees",
    icon: <GitBranch size={26} />,
    algorithms: [
      "Binary Tree",
      "Binary Search Tree",
      "AVL Tree",
    ],
  },
];

export default function CategoriesSection() {
  const [selected, setSelected] = useState<string | null>(null);

  const navigate = useNavigate();

  /*
   * =====================================================
   * CATEGORY CLICK
   * =====================================================
   *
   * Sorting category itself opens Merge Sort directly.
   *
   * Other categories continue to expand normally.
   */
  const handleCategoryClick = (title: string) => {
    if (title === "Sorting") {
      navigate("/merge-sort");
      return;
    }

    setSelected((current) =>
      current === title ? null : title
    );
  };

  /*
   * =====================================================
   * ALGORITHM CLICK
   * =====================================================
   *
   * IMPORTANT:
   *
   * The COMPLETE algorithm card is the clickable area.
   *
   * There is no separate Open button required.
   *
   * Example:
   *
   * Click anywhere on "Bubble Sort"
   *             ↓
   * /bubble-sort
   *
   * Click anywhere on "Merge Sort"
   *             ↓
   * /merge-sort
   */
  const handleAlgorithmClick = (algorithm: string) => {
    switch (algorithm) {
      case "Bubble Sort":
        navigate("/bubble-sort");
        break;

      case "Merge Sort":
        navigate("/merge-sort");
        break;

      case "Quick Sort":
        navigate("/quick-sort");
        break;

      case "Insertion Sort":
        navigate("/insertion-sort");
        break;

      case "Radix Sort":
        navigate("/radix-sort");
        break;

      case "Linear Search":
        navigate("/linear-search");
        break;

      case "Binary Search":
        navigate("/binary-search");
        break;

      case "Jump Search":
        navigate("/jump-search");
        break;

      case "BFS Traversal":
        navigate("/bfs");
        break;

      case "DFS Traversal":
        navigate("/dfs");
        break;

      case "Dijkstra Algorithm":
        navigate("/dijkstra");
        break;

      case "Binary Tree":
        navigate("/binary-tree");
        break;

      case "Binary Search Tree":
        navigate("/binary-search-tree");
        break;

      case "AVL Tree":
        navigate("/avl-tree");
        break;

      default:
        break;
    }
  };

  return (
    <section className="relative">
      {/* =====================================================
          HEADING
      ====================================================== */}

      <div className="mb-8">
        <h2 className="text-3xl font-extrabold text-white">
          Explore Algorithm Categories
        </h2>

        <p className="mt-2 text-slate-400">
          Choose a category and start learning algorithms visually.
        </p>
      </div>

      {/* =====================================================
          CATEGORY CARDS
      ====================================================== */}

      <div
        className="
          grid
          gap-6
          md:grid-cols-2
          lg:grid-cols-4
        "
      >
        {categories.map((category) => {
          const isSelected =
            selected === category.title;

          return (
            <button
              key={category.title}
              type="button"
              onClick={() =>
                handleCategoryClick(category.title)
              }
              className={`
                group
                relative
                overflow-hidden
                rounded-3xl
                border
                p-6
                text-left
                transition-all
                duration-300
                cursor-pointer
                ${
                  isSelected
                    ? "border-cyan-400 bg-cyan-500/[0.08] shadow-lg shadow-cyan-500/10"
                    : "border-slate-800 bg-slate-900 hover:-translate-y-1 hover:border-cyan-500/50"
                }
              `}
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
                  bg-cyan-500/10
                  blur-3xl
                  transition-all
                  duration-500
                  group-hover:bg-cyan-500/20
                "
              />

              {/* Icon */}

              <div
                className="
                  relative
                  mb-5
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-2xl
                  border
                  border-cyan-400/20
                  bg-cyan-400/10
                  text-cyan-400
                  transition-all
                  duration-300
                  group-hover:scale-110
                  group-hover:border-cyan-400/40
                  group-hover:bg-cyan-400/15
                "
              >
                {category.icon}
              </div>

              {/* Title */}

              <h3
                className="
                  relative
                  text-xl
                  font-bold
                  text-white
                "
              >
                {category.title}
              </h3>

              {/* Count */}

              <p
                className="
                  relative
                  mt-2
                  text-sm
                  text-slate-500
                "
              >
                {category.algorithms.length} Algorithms
              </p>

              {/* Explore */}

              <div
                className="
                  relative
                  mt-5
                  flex
                  items-center
                  gap-2
                  text-xs
                  font-semibold
                  uppercase
                  tracking-wider
                  text-cyan-400
                "
              >
                {category.title === "Sorting"
                  ? "Open Visualization"
                  : isSelected
                    ? "Close"
                    : "Explore"}

                <ChevronRight
                  size={15}
                  className={`
                    transition-transform
                    duration-300
                    ${
                      isSelected
                        ? "rotate-90"
                        : "group-hover:translate-x-1"
                    }
                  `}
                />
              </div>
            </button>
          );
        })}
      </div>

      {/* =====================================================
          SELECTED CATEGORY
      ====================================================== */}

      {selected && (
        <div
          className="
            mt-8
            rounded-3xl
            border
            border-slate-800
            bg-slate-900
            p-6
            shadow-xl
            animate-in
            fade-in
            slide-in-from-top-3
            duration-300
          "
        >
          {/* Header */}

          <div className="mb-5">
            <h3
              className="
                text-xl
                font-bold
                text-white
              "
            >
              {selected} Algorithms
            </h3>

            <p
              className="
                mt-1
                text-sm
                text-slate-500
              "
            >
              Click an algorithm to open its visualizer.
            </p>
          </div>

          {/* =====================================================
              ALGORITHM CARDS
          ====================================================== */}

          <div
            className="
              grid
              gap-3
              sm:grid-cols-2
              lg:grid-cols-3
            "
          >
            {categories
              .find(
                (item) =>
                  item.title === selected
              )
              ?.algorithms.map((algorithm) => (
                <button
                  key={algorithm}
                  type="button"
                  onClick={() =>
                    handleAlgorithmClick(algorithm)
                  }
                  className="
                    group
                    relative
                    flex
                    min-h-[64px]
                    w-full
                    cursor-pointer
                    items-center
                    justify-between
                    rounded-xl
                    border
                    border-slate-700
                    bg-slate-950
                    p-4
                    text-left
                    transition-all
                    duration-300
                    hover:-translate-y-0.5
                    hover:border-cyan-400/50
                    hover:bg-cyan-500/[0.04]
                    hover:shadow-[0_0_20px_rgba(34,211,238,0.08)]
                    focus:outline-none
                    focus:ring-2
                    focus:ring-cyan-400/30
                  "
                >
                  {/* Algorithm name */}

                  <span
                    className="
                      font-medium
                      text-slate-300
                      transition-colors
                      group-hover:text-cyan-300
                    "
                  >
                    {algorithm}
                  </span>

                  {/* Arrow */}

                  <span
                    className="
                      flex
                      h-7
                      w-7
                      shrink-0
                      items-center
                      justify-center
                      rounded-lg
                      border
                      border-slate-800
                      bg-slate-900
                      transition-all
                      duration-300
                      group-hover:border-cyan-400/30
                      group-hover:bg-cyan-400/10
                      group-hover:text-cyan-300
                    "
                  >
                    <ChevronRight
                      size={16}
                      className="
                        text-slate-600
                        transition-all
                        duration-300
                        group-hover:translate-x-0.5
                        group-hover:text-cyan-400
                      "
                    />
                  </span>
                </button>
              ))}
          </div>
        </div>
      )}
    </section>
  );
}