import React from "react";
import { NavLink } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const Sidebar = () => {
  const links = [
    { name: "Candidates", path: "/candidates" },
    { name: "Profile", path: "/profile" },
    { name: "Settings", path: "/settings" },
  ];

  return (
    <div className="w-44 h-screen bg-gray-800 text-white fixed">
      <div className="p-4 text-2xl font-bold border-b border-gray-700">
        RMS
      </div>
      <nav className="mt-4">
        {links.map((link, index) => (
          <NavLink
            key={index}
            to={link.path}
            className={({ isActive }) =>
              `block py-2.5 px-4 text-sm ${
                isActive ? "bg-gray-700 text-yellow-400" : "hover:bg-gray-700"
              }`
            }
          >
            {link.name}
          </NavLink>
        ))}
           <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
      />
      </nav>
    </div>
  );
};

export default Sidebar;
