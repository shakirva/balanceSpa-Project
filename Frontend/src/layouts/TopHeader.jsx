import React, { useEffect, useState, useRef } from "react";
import { FaBell, FaUserCircle, FaMoon, FaSun } from "react-icons/fa";
import {
  TbLayoutSidebarRightExpand,
  TbLayoutSidebarLeftExpand,
} from "react-icons/tb";

const TopHeader = ({ toggleSidebar, isCollapsed }) => {
  const [isDarkMode, setIsDarkMode] = useState(
    () => localStorage.getItem("darkMode") === "true"
  );
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const userDropdownRef = useRef(null);

  // Apply dark mode class on mount
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const newMode = !prev;
      localStorage.setItem("darkMode", newMode);
      document.documentElement.classList.toggle("dark", newMode);
      return newMode;
    });
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target)
      ) {
        setUserDropdownOpen(false);
      }
    }
    if (userDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [userDropdownOpen]);

  const handleProfile = () => {
    setUserDropdownOpen(false);
    // Add navigation or modal for profile here
    alert("Profile clicked");
  };

  const handleLogout = () => {
    setUserDropdownOpen(false);
    // Add logout logic here
    alert("Logout clicked");
  };

  return (
    <div className="flex items-center justify-between px-6 py-3 bg-gray-100 shadow-md gap-4 dark:bg-bgLighdark">
      <button
        onClick={toggleSidebar}
        className="text-2xl bg-white p-3 rounded-full dark:bg-bgDark dark:text-white"
        aria-label="Toggle Sidebar"
      >
        {isCollapsed ? (
          <TbLayoutSidebarLeftExpand />
        ) : (
          <TbLayoutSidebarRightExpand />
        )}
      </button>

      <div className="flex gap-4 items-center bg-white dark:bg-bgDark p-2 rounded-full">
        <div className="flex items-center rounded-full bg-[#f3f4f6] dark:bg-bgDark">
          <input
            type="text"
            placeholder="Search..."
            className="px-4 py-2 w-full rounded-full text-gray-700 bg-[#f3f4f6] dark:bg-[#2b2b2b]  focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="relative" ref={userDropdownRef}>
          <FaUserCircle
            className="text-gray-600 dark:text-gray-300 cursor-pointer text-2xl"
            onClick={() => setUserDropdownOpen((open) => !open)}
          />
          {userDropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
              <button
                className="block w-full text-left px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={handleProfile}
              >
                Profile
              </button>
              <button
                className="block w-full text-left px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopHeader;
