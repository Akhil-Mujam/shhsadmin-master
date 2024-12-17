import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from "./UserContext";
import logo from './assets/logo.png';
import control from './assets/control.png';
import Chart_fill from './assets/Chart_fill.png';
import Chat from './assets/Chat.png';
import User from './assets/User.png';
import Calendar from './assets/Calendar.png';
import Search from './assets/Search.png';
import Chart from './assets/Chart.png';
import Folder from './assets/Folder.png';
import Setting from './assets/Setting.png';

const SideBar = () => {
  const { role } = useContext(UserContext);
  const [open, setOpen] = useState(false);

  // Define sidebar menu items for each role
  const menusByRole = {
    admin: [
      { title: "Dashboard", src: Chart_fill, path: "/" },
      { title: "Events", src: Chat, path: "/events" },
      { title: "Accounts", src: User, gap: true },
      { title: "Students", src: Calendar, path: "/students" },
      { title: "Teacher Details", src: Search, path: "/teacher-details" },
      { title: "Analytics", src: Chart, path: "/analytics" },
      { title: "Attendance", src: Folder, gap: true, path: "/attendance-upload" },
      { title: "Notification", src: Setting, path: "/notifications" },
    ],
    teacher: [
      { title: "View Attendance", src: Chart_fill, path: "/view-attendance" },
      { title: "Attendance", src: Folder, path: "/attendance" },
      { title: "Marks", src: Calendar, path: "/marks" },
      { title: "View Marks", src: Setting, path: "/view-marks" },
    ],
    student: [
      { title: "Attendance Details", src: Folder, path: "/attendance-details" },
      { title: "Marks", src: Setting, path: "/marks" },
    ],
  };

  const Menus = menusByRole[role] || []; // Select the menu items based on role

  return (
    <div className="flex flex-col h-screen">
      
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className={`${open ? "w-72" : "w-20"} bg-dark-purple h-full p-5 pt-8 relative duration-300`}>
          <img
            src={control}
            alt="Toggle sidebar"
            className={`absolute cursor-pointer -right-3 top-9 w-7 border-dark-purple border-2 rounded-full ${!open && "rotate-180"}`}
            onClick={() => setOpen(!open)}
          />
          <div className="flex gap-x-4 items-center">
            <img src={logo} alt="Logo" className={`cursor-pointer duration-500 ${open && "rotate-[360deg]"}`} />
            <h1 className={`text-white origin-left font-medium text-xl duration-200 ${!open && "scale-0"}`}>
              {role.toUpperCase()}
            </h1>
          </div>
          <ul className="pt-6">
            {Menus.map((Menu, index) => (
              <li
                key={index}
                className={`flex rounded-md p-2 cursor-pointer hover:bg-light-white text-gray-300 text-sm items-center gap-x-4
                ${Menu.gap ? "mt-9" : "mt-2"}`}
              >
                <Link to={Menu.path || '#'} className="flex items-center gap-x-4">
                  <img src={Menu.src} alt={Menu.title} />
                  <span className={`${!open && "hidden"} origin-left duration-200`}>{Menu.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Main Content Area is handled in App.js */}
      </div>
    </div>
  );
};

export default SideBar;
