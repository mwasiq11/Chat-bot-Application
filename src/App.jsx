import React from 'react'
import { LeftSidePortion } from './Components/LeftSidePortion'
import MainContent from "./Components/MainContent"
import FeatureCard from "./Components/FeatureCard"
function App() {
  return (
      <div className='flex flex-wrap h-screen w-screen bg-[#F8FAFB] rounded-[0.3rem]'>
          <LeftSidePortion/>
        <div className='flex flex-col'>
          <MainContent/>
          <div className='mt-10'>
         <FeatureCard/>

          </div>
        </div >
         
      </div>
     
  )
      
}

export default App





















