'use client'
import React, { useState } from 'react'; // Import useState
import MainPage from './components/main';

function Page() {
  const [chats, setchats] = useState([]);

  const handlestartChat = () => {
    if (chats.length === 0) { // Fixed typo: lenght -> length
      const newChat = {
        id: `Chats ${new Date().toLocaleDateString("en-GB")} ${new Date().toLocaleTimeString()}`, // Fixed new Date()
        messages: [],
      };
      setchats([newChat]);
    }
  };

  return (
    <div>
    
      <MainPage />
    </div>

  );
}

export default Page;