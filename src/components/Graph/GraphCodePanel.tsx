// src/components/Graph/GraphCodePanel.tsx

import React, { useState } from "react";

interface GraphCodePanelProps {
  code: string[];
  activeLine?: number;
  title?: string;

  // Optional language control
  language?: "C++" | "Java" | "Python";

  onLanguageChange?: (
    language: "C++" | "Java" | "Python"
  ) => void;
}

type Language = "C++" | "Java" | "Python";

export default function GraphCodePanel({
  code,
  activeLine = 0,
  title = "BFS Source Code",
  language: externalLanguage,
  onLanguageChange,
}: GraphCodePanelProps) {
  // =========================================================
  // LANGUAGE
  // =========================================================

  const [internalLanguage, setInternalLanguage] =
    useState<Language>("C++");

  const language =
    externalLanguage ?? internalLanguage;

  const handleLanguageChange = (
    selectedLanguage: Language
  ) => {
    setInternalLanguage(selectedLanguage);

    if (onLanguageChange) {
      onLanguageChange(selectedLanguage);
    }
  };

  // =========================================================
  // MAIN
  // =========================================================

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        minHeight: 0,

        display: "flex",
        flexDirection: "column",

        overflow: "hidden",

        borderRadius: 18,

        background:
          "rgba(15, 23, 42, 0.92)",

        border:
          "1px solid rgba(100, 116, 139, 0.25)",

        boxShadow:
          "0 10px 35px rgba(0, 0, 0, 0.25)",
      }}
    >
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div
        style={{
          flexShrink: 0,

          minHeight: 48,

          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",

          padding: "0 16px",

          borderBottom:
            "1px solid rgba(100, 116, 139, 0.2)",

          background:
            "rgba(2, 6, 23, 0.55)",

          gap: 12,
        }}
      >
        {/* =================================================
            LEFT SIDE — CODE TITLE
        ================================================= */}

        <div
          style={{
            display: "flex",
            alignItems: "center",

            gap: 9,

            minWidth: 0,
          }}
        >
          {/* CODE ICON */}

          <div
            style={{
              width: 28,
              height: 28,

              flexShrink: 0,

              display: "flex",
              alignItems: "center",
              justifyContent: "center",

              borderRadius: 8,

              background:
                "rgba(99, 102, 241, 0.15)",

              border:
                "1px solid rgba(129, 140, 248, 0.25)",

              color: "#a5b4fc",

              fontSize: 14,

              fontWeight: 900,
            }}
          >
            {"</>"}
          </div>

          {/* TITLE */}

          <div>
            <div
              style={{
                color: "#f8fafc",

                fontSize: 12,

                fontWeight: 900,

                letterSpacing: "0.02em",

                whiteSpace: "nowrap",
              }}
            >
              {title}
            </div>

            <div
              style={{
                color: "#64748b",

                fontSize: 9,

                fontWeight: 700,

                marginTop: 2,
              }}
            >
              Step-by-step execution
            </div>
          </div>
        </div>

        {/* =================================================
            RIGHT SIDE
            LANGUAGE DROPDOWN + LINE
        ================================================= */}

        <div
          style={{
            display: "flex",
            alignItems: "center",

            gap: 8,

            flexShrink: 0,
          }}
        >
          {/* =================================================
              LANGUAGE DROPDOWN
          ================================================= */}

          <div
            style={{
              position: "relative",

              display: "flex",
              alignItems: "center",
            }}
          >
            <select
              value={language}
              onChange={(event) =>
                handleLanguageChange(
                  event.target.value as Language
                )
              }
              aria-label="Select programming language"
              style={{
                height: 28,

                minWidth: 82,

                padding:
                  "0 24px 0 10px",

                borderRadius: 7,

                background:
                  "#0f172a",

                border:
                  "1px solid rgba(100, 116, 139, 0.35)",

                color:
                  "#67e8f9",

                fontSize: 9,

                fontWeight: 800,

                outline: "none",

                cursor: "pointer",

                appearance: "auto",

                WebkitAppearance: "auto",

                colorScheme: "dark",
              }}
            >
              <option
                value="C++"
                style={{
                  background: "#0f172a",
                  color: "#67e8f9",
                }}
              >
                C++
              </option>

              <option
                value="Java"
                style={{
                  background: "#0f172a",
                  color: "#67e8f9",
                }}
              >
                Java
              </option>

              <option
                value="Python"
                style={{
                  background: "#0f172a",
                  color: "#67e8f9",
                }}
              >
                Python
              </option>
            </select>
          </div>

          {/* =================================================
              ACTIVE LINE
          ================================================= */}

          <div
            style={{
              padding: "5px 9px",

              borderRadius: 7,

              background:
                "rgba(99, 102, 241, 0.12)",

              border:
                "1px solid rgba(99, 102, 241, 0.2)",

              color: "#a5b4fc",

              fontSize: 9,

              fontWeight: 800,

              whiteSpace: "nowrap",
            }}
          >
            LINE {activeLine + 1}
          </div>
        </div>
      </div>

      {/* =====================================================
          LANGUAGE INDICATOR
      ===================================================== */}

      <div
        style={{
          flexShrink: 0,

          height: 24,

          display: "flex",
          alignItems: "center",

          padding: "0 14px",

          borderBottom:
            "1px solid rgba(100, 116, 139, 0.12)",

          background:
            "rgba(2, 6, 23, 0.3)",
        }}
      >
        <span
          style={{
            color: "#475569",

            fontSize: 8,

            fontWeight: 700,

            textTransform: "uppercase",

            letterSpacing: "0.08em",
          }}
        >
          Language
        </span>

        <span
          style={{
            marginLeft: 6,

            color: "#67e8f9",

            fontSize: 9,

            fontWeight: 800,
          }}
        >
          {language}
        </span>
      </div>

      {/* =====================================================
          CODE AREA
      ===================================================== */}

      <div
        style={{
          flex: 1,

          minHeight: 0,

          overflowY: "auto",

          overflowX: "auto",

          padding: "10px 0 14px",

          background:
            "linear-gradient(180deg, rgba(2, 6, 23, 0.4), rgba(15, 23, 42, 0.7))",
        }}
      >
        {code.length === 0 ? (
          <div
            style={{
              padding: 20,

              color: "#64748b",

              fontSize: 12,
            }}
          >
            No source code available.
          </div>
        ) : (
          code.map((line, index) => {
            const isActive =
              index === activeLine;

            return (
              <div
                key={`code-line-${index}`}
                style={{
                  position: "relative",

                  display: "flex",

                  alignItems: "stretch",

                  minHeight: 28,

                  background: isActive
                    ? "rgba(99, 102, 241, 0.16)"
                    : "transparent",

                  borderLeft: isActive
                    ? "3px solid #818cf8"
                    : "3px solid transparent",

                  transition:
                    "background 200ms ease, border-color 200ms ease",
                }}
              >
                {/* =================================================
                    ACTIVE LINE GLOW
                ================================================= */}

                {isActive && (
                  <div
                    style={{
                      position: "absolute",

                      inset: 0,

                      pointerEvents:
                        "none",

                      background:
                        "linear-gradient(90deg, rgba(99,102,241,0.08), transparent 75%)",
                    }}
                  />
                )}

                {/* =================================================
                    LINE NUMBER
                ================================================= */}

                <div
                  style={{
                    position: "relative",

                    width: 42,

                    flexShrink: 0,

                    paddingRight: 10,

                    display: "flex",

                    alignItems: "center",

                    justifyContent:
                      "flex-end",

                    color: isActive
                      ? "#a5b4fc"
                      : "#475569",

                    fontFamily:
                      "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",

                    fontSize: 10,

                    fontWeight: isActive
                      ? 800
                      : 500,

                    userSelect: "none",
                  }}
                >
                  {index + 1}
                </div>

                {/* =================================================
                    CODE TEXT
                ================================================= */}

                <pre
                  style={{
                    position: "relative",

                    flex: 1,

                    margin: 0,

                    padding:
                      "5px 14px 5px 10px",

                    color: isActive
                      ? "#f8fafc"
                      : "#cbd5e1",

                    fontFamily:
                      "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",

                    fontSize: 11,

                    lineHeight: 1.65,

                    fontWeight: isActive
                      ? 700
                      : 500,

                    whiteSpace: "pre",

                    transition:
                      "color 200ms ease",
                  }}
                >
                  {highlightCode(
                    line,
                    isActive
                  )}
                </pre>

                {/* =================================================
                    ACTIVE DOT
                ================================================= */}

                {isActive && (
                  <div
                    style={{
                      position: "absolute",

                      right: 8,

                      top: "50%",

                      width: 6,

                      height: 6,

                      transform:
                        "translateY(-50%)",

                      borderRadius: "50%",

                      background:
                        "#818cf8",

                      boxShadow:
                        "0 0 8px rgba(129, 140, 248, 0.9)",

                      animation:
                        "codeActivePulse 900ms ease-in-out infinite",

                      pointerEvents:
                        "none",
                    }}
                  />
                )}
              </div>
            );
          })
        )}
      </div>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <div
        style={{
          flexShrink: 0,

          minHeight: 32,

          display: "flex",

          alignItems: "center",

          padding: "0 14px",

          borderTop:
            "1px solid rgba(100, 116, 139, 0.18)",

          background:
            "rgba(2, 6, 23, 0.45)",

          color: "#64748b",

          fontSize: 9,

          fontWeight: 700,
        }}
      >
        <span
          style={{
            width: 6,

            height: 6,

            marginRight: 7,

            borderRadius: "50%",

            background:
              "#34d399",

            boxShadow:
              "0 0 7px rgba(52, 211, 153, 0.7)",
          }}
        />

        Click Next to execute one step
      </div>

      {/* =====================================================
          ACTIVE LINE ANIMATION
      ===================================================== */}

      <style>
        {`
          @keyframes codeActivePulse {
            0% {
              opacity: 0.45;
              transform:
                translateY(-50%)
                scale(0.8);
            }

            50% {
              opacity: 1;
              transform:
                translateY(-50%)
                scale(1.15);
            }

            100% {
              opacity: 0.45;
              transform:
                translateY(-50%)
                scale(0.8);
            }
          }

          select:focus {
            border-color:
              rgba(34, 211, 238, 0.55) !important;

            box-shadow:
              0 0 0 2px
              rgba(34, 211, 238, 0.08);
          }

          select:hover {
            border-color:
              rgba(34, 211, 238, 0.45);
          }
        `}
      </style>
    </div>
  );
}

