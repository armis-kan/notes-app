import React, { useState } from 'react';
import { removeToken } from '../services/tokenService';

const Sidebar = ({ onAddNote, onProfileIconClick }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    removeToken();
    window.location.reload('/auth'); // Reload the page to navigate to the auth route
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      {/* Sidebar Toggle Button */}
      <button
        className="fixed top-4 left-4 z-50 p-2 bg-gray-300 rounded-full lg:hidden"
        onClick={toggleSidebar}
      >
        <img src="./images/menu.svg" alt="Menu" className="w-6 h-6" />
      </button>

      {/* Sidebar */}
      <div className={`bg-gray-100 fixed inset-y-0 left-0 text-black w-56 flex-shrink-0 rounded-r-full flex flex-col items-center justify-between p-4 transition-transform ease-in-out duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`} style={{ zIndex: 100 }}>
        <div className="mt-20">
          <button 
            onClick={onAddNote}
            title='Create a new note' 
            className="flex items-center justify-center w-fit p-3 bg-gray-300 hover:bg-green-300 rounded-full transition-all ease-in-out"
          >
            <img src="./images/create.svg" alt="Create new note" className="w-8 h-8" />
          </button>
        </div>

        <div className="mb-4">
          <hr className='mb-2' />

          <button 
            title='My profile' 
            className="flex items-center justify-center p-3 text-center hover:bg-green-300 bg-gray-200 rounded-full mb-2 transition-all ease-in-out"
            onClick={onProfileIconClick} 
          >
            <img src="./images/profile.svg" alt="Dashboard" className="w-6 h-6 inline-block" />
          </button>
          <button 
            title='Log out' 
            className="flex items-center justify-center p-3 text-center hover:bg-green-300 bg-gray-200 rounded-full transition-all ease-in-out"
            onClick={handleLogout}
          >
            <img src="./images/logout.svg" alt="Logout" className="w-6 h-6 inline-block" />
          </button>
        </div>
      </div>

      {/* Overlay for closing the sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-100 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </>
  );
}

export default Sidebar;
