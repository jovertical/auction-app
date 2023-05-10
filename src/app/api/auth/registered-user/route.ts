import { NextRequest, NextResponse } from 'next/server';

import { db } from '@/utils/db';
import { createHash } from '@/utils/hashing';
import { validate } from '@/utils/validation';

export async function POST(request: NextRequest) {
  const data = await request.json();

  const input = validate(data, (validator) => ({
    name: validator.string().max(255),
    email: validator.string().email(),
    password: validator.string().min(8),
    password_confirmation: validator.string(),
  }));

  const user = await db.user.create({
    data: {
      name: input.name,
      email: input.email,
      password: createHash(input.password),
    },
  });

  return NextResponse.json({ id: user.id.toString() });
}
