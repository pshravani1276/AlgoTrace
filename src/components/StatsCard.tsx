import type { ReactNode } from "react";
import { motion } from "framer-motion";

interface Props {
  title: string;
  value: string;
  detail: string;
  progress: number;
  icon: ReactNode;
  color: string;
}

export default function StatsCard({
  title,
  value,
  detail,
  progress,
  icon,
  color,
}: Props) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      whileHover={{
        y: -10,
        scale: 1.03,
      }}
      transition={{
        duration: 0.35,
      }}
      className="
        group
        relative
        overflow-hidden
        rounded-3xl
        border
        border-slate-800
        bg-slate-900/70
        p-6
        shadow-2xl
        backdrop-blur-2xl
      "
    >
      {/* Animated Glow */}

      <div
        className={`
          absolute
          -right-16
          -top-16
          h-44
          w-44
          rounded-full
          bg-gradient-to-br
          ${color}
          opacity-20
          blur-3xl
          transition-all
          duration-700
          group-hover:opacity-50
        `}
      />

      {/* Shine Effect */}

      <div
        className="
          absolute
          inset-0
          -translate-x-full
          bg-gradient-to-r
          from-transparent
          via-white/10
          to-transparent
          transition-transform
          duration-700
          group-hover:translate-x-full
        "
      />

      {/* Content */}

      <div className="relative z-10">

        <div className="flex items-start justify-between">

          {/* Text */}

          <div>
            <p className="text-sm text-slate-400">
              {title}
            </p>

            <motion.h2
              initial={{
                scale: 0.8,
              }}
              animate={{
                scale: 1,
              }}
              className="
                mt-3
                text-4xl
                font-extrabold
                text-white
              "
            >
              {value}
            </motion.h2>
          </div>

          {/* Icon */}

          <motion.div
            whileHover={{
              rotate: 12,
              scale: 1.15,
            }}
            className={`
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-2xl
              bg-gradient-to-br
              ${color}
              text-white
              shadow-lg
            `}
          >
            {icon}
          </motion.div>

        </div>

        <div className="mt-6">
          <div
            className="
              h-2
              overflow-hidden
              rounded-full
              bg-slate-800
            "
          >
            <motion.div
              initial={{
                width: 0,
              }}
              animate={{
                width: `${Math.max(0, Math.min(progress, 100))}%`,
              }}
              transition={{
                duration: 1,
              }}
              className={`
                h-full
                rounded-full
                bg-gradient-to-r
                ${color}
              `}
            />
          </div>
        </div>

        <p className="mt-4 text-xs text-slate-500">{detail}</p>

      </div>

    </motion.div>
  );
}