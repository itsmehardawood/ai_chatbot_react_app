import React from "react";
import Link from "next/link"; // Import Link for navigation

function MainPage() {
  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center bg-gradient-to-br from-gray-900 to-black text-white px-5 text-center">
      {/* Background Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-700 via-pink-500 to-red-500 blur-[120px] opacity-50"></div>

      {/* Welcome Text */}
      <div className="relative z-10 mb-10">
        <h1 className="text-6xl font-extrabold bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text drop-shadow-lg">
          Welcome to ChatBot
        </h1>
        <p className="mt-4 text-lg text-gray-300 max-w-2xl">
          Your AI-powered assistant, always ready to chat! Ask questions, get insights, and enjoy a smart conversation.
        </p>
      </div>

      {/* Click Me Button */}
      <Link
        href="/ChatApp"
        className="relative z-10 px-16 py-6 text-3xl font-bold font-serif text-white bg-opacity-30 backdrop-blur-lg border border-gray-200 shadow-lg rounded-xl 
        transition-all duration-300 transform hover:scale-110 hover:bg-opacity-40 hover:shadow-2xl"
      >
        Start Chatting
      </Link>
    </div>
  );
}

export default MainPage;
