export interface BubbleSortStep {

  step:number;

  line:number;

  array:number[];

  i:number;

  j:number;

  comparing:number[];

  swapping:number[];

  sorted:number[];

  explanation:string;

}



export function generateBubbleSortSteps(
initial:number[]
){


const arr=[...initial];

const steps:BubbleSortStep[]=[];


const sorted:number[]=[];


let step=0;



steps.push({

step:step++,

line:1,

array:[...arr],

i:-1,

j:-1,

comparing:[],

swapping:[],

sorted:[],

explanation:
"Bubble Sort starts by comparing adjacent elements."

});





for(
let i=0;
i<arr.length-1;
i++
){


for(
let j=0;
j<arr.length-i-1;
j++
){


steps.push({

step:step++,

line:6,

array:[...arr],

i,

j,

comparing:[j,j+1],

swapping:[],

sorted:[...sorted],

explanation:
`Comparing ${arr[j]} and ${arr[j+1]}`

});



if(arr[j]>arr[j+1]){


steps.push({

step:step++,

line:8,

array:[...arr],

i,

j,

comparing:[],

swapping:[j,j+1],

sorted:[...sorted],

explanation:
`${arr[j]} is greater than ${arr[j+1]}, swapping values.`

});



[
arr[j],
arr[j+1]
]=
[
arr[j+1],
arr[j]
];



steps.push({

step:step++,

line:9,

array:[...arr],

i,

j,

comparing:[],

swapping:[j,j+1],

sorted:[...sorted],

explanation:
"Swap completed."

});


}


}



sorted.unshift(
arr[arr.length-i-1]
);



steps.push({

step:step++,

line:12,

array:[...arr],

i,

j:-1,

comparing:[],

swapping:[],

sorted:[...sorted],

explanation:
`${arr[arr.length-i-1]} is now in correct position.`

});


}



steps.push({

step:step,

line:14,

array:[...arr],

i:-1,

j:-1,

comparing:[],

swapping:[],

sorted:[
0,
1,
2,
3,
4,
5,
6
],

explanation:
"Bubble Sort completed successfully."

});


return steps;

}