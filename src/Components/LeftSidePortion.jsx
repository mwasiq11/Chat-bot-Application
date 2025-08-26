import React from "react";
import { FaTimes } from "react-icons/fa";
import HistorySidebar from "./HistorySidebar";

export function LeftSidePortion({ onClose }) {
  return (
    <div className="flex flex-col bg-[#edf0f3] rounded-t-[1rem] rounded-b-[1rem] backdrop-blur-lg border-2 border-gray-200 p-5 h-screen w-64 ">
      {/* Close button for mobile */}
      <div className="sm:hidden flex justify-end">
        <button onClick={onClose} className="text-gray-500 text-xl">
          <FaTimes />
        </button>
      </div>

      {/* Logo */}
      <div className="flex flex-row items-center gap-2">
        <a href="/app">
          <img
            className="w-[2.4rem] h-auto"
            src="https://www.pngall.com/wp-content/uploads/16/Google-Gemini-Logo-Transparent.png"
            alt="logo"
          />
        </a>
        <a href="/app">
          <h1
            className="text-[1.8rem] font-bold tracking-tight
          bg-gradient-to-r from-[#C94AFD] to-[#4F77FF] bg-clip-text text-transparent"
          >
            BotRix
          </h1>
        </a>
      </div>

      <hr className="border-t border-gray-300 my-4" />

      <h3 className="text-[#2D3031] text-2xl mt-4 font-serif mb-6">History</h3>

      {/* Scrollable history list */}
      <div className="flex-1 overflow-y-auto hide-scrollbar">
        <HistorySidebar onClose={onClose} />
      </div>
    </div>
  );
}
