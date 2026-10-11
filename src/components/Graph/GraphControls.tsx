// src/components/Graph/GraphControls.tsx

import type { ReactNode } from "react";

interface GraphControlsProps {
  currentStep: number;
  totalSteps: number;

  onPrevious: () => void;
  onNext: () => void;
  onReset: () => void;

  speed: number;
  onSpeedChange: (speed: number) => void;

  disabled?: boolean;

  leftContent?: ReactNode;
}

/* =========================================================
   GRAPH CONTROLS
   ========================================================= */

export default function GraphControls({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  onReset,
  speed,
  onSpeedChange,
  disabled = false,
  leftContent,
}: GraphControlsProps) {
  const isFirstStep = currentStep <= 0;

  const isLastStep =
    totalSteps === 0 ||
    currentStep >= totalSteps - 1;

  const percentage =
    totalSteps > 1
      ? (currentStep / (totalSteps - 1)) * 100
      : 0;

  return (
    <div
      style={{
        width: "100%",

        padding: "12px 14px",

        borderRadius: 16,

        background:
          "rgba(15,23,42,0.88)",

        border:
          "1px solid rgba(100,116,139,0.25)",

        boxShadow:
          "0 10px 30px rgba(0,0,0,0.22)",

        backdropFilter: "blur(14px)",

        boxSizing: "border-box",
      }}
    >
      {/* =================================================
          TOP ROW
          ================================================= */}

      <div
        style={{
          display: "flex",

          alignItems: "center",

          justifyContent: "space-between",

          gap: 12,

          marginBottom: 10,

          flexWrap: "wrap",
        }}
      >
        {/* LEFT CONTENT */}

        <div
          style={{
            display: "flex",

            alignItems: "center",

            gap: 8,

            minWidth: 0,
          }}
        >
          {leftContent}

          <div
            style={{
              color: "#94a3b8",

              fontSize: 11,

              fontWeight: 700,

              whiteSpace: "nowrap",
            }}
          >
            Step
          </div>

          <div
            style={{
              color: "#f8fafc",

              fontSize: 13,

              fontWeight: 900,

              whiteSpace: "nowrap",
            }}
          >
            {totalSteps === 0
              ? 0
              : currentStep + 1}
          </div>

          <div
            style={{
              color: "#64748b",

              fontSize: 11,

              fontWeight: 700,
            }}
          >
            /
          </div>

          <div
            style={{
              color: "#94a3b8",

              fontSize: 11,

              fontWeight: 700,

              whiteSpace: "nowrap",
            }}
          >
            {totalSteps}
          </div>
        </div>

        {/* SPEED */}

        <div
          style={{
            display: "flex",

            alignItems: "center",

            gap: 8,
          }}
        >
          <span
            style={{
              color: "#94a3b8",

              fontSize: 10,

              fontWeight: 800,

              textTransform: "uppercase",

              letterSpacing: "0.06em",
            }}
          >
            Speed
          </span>

          <select
            value={speed}
            onChange={(event) =>
              onSpeedChange(
                Number(event.target.value),
              )
            }
            disabled={disabled}
            style={{
              height: 30,

              padding: "0 8px",

              borderRadius: 8,

              border:
                "1px solid rgba(100,116,139,0.35)",

              background: "#020617",

              color: "#e2e8f0",

              fontSize: 11,

              fontWeight: 700,

              outline: "none",

              cursor: disabled
                ? "not-allowed"
                : "pointer",
            }}
          >
            <option value={0.5}>
              0.5x
            </option>

            <option value={1}>
              1x
            </option>

            <option value={1.5}>
              1.5x
            </option>

            <option value={2}>
              2x
            </option>

            <option value={3}>
              3x
            </option>
          </select>
        </div>
      </div>

      {/* =================================================
          PROGRESS BAR
          ================================================= */}

      <div
        style={{
          width: "100%",

          height: 4,

          borderRadius: 10,

          background:
            "rgba(71,85,105,0.35)",

          overflow: "hidden",

          marginBottom: 12,
        }}
      >
        <div
          style={{
            width: `${percentage}%`,

            height: "100%",

            borderRadius: 10,

            background:
              "linear-gradient(90deg, #6366f1, #38bdf8)",

            boxShadow:
              "0 0 10px rgba(99,102,241,0.55)",

            transition:
              "width 250ms ease",
          }}
        />
      </div>

      {/* =================================================
          BUTTON ROW
          ================================================= */}

      <div
        style={{
          display: "flex",

          alignItems: "center",

          justifyContent: "center",

          gap: 8,

          flexWrap: "wrap",
        }}
      >
        {/* PREVIOUS */}

        <ControlButton
          label="Previous"
          icon="←"
          onClick={onPrevious}
          disabled={
            disabled || isFirstStep
          }
        />

        {/* NEXT */}

        <button
          type="button"
          onClick={onNext}
          disabled={
            disabled || isLastStep
          }
          style={{
            minWidth: 110,

            height: 38,

            padding: "0 18px",

            borderRadius: 10,

            border:
              "1px solid rgba(129,140,248,0.7)",

            background:
              "linear-gradient(135deg, #4f46e5, #2563eb)",

            color: "#ffffff",

            fontSize: 12,

            fontWeight: 900,

            letterSpacing: "0.02em",

            cursor:
              disabled || isLastStep
                ? "not-allowed"
                : "pointer",

            opacity:
              disabled || isLastStep
                ? 0.4
                : 1,

            boxShadow:
              disabled || isLastStep
                ? "none"
                : "0 0 18px rgba(79,70,229,0.35)",

            transition:
              "transform 150ms ease, box-shadow 150ms ease, opacity 150ms ease",
          }}
          onMouseEnter={(event) => {
            if (!disabled && !isLastStep) {
              event.currentTarget.style.transform =
                "translateY(-1px)";
            }
          }}
          onMouseLeave={(event) => {
            event.currentTarget.style.transform =
              "translateY(0)";
          }}
        >
          ▶ Next
        </button>

        {/* RESET */}

        <ControlButton
          label="Reset"
          icon="↻"
          onClick={onReset}
          disabled={disabled}
        />
      </div>
    </div>
  );
}

/* =========================================================
   SMALL CONTROL BUTTON
   ========================================================= */

function ControlButton({
  label,
  icon,
  onClick,
  disabled,
}: {
  label: string;
  icon: string;
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        minWidth: 92,

        height: 38,

        padding: "0 13px",

        borderRadius: 10,

        border:
          "1px solid rgba(100,116,139,0.35)",

        background:
          "rgba(30,41,59,0.75)",

        color: "#cbd5e1",

        fontSize: 11,

        fontWeight: 800,

        cursor: disabled
          ? "not-allowed"
          : "pointer",

        opacity: disabled ? 0.35 : 1,

        transition:
          "background 150ms ease, transform 150ms ease, opacity 150ms ease",

        display: "flex",

        alignItems: "center",

        justifyContent: "center",

        gap: 7,
      }}
      onMouseEnter={(event) => {
        if (!disabled) {
          event.currentTarget.style.background =
            "rgba(51,65,85,0.9)";

          event.currentTarget.style.transform =
            "translateY(-1px)";
        }
      }}
      onMouseLeave={(event) => {
        event.currentTarget.style.background =
          "rgba(30,41,59,0.75)";

        event.currentTarget.style.transform =
          "translateY(0)";
      }}
    >
      <span
        style={{
          fontSize: 15,

          lineHeight: 1,
        }}
      >
        {icon}
      </span>

      <span>{label}</span>
    </button>
  );
}