/* =========================================================
   SIMPLE CODE HIGHLIGHTING
========================================================= */

function highlightCode(
  line: string,
  active: boolean
) {
  const trimmed = line.trim();

  /*
   * Empty line
   */

  if (trimmed === "") {
    return " ";
  }

  /*
   * Keywords
   */

  const keywords = [
    "function",
    "const",
    "new",
    "while",
    "for",
    "if",
    "return",
    "class",
    "public",
    "private",
    "void",
    "int",
    "boolean",
    "def",
    "in",
    "from",
    "import",
  ];

  /*
   * Split code safely
   */

  const parts = line.split(
    /(\bfunction\b|\bconst\b|\bnew\b|\bwhile\b|\bfor\b|\bif\b|\breturn\b|\bclass\b|\bpublic\b|\bprivate\b|\bvoid\b|\bint\b|\bboolean\b|\bdef\b|\bin\b|\bfrom\b|\bimport\b)/g
  );

  return parts.map((part, index) => {
    /*
     * Keywords
     */

    if (keywords.includes(part)) {
      return (
        <span
          key={index}
          style={{
            color: active
              ? "#c4b5fd"
              : "#a78bfa",

            fontWeight: 800,
          }}
        >
          {part}
        </span>
      );
    }

    /*
     * Strings
     */

    if (
      part.includes('"') ||
      part.includes("'")
    ) {
      return (
        <span
          key={index}
          style={{
            color: active
              ? "#86efac"
              : "#4ade80",
          }}
        >
          {part}
        </span>
      );
    }

    /*
     * Normal text
     */

    return (
      <span key={index}>
        {part}
      </span>
    );
  });
}