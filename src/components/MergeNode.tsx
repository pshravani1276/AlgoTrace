import { motion } from "framer-motion";
import type { MergeNode } from "../algorithms/Sorting/mergeSort";

type MergeNodeProps = {
  node: MergeNode;
  activeNode: string | null;
};

export default function MergeNodeComponent({
  node,
  activeNode,
}: MergeNodeProps) {
  const isActive = node.id === activeNode;

  return (
    <div className="flex flex-col items-center">

      {/* Current Node */}

      <motion.div
        layout
        animate={{
          scale: isActive ? 1.08 : 1,
        }}
        transition={{
          duration: 0.3,
        }}
        className={`
          min-w-[90px]
          rounded-2xl
          border
          px-4
          py-3
          text-center
          shadow-lg
          transition-all
          duration-300

          ${
            isActive
              ? "border-cyan-400 bg-cyan-500 text-slate-950 shadow-cyan-500/40"
              : "border-slate-700 bg-slate-800 text-white"
          }
        `}
      >
        <div className="text-xs text-slate-300">
          Level {node.level}
        </div>

        <div className="mt-1 font-bold">
          [{node.values.join(", ")}]
        </div>
      </motion.div>

      {/* Children */}

      {(node.left || node.right) && (

        <div className="mt-6 flex items-start justify-center gap-12">

          {node.left && (

            <div className="flex flex-col items-center">

              <div className="mb-3 h-6 w-px bg-slate-600" />

              <MergeNodeComponent
                node={node.left}
                activeNode={activeNode}
              />

            </div>

          )}

          {node.right && (

            <div className="flex flex-col items-center">

              <div className="mb-3 h-6 w-px bg-slate-600" />

              <MergeNodeComponent
                node={node.right}
                activeNode={activeNode}
              />

            </div>

          )}

        </div>

      )}

    </div>
  );
}