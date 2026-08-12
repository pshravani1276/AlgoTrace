import {
  Search,
  ArrowUpDown,
  Network,
  GitBranch,
} from "lucide-react";

import { useNavigate } from "react-router-dom";



export default function Categories(){


const navigate = useNavigate();



const categories = [

{
name:"Searching",
icon:<Search size={35}/>,
items:[
"Linear Search",
"Binary Search"
]
},


{
name:"Sorting",
icon:<ArrowUpDown size={35}/>,
items:[
"Bubble Sort",
"Merge Sort",
"Quick Sort"
]
},


{
name:"Graph",
icon:<Network size={35}/>,
items:[
"BFS",
"DFS",
"Dijkstra"
]
},


{
name:"Trees",
icon:<GitBranch size={35}/>,
items:[
"Binary Tree",
"BST",
"AVL Tree"
]
}

];





return (

<div

className="
min-h-screen
bg-slate-950
p-10
text-white
"

>


<h1

className="
text-4xl
font-bold
"

>

Explore Algorithm Categories

</h1>



<p

className="
mt-3
text-slate-400
"

>

Learn algorithms visually

</p>





<div

className="
mt-10
grid
gap-6
md:grid-cols-2
lg:grid-cols-4
"

>


{

categories.map(category=>(


<div

key={category.name}

className="
rounded-3xl
border
border-slate-800
bg-slate-900
p-6
hover:border-cyan-400
transition
"

>


<div className="
text-cyan-400
mb-4
">

{category.icon}

</div>



<h2 className="
text-2xl
font-bold
">

{category.name}

</h2>





<div className="
mt-5
space-y-3
">


{

category.items.map(item=>(


<button

key={item}

onClick={()=>{


if(item==="Merge Sort"){

navigate("/sorting/merge-sort");

}


}}


className="
w-full
rounded-xl
bg-slate-950
p-3
text-left
hover:border
hover:border-cyan-400
"

>

{item}

</button>


))


}



</div>



</div>


))


}


</div>





</div>


);

}