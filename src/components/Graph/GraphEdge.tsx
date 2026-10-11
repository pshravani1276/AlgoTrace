// src/components/Graph/GraphEdge.tsx

import type { CSSProperties } from "react";

interface GraphEdgeProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;

  id?: string;

  active?: boolean;

  visited?: boolean;

  weight?: number;

  directed?: boolean;
}

/* =========================================================
   GRAPH EDGE
   ========================================================= */

export default function GraphEdge({
  x1,
  y1,
  x2,
  y2,
  id = "",
  active = false,
  visited = false,
  weight,
  directed = false,
}: GraphEdgeProps) {
  /*
   * Calculate line geometry.
   */

  const dx = x2 - x1;
  const dy = y2 - y1;

  const length = Math.sqrt(dx * dx + dy * dy);

  const angle = Math.atan2(dy, dx) * (180 / Math.PI);

  /*
   * Colors are intentionally controlled by state.
   */

  const edgeColor = active
    ? "#fbbf24"
    : visited
      ? "#34d399"
      : "#475569";

  const glow = active
    ? "0 0 10px rgba(251,191,36,0.9)"
    : visited
      ? "0 0 8px rgba(52,211,153,0.45)"
      : "none";

  const edgeStyle: CSSProperties = {
    position: "absolute",

    left: x1,
    top: y1,

    width: length,

    height: active ? 4 : 2,

    transform: `rotate(${angle}deg)`,

    transformOrigin: "0 50%",

    background: edgeColor,

    borderRadius: 10,

    boxShadow: glow,

    transition:
      "background 250ms ease, height 250ms ease, box-shadow 250ms ease",

    zIndex: active ? 5 : 1,

    pointerEvents: "none",
  };

  /*
   * Arrow for directed graphs.
   */

  const arrowStyle: CSSProperties = {
    position: "absolute",

    left: length - 7,
    top: -5,

    width: 0,
    height: 0,

    borderTop: "7px solid transparent",
    borderBottom: "7px solid transparent",
    borderLeft: `10px solid ${edgeColor}`,

    filter: active
      ? "drop-shadow(0 0 5px rgba(251,191,36,0.9))"
      : "none",

    transition:
      "border-left-color 250ms ease, filter 250ms ease",

    pointerEvents: "none",
  };

  return (
    <>
      <style>
        {`
          @keyframes graphEdgeFlow {
            0% {
              transform: translateX(-20px);
              opacity: 0;
            }

            20% {
              opacity: 1;
            }

            80% {
              opacity: 1;
            }

            100% {
              transform: translateX(20px);
              opacity: 0;
            }
          }

          @keyframes graphEdgePulse {
            0% {
              opacity: 0.55;
            }

            50% {
              opacity: 1;
            }

            100% {
              opacity: 0.55;
            }
          }

          .graph-edge-active {
            animation: graphEdgePulse 700ms ease-in-out infinite;
          }

          .graph-edge-particle {
            animation: graphEdgeFlow 850ms linear infinite;
          }
        `}
      </style>

      {/* =================================================
          EDGE
          ================================================= */}

      <div
        className={active ? "graph-edge-active" : ""}
        style={edgeStyle}
        data-edge-id={id}
      >
        {/* ===============================================
            MOVING PARTICLES
            =============================================== */}

        {active && (
          <>
            <span
              className="graph-edge-particle"
              style={{
                position: "absolute",

                left: "30%",

                top: "50%",

                width: 6,
                height: 6,

                transform: "translate(-50%, -50%)",

                borderRadius: "50%",

                background: "#fef3c7",

                boxShadow:
                  "0 0 8px #fbbf24, 0 0 15px #f59e0b",

                pointerEvents: "none",
              }}
            />

            <span
              className="graph-edge-particle"
              style={{
                position: "absolute",

                left: "65%",

                top: "50%",

                width: 5,
                height: 5,

                transform: "translate(-50%, -50%)",

                borderRadius: "50%",

                background: "#ffffff",

                boxShadow:
                  "0 0 7px #fbbf24",

                animationDelay: "250ms",

                pointerEvents: "none",
              }}
            />
          </>
        )}

        {/* ===============================================
            DIRECTED ARROW
            =============================================== */}

        {directed && <div style={arrowStyle} />}

        {/* ===============================================
            EDGE WEIGHT
            =============================================== */}

        {weight !== undefined && (
          <div
            style={{
              position: "absolute",

              left: "50%",
              top: -22,

              transform: "translateX(-50%)",

              minWidth: 24,
              height: 20,

              padding: "0 6px",

              display: "flex",
              alignItems: "center",
              justifyContent: "center",

              borderRadius: 7,

              background: active
                ? "rgba(251,191,36,0.16)"
                : "rgba(15,23,42,0.9)",

              border: `1px solid ${
                active ? "#fbbf24" : "#334155"
              }`,

              color: active ? "#fef3c7" : "#cbd5e1",

              fontSize: 11,

              fontWeight: 800,

              boxShadow: active
                ? "0 0 10px rgba(251,191,36,0.35)"
                : "none",

              transition:
                "background 250ms ease, border 250ms ease, color 250ms ease",

              pointerEvents: "none",
            }}
          >
            {weight}
          </div>
        )}
      </div>
    </>
  );
}