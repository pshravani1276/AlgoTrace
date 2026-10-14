// src/components/Graph/GraphNode.tsx

import type { CSSProperties } from "react";

export type GraphNodeState =
  | "default"
  | "current"
  | "queued"
  | "visited"
  | "checking";

interface GraphNodeProps {
  id: string;
  label: string;
  x: number;
  y: number;
  state?: GraphNodeState;
  size?: number;
  onClick?: (id: string) => void;
}

/* =========================================================
   NODE COLORS
   ========================================================= */

const stateColors: Record<
  GraphNodeState,
  {
    background: string;
    border: string;
    text: string;
    glow: string;
  }
> = {
  default: {
    background: "#111827",
    border: "#64748b",
    text: "#f8fafc",
    glow: "none",
  },

  current: {
    background: "#312e81",
    border: "#818cf8",
    text: "#ffffff",
    glow: "0 0 18px rgba(129, 140, 248, 0.9), 0 0 40px rgba(99, 102, 241, 0.45)",
  },

  queued: {
    background: "#172554",
    border: "#38bdf8",
    text: "#e0f2fe",
    glow: "0 0 15px rgba(56, 189, 248, 0.65)",
  },

  visited: {
    background: "#064e3b",
    border: "#34d399",
    text: "#ecfdf5",
    glow: "0 0 14px rgba(52, 211, 153, 0.55)",
  },

  checking: {
    background: "#422006",
    border: "#fbbf24",
    text: "#fffbeb",
    glow: "0 0 18px rgba(251, 191, 36, 0.85), 0 0 35px rgba(245, 158, 11, 0.4)",
  },
};

/* =========================================================
   GRAPH NODE
   ========================================================= */

export default function GraphNode({
  id,
  label,
  x,
  y,
  state = "default",
  size = 62,
  onClick,
}: GraphNodeProps) {
  const colors = stateColors[state];

  const nodeStyle: CSSProperties = {
    position: "absolute",

    left: x,
    top: y,

    width: size,
    height: size,

    transform: "translate(-50%, -50%)",

    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    borderRadius: "50%",

    background: colors.background,

    border: `2px solid ${colors.border}`,

    color: colors.text,

    fontSize: size * 0.32,

    fontWeight: 800,

    letterSpacing: "0.5px",

    boxShadow: colors.glow,

    transition:
      "left 300ms ease, top 300ms ease, background 250ms ease, border 250ms ease, box-shadow 250ms ease, transform 250ms ease",

    cursor: onClick ? "pointer" : "default",

    userSelect: "none",

    zIndex: state === "current" || state === "checking" ? 20 : 10,
  };

  const handleClick = () => {
    if (onClick) {
      onClick(id);
    }
  };

  return (
    <>
      <style>
        {`
          @keyframes bfsNodePulse {
            0% {
              transform: translate(-50%, -50%) scale(1);
            }

            50% {
              transform: translate(-50%, -50%) scale(1.14);
            }

            100% {
              transform: translate(-50%, -50%) scale(1);
            }
          }

          @keyframes bfsNodeRing {
            0% {
              transform: translate(-50%, -50%) scale(0.85);
              opacity: 0.8;
            }

            100% {
              transform: translate(-50%, -50%) scale(1.55);
              opacity: 0;
            }
          }

          .graph-node-current {
            animation: bfsNodePulse 900ms ease-in-out infinite;
          }

          .graph-node-checking {
            animation: bfsNodePulse 650ms ease-in-out infinite;
          }

          .graph-node-wrapper:hover .graph-node-main {
            transform: translate(-50%, -50%) scale(1.08);
          }
        `}
      </style>

      <div
        className="graph-node-wrapper"
        style={{
          position: "absolute",
          left: x,
          top: y,
          width: size,
          height: size,
          transform: "translate(-50%, -50%)",
          zIndex:
            state === "current" || state === "checking" ? 30 : 10,
        }}
      >
        {/* =================================================
            OUTER ANIMATION RING
            ================================================= */}

        {(state === "current" || state === "checking") && (
          <div
            style={{
              position: "absolute",

              left: "50%",
              top: "50%",

              width: size,
              height: size,

              borderRadius: "50%",

              border: `2px solid ${colors.border}`,

              animation: "bfsNodeRing 1.2s ease-out infinite",

              pointerEvents: "none",
            }}
          />
        )}

        {/* =================================================
            MAIN NODE
            ================================================= */}

        <div
          className={
            state === "current"
              ? "graph-node-main graph-node-current"
              : state === "checking"
                ? "graph-node-main graph-node-checking"
                : "graph-node-main"
          }
          style={nodeStyle}
          onClick={handleClick}
          role={onClick ? "button" : undefined}
          aria-label={`Graph node ${label}`}
        >
          {label}
        </div>

        {/* =================================================
            STATE BADGE
            ================================================= */}

        {state !== "default" && (
          <div
            style={{
              position: "absolute",

              right: -8,
              top: -8,

              minWidth: 20,
              height: 20,

              padding: "0 5px",

              display: "flex",
              alignItems: "center",
              justifyContent: "center",

              borderRadius: 10,

              background: colors.border,

              color: "#020617",

              fontSize: 9,

              fontWeight: 900,

              textTransform: "uppercase",

              letterSpacing: "0.4px",

              boxShadow: `0 0 10px ${colors.border}`,

              zIndex: 40,

              pointerEvents: "none",
            }}
          >
            {state === "current"
              ? "NOW"
              : state === "queued"
                ? "Q"
                : state === "visited"
                  ? "✓"
                  : "?"}
          </div>
        )}
      </div>
    </>
  );
}