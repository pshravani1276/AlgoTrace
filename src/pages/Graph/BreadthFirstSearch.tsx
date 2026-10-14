import { useMemo, useState } from "react";

import GraphCanvas from "../../components/Graph/GraphCanvas";
import GraphCodePanel from "../../components/Graph/GraphCodePanel";
import GraphControls from "../../components/Graph/GraphControls";
import GraphExplanation from "../../components/Graph/GraphExplanation";
import GraphVariables from "../../components/Graph/GraphVariables";

/* =========================================================
   TYPES
   ========================================================= */

interface GraphNode {
  id: string;
  label: string;
  x: number;
  y: number;
}

interface GraphEdge {
  from: string;
  to: string;
}

interface BFSStep {
  currentNode: string | null;
  queue: string[];
  visited: string[];
  traversal: string[];
  activeEdge: string | null;
  checkingNodes: string[];
  createdNodes: string[];
  explanation: string;
  codeLine: number;
  completed: boolean;
}

/* =========================================================
   GRAPH NODES
   ========================================================= */

const GRAPH_NODES: GraphNode[] = [
  {
    id: "A",
    label: "A",
    x: 330,
    y: 70,
  },
  {
    id: "B",
    label: "B",
    x: 180,
    y: 180,
  },
  {
    id: "C",
    label: "C",
    x: 480,
    y: 180,
  },
  {
    id: "D",
    label: "D",
    x: 100,
    y: 320,
  },
  {
    id: "E",
    label: "E",
    x: 260,
    y: 320,
  },
  {
    id: "F",
    label: "F",
    x: 420,
    y: 320,
  },
  {
    id: "G",
    label: "G",
    x: 580,
    y: 320,
  },
];

/* =========================================================
   GRAPH EDGES
   ========================================================= */

const GRAPH_EDGES: GraphEdge[] = [
  {
    from: "A",
    to: "B",
  },
  {
    from: "A",
    to: "C",
  },
  {
    from: "B",
    to: "D",
  },
  {
    from: "B",
    to: "E",
  },
  {
    from: "C",
    to: "F",
  },
  {
    from: "C",
    to: "G",
  },
];

/* =========================================================
   ADJACENCY LIST
   ========================================================= */

const GRAPH: Record<string, string[]> = {
  A: ["B", "C"],
  B: ["A", "D", "E"],
  C: ["A", "F", "G"],
  D: ["B"],
  E: ["B"],
  F: ["C"],
  G: ["C"],
};

/* =========================================================
   SOURCE CODE
   ========================================================= */

const BFS_CODE = [
  "function BFS(graph, start) {",
  "  const queue = [start];",
  "  const visited = new Set([start]);",
  "",
  "  while (queue.length > 0) {",
  "    const current = queue.shift();",
  "    traversal.push(current);",
  "",
  "    for (const neighbor of graph[current]) {",
  "      if (!visited.has(neighbor)) {",
  "        visited.add(neighbor);",
  "        queue.push(neighbor);",
  "      }",
  "    }",
  "  }",
  "",
  "  return traversal;",
  "}",
];

/* =========================================================
   BFS STEP GENERATOR
   ========================================================= */

