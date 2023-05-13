import { NextRequest, NextResponse } from 'next/server';
import { decode } from 'next-auth/jwt';

import { rescueAsync } from '@/utils';
import * as response from '@/utils/http/response';

export async function middleware(request: NextRequest) {
  const cookiePrefix = process.env.NODE_ENV === 'production' ? '__Secure-' : '';

  const token = request.cookies.get(cookiePrefix + 'next-auth.session-token');

  if (!token) return response.unauthorized();

  const decodedToken = await rescueAsync(() => {
    return decode({
      token: token?.value ?? '',
      secret: process.env.NEXTAUTH_SECRET as string,
    });
  }, null);

  if (!decodedToken?.sub) return response.unauthorized();

  const headers = new Headers(request.headers);

  headers.set('X-User-Id', decodedToken.sub);

  return NextResponse.next({
    request: {
      headers,
    },
  });
}
