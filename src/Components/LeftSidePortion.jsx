import React from "react";

export default function Sidebar() {
  return (
    <aside className="bg-gradient-to-b from-gray-900 to-gray-800 text-white w-64 p-4 flex flex-col">
      <h2 className="text-lg font-semibold mb-4">Chat History</h2>
      <ul className="space-y-2">
        <li className="p-2 bg-gray-700 rounded cursor-pointer hover:bg-gray-600">Conversation 1</li>
        <li className="p-2 bg-gray-700 rounded cursor-pointer hover:bg-gray-600">Conversation 2</li>
      </ul>
    </aside>
  );
}
