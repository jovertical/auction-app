import { NextRequest } from 'next/server';
import authMiddleware from 'next-auth/middleware';

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    return authMiddleware(request as any);
  }
}
