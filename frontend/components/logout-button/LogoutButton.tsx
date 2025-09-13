'use client';
import { useAuth } from '@/context/AuthProvider';

const LogoutButton = () => {
  const { logout } = useAuth();
  
  const handleLogout = async () => {
    try {
      await logout();
      // No need to redirect here, logout() handles it
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  
  return (
    <button 
      onClick={handleLogout}
      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
    >
      Logout
    </button>
  );
};

export default LogoutButton;
