export interface SearchItem {
  name: string;
  category: string;
  description: string;
  path: string;
  keywords: string[];
}

export const searchCatalog: SearchItem[] = [
  {
    name: "Bubble Sort",
    category: "Sorting",
    description: "Sort values by comparing adjacent items.",
    path: "/sorting/bubble-sort",
    keywords: ["bubble", "adjacent", "swap", "comparison"],
  },
  {
    name: "Merge Sort",
    category: "Sorting",
    description: "A divide-and-conquer sorting visualization.",
    path: "/sorting/merge-sort",
    keywords: ["merge", "divide", "conquer", "recursion"],
  },
  {
    name: "Quick Sort",
    category: "Sorting",
    description: "Sort values by partitioning around a pivot.",
    path: "/sorting/quick-sort",
    keywords: ["quick", "pivot", "partition"],
  },
  {
    name: "Heap Sort",
    category: "Sorting",
    description: "Sort values using a binary heap.",
    path: "/sorting/heap-sort",
    keywords: ["heap", "binary heap"],
  },
  {
    name: "Insertion Sort",
    category: "Sorting",
    description: "Build a sorted section one item at a time.",
    path: "/sorting/insertion-sort",
    keywords: ["insertion", "insert"],
  },
  {
    name: "Selection Sort",
    category: "Sorting",
    description: "Repeatedly select the smallest remaining value.",
    path: "/sorting/selection-sort",
    keywords: ["selection", "minimum", "min"],
  },
  {
    name: "Binary Search",
    category: "Searching",
    description: "Find a value by halving a sorted search range.",
    path: "/searching/binary-search",
    keywords: ["binary", "half", "sorted", "logarithmic"],
  },
  {
    name: "Linear Search",
    category: "Searching",
    description: "Check each item in order until the target is found.",
    path: "/searching/linear-search",
    keywords: ["linear", "sequential", "target"],
  },
  {
    name: "Jump Search",
    category: "Searching",
    description: "Search a sorted list using block jumps.",
    path: "/searching/jump-search",
    keywords: ["jump", "blocks"],
  },
  {
    name: "Interpolation Search",
    category: "Searching",
    description: "Estimate a target position in a sorted list.",
    path: "/searching/interpolation-search",
    keywords: ["interpolation", "estimate", "position"],
  },
  {
    name: "Exponential Search",
    category: "Searching",
    description: "Find a range exponentially, then narrow the search.",
    path: "/searching/exponential-search",
    keywords: ["exponential", "range"],
  },
  {
    name: "Fibonacci Search",
    category: "Searching",
    description: "Narrow a sorted search using Fibonacci offsets.",
    path: "/searching/fibonacci-search",
    keywords: ["fibonacci", "sequence"],
  },
  {
    name: "Hash Search",
    category: "Searching",
    description: "Find a value in a hash table with collision probing.",
    path: "/searching/hash-search",
    keywords: ["hash", "hashing", "collision", "probing"],
  },
  {
    name: "Breadth First Search (BFS)",
    category: "Graph",
    description: "Explore a graph level by level using a queue.",
    path: "/graph/bfs",
    keywords: ["breadth", "first", "queue", "traversal"],
  },
  {
    name: "Sorting Algorithms",
    category: "Category",
    description: "Browse the available sorting visualizations.",
    path: "/sorting",
    keywords: ["sort", "sorting", "order"],
  },
  {
    name: "Searching Algorithms",
    category: "Category",
    description: "Browse the available searching visualizations.",
    path: "/searching",
    keywords: ["search", "searching", "find", "lookup"],
  },
  {
    name: "Graph Algorithms",
    category: "Category",
    description: "Explore graph traversal and related topics.",
    path: "/graph",
    keywords: ["graph", "graphs", "network"],
  },
];

function normalizeSearchText(value: string) {
  return value
    .normalize("NFKD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function searchAlgorithms(query: string): SearchItem[] {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) {
    return [];
  }

  const terms = normalizedQuery.split(/\s+/);

  return searchCatalog
    .map((item, index) => {
      const searchableText = normalizeSearchText(
        [item.name, item.category, item.description, ...item.keywords].join(" "),
      );
      const name = normalizeSearchText(item.name);
      const category = normalizeSearchText(item.category);
      const score =
        name === normalizedQuery
          ? 100
          : name.startsWith(normalizedQuery)
            ? 70
            : terms.every((term) => searchableText.includes(term))
              ? 40 + (category === normalizedQuery ? 10 : 0)
              : 0;
      return { item, index, score };
    })
    .filter((result) => result.score > 0)
    .sort((left, right) => right.score - left.score || left.index - right.index)
    .slice(0, 6)
    .map(({ item }) => item);
}
