"use client";
import React, { useState, useEffect, useRef } from "react";
import { FiEdit3, FiMenu } from "react-icons/fi"; // Added FiMenu for the hamburger icon
import { RxCrossCircled } from "react-icons/rx";
import { FaArrowRight } from "react-icons/fa6";
import { useRouter } from "next/navigation";

function ChatApp() {
  const router = useRouter();
  const messagesEndRef = useRef(null);

  // State for Chat
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // State for Chat History
  const [chatHistory, setChatHistory] = useState([]);
  const [selectedChatIndex, setSelectedChatIndex] = useState(null);
  const [editIndex, setEditIndex] = useState(null);
  const [editValue, setEditValue] = useState("");

  // State for Hamburger Menu
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Load chat history from Local Storage on mount
  useEffect(() => {
    const storedChats = JSON.parse(localStorage.getItem("chatHistory")) || [];
    setChatHistory(storedChats);
  }, []);

  // Save chat history whenever it updates
  useEffect(() => {
    localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
  }, [chatHistory]);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle input change
  const handleInputChange = (e) => setInputValue(e.target.value);

  // Call AI API
  const sendMessageToAI = async (message) => {
    try {
      const response = await fetch("/api/mistral", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();
      return data.reply || "No response received.";
    } catch (error) {
      console.error("Error:", error);
      return "Sorry, AI is unavailable.";
    }
  };

  // Handle message submission
  const handleSendMessage = async () => {
    if (inputValue.trim() === "" || isLoading) return;

    setIsLoading(true);

    const userMessage = { text: inputValue, type: "req", timestamp: Date.now() };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    // Get AI response
    const aiResponse = await sendMessageToAI(inputValue);
    const responseMessage = { text: aiResponse, type: "res", timestamp: Date.now() };

    setMessages((prev) => [...prev, responseMessage]);

    // Save chat to history
    if (selectedChatIndex !== null) {
      const updatedHistory = [...chatHistory];
      updatedHistory[selectedChatIndex].messages.push(userMessage, responseMessage);
      setChatHistory(updatedHistory);
    } else {
      const newChat = {
        name: `Chat ${new Date().toLocaleString()}`,
        messages: [userMessage, responseMessage],
      };
      setChatHistory([...chatHistory, newChat]);
      setSelectedChatIndex(chatHistory.length);
    }

    setIsLoading(false);
  };

  // Handle selecting a chat
  const handleSelectChat = (index) => {
    setSelectedChatIndex(index);
    setMessages(chatHistory[index].messages);
    setIsSidebarOpen(false); // Close sidebar on mobile after selecting a chat
  };

  // Handle deleting a chat
  const handleDeleteChat = (index) => {
    const updatedHistory = chatHistory.filter((_, i) => i !== index);
    setChatHistory(updatedHistory);
    if (index === selectedChatIndex) {
      setMessages([]);
      setSelectedChatIndex(null);
    }
  };

  // Handle renaming a chat
  const handleEditChat = (index) => {
    setEditIndex(index);
    setEditValue(chatHistory[index].name);
  };

  // Handle saving renamed chat
  const handleSaveEdit = (index) => {
    const updatedHistory = [...chatHistory];
    updatedHistory[index].name = editValue;
    setChatHistory(updatedHistory);
    setEditIndex(null);
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !isLoading) {
      handleSendMessage();
    }
  };

  // Go back to home
  const goBack = () => router.push("/");

  return (
    <div className="w-full min-h-screen flex">
      {/* Hamburger Menu Button (Mobile Only) */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed top-4 left-4 z-50 p-2 bg-black text-white rounded-lg lg:hidden"
      >
        <FiMenu className="text-2xl" />
      </button>

      {/* Left Sidebar */}
      <div
        className={`w-[30%] bg-black p-5 fixed lg:relative h-screen lg:h-auto z-40 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex justify-between text-2xl font-bold text-blue-300 mb-5">
          <h1>ChatBot</h1>
          <FiEdit3 />
        </div>

        {/* Chat History List */}
        <div>
          {chatHistory.map((chat, index) => (
            <div key={index} className="flex items-center justify-between p-3 mx-1 rounded-md text-lg bg-zinc-900 mb-3 hover:bg-zinc-700">
              {editIndex === index ? (
                <input
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onBlur={() => handleSaveEdit(index)}
                  onKeyDown={(e) => e.key === "Enter" && handleSaveEdit(index)}
                  className="bg-transparent border-b border-blue-500 outline-none text-white w-full px-2"
                />
              ) : (
                <h1 onClick={() => handleSelectChat(index)} className="cursor-pointer flex-1">
                  {chat.name}
                </h1>
              )}
              <FiEdit3 onClick={() => handleEditChat(index)} className="text-blue-400 mx-2 cursor-pointer" />
              <RxCrossCircled onClick={() => handleDeleteChat(index)} className="text-red-600 text-2xl cursor-pointer" />
            </div>
          ))}
        </div>
      </div>

      {/* Right Chat Section */}
      <div className="w-full lg:w-[70%] bg-zinc-700 flex flex-col">
        {/* Navbar */}
        <nav className="py-6 bg-black flex justify-between items-center px-5 text-2xl">
          <h1 className="ml-10 sm:ml-0">ChatBot</h1> {/* Adjusted margin for small screens */}
          <FaArrowRight onClick={goBack} />
        </nav>

        {/* Chat Messages */}
        <div className="p-5 flex flex-col flex-grow overflow-y-auto">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`max-w-[75%] px-5 py-3 text-white rounded-lg shadow-md ${
                msg.type === "req"
                  ? "self-end bg-gradient-to-l from-pink-600 to-purple-950 text-right my-3"
                  : "self-start bg-gradient-to-r from-blue-600 to-indigo-900 text-left"
              }`}
            >
              <p>{msg.text}</p>
              <p className="text-xs text-gray-300 mt-1">{new Date(msg.timestamp).toLocaleTimeString()}</p>
            </div>
          ))}
          {isLoading && (
            <div className="self-start max-w-[75%] px-5 py-3 text-white rounded-lg shadow-md bg-gradient-to-r from-blue-600 to-indigo-900">
              <p>Thinking...</p>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Field */}
        <div className="w-full flex items-center p-2 bg-black">
          <input
            type="text"
            placeholder="Type your message..."
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            className="w-full p-3 text-white bg-zinc-800 rounded-lg outline-none"
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            className="ml-3 p-3 bg-purple-700 hover:bg-purple-900 text-white rounded-lg"
            disabled={isLoading}
          >
            <FaArrowRight className="text-xl" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatApp;