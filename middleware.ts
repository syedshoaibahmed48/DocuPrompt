import { NextRequest, NextResponse } from 'next/server'
import { getUserDetailsfromJWT } from '@/lib/JwtUtils';


const isAdminPath = (path: string) => path.startsWith('/api/admin') || path === "/admin-dashboard";
const isProtectedPath = (path: string) => ["/api/signout", "/api/chat", "/api/me"].includes(path) || path.startsWith('/files') || path.startsWith("/api/file");
const isAPIPath = (path: string) => path.startsWith('/api');
const isCronJobPath = (path: string) => path === '/api/cron';
const requiresAuth = (path: string) => isProtectedPath(path) || isAdminPath(path) || isCronJobPath(path);

export const config = {
  matcher: [
    '/', '/unauthorized', '/request-access', '/signin', '/files', '/files/:fileId/chat', '/admin-dashboard', '/api/demo-login', '/api/request-access', '/api/signin', '/api/signout', '/api/chat', '/api/me', '/api/file', '/api/file/:fileId*', '/api/admin/all-data', '/api/admin/access-request', '/api/admin/access-request/:email*', '/api/cron'
  ]
}

function handleUnauthorizedResponse(request: NextRequest, path: string) {
  if (isAPIPath(path)) return NextResponse.json({ errorCode: 'Unauthorized' }, { status: 401 });
  return NextResponse.redirect(new URL('/unauthorized', request.url));
}

function handleForbiddenResponse(request: NextRequest, path: string) {
  if (isAPIPath(path)) return NextResponse.json({ errorCode: 'Unauthorized' }, { status: 403 });
  return NextResponse.redirect(new URL('/unauthorized', request.url));
}

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const token = request.cookies.get('AuthToken')?.value;

  if (requiresAuth(path)) {
    if (!token){// if is cronjob path then check authentication header, else send 401
      if (isCronJobPath(path) && request.headers.get('authorization') === `Bearer ${process.env.CRON_SECRET}`)  return NextResponse.next();
      else  return handleUnauthorizedResponse(request, path);
    }

    const { userId, userType } = getUserDetailsfromJWT(token!);

    if (isAdminPath(path) && userType !== 'admin') return handleForbiddenResponse(request, path);

    if (isAPIPath(path)) {
      if (path === '/api/signout' && userType === 'demo') return handleForbiddenResponse(request, path);

      const updatedRequest = request.clone();
      updatedRequest.headers.set('user-id', userId);
      updatedRequest.headers.set('user-type', userType);
      return NextResponse.next(updatedRequest);
    }
  } else {
    if (token && (path === '/' || (getUserDetailsfromJWT(token).userType !== 'demo' && (path === '/signin' || path === '/request-access')))) {
      return NextResponse.redirect(new URL('/files', request.url));
    }
  }
}