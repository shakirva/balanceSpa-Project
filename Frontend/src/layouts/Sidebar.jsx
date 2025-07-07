import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaHome, FaCog, FaSignOutAlt } from "react-icons/fa";
import logo from "@assets/logo.png";
import { FaCartPlus } from "react-icons/fa6";
import { assets } from "@assets/assets.js";
import { RiStackFill } from "react-icons/ri";
import { BsBoxSeamFill } from "react-icons/bs";
import { FaUser } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import { FaUsers } from "react-icons/fa";
import { FaCalendarAlt } from "react-icons/fa";

const Sidebar = ({ isCollapsed, toggleSidebar }) => {
  return (
    <div
      className={`fixed top-0 left-0 h-full z-40 bg-white transition-transform duration-500 ease-in-out dark:bg-bgDark ${
        isCollapsed ? "-translate-x-full" : "translate-x-0"
      } md:relative md:translate-x-0 `}
    >
      <div className="flex items-center p-4 justify-center">
        <img
          src={isCollapsed ? '' : assets.textlogo}
          alt="Logo"
          className={`h-8 w-28 transition-all duration-500 dark:invert dark:brightness-0 ${
            isCollapsed ? "hidden" : "hidden md:block"
          }`}
        />
        <img
          src={assets.textlogo}
          alt="Mobile Logo"
          className={`h-8 w-10 transition-all duration-500 dark:invert dark:brightness-0 ${
            isCollapsed ? "block" : "md:hidden"
          }`}
        />
        <button
          onClick={toggleSidebar}
          className="md:hidden text-gray-700 text-2xl ms-11 bg-red-100 rounded-full p-1"
          aria-label="Close Sidebar"
        >
          <IoClose />
        </button>
      </div>
      <div className="p-4 flex flex-col gap-[6px]">
        <MenuItem
          icon={<FaHome />}
          text="Dashboard"
          to="/"
          isCollapsed={isCollapsed}
        />
        <MenuItem
          icon={<FaCalendarAlt />}
          text="Appointments"
          to="/appointment"
          isCollapsed={isCollapsed}
        />
         <MenuItem
          icon={<RiStackFill />}
          text="Services"
          to="/service-category"
          isCollapsed={isCollapsed}
        />
         <MenuItem
          icon={<BsBoxSeamFill />}
          text="Treatment"
          to="/treatment"
          isCollapsed={isCollapsed}
        />
        {/* <MenuItem
          icon={<BsBoxSeamFill />}
          text="Products"
          to="/products"
          isCollapsed={isCollapsed}
        /> */}
        <MenuItem
          icon={<FaUsers />}
          text="Customers"
          to="/customers"
          isCollapsed={isCollapsed}
        />
       
        <MenuItem
          icon={<FaUser />}
          text="Users"
          to="/users"
          isCollapsed={isCollapsed}
        />
        
       
        <MenuItem
          icon={<FaCog />}
          text="Settings"
          to="/settings"
          isCollapsed={isCollapsed}
        />
        <MenuItem
          icon={<FaSignOutAlt />}
          text="Logout"
          to="/logout"
          isCollapsed={isCollapsed}
        />
      </div>
    </div>
  );
};

const MenuItem = ({ icon, text, to, isCollapsed }) => {
  const location = useLocation();
  const isActive =
    location.pathname === to ||
    (to !== "/" && location.pathname.startsWith(to));

  return (
    <Link
      to={to}
      className={`flex items-center  ${
        isCollapsed ? "justify-center p-4 pe-3 w-12 h-12" : "justify-start"
      } px-3 pe-16 py-3 rounded-lg ${
        isActive ? "bg-[#18181b] text-white" : "text-gray-500"
      } hover:bg-gray-300 hover:text-white dark:hover:bg-gray-600 transition duration-200 cursor-pointer`}
    >
      {icon}
      {!isCollapsed && <span className="ml-3">{text}</span>}
    </Link>
  );
};

export default Sidebar;
