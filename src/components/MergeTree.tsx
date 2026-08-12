import { motion } from "framer-motion";

import type { MergeNode } from "../algorithms/Sorting/MergeSort";



interface Props {

  root: MergeNode;

  activeNode:string | null;

}





export default function MergeTree({

  root,

  activeNode,

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
        text-2xl
        font-bold
        text-white
        ">

          Merge Recursion Tree

        </h2>


        <p className="
        text-sm
        text-slate-400
        ">

          Divide → Sort → Merge visualization

        </p>


      </div>






      <div

        className="
        flex
        justify-center
        overflow-x-auto
        "

      >


        <TreeNode

          node={root}

          activeNode={activeNode}

        />


      </div>



    </div>

  );

}









function TreeNode({

  node,

  activeNode,

}:{

  node:MergeNode;

  activeNode:string|null;

}){



  const active = node.id === activeNode;






  /*
    Hide nodes until algorithm reaches them
  */


  if(!node.visible && !active){

    return null;

  }







  return (

    <motion.div


      initial={{

        opacity:0,

        scale:0.5,

        y:-20,

      }}


      animate={{

        opacity:1,

        scale:active ? 1.12 : 1,

        y:0,

      }}



      transition={{

        duration:0.4,

      }}



      className="
      flex
      flex-col
      items-center
      "

    >







      {/* Node Box */}



      <div


        className={`

        rounded-xl

        border

        px-4

        py-2

        text-sm

        font-bold

        whitespace-nowrap


        ${

          active

          ?

          "border-cyan-400 bg-cyan-500/30 text-cyan-300 shadow-lg shadow-cyan-500/20"

          :

          "border-slate-700 bg-slate-950 text-white"

        }


        `}


      >


        [

        {node.values.join(", ")}

        ]


      </div>









      {/* Children */}



      {

        (node.left || node.right)

        &&


        <>


          <div

            className="
            h-6
            w-px
            bg-slate-700
            "

          />





          <div

            className="
            flex
            gap-8
            "

          >




            {

              node.left &&

              <TreeNode

                node={node.left}

                activeNode={activeNode}

              />


            }






            {

              node.right &&

              <TreeNode

                node={node.right}

                activeNode={activeNode}

              />


            }



          </div>



        </>


      }





    </motion.div>

  );

}