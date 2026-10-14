import { useMemo, useState } from "react";
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
  DEFAULT_GRAPH,
  DEFAULT_START_NODE,
  type BFSEdge,
  type BFSStep,
} from "../../algorithms/graph/bfs/bfsData";
import {
  BFS_SOURCE_CODE,
  generateBFSSteps,
  getGraphEdges,
  getGraphNodes,
  isEdgeActive,
} from "../../algorithms/graph/bfs/bfsSteps";
import LanguageSelector, { type Language } from "../../components/LanguageSelector";
import { translateSourceCode } from "../../utils/sourceCode";

const NODE_STYLES = {
  unvisited: { fill: "#111c31", stroke: "#64748b", text: "#e2e8f0" },
  current: { fill: "#083344", stroke: "#22d3ee", text: "#67e8f9" },
  checking: { fill: "#422006", stroke: "#fbbf24", text: "#fffbeb" },
  visited: { fill: "#052e2b", stroke: "#10b981", text: "#6ee7b7" },
  discovered: { fill: "#172554", stroke: "#38bdf8", text: "#dbeafe" },
  completed: { fill: "#064e3b", stroke: "#34d399", text: "#dcfce7" },
};

function getNodeState(step: BFSStep, nodeId: number) {
  if (step.currentNode === nodeId) return "current";
  if (step.checkingNode === nodeId) return "checking";
  if (step.completed.includes(nodeId)) return "completed";
  if (step.discovered.includes(nodeId)) {
    return step.visited.includes(nodeId) ? "visited" : "discovered";
  }
  return "unvisited";
}

function getEdgeState(step: BFSStep, edge: BFSEdge) {
  if (step.activeEdge && isEdgeActive(edge, step.activeEdge)) return "active";
  if (
    step.traversedEdges.some(
      ([from, to]) =>
        (from === edge.from && to === edge.to) ||
        (from === edge.to && to === edge.from),
    )
  ) {
    return "traversed";
  }
  return "normal";
}

