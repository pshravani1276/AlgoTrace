import { motion } from "framer-motion";


interface Props {

  comparisons:number;

  merges:number;

  currentStep:number;

  totalSteps:number;

}




function StatCard({

  title,

  value,

}:{

  title:string;

  value:string | number;

}){


  return (

    <motion.div

      whileHover={{
        scale:1.03,
      }}

      className="
      rounded-xl
      border
      border-slate-800
      bg-slate-950
      p-4
      "

    >


      <p className="
      text-xs
      text-slate-400
      ">

        {title}

      </p>


      <h3 className="
      mt-1
      text-xl
      font-bold
      text-cyan-400
      ">

        {value}

      </h3>


    </motion.div>

  );

}






export default function ComplexityPanel({

  comparisons,

  merges,

  currentStep,

  totalSteps,

}:Props){



  const progress =

    totalSteps === 0

    ?

    0

    :

    ((currentStep + 1) / totalSteps) * 100;





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





      <div className="flex items-center justify-between">


        <div>


          <h2 className="
          text-xl
          font-bold
          text-white
          ">

            Complexity Analysis

          </h2>


          <p className="
          text-xs
          text-slate-400
          ">

            Live performance monitoring

          </p>


        </div>



        <div className="
        text-right
        ">


          <p className="
          text-xs
          text-slate-400
          ">

            Progress

          </p>


          <p className="
          font-bold
          text-cyan-400
          ">

            {Math.round(progress)}%

          </p>


        </div>



      </div>








      {/* Progress Bar */}



      <div className="
      mt-4
      h-3
      overflow-hidden
      rounded-full
      bg-slate-800
      ">


        <motion.div

          animate={{

            width:`${progress}%`

          }}


          transition={{

            duration:0.4

          }}


          className="
          h-full
          rounded-full
          bg-gradient-to-r
          from-cyan-500
          to-blue-500
          "

        />



      </div>









      {/* Statistics */}



      <div

        className="
        mt-5
        grid
        gap-3
        md:grid-cols-6
        "

      >


        <StatCard

          title="Best"

          value="O(n log n)"

        />


        <StatCard

          title="Average"

          value="O(n log n)"

        />


        <StatCard

          title="Worst"

          value="O(n log n)"

        />


        <StatCard

          title="Space"

          value="O(n)"

        />


        <StatCard

          title="Comparisons"

          value={comparisons}

        />


        <StatCard

          title="Merges"

          value={merges}

        />


      </div>








      {/* Status */}



      <div className="
      mt-5
      flex
      justify-between
      rounded-xl
      bg-slate-950
      p-3
      text-sm
      ">


        <span className="text-slate-400">

          Current Step:

          <b className="ml-2 text-white">

            {currentStep + 1}/{totalSteps}

          </b>

        </span>




        <span className="text-green-400 font-semibold">


          {

            progress >= 100

            ?

            "Completed"

            :

            "Running"

          }


        </span>



      </div>




    </div>

  );

}