
// import { useState, useRef, useEffect } from "react";
// import MainContent from "./Components/MainContent";
// import FeatureCard from "./Components/FeatureCard";
// import SidebarToggle from "./Components/SidebarToggle";
// import ThemeToggle from "./Components/ThemeToggle";
// import ThreadApi from "./Components/ThreadApi";
// import HistorySidebar from "./Components/HistorySidebar";

// function App() {
//   const [response, setResponse] = useState([]);
//   const [isConversationStarted, setIsConversationStarted] = useState(false);
//   const bottomRef = useRef();
//   const threadApiRef = useRef();

//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [response]);

//   return (
//     <div className="flex h-screen w-screen bg-[#F8FAFB] rounded-[0.3rem] overflow-hidden">
//   {/* Sidebar container */}
//   <div className="w-64 border-r border-gray-200 bg-white">
//     {/* Toggle button */}
//     <SidebarToggle response={response} />

//     {/* History list */}
//     <HistorySidebar
//       onSelect={(chat) => {
//         setResponse(chat.messages || []);
//         setIsConversationStarted(true);
//       }}
//     />
//   </div>

//   {/* Main content */}
//   <div className="flex flex-col flex-1 h-full overflow-y-auto px-4 py-6 gap-8">
//     {!isConversationStarted ? (
//       <>
//         <MainContent response={response} />
//         <FeatureCard
//           onCardClick={(text) => threadApiRef.current.CallOpenAI(text)}
//           response={response}
//         />
//       </>
//     ) : (
//       // Chat messages
//       <div>
//         {response.map((msg, index) => (
//           <div
//             key={index}
//             className={`flex ${
//               msg.role === "user" ? "justify-end" : "justify-start mt-5"
//             }`}
//           >
//             <div
//               className={`px-4 py-2 rounded-2xl max-w-[70%] text-sm shadow 
//                 ${
//                   msg.role === "user"
//                     ? "bg-gradient-to-r from-[#C94AFD] to-[#4F77FF] text-white"
//                     : "bg-white text-gray-800 border border-gray-200"
//                 }`}
//             >
//               {msg.content}
//             </div>
//           </div>
//         ))}
//         <div ref={bottomRef}></div>
//       </div>
//     )}

//     {/* Input Box */}
//     <div className="flex-1 flex flex-col justify-end">
//       <ThreadApi
//         ref={threadApiRef}
//         response={response}
//         setResponse={setResponse}
//         isConversationStarted={isConversationStarted}
//         setIsConversationStarted={setIsConversationStarted}
//       />
//     </div>
//   </div>
// </div>

//   );
// }

// export default App;

import { useState, useRef, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import MainContent from "./Components/MainContent";
import FeatureCard from "./Components/FeatureCard";
import SidebarToggle from "./Components/SidebarToggle";
import HistorySidebar from "./Components/HistorySidebar";
import ThreadApi from "./Components/ThreadApi";
import HistoryPage from "./Components/HistoryPage";
import { Outlet } from "react-router-dom";

function App() {
  const [response, setResponse] = useState([]);
  const [isConversationStarted, setIsConversationStarted] = useState(false);
  const bottomRef = useRef();
  const threadApiRef = useRef();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [response]);

  return (
    <div className="flex h-screen w-screen bg-[#F8FAFB] rounded-[0.3rem] overflow-hidden">
      {/* Left Sidebar */}
      <SidebarToggle response={response} />
      <HistorySidebar />

      {/* Right Side (Main + Input) */}
      <div className="flex flex-col w-full h-full overflow-y-auto px-4 sm:pl-20 py-6 gap-8">
        <Routes>
          {/* Default new session */}
          <Route
            path="/"
            element={
              !isConversationStarted ? (
                <>
                  <MainContent response={response} />
                  <Outlet/>
                  <FeatureCard
                    onCardClick={(text) => threadApiRef.current.CallOpenAI(text)}
                    response={response}
                  />
                </>
              ) : (
                <div>
                  {response.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex ${
                        msg.role === "user"
                          ? "justify-end"
                          : "justify-start mt-5"
                      }`}
                    >
                      <div
                        className={`px-4 py-2 rounded-2xl max-w-[70%] text-sm shadow 
                        ${
                          msg.role === "user"
                            ? "bg-gradient-to-r from-[#C94AFD] to-[#4F77FF] text-white"
                            : "bg-white text-gray-800 border border-gray-200"
                        }`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  ))}
                  <div ref={bottomRef}></div>
                </div>
              )
            }
          />

          {/* History page (specific conversation) */}
          <Route path="/history/:id" element={<HistoryPage />} />
        </Routes>

        {/* Input Box always bottom */}
        <div className="flex-1 flex flex-col justify-end">
          <ThreadApi
            ref={threadApiRef}
            response={response}
            setResponse={setResponse}
            isConversationStarted={isConversationStarted}
            setIsConversationStarted={setIsConversationStarted}
          />
        </div>
      </div>
    </div>
  );
}

export default App;