function BFSGraph({ step }: { step: BFSStep }) {
  const nodes = getGraphNodes();
  const edges = getGraphEdges();
  const nodeMap = new Map(nodes.map((node) => [node.id, node]));

  return (
    <div className="relative h-[360px] min-h-[360px] overflow-hidden rounded-2xl border border-slate-800 bg-[#050b18]">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(71,85,105,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(71,85,105,0.08)_1px,transparent_1px)] bg-[size:32px_32px]" />
      <div className="absolute left-5 top-4 z-20">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.9)]" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">Graph Visualization</span>
        </div>
        <div className="mt-1 text-[10px] text-slate-600">BFS traversal state</div>
      </div>

      <svg viewBox="0 0 660 560" className="absolute inset-0 h-full w-full" role="img" aria-label="BFS graph visualization">
        {edges.map((edge) => {
          const from = nodeMap.get(edge.from);
          const to = nodeMap.get(edge.to);
          if (!from || !to) return null;
          const edgeState = getEdgeState(step, edge);
          const color = edgeState === "active" ? "#fbbf24" : edgeState === "traversed" ? "#34d399" : "#475569";
          const width = edgeState === "active" ? 4 : 2;

          return (
            <g key={`${edge.from}-${edge.to}`}>
              {edgeState === "active" && (
                <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke="#22d3ee" strokeWidth="10" opacity="0.10" />
              )}
              <line
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke={color}
                strokeWidth={width}
                strokeLinecap="round"
                className={edgeState === "active" ? "animate-pulse" : ""}
              />
              {edgeState === "active" && (
                <circle r="5" fill="#fef3c7" style={{ filter: "drop-shadow(0 0 8px rgba(251,191,36,.95))" }}>
                  <animateMotion dur="0.8s" repeatCount="indefinite" path={`M ${from.x},${from.y} L ${to.x},${to.y}`} />
                </circle>
              )}
            </g>
          );
        })}

        {nodes.map((node) => {
          const nodeState = getNodeState(step, node.id);
          const style = NODE_STYLES[nodeState];
          const isCurrent = step.currentNode === node.id;
          const isChecking = step.checkingNode === node.id;
          const isVisited = step.visited.includes(node.id);

          return (
            <g key={node.id}>
              {(isCurrent || isChecking) && (
                <circle cx={node.x} cy={node.y} r="31" fill="none" stroke={style.stroke} strokeWidth="3" opacity="0.25" className="animate-ping" />
              )}
              <circle cx={node.x} cy={node.y} r={isCurrent || isChecking ? 23 : 20} fill="none" stroke={style.stroke} strokeWidth="4" opacity="0.2" />
              <circle cx={node.x} cy={node.y} r="19" fill={style.fill} stroke={style.stroke} strokeWidth="3" />
              <text x={node.x} y={node.y + 7} textAnchor="middle" fontSize="22" fontWeight="800" fill={style.text}>{node.label}</text>
              {isCurrent && <text x={node.x} y={node.y - 38} textAnchor="middle" fontSize="10" fontWeight="800" fill="#22d3ee">CURRENT</text>}
              {isChecking && <text x={node.x} y={node.y - 38} textAnchor="middle" fontSize="10" fontWeight="800" fill="#fbbf24">CHECKING</text>}
              {isVisited && !isCurrent && !isChecking && <text x={node.x} y={node.y + 43} textAnchor="middle" fontSize="10" fontWeight="700" fill="#10b981">VISITED</text>}
              {step.discovered.includes(node.id) && !isVisited && !isCurrent && !isChecking && (
                <text x={node.x} y={node.y + 43} textAnchor="middle" fontSize="10" fontWeight="700" fill="#38bdf8">DISCOVERED</text>
              )}
            </g>
          );
        })}
      </svg>

      <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 flex-wrap items-center justify-center gap-3 rounded-xl border border-slate-800 bg-[#070e1d]/95 px-4 py-2 text-[10px] shadow-lg backdrop-blur-md">
        <span className="flex items-center gap-1.5 text-slate-500"><i className="h-2 w-2 rounded-full border border-slate-500 bg-slate-800" />Unvisited</span>
        <span className="flex items-center gap-1.5 text-emerald-400"><i className="h-2 w-2 rounded-full bg-emerald-400" />Visited</span>
        <span className="flex items-center gap-1.5 text-cyan-400"><i className="h-2 w-2 rounded-full bg-cyan-400" />Current</span>
        <span className="flex items-center gap-1.5 text-amber-300"><i className="h-2 w-2 rounded-full bg-amber-300" />Checking edge</span>
      </div>
    </div>
  );
}

