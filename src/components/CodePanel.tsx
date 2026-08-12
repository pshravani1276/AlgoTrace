import { motion } from "framer-motion";


interface Props {

  currentLine:number;

}




const codeLines = [

  "function mergeSort(arr){",

  "   if(arr.length <= 1)",

  "       return arr;",


  "   mid = divide array;",


  "   left = mergeSort(left);",


  "   right = mergeSort(right);",


  "   return merge(left,right);",


  "}",


  "",


  "function merge(left,right){",


  "   compare elements;",


  "   select smaller value;",


  "   add into result array;",


  "   return sorted array;",


  "}"

];







export default function CodePanel({

  currentLine,

}:Props){



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



      {/* Header */}



      <div className="mb-4">


        <h2

          className="
          text-xl
          font-bold
          text-white
          "

        >

          Merge Sort Code

        </h2>


        <p

          className="
          text-sm
          text-slate-400
          "

        >

          Current execution line

        </p>


      </div>








      {/* Code Area */}



      <div

        className="
        rounded-2xl
        bg-black/40
        p-3
        font-mono
        text-xs
        "

      >



        {

          codeLines.map((line,index)=>(


            <motion.div


              key={index}



              animate={{

                backgroundColor:

                currentLine === index

                ?

                "rgba(6,182,212,0.25)"

                :

                "transparent"


              }}



              className={`

              flex

              gap-3

              rounded-lg

              px-2

              py-1


              ${

                currentLine === index

                ?

                "text-cyan-300"

                :

                "text-slate-400"

              }


              `}


            >



              <span

                className="
                w-5
                text-right
                text-slate-600
                "

              >

                {index+1}

              </span>




              <span>

                {line}

              </span>



            </motion.div>



          ))

        }




      </div>








      {/* Current Operation */}



      <div

        className="
        mt-4
        rounded-xl
        border
        border-cyan-500/20
        bg-cyan-500/10
        p-3
        "

      >


        <p

          className="
          text-xs
          text-cyan-200
          "

        >

          🔥 Highlighted line shows the current Merge Sort execution step.

        </p>


      </div>




    </div>

  );

}