import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
import type { JWTPayload } from '@/lib/types/auth';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key'
);

// Public routes that don't require authentication
const PUBLIC_ROUTES = ['/login', '/api/auth/login', '/api/auth/refresh'];

// Role-based route restrictions
const ROUTE_PERMISSIONS: Record<string, string[]> = {
  '/inference': ['admin', 'analyst'],
  '/training': ['admin', 'ml_engineer'],
  '/dataset': ['admin', 'ml_engineer'],
  '/audit': ['admin', 'auditor'],
  '/settings/users': ['admin'],
};

// Default redirects based on role
const ROLE_REDIRECTS: Record<string, string> = {
  analyst: '/inference',
  admin: '/inference',
  ml_engineer: '/training',
  auditor: '/evaluations',
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  if (PUBLIC_ROUTES.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Check for auth token
  const token = request.cookies.get('accessToken')?.value;

  // If no token, redirect to login
  if (!token) {
    const url = new URL('/login', request.url);
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  try {
    // Verify JWT
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const jwtPayload = payload as unknown as JWTPayload;
    const userRole = jwtPayload.role;

    // Check role-based access for specific routes
    for (const [route, allowedRoles] of Object.entries(ROUTE_PERMISSIONS)) {
      if (pathname.startsWith(route) && !allowedRoles.includes(userRole)) {
        // Redirect to appropriate default page for their role
        const redirectPath = ROLE_REDIRECTS[userRole] || '/inference';
        return NextResponse.redirect(new URL(redirectPath, request.url));
      }
    }

    // Add user info to request headers for downstream use
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', jwtPayload.sub);
    requestHeaders.set('x-user-email', jwtPayload.email);
    requestHeaders.set('x-user-role', userRole);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    // Invalid token, redirect to login
    const url = new URL('/login', request.url);
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api/auth).*)',
  ],
};
