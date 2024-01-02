import React, { useState } from 'react';
import './SideBar.css';
import onlineIcon from '../../icons/onlineIcon.png';

const Sidebar = ({ users }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div>
      <div className='sideBarButton-con'>
        <button className={`sideBarButton ${isSidebarOpen ? 'moved' : ''}`} onClick={toggleSidebar}>
          «
        </button>
      </div>

      <div className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
        {isSidebarOpen && users && (
          <div>
            <h1>
              <center className='onlineUsers'>Online Users</center>
            </h1>
            <div className="activeContainer">
              <h2>
                {users.map(({ name }) => (
                  <div key={name} className="activeItem">
                    <p className='space'>
                    <img alt="Online Icon" src={onlineIcon} /> {' '} {name}
                    </p>
                  </div>
                ))}
              </h2>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
