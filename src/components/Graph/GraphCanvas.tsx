import React from "react";

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

interface GraphCanvasProps {
  nodes?: GraphNode[];
  edges?: GraphEdge[];
  currentNode?: string | null;
  activeEdge?: string | null;
  visited?: string[];
  step?: any;
  controls?: React.ReactNode;
}

export default function GraphCanvas({
  nodes = [],
  edges = [],
  currentNode = null,
  activeEdge = null,
  visited = [],
  step,
  controls,
}: GraphCanvasProps) {
  /* =========================================================
     COMPATIBILITY
     ========================================================= */

  const actualNodes: GraphNode[] =
    nodes.length > 0
      ? nodes
      : step?.nodes ??
        step?.visibleNodes ??
        [];

  const actualEdges: GraphEdge[] =
    edges.length > 0
      ? edges
      : step?.edges ??
        step?.visibleEdges ??
        [];

  const actualCurrentNode =
    currentNode ??
    step?.currentNode ??
    null;

  const actualActiveEdge =
    activeEdge ??
    step?.activeEdge ??
    null;

  const actualVisited: string[] =
    visited.length > 0
      ? visited
      : step?.visited ??
        [];

  /* =========================================================
     EMPTY STATE
     ========================================================= */

  if (actualNodes.length === 0) {
    return (
      <div className="relative flex h-full min-h-[420px] w-full items-center justify-center overflow-hidden rounded-2xl border border-slate-800 bg-[#050b18]">

        {/* BACKGROUND GRID */}

        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "linear-gradient(rgba(71,85,105,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(71,85,105,0.12) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        {/* CENTER MESSAGE */}

        <div className="relative z-10 text-center">

          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-500/30 bg-cyan-500/5 shadow-[0_0_35px_rgba(6,182,212,0.12)]">

            <div className="h-4 w-4 animate-pulse rounded-full bg-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.9)]" />

          </div>

          <h3 className="text-lg font-semibold text-slate-200">
            Graph Ready
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            Press{" "}
            <span className="text-cyan-400">
              Next
            </span>{" "}
            to create the first node
          </p>

        </div>

        {/* CONTROLS */}

        {controls && (
          <div className="absolute bottom-3 left-1/2 z-30 -translate-x-1/2">
            {controls}
          </div>
        )}

      </div>
    );
  }

  /* =========================================================
     NODE LOOKUP
     ========================================================= */

  const nodeMap = new Map(
    actualNodes.map((node) => [
      node.id,
      node,
    ]),
  );

  /* =========================================================
     ACTIVE EDGE
     ========================================================= */

  const isEdgeActive = (
    edge: GraphEdge,
  ) => {
    if (!actualActiveEdge) {
      return false;
    }

    return (
      actualActiveEdge ===
        `${edge.from}-${edge.to}` ||
      actualActiveEdge ===
        `${edge.to}-${edge.from}`
    );
  };

  /* =========================================================
     NODE STATE
     ========================================================= */

  const getNodeState = (
    node: GraphNode,
  ) => {
    const isCurrent =
      actualCurrentNode === node.id;

    const isVisited =
      actualVisited.includes(node.id);

    if (isCurrent) {
      return {
        fill: "#083344",
        stroke: "#22d3ee",
        text: "#67e8f9",
        glow: "rgba(34,211,238,0.85)",
      };
    }

    if (isVisited) {
      return {
        fill: "#052e2b",
        stroke: "#10b981",
        text: "#6ee7b7",
        glow: "rgba(16,185,129,0.65)",
      };
    }

    return {
      fill: "#111c31",
      stroke: "#64748b",
      text: "#e2e8f0",
      glow: "rgba(71,85,105,0.25)",
    };
  };

  /* =========================================================
     MAIN CANVAS
     ========================================================= */

  return (
    <div className="relative h-full min-h-[420px] w-full overflow-hidden rounded-2xl border border-slate-800 bg-[#050b18]">

      {/* =====================================================
          BACKGROUND
          ===================================================== */}

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(71,85,105,0.10) 1px, transparent 1px), linear-gradient(90deg, rgba(71,85,105,0.10) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* =====================================================
          TOP HEADER
          ===================================================== */}

      <div className="absolute left-5 top-4 z-20">

        <div className="flex items-center gap-2">

          <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.9)]" />

          <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            BFS Graph Visualization
          </span>

        </div>

        <div className="mt-1 text-[10px] text-slate-600">
          Breadth First Search
        </div>

      </div>

      {/* =====================================================
          GRAPH AREA
          IMPORTANT:
          Coordinates are 0-660 x 0-440
          ===================================================== */}

      <svg
        viewBox="0 0 660 440"
        preserveAspectRatio="xMidYMid meet"
        className="absolute inset-0 h-full w-full"
      >

        {/* ===================================================
            EDGES
            =================================================== */}

        {actualEdges.map(
          (edge, index) => {
            const from =
              nodeMap.get(edge.from);

            const to =
              nodeMap.get(edge.to);

            if (!from || !to) {
              return null;
            }

            const active =
              isEdgeActive(edge);

            return (
              <g
                key={`${edge.from}-${edge.to}-${index}`}
              >

                {/* ACTIVE EDGE GLOW */}

                {active && (
                  <>
                    <line
                      x1={from.x}
                      y1={from.y}
                      x2={to.x}
                      y2={to.y}
                      stroke="#22d3ee"
                      strokeWidth="10"
                      opacity="0.08"
                      strokeLinecap="round"
                    />

                    <line
                      x1={from.x}
                      y1={from.y}
                      x2={to.x}
                      y2={to.y}
                      stroke="#22d3ee"
                      strokeWidth="5"
                      opacity="0.18"
                      strokeLinecap="round"
                    />
                  </>
                )}

                {/* NORMAL EDGE */}

                <line
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                  stroke={
                    active
                      ? "#22d3ee"
                      : "#475569"
                  }
                  strokeWidth={
                    active
                      ? "3"
                      : "2"
                  }
                  strokeLinecap="round"
                  className={
                    active
                      ? "animate-pulse"
                      : ""
                  }
                />

                {/* MOVING PARTICLE */}

                {active && (
                  <circle
                    r="5"
                    fill="#67e8f9"
                    style={{
                      filter:
                        "drop-shadow(0 0 8px rgba(34,211,238,0.95))",
                    }}
                  >
                    <animateMotion
                      dur="0.8s"
                      repeatCount="indefinite"
                      path={`M ${from.x},${from.y} L ${to.x},${to.y}`}
                    />
                  </circle>
                )}

              </g>
            );
          },
        )}

        {/* ===================================================
            NODES
            =================================================== */}

        {actualNodes.map(
          (node) => {
            const state =
              getNodeState(node);

            const isCurrent =
              actualCurrentNode === node.id;

            const isVisited =
              actualVisited.includes(node.id);

            return (
              <g
                key={node.id}
                style={{
                  transition:
                    "all 0.45s ease",
                }}
              >

                {/* OUTER CURRENT RING */}

                {isCurrent && (
                  <>
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r="31"
                      fill="none"
                      stroke="#22d3ee"
                      strokeWidth="3"
                      opacity="0.18"
                    />

                    <circle
                      cx={node.x}
                      cy={node.y}
                      r="25"
                      fill="none"
                      stroke="#22d3ee"
                      strokeWidth="2"
                      opacity="0.3"
                      className="animate-ping"
                    />
                  </>
                )}

                {/* VISITED RING */}

                {isVisited && !isCurrent && (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="25"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2"
                    opacity="0.25"
                  />
                )}

                {/* NODE GLOW */}

                <circle
                  cx={node.x}
                  cy={node.y}
                  r={isCurrent ? 23 : 20}
                  fill="none"
                  stroke={state.stroke}
                  strokeWidth="4"
                  opacity={
                    isCurrent
                      ? 0.35
                      : 0.15
                  }
                  style={{
                    filter:
                      `drop-shadow(0 0 ${
                        isCurrent
                          ? 14
                          : 5
                      }px ${state.glow})`,
                  }}
                />

                {/* MAIN NODE */}

                <circle
                  cx={node.x}
                  cy={node.y}
                  r="19"
                  fill={state.fill}
                  stroke={state.stroke}
                  strokeWidth="3"
                  style={{
                    filter:
                      `drop-shadow(0 0 ${
                        isCurrent
                          ? 12
                          : 5
                      }px ${state.glow})`,
                  }}
                />

                {/* INNER NODE */}

                <circle
                  cx={node.x}
                  cy={node.y}
                  r="14"
                  fill="none"
                  stroke={state.stroke}
                  strokeWidth="1"
                  opacity="0.25"
                />

                {/* LABEL */}

                <text
                  x={node.x}
                  y={node.y + 7}
                  textAnchor="middle"
                  fontSize="22"
                  fontWeight="800"
                  fill={state.text}
                  style={{
                    userSelect: "none",
                  }}
                >
                  {node.label}
                </text>

                {/* VISITED LABEL */}

                {isVisited && (
                  <text
                    x={node.x}
                    y={node.y + 43}
                    textAnchor="middle"
                    fontSize="10"
                    fontWeight="700"
                    letterSpacing="1"
                    fill="#10b981"
                    style={{
                      userSelect: "none",
                    }}
                  >
                    VISITED
                  </text>
                )}

                {/* CURRENT LABEL */}

                {isCurrent && (
                  <text
                    x={node.x}
                    y={node.y - 37}
                    textAnchor="middle"
                    fontSize="10"
                    fontWeight="800"
                    letterSpacing="1"
                    fill="#22d3ee"
                    style={{
                      userSelect: "none",
                    }}
                  >
                    CURRENT
                  </text>
                )}

              </g>
            );
          },
        )}

      </svg>

      {/* =====================================================
          STEP INDICATOR
          ===================================================== */}

      <div className="absolute right-4 top-4 z-20 rounded-lg border border-slate-800 bg-[#070e1d]/90 px-3 py-2 backdrop-blur-md">

        <div className="text-[9px] uppercase tracking-wider text-slate-600">
          BFS State
        </div>

        <div className="mt-0.5 text-xs font-semibold text-cyan-400">
          {actualCurrentNode
            ? `Processing ${actualCurrentNode}`
            : actualVisited.length > 0
              ? "Traversal Active"
              : "Ready"}
        </div>

      </div>

      {/* =====================================================
          LEGEND
          ===================================================== */}

      <div className="absolute bottom-16 left-1/2 z-20 -translate-x-1/2">

        <div className="flex items-center gap-4 rounded-xl border border-slate-800 bg-[#070e1d]/95 px-4 py-2 text-[10px] shadow-lg backdrop-blur-md">

          <div className="flex items-center gap-1.5 text-slate-500">
            <span className="h-2 w-2 rounded-full border border-slate-500 bg-slate-800" />
            Unvisited
          </div>

          <div className="flex items-center gap-1.5 text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Visited
          </div>

          <div className="flex items-center gap-1.5 text-cyan-400">
            <span className="h-2 w-2 rounded-full bg-cyan-400" />
            Current
          </div>

          <div className="flex items-center gap-1.5 text-cyan-300">
            <span className="h-2 w-2 rounded-full bg-cyan-300" />
            Active Edge
          </div>

        </div>

      </div>

      {/* =====================================================
          CONTROLS
          REMAINS INSIDE VISUALIZATION
          ===================================================== */}

      {controls && (
        <div
          className="absolute bottom-3 left-1/2 z-30 -translate-x-1/2"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "max-content",
          }}
        >
          {controls}
        </div>
      )}

    </div>
  );
}