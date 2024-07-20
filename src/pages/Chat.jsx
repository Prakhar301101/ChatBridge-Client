import React, { useEffect,useContext } from 'react'
import Header from '../components/Header';
import Footer from '../components/Footer';
import { UserContext } from '../UserContext';

const Chat = () => {
  const{username,id} = useContext(UserContext);
 

  return (
    <div className='min-h-screen flex flex-col'>  
      <Header/>
      <div>
        <h1 className='text-white 3xl'>Welcome {username}</h1>
      </div>
      <Footer/>
    </div>
  )
  
}

export default Chat