import React from "react";

function MainContent() {
  return (
    <div className="flex flex-col items-center lg:mt-12 sm:mt-2 ">
      {/* <h1 className='md:text-3xl items-center text-gray-700 font-serif lg:text-[2.5rem]'>Hello, <span className='text-[#cf32b2]'>I’m here to help.</span> 
        <br />
        <span className='text-[#a015e0]'>How Can I</span> <span className='text-[#6745df]'>Assist You Today?</span>
        </h1> */}
      <h1 class="text-2xl sm:text-3xl md:text-[48px] leading-tight font-semibold ">
        <span>Hi there,</span>
        <span class="bg-gradient-to-r from-[#C94AFD] to-[#4F77FF] bg-clip-text text-transparent">
          Muhammad
        </span>
        <br />
        <span class="bg-gradient-to-r from-[#C94AFD] to-[#4F77FF] bg-clip-text text-transparent">
          What would like to know?
        </span>
      </h1>

      <p className="text-gray-500 text-[0.7rem] sm:text-[1rem] font-semibold lg:mt-3 md:text-[1.2rem] ">
        Use one of the most common prompts below or use your own to begin
      </p>
    </div>
  );
}

export default MainContent;
