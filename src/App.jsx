// import { useState } from "react";
// import MainContent from "./Components/MainContent";
// import FeatureCard from "./Components/FeatureCard";
// import SidebarToggle from './Components/SidebarToggle';
// import ThemeToggle from "./Components/ThemeToggle";
// import ThreadApi from "./Components/ThreadApi";

// function App() {
//   const [response, setResponse] = useState([]);
//   const [isConversationStarted, setIsConversationStarted] = useState(false);

//   return (
//     <div className="flex h-screen w-screen bg-[#F8FAFB] rounded-[0.3rem] overflow-hidden">
//       {/* Sidebar */}
//       <SidebarToggle response={response} />

//       {/* Main content */}
//       <div className="flex flex-col w-full h-full overflow-y-auto px-4 sm:pl-72 py-6 gap-8">
//         {!isConversationStarted && (
//           <>
//             <MainContent response={response} />
//             <FeatureCard response={response} />
//           </>
//         )}
//         <div className="flex-1 flex flex-col justify-end">
//           <ThreadApi
//             response={response}
//             setResponse={setResponse}
//             isConversationStarted={isConversationStarted}
//             setIsConversationStarted={setIsConversationStarted}
//           />
//         </div>
//       </div>
//       <ThemeToggle />
//     </div>
//   );
// }

// export default App;

import { useState } from "react";
import MainContent from "./Components/MainContent";
import FeatureCard from "./Components/FeatureCard";
import SidebarToggle from "./Components/SidebarToggle";
import ThemeToggle from "./Components/ThemeToggle";
import ThreadApi from "./Components/ThreadApi";
import { useRef, useEffect } from "react";

function App() {
  const [response, setResponse] = useState([]);
  const [isConversationStarted, setIsConversationStarted] = useState(false);
  const bottomRef = useRef();
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behaviour: "smooth" });
  }, [response]);
  const threadApiRef=useRef()

  return (
    <div className="flex h-screen w-screen bg-[#F8FAFB] rounded-[0.3rem] overflow-hidden">
      {/* Sidebar */}
      <SidebarToggle response={response} />

      {/* Main content */}
      <div className="flex flex-col w-full h-full overflow-y-auto px-4 sm:pl-72 py-6 gap-8">
        {!isConversationStarted ? (
          <>
            <MainContent response={response} />
            <FeatureCard
            onCardClick={(text)=> threadApiRef.current.CallOpenAI(text)}
             response={response} />
          </>
        ) : (
          // Chat Area
          <div
            className=""
          >
            {response.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`px-4 py-2 rounded-2xl max-w-[70%] text-sm shadow 
                   ${
                     msg.role === "user"
                       ? //  "text-black":"text-black"
                         "bg-gradient-to-r from-[#C94AFD] to-[#4F77FF] text-white rounded-br-none"
                       : "bg-white text-gray-800 rounded-bl-none border border-gray-200"
                   }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            <div ref={bottomRef}></div>
          </div>
        )}

        {/* Input Box stays bottom */}
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

      {/* <ThemeToggle /> */}
    </div>
  );
}

export default App;
