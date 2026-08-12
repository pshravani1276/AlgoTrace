import { motion } from "framer-motion";
import { Lightbulb } from "lucide-react";


interface Props {

  explanation:string;

}





export default function ExplanationPanel({

  explanation,

}:Props){



  return (

    <motion.div

      key={explanation}


      initial={{

        opacity:0,

        y:15,

      }}


      animate={{

        opacity:1,

        y:0,

      }}



      transition={{

        duration:0.3,

      }}



      className="
      rounded-3xl
      border
      border-slate-800
      bg-slate-900
      p-5
      shadow-xl
      "

    >






      {/* Header */}



      <div

        className="
        mb-4
        flex
        items-center
        gap-3
        "

      >



        <div

          className="
          flex
          h-10
          w-10
          items-center
          justify-center
          rounded-xl
          bg-yellow-500/20
          "

        >

          <Lightbulb

            size={22}

            className="text-yellow-400"

          />


        </div>





        <div>


          <h2

            className="
            text-xl
            font-bold
            text-white
            "

          >

            What's Happening?

          </h2>



          <p

            className="
            text-xs
            text-slate-400
            "

          >

            Live algorithm explanation

          </p>



        </div>



      </div>









      {/* Current Step */}



      <div

        className="
        rounded-2xl
        border
        border-yellow-500/20
        bg-yellow-500/10
        p-4
        "

      >


        <p

          className="
          text-sm
          leading-6
          text-yellow-100
          "

        >

          {explanation}


        </p>



      </div>









      {/* Learning Hint */}



      <div

        className="
        mt-4
        rounded-2xl
        bg-slate-950
        p-4
        "

      >


        <h3

          className="
          text-sm
          font-semibold
          text-cyan-400
          "

        >

          💡 Merge Sort Idea

        </h3>



        <p

          className="
          mt-2
          text-xs
          leading-5
          text-slate-400
          "

        >

          The algorithm repeatedly divides the array into smaller
          sub-arrays, sorts them recursively, and merges them back
          into a sorted array.


        </p>


      </div>





    </motion.div>

  );

}