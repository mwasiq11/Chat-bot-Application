import MainContent from "./Components/MainContent";
import FeatureCard from "./Components/FeatureCard";
import InputBar from './Components/InputBar';
import SidebarToggle from './Components/SidebarToggle';

function App() {
  return (
    <div className='flex h-screen w-screen bg-[#F8FAFB] rounded-[0.3rem] overflow-hidden'>
      {/* Sidebar - overlay */}
      <SidebarToggle />

      {/* Main content always full width */}
      <div className='flex flex-col w-full h-full overflow-y-auto px-4 sm:pl-72'>
        {/* sm:pl-72 → leaves space on desktop so content doesn't go under the sidebar */}
        
        <MainContent />
        
        <div className='mt-10'>
          <FeatureCard />
        </div>

        <div className='mt-15'>
          <InputBar />
        </div>
      </div>
    </div>
  );
}

export default App;

























