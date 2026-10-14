import { useMemo, useState, type ReactNode } from "react";
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  Code2,
  Cpu,
  GitBranch,
  Info,
  Layers3,
  ListOrdered,
  RotateCcw,
  Sparkles,
  Zap,
} from "lucide-react";
import {
  A_STAR_NODES,
  A_STAR_HEURISTICS,
  DEFAULT_A_STAR_GOAL_NODE,
  DEFAULT_A_STAR_GRAPH,
  DEFAULT_A_STAR_START_NODE,
  type AStarEdge,
  type AStarStep,
} from "../../algorithms/graph/a-star/aStarData";
import {
  A_STAR_SOURCE_CODE,
  generateAStarSteps,
  getAStarEdges,
  getAStarNodes,
  isAStarEdgeActive,
} from "../../algorithms/graph/a-star/aStarSteps";
import LanguageSelector, { type Language } from "../../components/LanguageSelector";
import { translateSourceCode } from "../../utils/sourceCode";

function getAStarNodeLabel(nodeId: number): string {
  return A_STAR_NODES.find((node) => node.id === nodeId)?.label ?? String(nodeId);
}

const NODE_STYLES = {
  unvisited: { fill: "#111c31", stroke: "#64748b", text: "#e2e8f0" },
  current: { fill: "#083344", stroke: "#22d3ee", text: "#67e8f9" },
  visited: { fill: "#052e2b", stroke: "#10b981", text: "#6ee7b7" },
  completed: { fill: "#064e3b", stroke: "#34d399", text: "#dcfce7" },
};

function getNodeState(step: AStarStep, nodeId: number) {
  if (step.currentNode === nodeId) return "current";
  if (step.completed.includes(nodeId)) return "completed";
  if (step.visited.includes(nodeId)) return "visited";
  return "unvisited";
}

function getEdgeState(step: AStarStep, edge: AStarEdge) {
  if (step.activeEdge && isAStarEdgeActive(edge, step.activeEdge)) return "active";
  if (step.traversedEdges.some(([from, to]) => (from === edge.from && to === edge.to) || (from === edge.to && to === edge.from))) return "traversed";
  return "normal";
}

