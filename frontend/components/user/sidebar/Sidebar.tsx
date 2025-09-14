"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  BarChart3,
  BookOpen,
  LucideIcon,
  Settings,
  User,
  Book,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "@/context/AuthProvider";
import { cn } from "@/lib/utils";
import { useState } from "react";

// Define the navigation items
type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  activeMatch: string;
};

const userNavItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/user/dashboard",
    icon: Home,
    activeMatch: "/user/dashboard",
  },
  {
    title: "Projects",
    href: "/user/projects",
    icon: BarChart3,
    activeMatch: "/user/projects",
  },
  {
    title: "Daily Tasks",
    href: "/user/daily-tasks",
    icon: BookOpen,
    activeMatch: "/user/daily-tasks",
  },
  {
    title: "Learning",
    href: "/user/learning",
    icon: Book,
    activeMatch: "/user/learning",
  },
  {
    title: "Profile",
    href: "/user/profile",
    icon: User,
    activeMatch: "/user/profile",
  },
  {
    title: "Settings",
    href: "/user/settings",
    icon: Settings,
    activeMatch: "/user/settings",
  },
];

const Sidebar = () => {
  const pathname = usePathname();
  const { logout } = useAuth();
  const [isOpen, setIsOpen] = useState(true);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Sidebar logout error:", error);
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col bg-gray-900 text-white transition-all duration-300",
        isOpen ? "w-64" : "w-18"
      )}
    >
      <div className="flex justify-between items-center h-16 border-b border-gray-800 px-2">
        {/* Logo and branding */}
        <div className="mr-2 w-[90%]">
          {isOpen && (
            <div className="flex h-16 items-center justify-center">
              <h1 className="text-2xl font-bold">Task Manager</h1>
            </div>
          )}
        </div>

        {/* Toggle Button */}
        <div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-800 hover:bg-gray-700"
          >
            {isOpen ? (
              <ChevronLeft className="h-5 w-5 text-white" />
            ) : (
              <ChevronRight className="h-5 w-5 text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-2">
          {userNavItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center rounded-md py-2 px-3 text-sm hover:bg-gray-800 transition-colors",
                  pathname.startsWith(item.activeMatch)
                    ? "bg-gray-800 text-blue-400"
                    : "text-gray-300"
                )}
              >
                <item.icon className="h-6 w-6" /> {/* Increased size */}
                {isOpen && <span className="ml-3">{item.title}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout button */}
      <div className="p-4 border-t border-gray-800">
        <button
          onClick={handleLogout}
          className="flex items-center w-full rounded-md px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 transition-colors"
        >
          <LogOut className="h-6 w-6" /> {/* Increased size */}
          {isOpen && <span className="ml-3">Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

