import React, { useEffect, useContext, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Logo from '../components/Logo'
import { UserContext } from '../UserContext';
import Avatar from '../components/Avatar';

const Chat = () => {
  const [ws, setWs] = useState(null);
  const [selectedContact,setSelectedContact] =useState('');
  const [onlinePeople, setonlinePeople] = useState({});
  const token = localStorage.getItem('jwtToken');

  const { username, id } = useContext(UserContext);
  useEffect(() => {
    const socket = new WebSocket(`ws://localhost:8000?token=${token}`);
    setWs(socket);
    socket.addEventListener('message', handleMessage);
  }, []);

  const showPeopleOnline = (data) => {
    const people = {};
    data.forEach(({ userId, userName }) => {
      people[userId] = userName;
    });
    setonlinePeople(people);
  };
  const handleMessage = (e) => {
    const messageData = JSON.parse(e.data);
    const clients = messageData.clients;
    showPeopleOnline(clients);
  };

  const selectContact=(userId)=>{
    setSelectedContact(userId);
  }

  const onlinePeopleExceptMe={...onlinePeople}
  delete onlinePeopleExceptMe[id];  

  return (
    <div className="min-h-screen flex flex-col items-center">
      <Header />
      <div className="Chat-area h-auto w-screen md:w-3/4 lg:w flex flex-grow p-2 md:py-5 lg:py-8 md:px-7 lg:px-12 justify-center font-semibold">
        <div className="w-1/3  bg-blue-700 rounded-sm flex flex-col ">
         <Logo/>
          {Object.keys(onlinePeopleExceptMe).map((userId) => (
            <div
              onClick={()=>selectContact(userId)}
              key={userId}
              className={`flex cursor-pointer items-center gap-1 md:gap-2 border-b px-2 py-2 text-sm md:text-xl text-blue-200  border-blue-500 shadow-md ${selectedContact===userId?'bg-blue-600 shadow-lg':''} `}
            >
            <Avatar username={onlinePeople[userId]} userId={userId} />
              <span>{onlinePeople[userId]}</span>
            </div>
          ))}
        </div>
        <div className="w-2/3 flex flex-col bg-blue-300 rounded-sm p-2 ">
          <div className="flex-grow">
            {!selectedContact&&(
              <div className='flex h-full flex-grow items-center justify-center'>
              <div className='text-blue-400 text-xl'>&larr; Select contact</div>
              </div>
            )}
          </div>
          {selectContact===''&&(
          <div className="flex gap-1 md:gap-2 ">
            <input
              type="text"
              placeholder="Type a message"
              className="w-full p-1 md:p-2 rounded-sm "
            ></input>
            <button className="text-blue-500 text- ">
              <ion-icon name="send" size="large"></ion-icon>
            </button>
          </div>)}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Chat;
