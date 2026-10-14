// src/components/Graph/GraphExplanation.tsx

interface GraphExplanationProps {
  explanation?: string;
  step?: number;
  completed?: boolean;
}

export default function GraphExplanation({
  explanation = "BFS is ready. Click Next to begin.",
  step = 0,
  completed = false,
}: GraphExplanationProps) {
  return (
    <div
      style={{
        width: "100%",
        boxSizing: "border-box",
        padding: "12px 14px",
        borderRadius: 16,
        background: completed
          ? "rgba(6, 78, 59, 0.22)"
          : "rgba(15, 23, 42, 0.9)",
        border: completed
          ? "1px solid rgba(52, 211, 153, 0.3)"
          : "1px solid rgba(100, 116, 139, 0.25)",
        boxShadow: "0 8px 28px rgba(0, 0, 0, 0.2)",
        transition:
          "background 250ms ease, border-color 250ms ease",
      }}
    >
      {/* HEADER */}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 10,
          marginBottom: 8,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          {/* Animated indicator */}

          <div
            style={{
              position: "relative",
              width: 24,
              height: 24,
              flexShrink: 0,
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 4,
                borderRadius: "50%",
                background: completed
                  ? "#34d399"
                  : "#818cf8",
                boxShadow: completed
                  ? "0 0 10px rgba(52,211,153,0.8)"
                  : "0 0 10px rgba(129,140,248,0.8)",
              }}
            />

            {!completed && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "50%",
                  border: "1px solid rgba(129,140,248,0.4)",
                  animation:
                    "explanationPulse 1.2s ease-out infinite",
                }}
              />
            )}
          </div>

          <span
            style={{
              color: "#f8fafc",
              fontSize: 12,
              fontWeight: 900,
              letterSpacing: "0.02em",
            }}
          >
            What's Happening?
          </span>
        </div>

        {/* STEP */}

        <div
          style={{
            padding: "4px 8px",
            borderRadius: 7,
            background: completed
              ? "rgba(52,211,153,0.12)"
              : "rgba(99,102,241,0.12)",
            border: completed
              ? "1px solid rgba(52,211,153,0.25)"
              : "1px solid rgba(99,102,241,0.2)",
            color: completed
              ? "#6ee7b7"
              : "#a5b4fc",
            fontSize: 9,
            fontWeight: 900,
            whiteSpace: "nowrap",
          }}
        >
          STEP {step + 1}
        </div>
      </div>

      {/* EXPLANATION */}

      <div
        style={{
          padding: "9px 11px",
          borderRadius: 10,
          background: "rgba(2, 6, 23, 0.48)",
          border:
            "1px solid rgba(100, 116, 139, 0.15)",
          color: completed
            ? "#d1fae5"
            : "#cbd5e1",
          fontSize: 11,
          lineHeight: 1.55,
          fontWeight: 600,
        }}
      >
        {explanation}
      </div>

      {/* FOOTER */}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          marginTop: 8,
          color: "#64748b",
          fontSize: 9,
          fontWeight: 700,
        }}
      >
        <span
          style={{
            color: completed
              ? "#34d399"
              : "#818cf8",
            fontSize: 11,
          }}
        >
          {completed ? "✓" : "→"}
        </span>

        <span>
          {completed
            ? "Traversal completed successfully"
            : "Press Next to execute the next BFS operation"}
        </span>
      </div>

      <style>
        {`
          @keyframes explanationPulse {
            0% {
              transform: scale(0.7);
              opacity: 0.9;
            }

            100% {
              transform: scale(1.5);
              opacity: 0;
            }
          }
        `}
      </style>
    </div>
  );
}