function generateBFSSteps(): BFSStep[] {
  const result: BFSStep[] = [];

  const queue: string[] = ["A"];

  const visited = new Set<string>();

  const traversal: string[] = [];

  const createdNodes: string[] = [];

  /* =======================================================
     STEP 0
     ======================================================= */

  result.push({
    currentNode: null,
    queue: ["A"],
    visited: [],
    traversal: [],
    activeEdge: null,
    checkingNodes: [],
    createdNodes: [],
    explanation:
      "BFS is ready. Press Next to create the starting node A.",
    codeLine: 1,
    completed: false,
  });

  /* =======================================================
     CREATE START NODE A
     ======================================================= */

  createdNodes.push("A");

  result.push({
    currentNode: "A",
    queue: [...queue],
    visited: [],
    traversal: [],
    activeEdge: null,
    checkingNodes: [],
    createdNodes: [...createdNodes],
    explanation:
      "Starting node A is created in the graph.",
    codeLine: 1,
    completed: false,
  });

  /* =======================================================
     VISIT A
     ======================================================= */

  visited.add("A");

  result.push({
    currentNode: "A",
    queue: [...queue],
    visited: [...visited],
    traversal: [],
    activeEdge: null,
    checkingNodes: [],
    createdNodes: [...createdNodes],
    explanation:
      "A is marked as visited and placed in the BFS queue.",
    codeLine: 2,
    completed: false,
  });

  /* =======================================================
     BFS
     ======================================================= */

  while (queue.length > 0) {
    const current = queue.shift()!;

    /* -------------------------------------------------------
       PROCESS CURRENT NODE
       ------------------------------------------------------- */

    result.push({
      currentNode: current,
      queue: [...queue],
      visited: [...visited],
      traversal: [...traversal],
      activeEdge: null,
      checkingNodes: [],
      createdNodes: [...createdNodes],
      explanation:
        `Remove ${current} from the front of the queue.`,
      codeLine: 5,
      completed: false,
    });

    /* -------------------------------------------------------
       ADD TO TRAVERSAL
       ------------------------------------------------------- */

    traversal.push(current);

    result.push({
      currentNode: current,
      queue: [...queue],
      visited: [...visited],
      traversal: [...traversal],
      activeEdge: null,
      checkingNodes: [],
      createdNodes: [...createdNodes],
      explanation:
        `${current} is processed and added to the BFS traversal.`,
      codeLine: 6,
      completed: false,
    });

    /* -------------------------------------------------------
       CHECK NEIGHBORS
       ------------------------------------------------------- */

    for (const neighbor of GRAPH[current]) {
      const forward = `${current}-${neighbor}`;
      const backward = `${neighbor}-${current}`;

      const existsForward = GRAPH_EDGES.some(
        (edge) =>
          edge.from === current &&
          edge.to === neighbor,
      );

      const activeEdge = existsForward
        ? forward
        : backward;

      /* -----------------------------------------------------
         CHECK NEIGHBOR
         ----------------------------------------------------- */

      result.push({
        currentNode: current,
        queue: [...queue],
        visited: [...visited],
        traversal: [...traversal],
        activeEdge,
        checkingNodes: [neighbor],
        createdNodes: [...createdNodes],
        explanation:
          `BFS checks the neighbor ${neighbor} of ${current}.`,
        codeLine: 8,
        completed: false,
      });

      /* -----------------------------------------------------
         CREATE NEW NODE
         ----------------------------------------------------- */

      if (!visited.has(neighbor)) {
        /*
         * IMPORTANT:
         *
         * The node is created BEFORE it is visited.
         * This produces the progressive graph-building
         * animation.
         */

        if (!createdNodes.includes(neighbor)) {
          createdNodes.push(neighbor);

          result.push({
            currentNode: current,
            queue: [...queue],
            visited: [...visited],
            traversal: [...traversal],
            activeEdge,
            checkingNodes: [neighbor],
            createdNodes: [...createdNodes],
            explanation:
              `Node ${neighbor} is created and connected to ${current}.`,
            codeLine: 9,
            completed: false,
          });
        }

        /* ---------------------------------------------------
           VISIT NODE
           --------------------------------------------------- */

        visited.add(neighbor);

        result.push({
          currentNode: current,
          queue: [...queue],
          visited: [...visited],
          traversal: [...traversal],
          activeEdge,
          checkingNodes: [neighbor],
          createdNodes: [...createdNodes],
          explanation:
            `${neighbor} is marked as visited.`,
          codeLine: 10,
          completed: false,
        });

        /* ---------------------------------------------------
           ADD TO QUEUE
           --------------------------------------------------- */

        queue.push(neighbor);

        result.push({
          currentNode: current,
          queue: [...queue],
          visited: [...visited],
          traversal: [...traversal],
          activeEdge,
          checkingNodes: [],
          createdNodes: [...createdNodes],
          explanation:
            `${neighbor} is added to the back of the queue.`,
          codeLine: 11,
          completed: false,
        });
      } else {
        /* ---------------------------------------------------
           ALREADY VISITED
           --------------------------------------------------- */

        result.push({
          currentNode: current,
          queue: [...queue],
          visited: [...visited],
          traversal: [...traversal],
          activeEdge,
          checkingNodes: [],
          createdNodes: [...createdNodes],
          explanation:
            `${neighbor} has already been visited, so BFS skips it.`,
          codeLine: 10,
          completed: false,
        });
      }
    }
  }

  /* =======================================================
     COMPLETED
     ======================================================= */

  result.push({
    currentNode: null,
    queue: [],
    visited: [...visited],
    traversal: [...traversal],
    activeEdge: null,
    checkingNodes: [],
    createdNodes: [...createdNodes],
    explanation:
      `BFS completed successfully. Traversal: ${traversal.join(
        " → ",
      )}`,
    codeLine: 16,
    completed: true,
  });

  return result;
}

