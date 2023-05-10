import { NextRequest, NextResponse } from 'next/server';
import { decode } from 'next-auth/jwt';

import { db } from '@/utils/db';
import { compareHash } from '@/utils/hashing';
import * as http from '@/utils/http';
import { validate } from '@/utils/validation';
import { rescue } from '@/utils';

export async function GET(request: NextRequest) {
  const token = request.cookies.get('next-auth.session-token');

  if (!token) return http.unauthorized();

  const decodedToken = await rescue(() => {
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

  return http.data({
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

  const user = await db.user.findUnique({
    where: { email: input.email },
    select: {
      id: true,
      name: true,
      email: true,
      password: true,
    },
  });

  if (!user || !compareHash(user?.password ?? '', input.password)) {
    return NextResponse.json(
      { error: 'Invalid credentials.' },
      { status: 401 }
    );
  }

  return http.data({
    id: parseInt(user.id.toString()), // Prisma fails to serialize `BigInt` types
  });
}
