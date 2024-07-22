import React, { useEffect, useContext, useState, useRef } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Logo from '../components/Logo';
import { UserContext } from '../UserContext';
import Avatar from '../components/Avatar';

const Chat = () => {
  const [ws, setWs] = useState(null);
  const [selectedContact, setSelectedContact] = useState('');
  const [onlinePeople, setonlinePeople] = useState({});
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const token = localStorage.getItem('jwtToken');
  const divUnderMessages = useRef();
  const { username, id } = useContext(UserContext);

  //socket connection initiated
  useEffect(() => {
    connectToSocket();
  }, []);

  const connectToSocket = () => {
    const socket = new WebSocket(`ws://localhost:8000?token=${token}`);
    setWs(socket);
    socket.addEventListener('message', handleMessage);
    socket.addEventListener('close', () => {
      setTimeout(() => {
        console.log('Disconnected, trying to reconnect..');
        connectToSocket();
      }, 1000);
    });
  };

  //fetch messages b/w users
  useEffect(() => {
    if (selectedContact) {
      fetch(`http://localhost:8000/api/messages/${selectedContact}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => setMessages(data));
    }
  }, [selectedContact]);

  //function to display all connected socket clients
  const showPeopleOnline = (data) => {
    const people = {};
    data.forEach(({ userId, userName }) => {
      people[userId] = userName;
    });
    setonlinePeople(people);
  };

  //function to handle message b/w socket and clients
  const handleMessage = (e) => {
    const messageData = JSON.parse(e.data);
    if (messageData.type === 'connectedClients') {
      const clients = messageData.clients;
      showPeopleOnline(clients);
    } else if ('text' in messageData) {
      setMessages((prv) => [...prv, { ...messageData }]);
    }
  };

  const selectContact = (userId) => {
    setSelectedContact(userId);
  };

  //function to sendMessage through the socket
  const sendMessage = (ev) => {
    // console.log("sending");
    ev.preventDefault();
    ws.send(
      JSON.stringify({
        recipient: selectedContact,
        text: newMessage,
      })
    );
    setNewMessage('');
    setMessages((prv) => [
      ...prv,
      {
        text: newMessage,
        sender: id,
        recipient: selectedContact,
      },
    ]);
  };

  //useEffect to scroll the chat to the bottom using useref
  useEffect(() => {
    const div = divUnderMessages.current;
    if (div) {
      div.scrollIntoView({ behavious: 'smooth', block: 'end' });
    }
  }, [messages]);

  //deleting my data from the clients (easy to display)
  const onlinePeopleExceptMe = { ...onlinePeople };
  delete onlinePeopleExceptMe[id];

  return (
    <div className="min-h-screen flex flex-col items-center">
      <Header />
      <div className="Chat-area h-auto w-screen md:w-3/4 lg:w flex flex-grow p-2 md:py-5 lg:py-8 md:px-7 lg:px-12 justify-center font-semibold">
        <div className="w-1/4 md:w-1/3  bg-blue-700 rounded-sm flex flex-col ">
          <Logo />
          {Object.keys(onlinePeopleExceptMe).map((userId) => (
            <div
              onClick={() => selectContact(userId)}
              key={userId}
              className={`flex cursor-pointer items-center gap-[2px] md:gap-2 border-b px-[2px] md:px-2 py-2 text-sm md:text-xl text-blue-200  border-blue-500 shadow-md ${
                selectedContact === userId ? 'bg-blue-600 shadow-lg' : ''
              } `}
            >
              <Avatar online={true} username={onlinePeople[userId]} userId={userId} />
              <span>{onlinePeople[userId]}</span>
            </div>
          ))}
        </div>
        <div className="w-3/4 md:w-2/3 flex flex-col bg-blue-300  rounded-sm p-2 ">
          <div className="flex-grow ">
            {!selectedContact && (
              <div className="flex h-full flex-grow items-center justify-center">
                <div className="text-blue-400 text-xl">
                  &larr; Select contact
                </div>
              </div>
            )}
            {!!selectedContact && (
              <div className="relative h-full">
                <div className="absolute overflow-y-scroll inset-0 ">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${
                        message.sender === id ? ' justify-end mr-1' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`text-white text-left text-xs md:text-base sm:py-1 py-2 px-1
                      sm:px-2 rounded-md md:text-md my-2 ${
                        message.sender === id ? 'bg-blue-500' : 'bg-sky-600'
                      }`}
                      >
                        {message.text}
                      </div>
                    </div>
                  ))}
                  <div ref={divUnderMessages}></div>
                </div>
              </div>
            )}
          </div>
          {!!selectedContact && (
            <form onSubmit={sendMessage} className="flex gap-1 md:gap-2 ">
              <input
                type="text"
                value={newMessage}
                onChange={(ev) => setNewMessage(ev.target.value)}
                placeholder="Type a message"
                className="w-full p-1 md:p-2 rounded-sm "
              ></input>
              <button type="submit" className="text-blue-500 text- ">
                <ion-icon name="send" size="large"></ion-icon>
              </button>
            </form>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Chat;
