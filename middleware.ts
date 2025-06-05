import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const isAdminRoute = req.nextUrl.pathname.startsWith('/admin');
  const isAuthRoute = req.nextUrl.pathname.startsWith('/login') || 
                     req.nextUrl.pathname.startsWith('/register');

  // If trying to access admin routes
  if (isAdminRoute) {
    if (!token) {
      // Not logged in, redirect to login
      return NextResponse.redirect(new URL('/login', req.url));
    }
    if (token.accountType !== 'ADMIN') {
      // Not an admin, redirect to home
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  // If logged in and trying to access auth routes
  if (isAuthRoute && token) {
    // Redirect to appropriate page based on account type
    if (token.accountType === 'ADMIN') {
      return NextResponse.redirect(new URL('/admin/dashboard', req.url));
    }
    return NextResponse.redirect(new URL('/products', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/login', '/register']
}; 