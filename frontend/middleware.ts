// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('refreshToken')?.value;
  const nextAuthToken = await getToken({ 
    req: request, 
    secret: process.env.NEXTAUTH_SECRET 
  });
  
  // Get the pathname from the URL
  const path = request.nextUrl.pathname;

  // Check if user is authenticated (either via refreshToken cookie or NextAuth session)
  const isAuthenticated = token || nextAuthToken;

  // Redirect unauthenticated users trying to access protected pages
  if (!isAuthenticated && (
    path.startsWith('/admin/') || 
    path.startsWith('/user/') ||
    path.startsWith('/dashboard') || 
    path.startsWith('/profile') || 
    path.startsWith('/settings')
  )) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

// 🔒 Apply to protected routes only
export const config = {
  matcher: [
    '/admin/:path*', 
    '/user/:path*', 
    '/dashboard/:path*', 
    '/profile/:path*', 
    '/settings/:path*'
  ],
};
