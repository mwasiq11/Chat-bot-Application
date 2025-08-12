import React from "react";

export default function FeatureCard({ title, description }) {
  return (
    <div className="bg-black/40 backdrop-blur-md p-4 rounded-xl border border-gray-700 hover:border-gray-500 transition-colors">
      <h3 className="text-white font-semibold mb-1">{title}</h3>
      <p className="text-gray-400 text-sm">{description}</p>
    </div>
  );
}
