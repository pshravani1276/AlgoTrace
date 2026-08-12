/* eslint-disable react-refresh/only-export-components */

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import type { ReactNode } from "react";

import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

import type { User } from "firebase/auth";

import {
  auth,
  googleProvider,
} from "../firebase/firebase";



interface AuthContextType {

  user: User | null;

  loading: boolean;


  login:
  (
    email:string,
    password:string
  )=>Promise<void>;


  signup:
  (
    name:string,
    email:string,
    password:string
  )=>Promise<void>;


  googleLogin:
  ()=>Promise<void>;


  logout:
  ()=>Promise<void>;

}



const AuthContext =
createContext<AuthContextType | null>(null);



interface Props{

  children:ReactNode;

}



let googleLoginRunning = false;



export function AuthProvider({
  children
}:Props){



const [user,setUser] =
useState<User | null>(null);



const [loading,setLoading] =
useState(true);





useEffect(()=>{


const unsubscribe =
onAuthStateChanged(
  auth,
  (currentUser)=>{

    setUser(currentUser);

    setLoading(false);

  }
);



return unsubscribe;



},[]);







async function login(
email:string,
password:string
){


await signInWithEmailAndPassword(
  auth,
  email,
  password
);


}








async function signup(
name:string,
email:string,
password:string
){


const result =
await createUserWithEmailAndPassword(
  auth,
  email,
  password
);



await updateProfile(
  result.user,
  {
    displayName:name
  }
);



}









async function googleLogin(){



if(googleLoginRunning){

return;

}



try{


googleLoginRunning = true;



await signInWithPopup(
  auth,
  googleProvider
);



}

catch(error:any){



if(
error?.code ===
"auth/cancelled-popup-request"
){

return;

}



throw error;



}

finally{


googleLoginRunning = false;


}



}








async function logout(){


await signOut(auth);


}







return (


<AuthContext.Provider

value={{

user,

loading,

login,

signup,

googleLogin,

logout

}}

>


{children}


</AuthContext.Provider>



);



}







export function useAuth(){



const context =
useContext(AuthContext);



if(!context){


throw new Error(
"useAuth must be inside AuthProvider"
);


}



return context;



}