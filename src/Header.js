// Header.js
import React from 'react';

const Header = () => {
  return (
    <header className="bg-dark-purple text-white p-4 shadow-md w-full flex justify-between items-center">
      <h1 className="text-lg lg:text-2xl font-bold">Sacred Heart High School</h1>
      <div className="hidden md:block"> {/* Add responsive features here as needed */}
        {/* Additional header items like profile icon or notifications can be added */}
      </div>
    </header>
  );
};

export default Header;
