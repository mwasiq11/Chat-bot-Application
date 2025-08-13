import React from "react";

function FeatureCard() {
  return (
    <div className="grid gap-6 ml-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <div
        className="
            flex flex-col justify-between
            h-[9rem] 
            bg-white/70 backdrop-blur-lg
            rounded-2xl text-black 
            shadow-md hover:shadow-2xl
            border border-gray-200
            transition-all duration-300 ease-in-out
            hover:-translate-y-1 hover:border-purple-400 hover:shadow-purple-200/70
            p-4
          "
      >
        <p className="font-medium text-gray-700 leading-snug">
          Write to-do list for personal project or task
        </p>

        <div className="flex items-end">
          <img
            className="h-10 w-auto drop-shadow-md"
            src="https://www.freeiconspng.com/thumbs/profile-icon-png/profile-icon-9.png"
            alt="profile-icon"
          />
        </div>
      </div>
      <div
        className="
            flex flex-col justify-between
            h-[9rem] 
            bg-white/70 backdrop-blur-lg
            rounded-2xl text-black 
            shadow-md hover:shadow-2xl
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
            className="h-10 w-auto drop-shadow-md"
            src="./public/assets/email-icon.png"
            alt="email-icon"
          />
        </div>
      </div>
      <div
        className="
            flex flex-col justify-between
            h-[9rem] 
            bg-white/70 backdrop-blur-lg
            rounded-2xl text-black 
            shadow-md hover:shadow-2xl
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
            className="h-10 w-auto drop-shadow-md"
            src="https://images.vexels.com/media/users/3/136397/isolated/preview/375e0e784a1623517b75ea61bc1db555-basic-message-icon.png"
            alt="message-icon"
          />
        </div>
      </div>
      <div
        className="
            flex flex-col justify-between
            h-[9rem] 
            bg-white/70 backdrop-blur-lg
            rounded-2xl text-black 
            shadow-md hover:shadow-2xl
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
            className="h-10 w-auto drop-shadow-md"
            src="./public/assets/data-icon.png"
            alt="data-structure-icon"
          />
        </div>
      </div>
    </div>
  );
}

export default FeatureCard;
