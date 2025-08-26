import React from "react";

function PageNotFound() {
  return (
    <div className="flex items-center justify-center h-screen ">
      <div className="flex flex-col items-center ">
        <img className="h-20 w-20 mb-4" src="/assets/lock.png" alt="lock-logo" />

        <h1 className="text-2xl font-semibold text-gray-700">
          This content isn't available at the moment
        </h1>

        <span className="text-[17px] text-gray-700">
          When this happens, it's usually because the owner only shared{" "}
        </span>
        <span className="text-gray-700">
          {" "}
          it with a small group of people or of invalid URL, or it's been
          deleted.
        </span>
      </div>
    </div>
  );
}

export default PageNotFound;
