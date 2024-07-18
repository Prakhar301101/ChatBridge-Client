import React, { useState } from 'react'
import Footer from '../components/Footer'
import Header from '../components/Header'
import { Link,Navigate } from 'react-router-dom'

const Login = () => {
  const[username,setUsername] =useState('');
  const[password,setPassword] =useState('');
  const[email,setEmail]=useState('');
  const[redirect,setRedirect] =useState(false);

  const userData={email,name:username,password};

  const loginUser= async (e)=>{
    e.preventDefault();
    const response = await fetch("http://localhost:8000/api/users/login", {
      method: "POST",
      body:JSON.stringify(userData),
      headers:{
        'Content-Type':'application/json'
      },
    })
    if(response.status==400){
      alert('Error while while logging in,try different credentials!');
    }
    if(response.status==200){
      const data=await response.json();
      alert('LogIn successful');
      console.log(data);
      setRedirect(true);
    }
  }
  if(redirect){
    return <Navigate to={"/chat"}/>
  }
  return (
    <div className='min-h-screen flex flex-col items-center'>
      <Header/>
      <div className=" text-white h-1/2 mt-6 md:mt-10 w-4/5 max-w-lg px-4 py-6 rounded-2xl bg-transparent backdrop-blur-xl flex flex-col justify-center border-[1px] border-gray-400 shadow-xl">
        <h1 className="text-xl md:text-3xl text-center p">Sign-In</h1>
        <form className="flex flex-col px-1 py-3 md:px-3 md:py-5" onSubmit={loginUser} id="Signup-form">
          <input
            className="my-2 rounded-2xl px-2 py-1 md:py-2 text:lg md:text-xl text-white bg-transparent border "
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          ></input>
          <input
            className="my-2 rounded-2xl px-2 py-1 md:py-2 text:lg md:text-xl text-white bg-transparent border "
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          ></input>
          <input
            className="my-2 rounded-2xl px-2 py-1 md:py-2 text:lg md:text-xl  text-white bg-transparent border"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          ></input>
          <button
            className="my-2 bg-white text-slate-700 rounded-lg p-1"
            type="submit"
          >
            Log-In
          </button>
          <div className="flex justify-center items-center gap-2 sm:gap-3 ">
          <span>New User?</span>
          <Link to="/register" className="text-slate-300">
            Sign-Up
          </Link>
        </div>
        </form>
      </div>
      <Footer/>
      </div>
  )
}

export default Login