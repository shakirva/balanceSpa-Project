import React, { useState } from "react";
import Sidebar from "./Sidebar";
import TopHeader from "./TopHeader";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev);
  };

  return (
    <div className="flex w-full h-screen">
      <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
      <div
        className={`flex-1 flex flex-col bg-cover bg-center overflow-hidden ${
          isCollapsed ? "" : ""
        }`}
      >
        {/* <TopHeader isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} /> */}
        <main className="flex-1 p-4 overflow-y-auto bg-gray-100 dark:bg-bgLighdark">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
