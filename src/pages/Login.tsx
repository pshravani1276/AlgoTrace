import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  Mail,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

import AnimatedBackground from "../components/auth/AnimatedBackground";


export default function Login() {


  const navigate = useNavigate();


  const {
    login,
  } = useAuth();



  const [email,setEmail] =
  useState("");


  const [password,setPassword] =
  useState("");


  const [showPassword,setShowPassword] =
  useState(false);


  const [loading,setLoading] =
  useState(false);


  const [error,setError] =
  useState("");



  async function handleLogin(
    e: React.FormEvent<HTMLFormElement>
  ){

    e.preventDefault();


    try{

      setLoading(true);
      setError("");


      await login(
        email,
        password
      );


      navigate("/dashboard");


    }
    catch(err:unknown){


      setError(

        err instanceof Error
        ? err.message
        : "Login failed"

      );

    }
    finally{

      setLoading(false);

    }

  }




  





return (

<div
className="
relative
min-h-screen
overflow-hidden
bg-slate-950
flex
items-center
justify-center
px-4
"
>


<AnimatedBackground />



<div
className="
relative
z-10
w-full
max-w-md
rounded-2xl
border
border-white/10
bg-white/10
backdrop-blur-xl
p-8
shadow-2xl
"
>


<div
className="
text-center
mb-8
"
>


<h1
className="
text-4xl
font-bold
text-white
"
>

AlgoTrace

</h1>


<p
className="
text-slate-400
mt-2
"
>

Learn Algorithms Visually

</p>


<h2
className="
mt-6
mb-2
text-2xl
font-semibold
text-white
"
>

Welcome Back 👋

</h2>


<p
className="
text-slate-400
"
>

Login to continue your learning journey.

</p>


</div>





{
error &&

<div
className="
mb-5
rounded-lg
border
border-red-500
bg-red-500/20
p-3
text-sm
text-red-300
"
>

{error}

</div>

}




<form
onSubmit={handleLogin}
className="
space-y-5
"
>



<div>

<label
className="
mb-2
block
text-sm
text-slate-300
"
>

Email

</label>


<div
className="
relative
"
>

<Mail
size={18}
className="
absolute
left-3
top-3.5
text-slate-400
"
/>


<input

type="email"

required

value={email}

onChange={
(e)=>setEmail(e.target.value)
}

placeholder="Enter your email"


className="
w-full
rounded-lg
border
border-slate-700
bg-slate-900/70
py-3
pl-10
pr-4
text-white
outline-none
focus:border-indigo-500
"

/>

</div>

</div>





<div>

<label
className="
mb-2
block
text-sm
text-slate-300
"
>

Password

</label>


<div
className="
relative
"
>


<Lock
size={18}
className="
absolute
left-3
top-3.5
text-slate-400
"
/>



<input

type={
showPassword
?
"text"
:
"password"
}

required

value={password}

onChange={
(e)=>setPassword(e.target.value)
}


placeholder="Enter password"


className="
w-full
rounded-lg
border
border-slate-700
bg-slate-900/70
py-3
pl-10
pr-12
text-white
outline-none
focus:border-indigo-500
"

/>



<button

type="button"

onClick={
()=>setShowPassword(!showPassword)
}

className="
absolute
right-3
top-3.5
text-slate-400
"

>


{
showPassword
?
<EyeOff size={18}/>
:
<Eye size={18}/>
}


</button>


</div>

</div>





<div
className="
text-right
"
>


<Link

to="/forgot-password"

className="
text-sm
text-indigo-400
hover:text-indigo-300
"

>

Forgot Password?

</Link>


</div>





<button

disabled={loading}

className="
flex
w-full
items-center
justify-center
rounded-lg
bg-indigo-600
py-3
font-semibold
text-white
transition
hover:bg-indigo-700
disabled:opacity-50
"

>

{

loading
?
"Logging In..."
:
"Login"

}


</button>




</form>





<div
className="
my-6
flex
items-center
gap-3
"
>

<div
className="
h-px
flex-1
bg-slate-700
"
/>


<span
className="
text-sm
text-slate-400
"
>

OR

</span>


<div
className="
h-px
flex-1
bg-slate-700
"
/>


</div>






<p
className="
mt-6
text-center
text-slate-400
"
>

Don't have an account?


<Link

to="/signup"

className="
ml-2
font-medium
text-indigo-400
hover:text-indigo-300
"

>

Sign Up

</Link>


</p>




</div>


</div>


);

}