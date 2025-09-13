'use client';

import { useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useAuth } from '@/context/AuthProvider';

export const useAuthRedirect = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const { user, loading } = useAuth();
  const hasRedirected = useRef(false);

  useEffect(() => {
    // Don't redirect if still loading
    if (loading || status === 'loading') {
      return;
    }

    // Don't redirect if not on login page or already redirected
    if (pathname !== '/login' || hasRedirected.current) {
      return;
    }

    // Check if we have authentication (either NextAuth session or user from AuthProvider)
    const isAuthenticated = session?.user || user;
    
    if (isAuthenticated) {
      const userData = user || {
        role: (session?.user as any)?.role || 'user'
      };

      console.log('useAuthRedirect: Redirecting authenticated user with role:', userData.role);
      hasRedirected.current = true;
      
      // Small delay to ensure the state is properly set
      setTimeout(() => {
        if (userData.role === 'admin') {
          router.replace('/admin/dashboard');
        } else {
          router.replace('/user/dashboard');
        }
      }, 100);
    }
  }, [session, user, loading, status, pathname, router]);

  // Reset the redirect flag when the pathname changes
  useEffect(() => {
    if (pathname !== '/login') {
      hasRedirected.current = false;
    }
  }, [pathname]);
};
