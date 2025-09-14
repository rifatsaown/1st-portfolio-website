import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    // Additional middleware logic can go here
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        // Protect admin routes
        if (req.nextUrl.pathname.startsWith('/dashboard')) {
          return token?.role === 'admin';
        }
        // Other protected routes require authentication
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ['/dashboard/:path*', '/api/admin/:path*'],
};