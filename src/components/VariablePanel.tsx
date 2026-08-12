import { motion } from "framer-motion";

import type { MergeVariables } from "../algorithms/Sorting/MergeSort";


interface Props {

  variables: MergeVariables;

}





function VariableCard({

  title,

  value,

}: {

  title:string;

  value:string | number;

}) {


  return (

    <motion.div

      whileHover={{
        scale:1.04,
      }}

      className="
      rounded-xl
      border
      border-slate-800
      bg-slate-950
      p-3
      "

    >

      <p className="
      text-xs
      text-slate-500
      ">

        {title}

      </p>


      <p className="
      mt-1
      text-lg
      font-bold
      text-cyan-400
      ">

        {value}

      </p>


    </motion.div>

  );

}








export default function VariablePanel({

  variables,

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




      <div className="mb-4">


        <h2 className="
        text-xl
        font-bold
        text-white
        ">

          Live Variables

        </h2>


        <p className="
        text-sm
        text-slate-400
        ">

          Real-time Merge Sort execution state

        </p>


      </div>







      <div

        className="
        grid
        grid-cols-2
        gap-3
        "

      >


        <VariableCard

          title="Left Pointer"

          value={variables.left}

        />



        <VariableCard

          title="Right Pointer"

          value={variables.right}

        />



        <VariableCard

          title="Middle"

          value={variables.mid}

        />



        <VariableCard

          title="Recursion Level"

          value={variables.recursionLevel}

        />



        <VariableCard

          title="Comparisons"

          value={variables.comparisons}

        />



        <VariableCard

          title="Merge Count"

          value={variables.merges}

        />


      </div>









      <div className="mt-5">


        <h3 className="
        mb-2
        text-sm
        font-semibold
        text-cyan-400
        ">

          Current Pointers

        </h3>



        <div className="
        grid
        grid-cols-3
        gap-2
        ">



          <div className="
          rounded-lg
          bg-slate-950
          p-2
          text-center
          ">

            <p className="text-xs text-slate-500">
              i
            </p>

            <p className="font-bold text-green-400">
              {variables.i}
            </p>

          </div>





          <div className="
          rounded-lg
          bg-slate-950
          p-2
          text-center
          ">

            <p className="text-xs text-slate-500">
              j
            </p>

            <p className="font-bold text-orange-400">
              {variables.j}
            </p>

          </div>





          <div className="
          rounded-lg
          bg-slate-950
          p-2
          text-center
          ">

            <p className="text-xs text-slate-500">
              k
            </p>

            <p className="font-bold text-purple-400">
              {variables.k}
            </p>

          </div>



        </div>


      </div>









      <div className="mt-5 grid grid-cols-2 gap-4">



        {/* Left Array */}


        <div>


          <h3 className="
          mb-2
          text-xs
          font-semibold
          text-green-400
          ">

            Left Array

          </h3>


          <div className="
          flex
          flex-wrap
          gap-1
          ">


            {

              variables.leftArray.map((value,index)=>(


                <motion.span

                  key={index}

                  initial={{
                    scale:0,
                  }}

                  animate={{
                    scale:1,
                  }}

                  className="
                  rounded-md
                  bg-green-500/20
                  px-2
                  py-1
                  text-xs
                  text-green-300
                  "

                >

                  {value}

                </motion.span>


              ))

            }


          </div>


        </div>








        {/* Right Array */}


        <div>


          <h3 className="
          mb-2
          text-xs
          font-semibold
          text-orange-400
          ">

            Right Array

          </h3>


          <div className="
          flex
          flex-wrap
          gap-1
          ">


            {

              variables.rightArray.map((value,index)=>(


                <motion.span

                  key={index}

                  initial={{
                    scale:0,
                  }}

                  animate={{
                    scale:1,
                  }}

                  className="
                  rounded-md
                  bg-orange-500/20
                  px-2
                  py-1
                  text-xs
                  text-orange-300
                  "

                >

                  {value}

                </motion.span>


              ))

            }


          </div>


        </div>




      </div>









      <div className="mt-5">


        <h3 className="
        mb-2
        text-sm
        font-semibold
        text-yellow-400
        ">

          Comparing Values

        </h3>



        <div className="
        flex
        gap-2
        ">


          {

            variables.comparing.length === 0

            ?

            <span className="
            text-sm
            text-slate-500
            ">

              Waiting...

            </span>


            :


            variables.comparing.map((value,index)=>(


              <motion.div

                key={index}

                initial={{
                  scale:0,
                }}

                animate={{
                  scale:1,
                }}

                className="
                rounded-lg
                bg-cyan-500/20
                px-4
                py-2
                font-bold
                text-cyan-300
                "

              >

                {value}

              </motion.div>


            ))

          }


        </div>


      </div>




    </div>

  );

}