import { motion } from "framer-motion";

const symbols = [
  "{}",
  "[]",
  "()",
  "< />",
  "0",
  "1",
  "if",
  "for",
  "while",
  "O(n)",
  "DFS",
  "BFS",
  "Σ",
];

export default function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">

      {/* Gradient Blob 1 */}

      <motion.div
        animate={{
          x: [0, 120, 0],
          y: [0, -80, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -top-32 -left-24 h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl"
      />

      {/* Gradient Blob 2 */}

      <motion.div
        animate={{
          x: [0, -100, 0],
          y: [0, 80, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-0 right-0 h-[450px] w-[450px] rounded-full bg-cyan-500/15 blur-3xl"
      />

      {/* Floating Symbols */}

      {symbols.map((symbol, index) => (
        <motion.span
          key={index}
          initial={{
            opacity: 0,
            y: 50,
          }}
          animate={{
            opacity: [0.1, 0.35, 0.1],
            y: [-30, 30, -30],
          }}
          transition={{
            duration: 6 + index,
            repeat: Infinity,
          }}
          className="absolute text-slate-600 font-mono select-none"
          style={{
            left: `${(index * 31 + 7) % 90}%`,
            top: `${(index * 47 + 11) % 90}%`,
            fontSize: `${18 + ((index * 7) % 18)}px`,
          }}
        >
          {symbol}
        </motion.span>
      ))}
    </div>
  );
}