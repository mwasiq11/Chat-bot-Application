// Layout.jsx
import { Outlet } from "react-router-dom";
import HistorySidebar from "./HistorySidebar";

export default function Layout() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-100 border-r">
        <HistorySidebar />
      </div>

      {/* Main content */}
      <div className="flex-1 p-6">
        <Outlet /> {/* this will render page content */}
      </div>
    </div>
  );
}
