'use client';

import Dashboard from "@/components/user/dashboard/Dashboard";
import { useAuth } from '@/context/AuthProvider';
import { useSession } from 'next-auth/react';
import React from "react";

export default function UserDashboardPage() {
  const { user, loading } = useAuth();
  const { data: session, status } = useSession();

  if (loading || status === 'loading') {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading user dashboard...</div>
      </div>
    );
  }

  return <Dashboard />;
}
