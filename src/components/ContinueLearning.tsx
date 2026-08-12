import { Link } from "react-router-dom";
import {
  ArrowRight,
  Clock3,
  PlayCircle,
  Trophy,
  Flame,
  Code2,
} from "lucide-react";

import { motion } from "framer-motion";


export default function ContinueLearning() {

  return (

    <section className="mt-14">


      {/* Header */}

      <div className="mb-7">

        <h2
          className="
          text-3xl
          font-extrabold
          text-white
          "
        >
          Continue Learning
        </h2>


        <p
          className="
          mt-2
          text-slate-400
          "
        >
          Resume your algorithm journey and keep your coding streak alive.
        </p>

      </div>



      <motion.div

        initial={{
          opacity:0,
          y:25,
        }}

        animate={{
          opacity:1,
          y:0,
        }}

        whileHover={{
          y:-6,
        }}

        transition={{
          duration:0.4,
        }}


        className="
        relative
        overflow-hidden
        rounded-3xl
        border
        border-slate-800
        bg-gradient-to-br
        from-slate-900
        via-slate-950
        to-indigo-950
        p-8
        shadow-2xl
        "

      >



        {/* Background Glow */}


        <div
          className="
          absolute
          -right-20
          -top-20
          h-72
          w-72
          rounded-full
          bg-cyan-500/20
          blur-3xl
          "
        />


        <div
          className="
          absolute
          -bottom-20
          -left-20
          h-64
          w-64
          rounded-full
          bg-indigo-500/20
          blur-3xl
          "
        />



        <div className="relative z-10">


          <div
            className="
            flex
            flex-col
            gap-8
            lg:flex-row
            lg:items-center
            lg:justify-between
            "
          >



            {/* LEFT CONTENT */}


            <div className="max-w-2xl">


              <div
                className="
                inline-flex
                items-center
                gap-2
                rounded-full
                border
                border-cyan-500/30
                bg-cyan-500/10
                px-4
                py-2
                text-sm
                text-cyan-300
                "
              >

                <Code2 size={16}/>

                Merge Sort

              </div>




              <h3
                className="
                mt-5
                text-4xl
                font-extrabold
                text-white
                "
              >

                Merge Sort Visualization

              </h3>



              <p
                className="
                mt-4
                leading-7
                text-slate-400
                "
              >

                Master divide and conquer algorithms with
                recursive trees, live variables, execution flow,
                merge animations and complexity analysis.

              </p>





              {/* Stats */}


              <div
                className="
                mt-8
                flex
                flex-wrap
                gap-5
                "
              >


                <div
                  className="
                  flex
                  items-center
                  gap-2
                  rounded-xl
                  border
                  border-slate-800
                  bg-slate-900/70
                  px-4
                  py-3
                  "
                >

                  <Clock3
                    size={18}
                    className="text-cyan-400"
                  />

                  <span className="text-sm text-slate-300">
                    15 min
                  </span>

                </div>




                <div
                  className="
                  flex
                  items-center
                  gap-2
                  rounded-xl
                  border
                  border-slate-800
                  bg-slate-900/70
                  px-4
                  py-3
                  "
                >

                  <Trophy
                    size={18}
                    className="text-yellow-400"
                  />

                  <span className="text-sm text-slate-300">
                    Intermediate
                  </span>

                </div>




                <div
                  className="
                  flex
                  items-center
                  gap-2
                  rounded-xl
                  border
                  border-slate-800
                  bg-slate-900/70
                  px-4
                  py-3
                  "
                >

                  <Flame
                    size={18}
                    className="text-orange-400"
                  />

                  <span className="text-sm text-slate-300">
                    +1 Streak
                  </span>

                </div>



              </div>



            </div>






            {/* RIGHT PROGRESS CARD */}



            <div
              className="
              w-full
              max-w-sm
              rounded-3xl
              border
              border-slate-800
              bg-slate-950/80
              p-6
              "
            >


              <div
                className="
                flex
                justify-between
                "
              >

                <span className="text-slate-400">
                  Progress
                </span>


                <span className="font-bold text-cyan-400">
                  63%
                </span>


              </div>




              <div
                className="
                mt-4
                h-3
                overflow-hidden
                rounded-full
                bg-slate-800
                "
              >

                <motion.div

                  initial={{
                    width:0,
                  }}

                  animate={{
                    width:"63%",
                  }}

                  transition={{
                    duration:1.2,
                  }}

                  className="
                  h-full
                  rounded-full
                  bg-gradient-to-r
                  from-cyan-500
                  via-blue-500
                  to-indigo-500
                  "

                />

              </div>




              <Link

                to="/sorting/merge-sort"

                className="
                mt-8
                flex
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-gradient-to-r
                from-cyan-500
                to-blue-500
                px-6
                py-4
                font-bold
                text-slate-950
                transition
                hover:scale-105
                "

              >

                <PlayCircle size={20}/>

                Resume Learning

                <ArrowRight size={18}/>


              </Link>



            </div>



          </div>



        </div>



      </motion.div>



    </section>

  );
}