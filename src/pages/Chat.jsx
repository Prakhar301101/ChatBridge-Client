import React, { useEffect, useContext, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { UserContext } from '../UserContext';

const Chat = () => {
  const [ws, setWs] = useState(null);
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

  return (
    <div className="min-h-screen flex flex-col items-center">
      <Header />
      <div className="Chat-area h-auto w-screen md:w-3/4 lg:w flex flex-grow p-2 md:py-5 lg:py-8 md:px-7 lg:px-12 justify-center font-semibold">
        <div className="w-1/3  bg-blue-700 rounded-sm">
          {Object.keys(onlinePeople).map((userId) => (
            <div key={userId}>{onlinePeople[userId]}</div>
          ))}
        </div>
        <div className="w-2/3 flex flex-col bg-blue-300 rounded-sm p-2 ">
          <div className="flex-grow">Message here!!</div>
          <div className="flex gap-1 md:gap-2 ">
            <input
              type="text"
              placeholder="Type a message"
              className="w-full p-1 md:p-2 rounded-sm "
            ></input>
            <button className="text-blue-500 text- ">
              <ion-icon name="send" size="large"></ion-icon>
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Chat;
