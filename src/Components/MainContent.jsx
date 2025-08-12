import React from 'react'

function MainContent() {
  return (
    <div className='flex flex-col items-center lg:mt-12 lg:ml-[8rem] sm:mt-2 '> 
      <h1 className='md:text-3xl items-center text-gray-700  font-serif lg:text-[2.5rem]'>Good Morning <span className='text-[#cf32b2]'>Muhammad, </span> 
        <br />
        <span className='text-[#a015e0]'>How Can I</span> <span className='text-[#6745df]'>Assist You Today?</span>
        </h1>
        <p className="text-gray-500 text-[0.4rem] lg:text-xl font-semibold lg:mt-3">
            Use one of the most common prompts below or use your own to begin
          </p>
    </div>
  )
}

export default MainContent