function AStarGraph({ step }: { step: AStarStep }) {
  const nodes = getAStarNodes();
  const edges = getAStarEdges();
  const nodeMap = new Map(nodes.map((node) => [node.id, node]));

  return (
    <div className="relative h-[360px] min-h-[360px] overflow-hidden rounded-2xl border border-slate-800 bg-[#050b18]">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(71,85,105,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(71,85,105,0.08)_1px,transparent_1px)] bg-[size:32px_32px]" />
      <div className="absolute left-5 top-4 z-20">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.9)]" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">Graph Visualization</span>
        </div>
        <div className="mt-1 text-[10px] text-slate-600">A* search state</div>
      </div>

      <svg viewBox="0 0 660 560" className="absolute inset-0 h-full w-full" role="img" aria-label="A star graph visualization">
        {edges.map((edge) => {
          const from = nodeMap.get(edge.from);
          const to = nodeMap.get(edge.to);
          if (!from || !to) return null;
          const edgeState = getEdgeState(step, edge);
          const color = edgeState === "active" ? "#fbbf24" : edgeState === "traversed" ? "#34d399" : "#475569";
          const deltaX = to.x - from.x;
          const deltaY = to.y - from.y;
          const edgeLength = Math.hypot(deltaX, deltaY) || 1;
          const weightX = (from.x + to.x) / 2 - (deltaY / edgeLength) * 12;
          const weightY = (from.y + to.y) / 2 + (deltaX / edgeLength) * 12;
          return (
            <g key={`${edge.from}-${edge.to}`}>
              <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke={color} strokeWidth={edgeState === "active" ? 4 : 2} strokeLinecap="round" />
              <text x={weightX} y={weightY} textAnchor="middle" fontSize="12" fontWeight="800" fill="#67e8f9" stroke="#050b18" strokeWidth="4" paintOrder="stroke">{edge.weight}</text>
              {edgeState === "active" && <circle cx={(from.x + to.x) / 2} cy={(from.y + to.y) / 2} r="4" fill="#fef3c7" />}
            </g>
          );
        })}

        {nodes.map((node) => {
          const nodeState = getNodeState(step, node.id);
          const style = NODE_STYLES[nodeState];
          const isCurrent = step.currentNode === node.id;
          const heuristicValue = A_STAR_HEURISTICS[node.id] ?? 0;
          return (
            <g key={node.id}>
              {isCurrent && <circle cx={node.x} cy={node.y} r="31" fill="none" stroke={style.stroke} strokeWidth="3" opacity="0.25" className="animate-ping" />}
              <circle cx={node.x} cy={node.y} r={isCurrent ? 28 : 25} fill="none" stroke={style.stroke} strokeWidth="4" opacity="0.2" />
              <circle cx={node.x} cy={node.y} r="24" fill={style.fill} stroke={style.stroke} strokeWidth="3" />
              <text x={node.x} y={node.y + 8} textAnchor="middle" fontSize="26" fontWeight="800" fill={style.text}>{node.label}</text>
              <text x={node.x} y={node.y + 42} textAnchor="middle" fontSize="12" fontWeight="700" fill="#fbbf24">h={heuristicValue}</text>
              {isCurrent && <text x={node.x} y={node.y - 46} textAnchor="middle" fontSize="11" fontWeight="800" fill="#22d3ee">CURRENT</text>}
            </g>
          );
        })}
      </svg>

      <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 flex-wrap items-center justify-center gap-3 rounded-xl border border-slate-800 bg-[#070e1d]/95 px-4 py-2 text-[10px] shadow-lg backdrop-blur-md">
        <span className="flex items-center gap-1.5 text-slate-500"><i className="h-2 w-2 rounded-full border border-slate-500 bg-slate-800" />Unvisited</span>
        <span className="flex items-center gap-1.5 text-emerald-400"><i className="h-2 w-2 rounded-full bg-emerald-400" />Visited</span>
        <span className="flex items-center gap-1.5 text-cyan-400"><i className="h-2 w-2 rounded-full bg-cyan-400" />Current</span>
      </div>
    </div>
  );
}

function AStarInspector({ step }: { step: AStarStep }) {
  const frontier = step.frontier.map((item) => `${getAStarNodeLabel(item.node)}: f=${item.f}`).join(" · ") || "Empty";
  return (
    <aside className="flex min-w-0 flex-col gap-3">
      <section className="overflow-hidden rounded-2xl border border-slate-800 bg-[#050b18]">
        <div className="flex items-center gap-2 border-b border-slate-800 px-4 py-3"><Info size={14} className="text-cyan-400" /><h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">A* Inspector</h2></div>
        <div className="space-y-4 p-4">
          <div><div className="mb-1.5 text-[9px] font-bold uppercase tracking-widest text-slate-600">Current Operation</div><div className="rounded-lg border border-cyan-400/20 bg-cyan-400/5 px-3 py-2 text-xs font-semibold text-cyan-200">{step.operation}</div></div>
          <div><div className="mb-1.5 text-[9px] font-bold uppercase tracking-widest text-slate-600">Condition</div><div className="rounded-lg border border-slate-700 bg-slate-900/70 px-3 py-2 font-mono text-[10px] leading-5 text-slate-300">{step.condition}</div></div>
          <div className="space-y-2 font-mono text-[10px]">
            <div className="flex gap-3 rounded-lg bg-slate-900/70 px-2 py-2"><span className="w-12 text-slate-600">current</span><span className="text-cyan-300">{step.currentNode === null ? "—" : getAStarNodeLabel(step.currentNode)}</span></div>
            <div className="flex gap-3 rounded-lg bg-slate-900/70 px-2 py-2"><span className="w-12 text-slate-600">frontier</span><span className="text-violet-300">{frontier}</span></div>
            <div className="flex gap-3 rounded-lg bg-slate-900/70 px-2 py-2"><span className="w-12 text-slate-600">visited</span><span className="text-emerald-300">[{step.visited.join(", ") || "None"}]</span></div>
            <div className="flex gap-3 rounded-lg bg-slate-900/70 px-2 py-2"><span className="w-12 text-slate-600">path</span><span className="text-sky-300">[{step.path.map(getAStarNodeLabel).join(" → ") || "—"}]</span></div>
          </div>
        </div>
      </section>
      <section className="rounded-2xl border border-slate-800 bg-[#050b18] p-4">
        <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300"><ListOrdered size={14} className="text-violet-400" />Best Path</div>
        <div className="min-h-12 rounded-lg border border-slate-800 bg-slate-900/50 p-2 font-mono text-[10px] text-violet-300">{step.path.length ? step.path.map(getAStarNodeLabel).join(" → ") : "Waiting for path…"}</div>
      </section>
    </aside>
  );
}

