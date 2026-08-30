import React, { useContext } from 'react'
import assets from "../assets/assets";
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { AuthContext } from "../../context/AuthContext"

const Loginpage = () => {

  const [curentState, setcurentState] = useState("Sign Up")
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [bio, setBio] = useState("")
  const [isDataSubmited, setisDataSubmited] = useState(false)

  const {login} = useContext(AuthContext)

  const handelsubmit = async (events) => {
    events.preventDefault();
    if(curentState === "Sign Up" && !isDataSubmited) {
      if(fullName && email && password) {
        setisDataSubmited(true);
        return;
      } else {
        alert("Please fill all fields");
      }
    }
    
    login(curentState === "Sign Up" ? "signup" : "login", {fullName, email, password, bio})
  }
  

  return (
    <div className='min-h-screen w-full absolute bg-cover bg-center h-full flex items-center lg:justify-evenly gap-7 lg:gap-0 pt-[100px] lg:pt-0 flex-col lg:flex-row backdrop-blur-2xl'>
      <img src={assets.logo_big} alt="" className='w-[230px]' />
      <form onSubmit={handelsubmit} className='flex flex-col border-[1.5px] border-gray-400 rounded-xl justify-center gap-3 w-[330px] bg-gray-400/10 px-5 py-4'>
      <h1 className='text-white text-[27px] flex justify-between cursor-pointer items-center font-medium w-full'>
      {curentState}
      {isDataSubmited && <img className='w-8' onClick={()=>setisDataSubmited(false)} src={assets.arrow_icon} alt="" /> }
      </h1>

        {curentState === "Sign Up" && !isDataSubmited && (
            <div>
            <input type="text" onChange={(e)=>setFullName(e.target.value)} value={fullName} placeholder='Full Name' className='bg-transparent w-full border-[0.5px] placeholder:text-[16px] placeholder:font-semibold border-gray-500 text-gray-300 rounded-[7px] px-4 py-2 my-2' required />
        </div>
        )}

        {!isDataSubmited && (
          <>
             <div>
          <input type="email" onChange={(e)=>setEmail(e.target.value)} value={email} placeholder='email Address' className='bg-transparent w-full border-[0.5px] placeholder:text-[16px] placeholder:font-semibold border-gray-500 text-gray-300 rounded-[7px] px-4 py-2 my-2' required />
        </div>
        <div>
          <input type="password" onChange={(e)=>setPassword(e.target.value)} value={password} placeholder='password' className='bg-transparent border-[0.5px] placeholder:text-[16px] placeholder:font-semibold border-gray-500 text-gray-300 rounded-[7px] px-4 py-2 w-full my-2' required />
        </div>
          </>
        )}

        {curentState === "Sign Up" && isDataSubmited && (
          <div>
          <textarea type="text" rows={4} onChange={(e)=>setBio(e.target.value)} value={bio} placeholder='Provide a short bio..' className='bg-transparent border-[0.5px] placeholder:text-[16px] placeholder:font-semibold border-gray-500 text-gray-300 rounded-[7px] px-4 py-2 w-full my-2' required > </textarea>
        </div>
        )}
       
        <div>
          <button type="submit" className="text-white w-full bg-gradient-to-r from-purple-400 via-purple-500 to-purple-700 hover:bg-gradient-to-br cursor-pointer rounded-[6px] px-5 py-2.5 text-center font-medium text-[16px]">
           {curentState === "Sign Up" ? "Creat acount" : "Login"}
          </button>
        </div>
        <div className='flex items-center gap-2 text-gray-300 text-[14px]'>
          <input type="checkbox" />
          <p className='text-gray-400'>Agree to the terms of use & privacy policy.</p>
        </div>
        <div className='text-gray-300 text-[14px] mt-4 mb-2'>
        {curentState === "Sign Up" ? (
          <p className='text-gray-400'>Already have an account? <Link href="" onClick={() => {setcurentState("Login"); setisDataSubmited(false)}} className='text-violet-500 font-medium'>Login now
          </Link></p>
        ): (
          <p className='text-gray-400'>Create an account <Link href="" onClick={() => setcurentState("Sign Up")} className='text-violet-500 font-medium'>Click here</Link></p>
        )}
          
        </div>
      </form>
    </div>
  )
}

export default Loginpage
