import React from "react";
import { FaTimes } from "react-icons/fa";

export function LeftSidePortion({ onClose }) {
  return (
    <div
      className="
        flex flex-col
        bg-[#edf0f3]
        rounded-[1rem]
        backdrop-blur-lg
        border-2 border-gray-200
        text-white
        p-5
        overflow-y-auto
        w-64
        min-h-screen
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
          className="w-[2.5rem] h-auto"
          src="https://www.pngall.com/wp-content/uploads/16/Google-Gemini-Logo-Transparent.png"
          alt="logo"
        />
        <h1 className="text-[1.6rem] text-[#1ACF6E] font-bold">BotRix</h1>
      </div>

      <hr className="border-t border-gray-300 my-4" />

      <h3 className="text-[#2D3031] text-xl mt-4 font-serif">History</h3>
    </div>
  );
}