function PanelCard({ icon, title, value, accent }: { icon: ReactNode; title: string; value: string; accent: "cyan" | "emerald" }) {
  const colors = accent === "cyan" ? "text-cyan-400 bg-cyan-400/10 border-cyan-400/20" : "text-emerald-400 bg-emerald-400/10 border-emerald-400/20";
  return <div className="rounded-2xl border border-slate-800 bg-[#050b18] p-3"><div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-wider text-slate-500">{icon}<span>{title}</span></div><div className={`mt-2 truncate rounded-lg border px-2 py-2 font-mono text-[9px] ${colors}`}>{value}</div></div>;
}

export default function AStarVisualizer() {
  const steps = useMemo(() => generateAStarSteps(DEFAULT_A_STAR_GRAPH, DEFAULT_A_STAR_START_NODE, DEFAULT_A_STAR_GOAL_NODE), []);
  const [currentStep, setCurrentStep] = useState(0);
  const [language, setLanguage] = useState<Language>("TypeScript");
  const sourceCode = useMemo(
    () => translateSourceCode(A_STAR_SOURCE_CODE, language),
    [language],
  );
  const step = steps[Math.min(currentStep, Math.max(0, steps.length - 1))];
  const handlePrevious = () => setCurrentStep((value) => Math.max(0, value - 1));
  const handleNext = () => setCurrentStep((value) => Math.min(value + 1, steps.length - 1));
  const handleReset = () => setCurrentStep(0);

  return (
    <main className="min-h-screen overflow-hidden bg-[#020617] text-white">
      <div className="mx-auto max-w-[1550px] p-4 lg:p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-500/10 text-cyan-300"><GitBranch size={19} /></div>
            <div><h1 className="text-lg font-bold">A* (A Star) Algorithm</h1><p className="text-[10px] text-slate-500">Priority-based shortest path visualizer</p></div>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-2 text-[9px] uppercase tracking-widest text-slate-500"><span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />Graph · {A_STAR_NODES.length} nodes · {DEFAULT_A_STAR_GRAPH.length} weighted edges</div>
        </div>
        <div className="grid gap-3 xl:grid-cols-[minmax(300px,0.78fr)_minmax(560px,1.55fr)_minmax(300px,0.78fr)]">
          <section className="min-w-0 space-y-3">
            <div className="overflow-hidden rounded-2xl border border-slate-800 bg-[#050b18]" style={{ height: 430 }}>
              <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3"><div className="flex items-center gap-2"><Code2 size={14} className="text-cyan-400" /><h2 className="text-xs font-bold text-slate-200">Source Code</h2></div><LanguageSelector value={language} onChange={setLanguage} /></div>
              <div className="h-[calc(100%-49px)] overflow-auto p-3 font-mono text-[10px] leading-6">{sourceCode.map((line, index) => {
                const isActiveLine = index + 1 === step.codeLine;
                return <div key={index} aria-current={isActiveLine ? "step" : undefined} className={`flex min-h-5 gap-3 rounded border-l-2 px-2 py-0.5 transition-colors ${isActiveLine ? "border-cyan-400 bg-cyan-400/10 text-cyan-100" : "border-transparent text-slate-400"}`}><span className={`w-5 shrink-0 text-right ${isActiveLine ? "text-cyan-300" : "text-slate-700"}`}>{index + 1}</span><span className="whitespace-pre">{line}</span></div>;
              })}</div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <PanelCard icon={<Layers3 size={14} />} title="Frontier" value={step.frontier.map((item) => `${getAStarNodeLabel(item.node)}(${item.f})`).join("  ") || "Empty"} accent="cyan" />
              <PanelCard icon={<ListOrdered size={14} />} title="Path" value={step.path.map(getAStarNodeLabel).join(" → ") || "—"} accent="emerald" />
            </div>
            <div className="rounded-2xl border border-slate-800 bg-[#050b18] p-4"><div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300"><Activity size={14} className="text-cyan-400" />Graph Information</div><div className="mt-3 space-y-2 text-[10px] text-slate-500"><InfoRow label="Goal" value={getAStarNodeLabel(DEFAULT_A_STAR_GOAL_NODE)} /><InfoRow label="Starting Node" value={getAStarNodeLabel(DEFAULT_A_STAR_START_NODE)} /><InfoRow label="Heuristic" value={step.heuristic === null ? "h(n)" : `h(${step.currentNode === null ? "—" : getAStarNodeLabel(step.currentNode)}) = ${step.heuristic}`} /><InfoRow label="Time" value="O(E log V)" /><InfoRow label="Space" value="O(V)" /></div></div>
          </section>
          <section className="min-w-0 space-y-3">
            <div className="rounded-2xl border border-slate-800 bg-[#050b18] p-4"><div className="flex items-center justify-between gap-3"><div className="flex items-center gap-2"><Sparkles size={14} className="text-cyan-400" /><span className="text-xs font-bold uppercase tracking-wider text-slate-300">What&apos;s Happening?</span></div><span className="rounded-md border border-cyan-400/20 bg-cyan-400/10 px-2 py-1 text-[8px] font-bold uppercase tracking-wider text-cyan-300">Step {step.step}</span></div><p className="mt-3 text-xs leading-5 text-slate-300">{step.explanation}</p><div className="mt-3 flex items-center gap-2 text-[9px] text-slate-600"><Zap size={12} className="text-cyan-400" />{step.operation}</div></div>
            <AStarGraph step={step} />
            <div className="rounded-2xl border border-slate-800 bg-[#050b18] p-3"><div className="flex flex-wrap items-center justify-center gap-2"><button type="button" onClick={handlePrevious} disabled={currentStep === 0} className="flex min-w-[92px] items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-xs font-bold text-slate-300 transition hover:border-cyan-400/40 hover:text-cyan-300 disabled:cursor-not-allowed disabled:opacity-35"><ArrowLeft size={14} />Previous</button><button type="button" onClick={handleNext} disabled={currentStep === steps.length - 1} className="flex min-w-[110px] items-center justify-center gap-2 rounded-xl border border-cyan-400/70 bg-gradient-to-r from-cyan-600 to-blue-600 px-4 py-2.5 text-xs font-black text-white shadow-[0_0_18px_rgba(34,211,238,0.35)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-35"><ArrowRight size={14} />Next</button><button type="button" onClick={handleReset} className="flex min-w-[92px] items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-xs font-bold text-slate-300 transition hover:border-cyan-400/40 hover:text-cyan-300"><RotateCcw size={14} />Reset</button></div><div className="mt-3 flex items-center justify-between text-[9px] text-slate-600"><span>Step {currentStep + 1} of {steps.length}</span><span className="flex items-center gap-1.5"><Cpu size={11} />Manual navigation only</span></div></div>
          </section>
          <AStarInspector step={step} />
        </div>
      </div>
    </main>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) { return <div className="flex items-center justify-between gap-3"><span>{label}</span><span className="text-slate-300">{value}</span></div>; }
