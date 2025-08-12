import React from "react";
import { FaMicrophone, FaPlus } from "react-icons/fa";

export default function SearchBar() {
  return (
    <div className="flex items-center gap-2 bg-black/30 backdrop-blur-lg p-3 rounded-full border border-gray-700 w-full max-w-2xl">
      <button className="p-2 bg-gray-800 rounded-full"><FaPlus className="text-gray-300" /></button>
      <input
        type="text"
        placeholder="Show me weekly sales trends..."
        className="bg-transparent flex-1 outline-none text-gray-200 placeholder-gray-500"
      />
      <button className="p-2 bg-gray-800 rounded-full"><FaMicrophone className="text-gray-300" /></button>
    </div>
  );
}
