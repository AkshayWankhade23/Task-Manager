'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getMe, api } from '@/lib/api';
import { User } from '@/types/auth';
import { useSession, signOut } from 'next-auth/react';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // First, check if we have NextAuth session
        if (session && session.user) {
          console.log('AuthProvider: Using NextAuth session');
          
          // Convert NextAuth user to our User type
          const userData: User = {
            id: session.user.id || '',
            name: session.user.name || '',
            email: session.user.email || '',
            role: (session.user as any).role || 'user',
            image: session.user.image || null,
          };
          
          setUser(userData);
          
          // Store user data and token in localStorage for consistent access
          if (typeof window !== 'undefined') {
            localStorage.setItem('user', JSON.stringify(userData));
            
            // If we have an access token from NextAuth, set it for API calls
            if ((session as any).accessToken) {
              localStorage.setItem('accessToken', (session as any).accessToken);
            }
          }
          
          return;
        }
        
        // If no NextAuth session, fall back to previous auth method
        if (typeof window !== 'undefined') {
          // First check localStorage directly
          const userString = localStorage.getItem('user');
          const token = localStorage.getItem('accessToken');
          
          if (token && userString) {
            try {
              console.log('AuthProvider: Found user in localStorage');
              const userData = JSON.parse(userString);
              
              // For now, trust the localStorage data if we have both token and user
              // This prevents issues when the backend is not available
              console.log('AuthProvider: Using cached user data');
              setUser(userData);
              return;
              
              // Optional: Verify the token is still valid with a quick API call
              // Commented out to prevent issues when backend is not running
              /*
              try {
                console.log('AuthProvider: Verifying token validity');
                await api.get('/auth/verify-token');
                console.log('AuthProvider: Token is valid');
                setUser(userData);
                return;
              } catch (tokenErr) {
                console.error('AuthProvider: Token validation failed', tokenErr);
                // Token is invalid, clear it and continue to API call
                localStorage.removeItem('accessToken');
                localStorage.removeItem('user');
              }
              */
            } catch (e) {
              console.error('AuthProvider: Error parsing user JSON', e);
              // Continue to API call if JSON parsing fails
            }
          }
          
          // If we get here, we need to call the API only if we have a token
          const apiToken = localStorage.getItem('accessToken');
          if (apiToken) {
            console.log('AuthProvider: Calling getMe API');
            const res = await getMe();
            console.log('AuthProvider: API response', res);
            setUser(res.user);
          } else {
            // No authentication available - this is normal for unauthenticated users
            setUser(null);
          }
        }
      } catch (err) {
        console.error('Error in auth provider:', err);
        setUser(null);
        
        // If there's an auth error and we're not already on the login page, redirect
        if (typeof window !== 'undefined' && 
            !window.location.pathname.includes('/login') && 
            !window.location.pathname.includes('/register')) {
          console.log('AuthProvider: Redirecting to login due to auth error');
          router.push('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    // Only run fetchUser if the session status is no longer loading
    if (status !== 'loading') {
      fetchUser();
    }
    
    // Listen for storage events to sync auth state across tabs
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'user' && event.newValue) {
        try {
          setUser(JSON.parse(event.newValue));
        } catch (e) {
          console.error('Error parsing user from storage event', e);
        }
      } else if (event.key === 'user' && !event.newValue) {
        setUser(null);
      }
    };
    
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorageChange);
      return () => window.removeEventListener('storage', handleStorageChange);
    }
  }, [router, session, status]);

  const logout = async (): Promise<void> => {
    console.log('AuthProvider: Logging out user');
    // Sign out from NextAuth
    await signOut({ redirect: false });
    
    // Clear user data from localStorage first
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
    }
    
    // Update state immediately
    setUser(null);
    
    try {
      // Call logout API if needed
      await api.post('/auth/logout');
      console.log('AuthProvider: Logout API call successful');
    } catch (err) {
      console.error('AuthProvider: Logout API error:', err);
      // Continue with logout process even if API fails
    }
    
    // Use window.location for a full page refresh/redirect which is more reliable
    if (typeof window !== 'undefined') {
      console.log('AuthProvider: Redirecting to login page');
      window.location.href = '/login';
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
