import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext";
import axiosInstance from "./axios";

const Logout = () => {
  const { setRole } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = async() => {
    // Clear user session
   
   await axiosInstance.post("/userauthdata/logout").then((response) =>{
        console.log(response.data)
        setRole(null);
    })
    
    // Redirect to login
    navigate("/login");
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-x-4 mt-auto w-full p-2 rounded-md text-gray-300 hover:bg-light-white"
    >
      <img
        src="https://img.icons8.com/ios-glyphs/30/ffffff/logout-rounded-up.png"
        alt="Logout Icon"
      />
      <span className="origin-left duration-200">Logout</span>
    </button>
  );
};

export default Logout;
