import { useState, useRef, useEffect } from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import MainContent from "./Components/MainContent";
import FeatureCard from "./Components/FeatureCard";
import SidebarToggle from "./Components/SidebarToggle";
import HistorySidebar from "./Components/HistorySidebar";
import ThreadApi from "./Components/ThreadApi";
import HistoryPage from "./Components/HistoryPage";
import { LeftSidePortion } from "./Components/LeftSidePortion";
import Loader from "./Components/Loader";
import PageNotFound from "./Components/PageNotFound";
import Logout from "./Components/Logout";
function App() {
  const [response, setResponse] = useState([]);
  const [isConversationStarted, setIsConversationStarted] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const bottomRef = useRef();
  const threadApiRef = useRef();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [response]);

  return (
    <div className="flex h-screen w-screen bg-[#F8FAFB] overflow-hidden">
      {/* Sidebar Toggle (for mobile) */}
      <SidebarToggle response={response} />

      <div className="absolute top-2 right-2">
        <Logout />
      </div>

      {/* Left Sidebar */}
      <div className="hidden sm:block w-64 h-screen">
        <LeftSidePortion />
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 px-4 sm:pl-6 py-6 gap-4">
        {/* Scrollable message container */}
        <div className="flex-1 overflow-auto hide-scrollbar pr-2 mt-8 ">
          <Routes>
            {/* Default new session */}
            <Route
              path="/"
              element={
                !isConversationStarted ? (
                  <>
                    <MainContent response={response} />
                    <Outlet />
                    <FeatureCard 
                      onCardClick={(text) =>
                        threadApiRef.current.CallOpenAI(text)
                      }
                      response={response}
                      onRefresh={() => threadApiRef.current.ClearInput()}
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
                    {/*Loading untill getting response*/}
                    {isLoading && (
                      <div className="flex justify-start mt-5">
                        <div className="px-4 py-2 rounded-2xl max-w-[70%] text-sm shadow bg-white text-gray-800 border border-gray-200 flex items-center gap-2">
                          <span className="animate-pulse">
                            Generating response
                          </span>
                          <Loader />
                        </div>
                      </div>
                    )}
                    <div ref={bottomRef}></div>
                  </div>
                )
              }
            />
             
            {/* History page (specific conversation) */}
            <Route path="/history/:id" element={<HistoryPage/>} />

            
          </Routes>
        </div>

        {/* Input Bar */}
        <div>
          <ThreadApi
            ref={threadApiRef}
            response={response}
            setResponse={setResponse}
            isConversationStarted={isConversationStarted}
            setIsConversationStarted={setIsConversationStarted}
            setisLoading={setisLoading}
          />
        </div>
      </div>
      
    </div>
  );
}

export default App;
