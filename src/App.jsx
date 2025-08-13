
import React from 'react'
import { LeftSidePortion } from './Components/LeftSidePortion'
import MainContent from "./Components/MainContent"
import FeatureCard from "./Components/FeatureCard"
import InputBar from './Components/InputBar'

function App() {
  return (
    <div className='flex h-screen w-screen bg-[#F8FAFB] rounded-[0.3rem]'>
      {/* Sidebar */}
      <LeftSidePortion/>

      {/* Main Content Area */}
      <div className='flex flex-col flex-1 overflow-y-auto'>
        <MainContent/>
        <div className='mt-10 px-4'>
          <FeatureCard/>
        </div>
        <div className='mt-15'>
          <InputBar/>
        </div>
      </div>
    </div>
  )
}

export default App
























