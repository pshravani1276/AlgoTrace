import { useMemo, useState } from "react";
import { Activity, ArrowLeft, ArrowRight, Code2, GitBranch, RotateCcw } from "lucide-react";
import { Link } from "react-router-dom";
import {
  type GraphAlgorithm,
  type GraphAlgorithmId,
  type GraphAlgorithmStep,
} from "../../algorithms/graph/types";
import { BELLMAN_FORD_DATA, generateBellmanFordSteps } from "../../algorithms/graph/bellman-ford";
import { TOPOLOGICAL_KAHN_DATA, generateKahnTopologicalSteps } from "../../algorithms/graph/topological-kahn";
import { TOPOLOGICAL_DFS_DATA, generateDfsTopologicalSteps } from "../../algorithms/graph/topological-dfs";
import { DAG_SHORTEST_PATH_DATA, generateDagShortestPathSteps } from "../../algorithms/graph/dag-shortest-path";
import LanguageSelector, { type Language } from "../../components/LanguageSelector";
import { translateSourceCode } from "../../utils/sourceCode";

const ALGORITHM_DATA: Record<GraphAlgorithmId, GraphAlgorithm> = {
  "bellman-ford": BELLMAN_FORD_DATA,
  "topological-kahn": TOPOLOGICAL_KAHN_DATA,
  "topological-dfs": TOPOLOGICAL_DFS_DATA,
  "dag-shortest-path": DAG_SHORTEST_PATH_DATA,
};

const STEP_GENERATORS: Record<GraphAlgorithmId, () => GraphAlgorithmStep[]> = {
  "bellman-ford": generateBellmanFordSteps,
  "topological-kahn": generateKahnTopologicalSteps,
  "topological-dfs": generateDfsTopologicalSteps,
  "dag-shortest-path": generateDagShortestPathSteps,
};

const NODE_COLORS = {
  normal: { fill: "#111c31", stroke: "#64748b", text: "#e2e8f0" },
  current: { fill: "#083344", stroke: "#22d3ee", text: "#cffafe" },
  checking: { fill: "#422006", stroke: "#fbbf24", text: "#fffbeb" },
  visited: { fill: "#064e3b", stroke: "#34d399", text: "#d1fae5" },
};

function GraphView({ algorithmId, step }: { algorithmId: GraphAlgorithmId; step: GraphAlgorithmStep }) {
  const algorithm = ALGORITHM_DATA[algorithmId];
  const nodes = new Map(algorithm.nodes.map((node) => [node.id, node]));

  return (
    <div className="relative h-[360px] min-h-[360px] overflow-hidden rounded-xl border border-slate-800 bg-[#050b18]">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(71,85,105,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(71,85,105,0.08)_1px,transparent_1px)] bg-[size:32px_32px]" />
      <svg viewBox="0 0 660 560" className="absolute inset-0 h-full w-full" role="img" aria-label={`${algorithm.title} graph`}>
        {algorithm.edges.map((edge) => {
          const from = nodes.get(edge.from);
          const to = nodes.get(edge.to);
          if (!from || !to) return null;
          const isActive = step.activeEdge?.[0] === edge.from && step.activeEdge?.[1] === edge.to;
          const isTraversed = step.traversedEdges.some(([left, right]) => left === edge.from && right === edge.to);
          const dx = to.x - from.x;
          const dy = to.y - from.y;
          const length = Math.hypot(dx, dy) || 1;
          const labelX = (from.x + to.x) / 2 - (dy / length) * 13;
          const labelY = (from.y + to.y) / 2 + (dx / length) * 13;
          const color = isActive ? "#fbbf24" : isTraversed ? "#34d399" : "#475569";

          return (
            <g key={`${edge.from}-${edge.to}`}>
              <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke={color} strokeWidth={isActive ? 4 : 2} strokeLinecap="round" />
              <text x={labelX} y={labelY} textAnchor="middle" fontSize="12" fontWeight="800" fill={edge.weight < 0 ? "#fb7185" : "#67e8f9"} stroke="#050b18" strokeWidth="4" paintOrder="stroke">{edge.weight}</text>
              {isActive && <circle cx={(from.x + to.x) / 2} cy={(from.y + to.y) / 2} r="5" fill="#fef3c7" />}
            </g>
          );
        })}
        {algorithm.nodes.map((node) => {
          const state = step.currentNode === node.id ? "current" : step.checkingNode === node.id ? "checking" : step.visited.includes(node.id) ? "visited" : "normal";
          const style = NODE_COLORS[state];
          const distance = step.distances[node.id];
          return (
            <g key={node.id}>
              <circle cx={node.x} cy={node.y} r="24" fill={style.fill} stroke={style.stroke} strokeWidth="3" />
              <text x={node.x} y={node.y + 6} textAnchor="middle" fontSize="19" fontWeight="800" fill={style.text}>{node.id}</text>
              {distance !== undefined && <text x={node.x} y={node.y + 43} textAnchor="middle" fontSize="12" fontWeight="700" fill="#fbbf24" stroke="#050b18" strokeWidth="4" paintOrder="stroke">d={Number.isFinite(distance) ? distance : "∞"}</text>}
              {state === "current" && <text x={node.x} y={node.y - 34} textAnchor="middle" fontSize="10" fontWeight="800" fill="#22d3ee">CURRENT</text>}
              {state === "checking" && <text x={node.x} y={node.y - 34} textAnchor="middle" fontSize="10" fontWeight="800" fill="#fbbf24">CHECKING</text>}
            </g>
          );
        })}
      </svg>
      <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 flex-wrap justify-center gap-3 rounded-lg border border-slate-800 bg-[#070e1d]/95 px-3 py-2 text-[10px] text-slate-400">
        <span className="text-cyan-300">Current</span><span className="text-amber-300">Checking</span><span className="text-emerald-300">Visited</span><span>Edge labels: weight</span>
      </div>
    </div>
  );
}

