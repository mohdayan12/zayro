import React, { useState, useEffect, useContext, useRef } from 'react';
import { Link } from 'react-router-dom';
import { assets } from '../assets/assets.js';
import { authDataContext } from '../context/AuthContext.jsx';
import axios from 'axios';
import { toast } from 'react-toastify';

const Navbar = () => {
  const [showList, setShowList] = useState(false);
  const [input, setInput] = useState('');
  const { userData, setUserData, backendUrl, navigate, handleSearch } = useContext(authDataContext);
  const menuRef = useRef();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowList(false);
      }
    };
    if (showList) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showList]);

  // Search as user types
  useEffect(() => {
    handleSearch(input);
  }, [input]);

  // Logout user
  const userLogout = async () => {
    try {
      const res = await axios.post(`${backendUrl}/api/auth/logout`, {}, { withCredentials: true });
      if (res.data.status) {
        setUserData(null);
        toast.success(res.data.message);
        navigate('/');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <nav className="bg-white fixed  w-full z-50 border-b backdrop-blur-2xl   border-gray-300 shadow-sm px-4 md:px-10 py-4 flex items-center justify-between">
      {/* Logo */}
      <Link to="/"
       onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
        <img src={assets.zayro} alt="Zayro Logo" className="w-20 md:w-24" />
      </Link>

      {/* Search Bar */}
      <div className="w-[45%] relative  md:flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Start your next trip here..."
          className="w-full h-11 rounded-full border border-gray-300 pl-4 pr-12 focus:outline-sky-500 bg-sky-100"
        />
        {/* <div className="absolute right-[2px] top-0 h-full flex items-center justify-center w-12 rounded-r-full bg-sky-200">
          <img src={assets.search} alt="Search" className="w-6" />
        </div> */}
      </div>

      {/* Profile & Menu */}
      <div className="flex items-center gap-4">
        {/* User Icon */}
        {userData ? (
          <div className="bg-sky-700 text-white w-10 h-10 rounded-full flex items-center justify-center text-xl uppercase">
            {userData.user.email?.charAt(0)}
          </div>
        ) : (
          <Link to="/login">
            <img src={assets.profile} alt="Login" className="w-8 h-8 cursor-pointer" />
          </Link>
        )}

        {/* Menu Icon */}
        <div className="relative z-20">
          <img
            src={assets.menu}
            alt="menu"
            className="w-8 h-8 cursor-pointer"
            onClick={() => setShowList(true)}
          />

          {/* Dropdown */}
          <div
            ref={menuRef}
            className={`absolute right-0 top-12 w-40 bg-white shadow-lg border border-gray-200 rounded-lg p-4 transition-all duration-300 ease-in-out ${
              showList ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
            }`}
          >
            {/* Close Icon */}
            <img
              src={assets.cross}
              alt="Close"
              onClick={() => setShowList(false)}
              className="w-5 absolute top-3 right-3 cursor-pointer"
            />

            <hr className="my-6 border-t border-gray-300" />

            {userData ? (
              <div className="flex flex-col gap-3 text-gray-800">
                <Link to="/add-list">List Your Home</Link>
                <Link to="/my-listing">My Listings</Link>
                <Link to="/my-booking">My Bookings</Link>
                <button onClick={userLogout} className="text-red-500 text-left">
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 text-gray-700">
                <Link to="/login">Login</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