function BFSInspector({ step }: { step: BFSStep }) {
  const operation = step.operation || "Waiting for BFS state";
  const condition = step.condition || "—";
  const queue = step.queue.length ? step.queue.join(", ") : "Empty";
  const visited = step.visited.length ? step.visited.join(", ") : "None";
  const traversal = step.traversalOrder.length ? step.traversalOrder.join(" → ") : "—";

  return (
    <aside className="flex min-w-0 flex-col gap-3">
      <section className="overflow-hidden rounded-2xl border border-slate-800 bg-[#050b18]">
        <div className="flex items-center gap-2 border-b border-slate-800 px-4 py-3">
          <Info size={14} className="text-cyan-400" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">Inspector</h2>
        </div>
        <div className="space-y-4 p-4">
          <div>
            <div className="mb-1.5 text-[9px] font-bold uppercase tracking-widest text-slate-600">Current Operation</div>
            <div className="rounded-lg border border-cyan-400/20 bg-cyan-400/5 px-3 py-2 text-xs font-semibold text-cyan-200">{operation}</div>
          </div>
          <div>
            <div className="mb-1.5 text-[9px] font-bold uppercase tracking-widest text-slate-600">Condition</div>
            <div className="rounded-lg border border-slate-700 bg-slate-900/70 px-3 py-2 font-mono text-[10px] leading-5 text-slate-300">{condition}</div>
          </div>
          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[9px] font-bold uppercase tracking-widest text-slate-600">Live Variables</span>
              <span className="text-[8px] uppercase text-slate-700">Step {step.step}</span>
            </div>
            <div className="space-y-2 font-mono text-[10px]">
              <div className="flex gap-3 rounded-lg bg-slate-900/70 px-2 py-2"><span className="w-12 text-slate-600">current</span><span className="text-cyan-300">{step.currentNode ?? "—"}</span></div>
              <div className="flex gap-3 rounded-lg bg-slate-900/70 px-2 py-2"><span className="w-12 text-slate-600">neighbor</span><span className="text-amber-300">{step.checkingNode ?? "—"}</span></div>
              <div className="flex gap-3 rounded-lg bg-slate-900/70 px-2 py-2"><span className="w-12 text-slate-600">queue</span><span className="text-violet-300">[{queue}]</span></div>
              <div className="flex gap-3 rounded-lg bg-slate-900/70 px-2 py-2"><span className="w-12 text-slate-600">visited</span><span className="text-emerald-300">[{visited}]</span></div>
              <div className="flex gap-3 rounded-lg bg-slate-900/70 px-2 py-2"><span className="w-12 text-slate-600">traversal</span><span className="text-sky-300">[{traversal}]</span></div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <Metric label="Queue size" value={step.queue.length} />
            <Metric label="Visited" value={step.visited.length} />
            <Metric label="Traversal" value={step.traversalOrder.length} />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-[#050b18] p-4">
        <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300"><ListOrdered size={14} className="text-violet-400" />Traversal Order</div>
        <div className="flex min-h-12 flex-wrap items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900/50 p-2 font-mono text-[10px] text-violet-300">
          {step.traversalOrder.length === 0 ? <span className="text-slate-600">Waiting for traversal…</span> : step.traversalOrder.map((node, index) => (
            <span key={`${node}-${index}`} className="rounded-md border border-violet-400/30 bg-violet-400/10 px-2 py-1">{node}{index < step.traversalOrder.length - 1 ? " → " : ""}</span>
          ))}
        </div>
      </section>
    </aside>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-2 text-center">
      <div className="text-lg font-bold text-cyan-300">{value}</div>
      <div className="mt-0.5 text-[7px] font-bold uppercase tracking-wider text-slate-600">{label}</div>
    </div>
  );
}

export default function BFSVisualizer() {
  const steps = useMemo(
    () => generateBFSSteps(DEFAULT_GRAPH, DEFAULT_START_NODE),
    [],
  );
  const [currentStep, setCurrentStep] = useState(0);
  const [language, setLanguage] = useState<Language>("TypeScript");
  const sourceCode = useMemo(
    () => translateSourceCode(BFS_SOURCE_CODE, language),
    [language],
  );
  const step = steps[Math.min(currentStep, Math.max(0, steps.length - 1))];

  const handlePrevious = () => setCurrentStep((value) => Math.max(0, value - 1));
  const handleNext = () => setCurrentStep((value) => Math.min(value + 1, steps.length - 1));
  const handleReset = () => setCurrentStep(0);

  const queuePreview = step.queue.length ? step.queue.join("  ") : "Empty";
  const traversalPreview = step.traversalOrder.length ? step.traversalOrder.join(" → ") : "—";

  return (
    <main className="min-h-screen overflow-hidden bg-[#020617] text-white">
      <div className="mx-auto max-w-[1550px] p-4 lg:p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-500/10 text-cyan-300"><GitBranch size={19} /></div>
            <div>
              <h1 className="text-lg font-bold">Breadth-First Search</h1>
              <p className="text-[10px] text-slate-500">Step-by-step graph traversal visualizer</p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-2 text-[9px] uppercase tracking-widest text-slate-500">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Attack graph · 7 nodes · 6 edges
          </div>
        </div>

        <div className="grid gap-3 xl:grid-cols-[minmax(300px,0.78fr)_minmax(560px,1.55fr)_minmax(300px,0.78fr)]">
          <section className="min-w-0 space-y-3">
            <div className="overflow-hidden rounded-2xl border border-slate-800 bg-[#050b18]" style={{ height: 430 }}>
              <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
                <div className="flex items-center gap-2"><Code2 size={14} className="text-indigo-400" /><h2 className="text-xs font-bold text-slate-200">Source Code</h2></div>
                <LanguageSelector value={language} onChange={setLanguage} />
              </div>
              <div className="h-[calc(100%-49px)] overflow-auto p-3 font-mono text-[10px] leading-6">
                {sourceCode.map((line, index) => {
                  const active = step.line === index + 1;
                  return (
                    <div key={line} className={`flex min-h-5 gap-3 rounded px-2 py-0.5 ${active ? "bg-cyan-400/10 text-cyan-200 ring-1 ring-cyan-400/30" : "text-slate-400"}`}>
                      <span className="w-5 shrink-0 text-right text-slate-700">{index + 1}</span>
                      <span className="whitespace-pre">{line}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <PanelCard icon={<Layers3 size={14} />} title="Queue" value={`[ ${queuePreview} ]`} accent="violet" />
              <PanelCard icon={<ListOrdered size={14} />} title="Traversal" value={traversalPreview} accent="emerald" />
            </div>

            <div className="rounded-2xl border border-slate-800 bg-[#050b18] p-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300"><Activity size={14} className="text-cyan-400" />Graph Information</div>
              <div className="mt-3 space-y-2 text-[10px] text-slate-500">
                <InfoRow label="Graph" value="7 nodes · 6 edges" />
                <InfoRow label="Starting Node" value={`${DEFAULT_START_NODE}`} />
                <InfoRow label="Algorithm" value="Breadth-First Search" />
                <InfoRow label="Time" value="O(V + E)" />
                <InfoRow label="Space" value="O(V)" />
              </div>
            </div>
          </section>

          <section className="min-w-0 space-y-3">
            <div className="rounded-2xl border border-slate-800 bg-[#050b18] p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2"><Sparkles size={14} className="text-indigo-400" /><span className="text-xs font-bold uppercase tracking-wider text-slate-300">What's Happening?</span></div>
                <span className="rounded-md border border-indigo-400/20 bg-indigo-400/10 px-2 py-1 text-[8px] font-bold uppercase tracking-wider text-indigo-300">Step {step.step}</span>
              </div>
              <p className="mt-3 text-xs leading-5 text-slate-300">{step.explanation}</p>
              <div className="mt-3 flex items-center gap-2 text-[9px] text-slate-600"><Zap size={12} className="text-cyan-400" />{step.operation}</div>
            </div>

            <BFSGraph step={step} />

            <div className="rounded-2xl border border-slate-800 bg-[#050b18] p-3">
              <div className="flex flex-wrap items-center justify-center gap-2">
                <button type="button" onClick={handlePrevious} disabled={currentStep === 0} className="flex min-w-[92px] items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-xs font-bold text-slate-300 transition hover:border-cyan-400/40 hover:text-cyan-300 disabled:cursor-not-allowed disabled:opacity-35"><ArrowLeft size={14} />Previous</button>
                <button type="button" onClick={handleNext} disabled={currentStep === steps.length - 1} className="flex min-w-[110px] items-center justify-center gap-2 rounded-xl border border-indigo-400/70 bg-gradient-to-r from-indigo-600 to-blue-600 px-4 py-2.5 text-xs font-black text-white shadow-[0_0_18px_rgba(79,70,229,0.35)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-35"><ArrowRight size={14} />Next</button>
                <button type="button" onClick={handleReset} className="flex min-w-[92px] items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-xs font-bold text-slate-300 transition hover:border-cyan-400/40 hover:text-cyan-300"><RotateCcw size={14} />Reset</button>
              </div>
              <div className="mt-3 flex items-center justify-between text-[9px] text-slate-600"><span>Step {currentStep + 1} of {steps.length}</span><span className="flex items-center gap-1.5"><Cpu size={11} />Manual navigation only</span></div>
            </div>
          </section>

          <BFSInspector step={step} />
        </div>
      </div>
    </main>
  );
}

function PanelCard({ icon, title, value, accent }: { icon: React.ReactNode; title: string; value: string; accent: "violet" | "emerald" }) {
  const colors = accent === "violet" ? "border-violet-400/20 bg-violet-400/5 text-violet-300" : "border-emerald-400/20 bg-emerald-400/5 text-emerald-300";
  return (
    <div className={`rounded-2xl border p-3 ${colors}`}>
      <div className="mb-2 flex items-center gap-2 text-[9px] font-bold uppercase tracking-wider text-slate-500">{icon}{title}</div>
      <div className="truncate font-mono text-[10px] font-semibold">{value}</div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return <div className="flex items-center justify-between gap-3 border-b border-slate-800/70 pb-1.5 last:border-0"><span>{label}</span><span className="font-mono text-slate-300">{value}</span></div>;
}