function renderDistance(value: number | undefined): string {
  if (value === undefined || !Number.isFinite(value)) return "∞";
  return String(value);
}

export default function AdvancedGraphVisualizer({ algorithmId }: { algorithmId: GraphAlgorithmId }) {
  const algorithm = ALGORITHM_DATA[algorithmId];
  const isTopological = algorithmId === "topological-kahn" || algorithmId === "topological-dfs";
  const isDfsTopological = algorithmId === "topological-dfs";
  const steps = useMemo(() => STEP_GENERATORS[algorithmId](), [algorithmId]);
  const [currentStep, setCurrentStep] = useState(0);
  const [language, setLanguage] = useState<Language>("TypeScript");
  const step = steps[Math.min(currentStep, steps.length - 1)];
  const isLastStep = currentStep >= steps.length - 1;
  const sourceCode = useMemo(
    () => translateSourceCode(algorithm.sourceCode, language),
    [algorithm.sourceCode, language],
  );

  return (
    <main className="min-h-screen overflow-hidden bg-[#020617] p-4 text-white lg:p-5">
      <div className="mx-auto max-w-[1550px]">
        <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link to="/graph" aria-label="Back to graph algorithms" title="Back to graph algorithms" className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-700 bg-slate-900 text-slate-300 hover:border-cyan-400/50 hover:text-cyan-300"><ArrowLeft size={17} /></Link>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-cyan-400/20 bg-cyan-400/10 text-cyan-300"><GitBranch size={19} /></div>
            <div><h1 className="text-lg font-bold">{algorithm.title}</h1><p className="text-[10px] text-slate-500">{algorithm.description}</p></div>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-2 text-[9px] uppercase text-slate-400">{algorithm.nodes.length} nodes · {algorithm.edges.length} directed edges{isTopological ? " · DAG" : ` · start ${algorithm.start} · goal ${algorithm.goal}`}</div>
        </header>

        <div className="grid gap-3 xl:grid-cols-[minmax(280px,0.8fr)_minmax(520px,1.5fr)_minmax(280px,0.8fr)]">
          <section className="min-w-0 space-y-3">
            <div className="overflow-hidden rounded-xl border border-slate-800 bg-[#050b18]" style={{ height: 430 }}>
              <div className="flex items-center justify-between gap-2 border-b border-slate-800 px-4 py-3"><div className="flex items-center gap-2"><Code2 size={14} className="text-cyan-400" /><h2 className="text-xs font-bold text-slate-200">Source Code</h2></div><LanguageSelector value={language} onChange={setLanguage} /></div>
              <div className="h-[calc(100%-49px)] overflow-auto p-3 font-mono text-[10px] leading-6">
                {sourceCode.map((line, index) => {
                  const active = index + 1 === step.codeLine;
                  return <div key={index} aria-current={active ? "step" : undefined} className={`flex min-h-5 gap-3 rounded border-l-2 px-2 py-0.5 ${active ? "border-cyan-400 bg-cyan-400/10 text-cyan-100" : "border-transparent text-slate-400"}`}><span className={`w-5 shrink-0 text-right ${active ? "text-cyan-300" : "text-slate-700"}`}>{index + 1}</span><span className="whitespace-pre">{line}</span></div>;
                })}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <DataPanel label={isDfsTopological ? "Recursion Stack" : algorithmId === "topological-kahn" ? "Zero-Indegree Queue" : "Frontier"} value={step.frontier.join(" · ") || "Empty"} />
              <DataPanel label={isDfsTopological && step.codeLine < 18 ? "DFS Finish Order" : isTopological ? "Topological Order" : "Order / Stack"} value={step.order.join(" → ") || step.visited.join(" → ") || "—"} />
            </div>
            {isDfsTopological ? (
              <section className="rounded-xl border border-slate-800 bg-[#050b18] p-4">
                <div className="mb-3 flex items-center gap-2 text-xs font-bold text-slate-300"><Activity size={14} className="text-cyan-400" />DFS Node State</div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[10px]">
                  {algorithm.nodes.map((node) => <div key={node.id} className="flex justify-between gap-3"><span className="text-slate-500">{node.id}</span><span className="font-mono text-slate-200">{step.frontier.includes(node.id) ? "active" : step.visited.includes(node.id) ? "finished / visited" : "unvisited"}</span></div>)}
                </div>
              </section>
            ) : (
              <section className="rounded-xl border border-slate-800 bg-[#050b18] p-4">
                <div className="mb-3 flex items-center gap-2 text-xs font-bold text-slate-300"><Activity size={14} className="text-cyan-400" />{algorithmId === "topological-kahn" ? "Indegrees" : "Shortest Distances"}</div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[10px]">
                  {algorithm.nodes.map((node) => <div key={node.id} className="flex justify-between gap-3"><span className="text-slate-500">{node.id}</span><span className="font-mono text-slate-200">{renderDistance(step.distances[node.id])}</span></div>)}
                </div>
              </section>
            )}
          </section>

          <section className="min-w-0 space-y-3">
            <section className="rounded-xl border border-slate-800 bg-[#050b18] p-4">
              <div className="flex items-center justify-between gap-3"><div className="text-xs font-bold uppercase text-slate-300">Execution</div><span className="rounded-md border border-cyan-400/20 bg-cyan-400/10 px-2 py-1 text-[9px] text-cyan-300">Step {step.step} / {steps.length}</span></div>
              <p className="mt-3 text-xs leading-5 text-slate-300">{step.explanation}</p>
              <div className="mt-2 font-mono text-[10px] text-slate-500">{step.condition}</div>
              <div className="mt-2 text-[10px] font-semibold text-cyan-300">{step.operation}</div>
            </section>
            <GraphView algorithmId={algorithmId} step={step} />
            <section className="rounded-xl border border-slate-800 bg-[#050b18] p-3">
              <div className="flex flex-wrap items-center justify-center gap-2">
                <button type="button" disabled={currentStep === 0} onClick={() => setCurrentStep((value) => Math.max(0, value - 1))} className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-xs text-slate-200 disabled:opacity-40"><ArrowLeft size={14} />Previous</button>
                <button type="button" onClick={() => setCurrentStep((value) => Math.min(steps.length - 1, value + 1))} disabled={isLastStep} className="flex items-center gap-2 rounded-lg border border-cyan-400/50 bg-cyan-600 px-4 py-2 text-xs font-bold text-white disabled:opacity-40"><ArrowRight size={14} />Next</button>
                <button type="button" onClick={() => setCurrentStep(0)} className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-xs text-slate-200"><RotateCcw size={14} />Reset</button>
              </div>
              <div className="mt-2 text-center text-[9px] text-slate-500">Line {step.codeLine} of {sourceCode.length}</div>
            </section>
          </section>

          <aside className="min-w-0 space-y-3">
            <section className="rounded-xl border border-slate-800 bg-[#050b18] p-4">
              <h2 className="mb-3 text-xs font-bold uppercase text-slate-300">Live State</h2>
              <StateRow label="Current" value={step.currentNode ?? "—"} />
              <StateRow label="Checking" value={step.checkingNode ?? "—"} />
              <StateRow label="Frontier" value={step.frontier.join(", ") || "Empty"} />
              <StateRow label="Visited" value={step.visited.join(", ") || "—"} />
              <StateRow label="Order" value={step.order.join(" → ") || "—"} />
            </section>
            <section className="rounded-xl border border-slate-800 bg-[#050b18] p-4">
              <h2 className="mb-3 text-xs font-bold uppercase text-slate-300">{isTopological ? "Result" : "Current Path"}</h2>
              <div className="min-h-12 break-words rounded-lg border border-slate-800 bg-slate-900/60 p-3 font-mono text-xs text-cyan-200">{isTopological ? step.codeLine >= 18 && isDfsTopological ? step.order.join(" → ") : algorithmId === "topological-kahn" && step.operation.startsWith("Return order") ? step.order.join(" → ") : "Building order…" : step.path.join(" → ") || "No path yet"}</div>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}

function DataPanel({ label, value }: { label: string; value: string }) {
  return <section className="min-w-0 rounded-xl border border-slate-800 bg-[#050b18] p-3"><h2 className="mb-2 text-[9px] font-bold uppercase text-slate-500">{label}</h2><div className="truncate font-mono text-[10px] text-cyan-200">{value}</div></section>;
}

function StateRow({ label, value }: { label: string; value: string }) {
  return <div className="flex justify-between gap-3 border-b border-slate-800 py-2 text-[10px] last:border-0"><span className="text-slate-500">{label}</span><span className="break-all text-right font-mono text-slate-200">{value}</span></div>;
}