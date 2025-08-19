import React from "react";
import { FaTimes } from "react-icons/fa";

export function LeftSidePortion({ onClose }) {
  return (
    <div
      className=" text-gray-700
        flex flex-col
        bg-[#edf0f3]
        rounded-[1rem]
        backdrop-blur-lg
        border-2 border-gray-200
        p-5
        overflow-y-auto
        w-64
        min-h-screen *:text-md
      "
    >
      {/* Close button for mobile */}
      <div className="sm:hidden flex justify-end">
        <button onClick={onClose} className="text-gray-500 text-xl">
          <FaTimes />
        </button>
      </div>

      {/* Logo */}
      <div className="flex flex-row items-center gap-2">
        <img
          className="w-[2.4rem] h-auto"
          src="https://www.pngall.com/wp-content/uploads/16/Google-Gemini-Logo-Transparent.png"
          alt="logo"
        />
        <h1
          className="text-[1.8rem] font-bold tracking-tight
          bg-gradient-to-r from-[#C94AFD] to-[#4F77FF] bg-clip-text text-transparent"
        >
          BotRix
        </h1>
      </div>

      <hr className="border-t border-gray-300 my-4" />

      <h3 className="text-[#2D3031] text-xl mt-4 font-serif mb-6">History</h3>

      {/* <ul>
        <li>What is to-do list</li>
        <li>Tell me about generative Ai</li>
        <li>What is the weather today</li>
        <li>How to make a sandwich</li>  
        <li>What is the capital of France</li>
        <li>How to learn React</li>
        <li>What is the best programming language</li>   
      </ul> */}
    </div>
  );
}

{
  /* <svg width="32" height="32" viewBox="0 0 16 16" fill="white" xmlns="http://www.w3.org/2000/svg"><path d="M16 12.519H0V14.5H16V12.519Z" fill="current"></path><path d="M16 7.25951H0V9.24049H16V7.25951Z" fill="current"></path><path d="M16 2H0V3.98098H16V2Z" fill="current"></path></svg>*/
}
