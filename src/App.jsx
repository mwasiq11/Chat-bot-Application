import React from "react";
import Sidebar from "./components/LeftSidePortion";
import Header from "./components/Header";
import MainContent from "./Components/MainContent";

export default function App() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 relative">
        <Header />
        <MainContent />
      </div>
    </div>
  );
}



// export default function App() {
//   return (
//     <div className="relative h-screen w-screen overflow-hidden">
//       {/* Background Image */}
//       <div
//         className="absolute inset-0 bg-cover bg-center"
//         style={{ backgroundImage: "url('./public/assets/bgImage.svg')" }}
//       ></div>

//       {/* Dark Overlay */}
//       <div className="absolute inset-0 bg-[#0b1442]/70"></div>

//       {/* Foreground Content */}
//       <div className="relative flex h-full">
//         {/* Sidebar */}
//         <aside className="w-72 bg-white/5 backdrop-blur-lg border-r border-white/10 text-white p-5 overflow-y-auto">
//           {/* Logo */}
//           <div className="flex items-center space-x-2 mb-6">
//             <span className="bg-purple-500 p-2 rounded-lg">
//               💬
//             </span>
//             <h1 className="text-xl font-bold">QuickChat</h1>
//           </div>

//           {/* Search */}
//           <input
//             type="text"
//             placeholder="Search here..."
//             className="w-full px-4 py-2 rounded-lg bg-white/10 text-white placeholder-gray-300 outline-none mb-6"
//           />

//           {/* Contact List */}
//           <ul className="space-y-5">
//             {[
//               { name: "Caroline Gray", status: "Online", img: 1 },
//               { name: "Matthew Walker", status: "Online", img: 2 },
//               { name: "Carmen Jacobson", status: "Online", img: 3 },
//               { name: "Presley Martin", status: "Online", img: 4 },
//               { name: "Alexander Wilson", status: "Offline", img: 5 },
//               { name: "Samuel White", status: "Offline", img: 6 },
//             ].map((user, idx) => (
//               <li key={idx} className="flex items-center space-x-3">
//                 <img
//                   src={`https://i.pravatar.cc/40?img=${user.img}`}
//                   alt={user.name}
//                   className="w-10 h-10 rounded-full border border-white/20"
//                 />
//                 <div>
//                   <p className="font-medium">{user.name}</p>
//                   <span
//                     className={`text-sm ${
//                       user.status === "Online"
//                         ? "text-green-400"
//                         : "text-gray-400"
//                     }`}
//                   >
//                     {user.status}
//                   </span>
//                 </div>
//               </li>
//             ))}
//           </ul>
//         </aside>

//         {/* Main Chat Area */}
//         <main className="flex-1 flex flex-col bg-white/5 backdrop-blur-lg">
//           {/* Chat Header */}
//           <div className="p-5 border-b border-white/10 flex items-center space-x-3 text-white">
//             <img
//               src="https://i.pravatar.cc/40?img=1"
//               alt="Caroline Gray"
//               className="w-10 h-10 rounded-full border border-white/20"
//             />
//             <div className="flex items-center space-x-2">
//               <span className="font-medium">Caroline Gray</span>
//               <span className="text-green-400 text-sm">●</span>
//             </div>
//           </div>

//           {/* Chat Messages */}
//           <div className="flex-1 p-6 space-y-6 overflow-y-auto">
//             {/* Received Message */}
//             <div className="flex items-end space-x-3">
//               <img
//                 src="https://i.pravatar.cc/40?img=2"
//                 alt="User"
//                 className="w-8 h-8 rounded-full border border-white/20"
//               />
//               <div className="bg-white/10 p-3 rounded-lg max-w-xs text-white text-sm">
//                 Lorem ipsum is placeholder text commonly used in the graphic,
//                 print, and publishing...
//               </div>
//               <span className="text-xs text-gray-400">2:45 PM</span>
//             </div>

//             {/* Sent Message */}
//             <div className="flex justify-end items-end space-x-2">
//               <span className="text-xs text-gray-400">4:30 PM</span>
//               <div className="bg-purple-500 p-3 rounded-lg max-w-xs text-white text-sm">
//                 Lorem ipsum is placeholder text commonly used...
//               </div>
//             </div>

//             {/* Received Message */}
//             <div className="flex items-end space-x-3">
//               <img
//                 src="https://i.pravatar.cc/40?img=2"
//                 alt="User"
//                 className="w-8 h-8 rounded-full border border-white/20"
//               />
//               <div className="bg-white/10 p-3 rounded-lg max-w-xs text-white text-sm">
//                 Lorem ipsum is placeholder text commonly used in the graphic,
//                 print, and publishing...
//               </div>
//               <span className="text-xs text-gray-400">5:00 PM</span>
//             </div>
//           </div>

//           {/* Input Bar */}
//           <div className="p-4 border-t border-white/10 flex items-center space-x-3">
//             <input
//               type="text"
//               placeholder="Send a message"
//               className="flex-1 px-4 py-2 rounded-lg bg-white/10 text-white placeholder-gray-300 outline-none"
//             />
//             <button className="bg-purple-500 hover:bg-purple-600 transition px-4 py-2 rounded-lg text-white">
//               ➤
//             </button>
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }
