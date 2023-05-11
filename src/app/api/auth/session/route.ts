import { NextRequest, NextResponse } from 'next/server';
import { decode } from 'next-auth/jwt';

import { rescueAsync } from '@/utils';
import { db } from '@/utils/db';
import { compareHash } from '@/utils/hashing';
import * as http from '@/utils/http';
import { validate } from '@/utils/validation';

export async function GET(request: NextRequest) {
  const cookiePrefix = process.env.NODE_ENV === 'production' ? '__Secure-' : '';

  const token = request.cookies.get(cookiePrefix + 'next-auth.session-token');

  if (!token) return http.unauthorized();

  const decodedToken = await rescueAsync(() => {
    return decode({
      token: token?.value ?? '',
      secret: process.env.NEXTAUTH_SECRET as string,
    });
  }, null);

  if (!decodedToken?.sub) return http.unauthorized();

  const user = await db.user.findUnique({
    where: { id: parseInt(decodedToken.sub) },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) return http.unauthorized();

  return NextResponse.json({
    user: {
      id: parseInt(user.id.toString()), // Prisma fails to serialize `BigInt` types
      name: user.name,
      email: user.email,
      created_at: user.createdAt,
      updated_at: user.updatedAt,
    },
  });
}

export async function POST(request: NextRequest) {
  const data = await request.json();

  const input = validate(data, (validator) => ({
    email: validator.string().email(),
    password: validator.string(),
  }));

  if (!input.success) {
    return NextResponse.json(
      {
        message: 'Invalid data provided.',
        errors: input.error.formErrors.fieldErrors,
      },
      { status: 422 }
    );
  }

  const user = await db.user.findUnique({
    where: { email: input.data.email },
    select: {
      id: true,
      name: true,
      email: true,
      password: true,
    },
  });

  if (!user || !compareHash(user?.password ?? '', input.data.password)) {
    return http.unauthorized();
  }

  return NextResponse.json({
    id: parseInt(user.id.toString()), // Prisma fails to serialize `BigInt` types
  });
}
