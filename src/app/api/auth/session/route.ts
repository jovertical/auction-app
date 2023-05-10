import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

import { db } from '@/utils/db';
import { compareHash } from '@/utils/hashing';
import { validate } from '@/utils/validation';

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
    return NextResponse.json({
      error: 'Invalid credentials.',
    });
  }

  return NextResponse.json({ id: user.id.toString() });
}
