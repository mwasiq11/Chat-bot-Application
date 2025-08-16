import { useState } from "react";
import MainContent from "./Components/MainContent";
import FeatureCard from "./Components/FeatureCard";
import SidebarToggle from './Components/SidebarToggle';
import ThemeToggle from "./Components/ThemeToggle";
import ThreadApi from "./Components/ThreadApi";

function App() {
  const [response, setResponse] = useState([]);
  const [isConversationStarted, setIsConversationStarted] = useState(false);
  

  return (
    <div className="flex h-screen w-screen bg-[#F8FAFB] rounded-[0.3rem] overflow-hidden">
      {/* Sidebar */}
      <SidebarToggle response={response} />

      {/* Main content */}
      <div className="flex flex-col w-full h-full overflow-y-auto px-4 sm:pl-72 py-6 gap-8">
        {!isConversationStarted && (
          <>
            <MainContent response={response} />
            <FeatureCard response={response} />
          </>
        )}
        <div className="flex-1 flex flex-col justify-end">
          <ThreadApi
            response={response}
            setResponse={setResponse}
            isConversationStarted={isConversationStarted}
            setIsConversationStarted={setIsConversationStarted}
          />
        </div>
      </div>
      <ThemeToggle />
    </div>
  );
}

export default App;

