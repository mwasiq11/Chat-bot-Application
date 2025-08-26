import React from "react";

function MainContent() {
  return (
    <div className="flex flex-col items-center text-center px-4 mt-6 sm:mt-8">
      {/* Main Heading */}
      <h1
        className="
          font-semibold 
          leading-[1.15] 
          tracking-tight 
          text-[clamp(1.6rem,5vw,3.5rem)]
          sm:text-[clamp(2rem,4.5vw,3.6rem)]
        "
      >
        <span>Welcome to </span>
        <span className="bg-gradient-to-r from-[#C94AFD] to-[#4F77FF] bg-clip-text text-transparent">
          BotRix
        </span>
        <br />
        <span className="bg-gradient-to-r from-[#C94AFD] to-[#4F77FF] bg-clip-text text-transparent">
          What would you like to know?
        </span>
      </h1>

      {/* Subtext */}
      <p
        className="
          text-gray-500 
          font-medium
          mt-3
          max-w-[90%] sm:max-w-[70%]
          text-[clamp(0.85rem,2.2vw,1.4rem)]
        "
      >
        Use one of the most common prompts below or use your own to begin
      </p>
    </div>
  );
}

export default MainContent;
