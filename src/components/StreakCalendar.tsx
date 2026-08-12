import { Flame, X } from "lucide-react";


interface Props {

  onClose?: () => void;

}



export default function StreakCalendar({
  onClose
}: Props) {


  const days = Array.from(
    { length: 35 },
    (_, index) => index + 1
  );



  return (

    <div

      className="
      relative
      w-96
      rounded-3xl
      border
      border-slate-700
      bg-slate-900
      p-6
      shadow-2xl
      "

    >



      {/* Close Button */}

      {
        onClose &&

        <button

          onClick={onClose}

          className="
          absolute
          right-4
          top-4
          rounded-full
          bg-slate-800
          p-2
          text-slate-300
          hover:bg-slate-700
          "

        >

          <X size={18}/>


        </button>

      }






      {/* Header */}

      <div className="
      mb-6
      flex
      items-center
      gap-3
      ">


        <div

          className="
          rounded-xl
          bg-orange-500/20
          p-3
          "

        >

          <Flame

            className="text-orange-400"

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

            Coding Streak

          </h2>


          <p className="
          text-sm
          text-slate-400
          ">

            Keep learning every day 🔥

          </p>


        </div>


      </div>






      {/* Month */}

      <div className="
      mb-5
      flex
      items-center
      justify-between
      text-white
      ">


        <button className="text-slate-400">

          ◀

        </button>



        <h3 className="font-semibold">

          August 2026

        </h3>



        <button className="text-slate-400">

          ▶

        </button>


      </div>






      {/* Week */}

      <div className="
      mb-3
      grid
      grid-cols-7
      text-center
      text-xs
      text-slate-500
      ">


        {
          [
            "S",
            "M",
            "T",
            "W",
            "T",
            "F",
            "S"
          ]

          .map(
            (day,index)=>(

              <span key={index}>

                {day}

              </span>

            )
          )

        }


      </div>








      {/* Calendar */}

      <div className="
      grid
      grid-cols-7
      gap-2
      ">


        {

          days.map((day)=>(


            <div

              key={day}

              className={`
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-lg
              text-sm
              transition


              ${
                day <= 12

                ?

                "bg-orange-500 text-white"

                :

                "bg-slate-800 text-slate-400"

              }


              `}

            >

              {day}


            </div>


          ))

        }


      </div>






      {/* Footer */}

      <div

        className="
        mt-6
        rounded-xl
        bg-slate-800
        p-4
        text-center
        "

      >

        <p className="text-sm text-slate-400">

          Current Streak

        </p>


        <p className="
        mt-1
        text-3xl
        font-bold
        text-orange-400
        ">

          🔥 12 Days

        </p>


      </div>



    </div>


  );

}