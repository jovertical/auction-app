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

  if (!input.success) {
    return NextResponse.json(
      {
        message: 'Invalid data provided.',
        errors: input.error.formErrors.fieldErrors,
      },
      { status: 422 }
    );
  }

  const user = await db.user.create({
    data: {
      name: input.data.name,
      email: input.data.email,
      password: createHash(input.data.password),
    },
  });

  return NextResponse.json({ id: user.id.toString() });
}
