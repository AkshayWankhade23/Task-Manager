"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthProvider";
import { useState, useRef, useEffect } from "react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!user) return null; // Don't show navbar when not logged in

  return (
    <nav className="flex justify-between items-center p-4 bg-white border-b text-gray-800 shadow-sm">
      <div className="flex gap-4 items-center">
        <h1 className="text-xl font-bold md:hidden">Task Manager</h1>
      </div>
      
      <div className="relative ml-auto" ref={dropdownRef}>
        <button 
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center space-x-2 p-2 rounded hover:bg-gray-100"
        >
          <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center text-white">
            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <span className="hidden md:inline">{user.name}</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 py-2 bg-white rounded-md shadow-lg z-10">
            <Link
              href="/user/profile"
              className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
              onClick={() => setDropdownOpen(false)}
            >
              Profile
            </Link>
            <Link
              href="/user/settings"
              className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
              onClick={() => setDropdownOpen(false)}
            >
              Settings
            </Link>
            <button
              onClick={async () => {
                try {
                  await logout();
                  setDropdownOpen(false);
                } catch (error) {
                  console.error("Navbar logout error:", error);
                }
              }}
              className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
