import React from "react";

export default function Header() {
  return (
    <div className="absolute top-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
      {/* Glow Line */}
      <div className="relative w-[300px] h-[2px] bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-80 blur-sm"></div>

      {/* Bot Icon */}
      <div className="absolute -top-10">
        <div className="relative">
          {/* Outer Glow */}
          <div className="absolute inset-0 rounded-full bg-blue-500 blur-3xl opacity-50"></div>

          {/* Inline SVG Bot */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 64 64"
            className="relative w-20 h-20 z-10"
          >
            <circle cx="32" cy="32" r="30" fill="#1e293b" stroke="#3b82f6" strokeWidth="4" />
            <circle cx="24" cy="28" r="4" fill="#3b82f6" />
            <circle cx="40" cy="28" r="4" fill="#3b82f6" />
            <rect x="18" y="38" width="28" height="4" rx="2" fill="#3b82f6" />
          </svg>
        </div>
      </div>
    </div>
  );
}
