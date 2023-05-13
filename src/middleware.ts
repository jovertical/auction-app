import { NextRequest } from 'next/server';
import authMiddleware from 'next-auth/middleware';

import { middleware as apiAuthMiddleware } from './middleware/api.auth.middleware';

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    return authMiddleware(request as any);
  }

  if (request.nextUrl.pathname.startsWith('/api/user')) {
    return apiAuthMiddleware(request);
  }
}
