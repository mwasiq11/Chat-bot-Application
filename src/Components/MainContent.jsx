import React from "react";
import FeatureCard from "./FeatureCard";
import SearchBar from "./Searchbar";
export default function MainContent() {
  return (
    <main className="flex-1 bg-gradient-to-b from-gray-900 via-black to-gray-900 text-center p-8">
      <div className="mt-32">
        <h1 className="text-3xl font-light text-gray-300">
          Good morning <span className="text-white font-medium">Anna</span>, ready to start?
        </h1>

        <div className="mt-6 flex justify-center">
          <SearchBar />
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <FeatureCard
            title="My Weekly Reports"
            description="Your weekly reports are already here. See what I have prepared."
          />
          <FeatureCard
            title="Dashboard Designer"
            description="Design dashboards your way – fast, simple, and fully personalised."
          />
          <FeatureCard
            title="Advanced Analysis"
            description="Go beyond the basics – discover new, game-changing insights."
          />
        </div>

        <p className="mt-10 text-gray-600 text-xs">
          Disclaimer: This chatbot uses Artificial Intelligence to generate analytical insights...
        </p>
      </div>
    </main>
  );
}
