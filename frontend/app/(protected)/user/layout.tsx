"use client";

import { useAuth } from '@/context/AuthProvider';
import { redirect } from 'next/navigation';
import Sidebar from '@/components/user/sidebar/Sidebar';
import Navbar from '@/components/navbar/Navbar';
import { useSession } from 'next-auth/react';

export default function UserLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const { data: session, status } = useSession();

  // Show loading while authentication is being determined
  if (loading || status === 'loading') {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Check authentication from either source
  const currentUser = user || session?.user;
  const userRole = user?.role || (session?.user as any)?.role;
  
  // Redirect if no user or if user is not a regular user
  if (!currentUser) {
    return redirect('/login');
  }
  
  if (userRole && userRole !== 'user') {
    return redirect('/login');
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 overflow-auto flex flex-col">
        <Navbar />
        <main className="flex-1 p-4">
          {children}
        </main>
      </div>
    </div>
  );
}
