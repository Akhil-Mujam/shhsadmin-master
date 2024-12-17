// DashboardLayout.js
import React from 'react';
import SideBar from './SideBar'; // Import the sidebar component
import Header from './Header';
import { Outlet } from 'react-router-dom'; // For nested routing

const DashboardLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden">
    {/* Sidebar */}
    <SideBar />

    {/* Main Content Area */}
    <div className="flex flex-col w-full">
      {/* Header */}
      <Header />
      
      {/* Page Content */}
      <main className="flex-1 overflow-auto p-4 bg-gray-100">
        <Outlet/>
      </main>
    </div>
  </div>
  );
};

export default DashboardLayout;
