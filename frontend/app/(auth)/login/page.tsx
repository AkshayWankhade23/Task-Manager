'use client';

import Login from "@/components/login/Login";
import { useAuthRedirect } from '@/hooks/useAuthRedirect';

export default function LoginPage() {
  useAuthRedirect();
  
  return (
    <div className="max-w-md mx-auto mt-10">
      <Login />
    </div>
  );
}
