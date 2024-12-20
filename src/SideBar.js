import React, { useContext, useState } from 'react';
import { Link, useLocation,useNavigate } from 'react-router-dom';
import { UserContext } from "./UserContext";
import axiosInstance from './axios';
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
  const { role} = useContext(UserContext);

  //const displayRole = loading ? 'Loading...' : role ? role.toUpperCase() : 'GUEST';

  const [open, setOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async() => {
    // Clear user session
   
   await axiosInstance.post("/userauthdata/logout").then((response) =>{
        console.log(response.data)
        
    })
    
    // Redirect to login
    navigate("/login");
  };


  const menusByRole = {
    Admin: [
      { title: "Dashboard", src: Chart_fill, path: "/dashboard" },
      { title: "Events", src: Chat, path: "/events" },
      { title: "Circular", src: User, gap: true , path: "/circular "},
      { title: "Students", src: Calendar, path: "/student-details" },
      { title: "Teacher Details", src: Search, path: "/teacher-details" },
      { title: "Analytics", src: Chart, path: "/analytics" },
      { title: "Attendance", src: Folder, gap: true, path: "/attendance-upload" },
      { title: "Notification", src: Setting, path: "/notifications" },
      { title: "Logout", src: "https://img.icons8.com/ios-glyphs/30/ffffff/logout-rounded-up.png", gap: true },
    ],
    ClassTeacher: [
      { title: "View Attendance", src: Chart_fill, path: "/view-CT-attendance" },
      { title: "Attendance", src: Folder, path: "/attendance-upload" },
      { title: "Marks", src: Calendar, path: "/marks-upload" },
      { title: "View Marks", src: Setting, path: "/view-marks" },
      { title: "Logout", src: "https://img.icons8.com/ios-glyphs/30/ffffff/logout-rounded-up.png", gap: true },
    ],
    Teacher: [
      { title: "View Attendance", src: Chart_fill, path: "/view-attendance" },
      { title: "View Marks", src: Setting, path: "/view-marks" },
      { title: "Logout", src: "https://img.icons8.com/ios-glyphs/30/ffffff/logout-rounded-up.png", gap: true },
    ],
    Student: [
      { title: "Attendance Details", src: Folder, path: "/view-student-attendance" },
      { title: "Marks", src: Setting, path: "/Student-Marks" },
      { title: "Logout", src: "https://img.icons8.com/ios-glyphs/30/ffffff/logout-rounded-up.png", gap: true },
    ],
  };

  const Menus = menusByRole[role] || [];

  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-1">
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
              {role}
            </h1>
          </div>
          <ul className="pt-6">
            {Menus.map((Menu, index) => (
              <li
                key={index}
                className={`flex rounded-md p-2 cursor-pointer hover:bg-light-white text-gray-300 text-sm items-center gap-x-4
                ${Menu.gap ? "mt-9" : "mt-2"} ${location.pathname === Menu.path ? "bg-light-white" : ""}`}
              >
                {Menu.title === "Logout" ? (
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-x-4 w-full text-left"
                  >
                    <img src={Menu.src} alt={Menu.title} />
                    <span className={`${!open && "hidden"} origin-left duration-200`}>{Menu.title}</span>
                  </button>
                ) : (
                  <Link to={Menu.path || "#"} className="flex items-center gap-x-4">
                    <img src={Menu.src} alt={Menu.title} />
                    <span className={`${!open && "hidden"} origin-left duration-200`}>{Menu.title}</span>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
