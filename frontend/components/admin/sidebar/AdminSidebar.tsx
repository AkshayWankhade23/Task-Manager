'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthProvider';
import { 
  Home, 
  BarChart3, 
  Users, 
  Settings, 
  User, 
  LogOut, 
  FileText,
  ShieldCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Define the navigation items
type NavItem = {
  title: string;
  href: string;
  icon: React.ElementType;
  activeMatch: string;
};

const adminNavItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/admin/dashboard',
    icon: Home,
    activeMatch: '/admin/dashboard'
  },
  {
    title: 'Users',
    href: '/admin/users',
    icon: Users,
    activeMatch: '/admin/users'
  },
  {
    title: 'Analytics',
    href: '/admin/analytics',
    icon: BarChart3,
    activeMatch: '/admin/analytics'
  },
  {
    title: 'Content',
    href: '/admin/content',
    icon: FileText,
    activeMatch: '/admin/content'
  },
  {
    title: 'Permissions',
    href: '/admin/permissions',
    icon: ShieldCheck,
    activeMatch: '/admin/permissions'
  },
  {
    title: 'Settings',
    href: '/admin/settings',
    icon: Settings,
    activeMatch: '/admin/settings'
  },
];

const AdminSidebar = () => {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  if (!user) return null;

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('AdminSidebar logout error:', error);
    }
  };

  return (
    <div className="flex h-screen w-64 flex-col bg-gray-900 text-white">
      {/* Logo and branding */}
      <div className="flex h-16 items-center justify-center border-b border-gray-800">
        <h1 className="text-2xl font-bold">Admin Portal</h1>
      </div>

      {/* User info */}
      <div className="flex flex-col items-center py-6 px-4 border-b border-gray-800">
        <div className="h-12 w-12 rounded-full bg-gray-700 flex items-center justify-center text-xl font-bold">
          {user.name ? user.name.charAt(0).toUpperCase() : 'A'}
        </div>
        <p className="mt-3 font-medium">{user.name}</p>
        <span className="mt-1 rounded-full bg-blue-600 px-2 py-0.5 text-xs font-semibold">Admin</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-2">
          {adminNavItems.map((item) => (
            <li key={item.href}>
              <Link 
                href={item.href}
                className={cn(
                  "flex items-center rounded-md py-2 px-3 text-sm hover:bg-gray-800 transition-colors",
                  pathname.startsWith(item.activeMatch) ? "bg-gray-800 text-blue-400" : "text-gray-300"
                )}
              >
                <item.icon className="mr-3 h-4 w-4" />
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout button */}
      <div className="p-4 border-t border-gray-800">
        <button
          onClick={handleLogout}
          className="flex w-full items-center rounded-md px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 transition-colors"
        >
          <LogOut className="mr-3 h-4 w-4" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
