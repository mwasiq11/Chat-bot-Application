import React from "react";

function FeatureCard({ onCardClick, onRefresh }) {
  return (
    <div className="grid gap-6 ml-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-10">
      <div
        onClick={() =>
          onCardClick("Write to-do list for personal project or task?")
        }
        className="
                      flex flex-col justify-between shadow-[5px_5px_10px_#babace,_-5px_-5px_10px_#ffffff]
            h-[9rem] 
            bg-white/90 backdrop-blur-lg
            rounded-2xl text-black 
             hover:shadow-2xl
            border border-gray-200
            transition-all duration-300 ease-in-out
            hover:-translate-y-1 hover:border-purple-400 hover:shadow-purple-200/70
            p-4
          "
      >
        <p className="font-medium text-gray-700 leading-snug">
          Write to-do list for personal project or task
        </p>

        <div className="flex items-end ">
          <img
            className="h-6 w-auto drop-shadow-md "
            src="./assets/profile_icon.png"
            alt="profile-icon"
          />
        </div>
      </div>
      <div
        onClick={() => onCardClick("Generate a email to reply to a job offer?")}
        className="
            flex flex-col justify-between shadow-[5px_5px_10px_#babace,_-5px_-5px_10px_#ffffff]
            h-[9rem] 
           bg-white/90 backdrop-blur-lg
            rounded-2xl text-black 
             hover:shadow-2xl
            border border-gray-200
            transition-all duration-300 ease-in-out
            hover:-translate-y-1 hover:border-purple-400 hover:shadow-purple-200/70
            p-4
          "
      >
        <p className="font-medium text-gray-700 leading-snug">
          Generate a email to reply to a job offer
        </p>

        <div className="flex items-end">
          <img
            className="h-8 w-auto drop-shadow-md"
            src="./assets/email-icon.png"
            alt="email-icon"
          />
        </div>
      </div>
      <div
        onClick={() =>
          onCardClick("Summarize this article or text for me in one paragraph?")
        }
        className="
            flex flex-col justify-between shadow-[5px_5px_10px_#babace,_-5px_-5px_10px_#ffffff]
            h-[9rem] 
         bg-white/90 backdrop-blur-lg
            rounded-2xl text-black 
            hover:shadow-2xl
            border border-gray-200
            transition-all duration-300 ease-in-out
            hover:-translate-y-1 hover:border-purple-400 hover:shadow-purple-200/70
            p-4
          "
      >
        <p className="font-medium text-gray-700 leading-snug">
          Summarize this article or text for me in one paragraph
        </p>

        <div className="flex items-end">
          <img
            className="h-8 w-auto drop-shadow-md"
            src="https://images.vexels.com/media/users/3/136397/isolated/preview/375e0e784a1623517b75ea61bc1db555-basic-message-icon.png"
            alt="message-icon"
          />
        </div>
      </div>
      <div
        onClick={() =>
          onCardClick(
            "How does AI helps programmers to understand complex data structures?"
          )
        }
        className="
            flex flex-col justify-between
            h-[9rem] 
           bg-white/90 backdrop-blur-lg shadow-[5px_5px_10px_#babace,_-5px_-5px_10px_#ffffff]
            rounded-2xl text-black 
            hover:shadow-2xl
            border border-gray-200
            transition-all duration-300 ease-in-out
            hover:-translate-y-1 hover:border-purple-400 hover:shadow-purple-200/70
            p-4
          "
      >
        <p className="font-medium text-gray-700 leading-snug">
          How does AI helps programmers to understand complex data structures?
        </p>

        <div className="flex items-end">
          <img
            className="h-8 w-auto drop-shadow-md"
            src="./assets/data-icon.png"
            alt="data-structure-icon"
          />
        </div>
      </div>
      {/*Refresh icon */}
      <div className="flex flex-row">
        <a href="">
          <button
            onClick={() => onRefresh()}
            className="flex items-center cursor-pointer"
          >
            <img
              className="h-5 w-auto ml-4 mt-2"
              src="./assets/refresh.png"
              alt="refresh-icon"
            />
            <p className="text-md text-gray-500 font-semibold leading-snug mt-2 ml-2">
              Refresh Prompts
            </p>
          </button>
        </a>
      </div>
    </div>
  );
}

export default FeatureCard;
