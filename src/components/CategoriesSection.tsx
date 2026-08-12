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
   * IMPORTANT:
   * DO NOT navigate to "/sorting".
   *
   * There is no "/sorting" route.
   *
   * Clicking Sorting simply opens the algorithms below.
   */

  const handleCategoryClick = (title: string) => {
    setSelected((current) =>
      current === title ? null : title
    );
  };

  /*
   * =====================================================
   * ALGORITHM CLICK
   * =====================================================
   */

  const handleAlgorithmClick = (algorithm: string) => {
    switch (algorithm) {
      case "Merge Sort":
        navigate("/merge-sort");
        break;

      case "Radix Sort":
        navigate("/radix-sort");
        break;

      /*
       * Keep your existing routes for these algorithms.
       * If their routes already exist in your original
       * App.tsx, they will continue working.
       */

      case "Bubble Sort":
        navigate("/bubble-sort");
        break;

      case "Quick Sort":
        navigate("/quick-sort");
        break;

      case "Insertion Sort":
        navigate("/insertion-sort");
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
                {isSelected ? "Close" : "Explore"}

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
              Select an algorithm to open its visualizer.
            </p>
          </div>

          {/* Algorithm buttons */}

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
                    handleAlgorithmClick(
                      algorithm
                    )
                  }
                  className="
                    group
                    flex
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
                  "
                >
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

                  <ChevronRight
                    size={16}
                    className="
                      text-slate-600
                      transition-all
                      group-hover:translate-x-1
                      group-hover:text-cyan-400
                    "
                  />
                </button>
              ))}
          </div>
        </div>
      )}
    </section>
  );
}