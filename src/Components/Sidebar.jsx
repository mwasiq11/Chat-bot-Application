import React from "react";
import { FaPlus, FaComments, FaChartPie, FaRobot, FaCog, FaLifeRing } from "react-icons/fa";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-gradient-to-b from-gray-900 to-black text-gray-300 p-4 flex flex-col">
      {/* Logo */}
      <div className="flex items-center space-x-2 mb-6">
        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">S</div>
        <span className="text-lg font-semibold">Starbot.ai</span>
      </div>

      {/* Menu */}
      <nav className="space-y-3">
        <button className="flex items-center gap-3 hover:text-white">
          <FaPlus /> New chat
        </button>
        <button className="flex items-center gap-3 hover:text-white">
          <FaComments /> Team chats
        </button>
        <button className="flex items-center gap-3 hover:text-white">
          <FaChartPie /> Dashboards
        </button>
        <button className="flex items-center gap-3 hover:text-white">
          <FaRobot /> My Assistant
        </button>
      </nav>

      {/* Pinned chats */}
      <div className="mt-6">
        <h2 className="text-sm text-gray-400 uppercase mb-2">Pinned Chats</h2>
        <ul className="space-y-1 text-gray-400">
          <li className="hover:text-white cursor-pointer">Weekly Performance Summary</li>
          <li className="hover:text-white cursor-pointer">Units sold last month</li>
          <li className="hover:text-white cursor-pointer">Trends Summary</li>
        </ul>
      </div>

      {/* Footer */}
      <div className="mt-auto pt-4 border-t border-gray-700 space-y-3 text-sm">
        <button className="flex items-center gap-3 hover:text-white"><FaCog /> Settings</button>
        <button className="flex items-center gap-3 hover:text-white"><FaLifeRing /> Help & support</button>
        <p className="text-gray-500">v1.1.2</p>
      </div>
    </aside>
  );
}
