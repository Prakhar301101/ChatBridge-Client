import React from 'react';

const Header = () => {
  return (
    <div className="w-full flex items-center justify-center top-0">
      <div className="px-2 md:px-3 py-3 w-[90%] flex item justify-between text-white">
      <div className=' flex items-center'>
            <div className='text-xl md:text-3xl'><ion-icon name="chatbubbles" ></ion-icon></div>
            <h1 className='text-xl md:text-2xl font-medium'>ChatBridge</h1>
        </div>
        <div className=' flex items-center'>
            <h1 className='text-xl md:text-2xl font-medium'>Github</h1>
            <div className='text-xl md:text-3xl '><ion-icon name="logo-github"></ion-icon></div>
        </div>
      </div>
    </div>
  );
};

export default Header;