/* =========================================================
   PAGE
   ========================================================= */

export default function BreadthFirstSearch() {
  const steps = useMemo(
    () => generateBFSSteps(),
    [],
  );

  const [currentStep, setCurrentStep] =
    useState(0);

  const [speed, setSpeed] =
    useState(1);

  const step = steps[currentStep];

  /* =======================================================
     PREVIOUS
     ======================================================= */

  const handlePrevious = () => {
    setCurrentStep((value) =>
      Math.max(value - 1, 0),
    );
  };

  /* =======================================================
     NEXT
     ======================================================= */

  const handleNext = () => {
    setCurrentStep((value) =>
      Math.min(
        value + 1,
        steps.length - 1,
      ),
    );
  };

  /* =======================================================
     RESET
     ======================================================= */

  const handleReset = () => {
    setCurrentStep(0);
  };

  /* =======================================================
     CONTROLS
     ======================================================= */

  const controls = (
    <GraphControls
      currentStep={currentStep}
      totalSteps={steps.length}
      onPrevious={handlePrevious}
      onNext={handleNext}
      onReset={handleReset}
      speed={speed}
      onSpeedChange={setSpeed}
    />
  );

  /* =======================================================
     ONLY SHOW CREATED NODES
     ======================================================= */

  const visibleNodes = useMemo(() => {
    return GRAPH_NODES.filter((node) =>
      step.createdNodes.includes(node.id),
    );
  }, [step.createdNodes]);

  /* =======================================================
     ONLY SHOW EDGES WHOSE BOTH NODES EXIST
     ======================================================= */

  const visibleEdges = useMemo(() => {
    return GRAPH_EDGES.filter(
      (edge) =>
        step.createdNodes.includes(edge.from) &&
        step.createdNodes.includes(edge.to),
    );
  }, [step.createdNodes]);

  /* =======================================================
     MAIN SCREEN
     ======================================================= */

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#020617] text-white">

      {/* ===================================================
          HEADER
          =================================================== */}

      <div className="border-b border-slate-800/80 bg-[#050b18] px-5 py-3">

        <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4">

          <div>

            <div className="flex items-center gap-2">

              <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.9)]" />

              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">
                Graph Algorithm
              </span>

            </div>

            <h1 className="mt-1 text-xl font-bold text-slate-100">
              Breadth-First Search
            </h1>

          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-2 text-right">

            <div className="text-[9px] uppercase tracking-wider text-slate-500">
              Step
            </div>

            <div className="text-sm font-bold text-cyan-400">
              {currentStep} / {steps.length - 1}
            </div>

          </div>

        </div>

      </div>

      {/* ===================================================
          MAIN
          =================================================== */}

      <main className="mx-auto max-w-[1500px] p-4">

        <div className="grid gap-3 lg:grid-cols-[minmax(340px,0.85fr)_minmax(600px,1.4fr)]">

          {/* =================================================
              LEFT SIDE
              ================================================= */}

          <section className="flex min-w-0 flex-col gap-3">

            {/* SOURCE CODE */}

            <div
              className="overflow-hidden rounded-2xl border border-slate-800 bg-[#050b18]"
              style={{
                height: "365px",
              }}
            >

              <GraphCodePanel
                code={BFS_CODE}
                activeLine={step.codeLine}
              />

            </div>

            {/* LIVE VARIABLES */}

            <div
              className="overflow-hidden rounded-2xl border border-slate-800 bg-[#050b18]"
              style={{
                minHeight: "145px",
              }}
            >

              <GraphVariables
                currentNode={step.currentNode}
                queue={step.queue}
                visited={step.visited}
                traversal={step.traversal}
                activeEdge={step.activeEdge}
              />

            </div>

            {/* WHAT'S HAPPENING */}

            <div
              className="overflow-hidden rounded-2xl border border-slate-800 bg-[#050b18]"
              style={{
                minHeight: "125px",
              }}
            >

              <GraphExplanation
                explanation={step.explanation}
                step={currentStep}
                completed={step.completed}
              />

            </div>

          </section>

          {/* =================================================
              RIGHT SIDE
              ================================================= */}

          <section className="min-w-0">

            <div
              className="w-full"
              style={{
                height: "650px",
              }}
            >

              <GraphCanvas
                nodes={visibleNodes}
                edges={visibleEdges}
                currentNode={step.currentNode}
                activeEdge={step.activeEdge}
                visited={step.visited}
                step={step}
                controls={controls}
              />

            </div>

          </section>

        </div>

      </main>

    </div>
  );
}