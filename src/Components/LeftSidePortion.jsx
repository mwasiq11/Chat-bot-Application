import React from "react";

export function LeftSidePortion() {
  return (
    <div className="flex flex-col w-64 bg-[#edf0f3] min-h-screen rounded-[1rem] backdrop-blur-lg border-2 border-gray-200  text-white p-5 overflow-y-auto ml-2">
      <div className="flex flex-row items-center gap-2">
        <img
          className="flex flex-row w-[2.5rem] h-auto "
          src="https://www.pngall.com/wp-content/uploads/16/Google-Gemini-Logo-Transparent.png"
          alt="logo"
        />
        <h1 className="flex flex-row text-[1.7rem] text-gray-700 font-bold ">
          AI Assisstent{" "}
        </h1>
      </div>
      <hr className="border-t border-gray-300 my-4 "/>

      <h3 className="text-[#2D3031] text-xl mt-4 font-serif">History</h3>
    </div>
  );
}
