import { motion } from "framer-motion";

interface Props {
  array: number[];
  activeIndices: number[];
}

export default function ArrayVisualizer({
  array,
  activeIndices,
}: Props) {
  return (
    <div
      className="
        rounded-3xl
        border
        border-slate-800
        bg-slate-900
        p-5
        shadow-xl
      "
    >
      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="mb-5">
        <h2
          className="
            text-xl
            font-bold
            text-white
          "
        >
          Array Visualization
        </h2>

        <p
          className="
            text-sm
            text-slate-400
          "
        >
          Follow the current Merge Sort step
        </p>
      </div>


      {/* =====================================================
          ARRAY ELEMENTS
      ====================================================== */}

      <div
        className="
          flex
          min-h-24
          flex-wrap
          items-center
          justify-center
          gap-3
        "
      >
        {array.length > 0 ? (
          array.map((value, index) => {
            const isActive =
              activeIndices.includes(index);

            return (
              <motion.div
                key={`${index}-${value}`}
                layout
                animate={{
                  scale: isActive ? 1.12 : 1,
                  y: isActive ? -7 : 0,
                }}
                transition={{
                  duration: 0.2,
                }}
                className={`
                  flex
                  h-16
                  w-16
                  flex-col
                  items-center
                  justify-center
                  rounded-xl
                  border
                  font-bold
                  transition-all
                  duration-200

                  ${
                    isActive
                      ? `
                        border-cyan-400
                        bg-cyan-500/30
                        text-cyan-300
                        shadow-lg
                        shadow-cyan-500/20
                      `
                      : `
                        border-slate-700
                        bg-slate-950
                        text-white
                      `
                  }
                `}
              >
                <span className="text-lg">
                  {value}
                </span>

                <span
                  className="
                    text-[10px]
                    text-slate-500
                  "
                >
                  index {index}
                </span>
              </motion.div>
            );
          })
        ) : (
          <p className="text-sm text-slate-500">
            No array data available
          </p>
        )}
      </div>


      {/* =====================================================
          CURRENT OPERATION
      ====================================================== */}

      <div
        className="
          mt-5
          rounded-xl
          border
          border-slate-800
          bg-slate-950
          p-4
          text-center
        "
      >
        {activeIndices.length > 0 ? (
          <>
            <p
              className="
                text-xs
                uppercase
                tracking-widest
                text-slate-500
              "
            >
              Current Operation
            </p>

            <p
              className="
                mt-2
                text-sm
                font-semibold
                text-cyan-400
              "
            >
              Comparing / processing index
              {activeIndices.length > 1
                ? "es"
                : ""}
            </p>

            <div
              className="
                mt-2
                flex
                justify-center
                gap-2
              "
            >
              {activeIndices.map(
                (index) => (
                  <span
                    key={index}
                    className="
                      rounded-lg
                      bg-cyan-500/10
                      px-3
                      py-1
                      text-xs
                      font-bold
                      text-cyan-400
                    "
                  >
                    {index}
                  </span>
                )
              )}
            </div>
          </>
        ) : (
          <>
            <p
              className="
                text-xs
                uppercase
                tracking-widest
                text-slate-500
              "
            >
              Current Operation
            </p>

            <p
              className="
                mt-2
                text-sm
                text-slate-400
              "
            >
              Waiting for the next step...
            </p>
          </>
        )}
      </div>


      {/* =====================================================
          STEP-BY-STEP HINT
      ====================================================== */}

      <div
        className="
          mt-3
          flex
          items-center
          justify-center
          gap-2
          text-xs
          text-slate-500
        "
      >
        <span
          className="
            h-2
            w-2
            rounded-full
            bg-cyan-400
          "
        />

        Click
        <span className="font-semibold text-slate-300">
          Next
        </span>
        to perform one operation
      </div>
    </div>
  );
}