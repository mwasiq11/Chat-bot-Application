import React, { useState, useEffect } from "react";
import { FaBars } from "react-icons/fa";
import { LeftSidePortion } from "./LeftSidePortion";

export default function SidebarToggle() {
  const [isOpen, setIsOpen] = useState(false);

  // Automatically open sidebar on desktop load
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 640) {
        setIsOpen(true); // Desktop: open by default
      } else {
        setIsOpen(false); // Mobile: closed by default
      }
    };

    handleResize(); // Run once on mount
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {/* Mobile menu button (top-left) */}
      <button
        onClick={() => setIsOpen(true)}
        className="p-3 text-2xl text-green-500 sm:hidden absolute top-3 left-3 z-50"
      >
        <FaBars />
      </button>

      {/* Sidebar */}
      {isOpen && (
        <>
          {/* Dark background overlay for mobile */}
          <div
            className="fixed inset-0 bg-black bg-opacity-40 sm:hidden"
            onClick={() => setIsOpen(false)}
          ></div>

          <div
            className={`
              fixed top-0 left-0 h-full w-64
              z-50
              transform transition-transform duration-300
              bg-white
              shadow-lg
              ${isOpen ? "translate-x-0" : "-translate-x-full"}
            `}
          >
            <LeftSidePortion onClose={() => setIsOpen(false)} />
          </div>
        </>
      )}
    </>
  );
}
