"use client";

import { useAuth } from '@/context/AuthProvider';
import { redirect } from 'next/navigation';
import AdminSidebar from '@/components/admin/sidebar/AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-purple-500"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!user || user.role !== 'admin') return redirect('/login');

  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <div className="flex-1 overflow-auto">
        <main>
          {children}
        </main>
      </div>
    </div>
  );
}
