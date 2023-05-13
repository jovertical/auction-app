import { NextRequest } from 'next/server';

import { db } from '@/utils/db';
import { createHash } from '@/utils/hashing';
import * as http from '@/utils/http';
import { validate } from '@/utils/validation';

export async function POST(request: NextRequest) {
  const data = await request.json();

  const input = validate(data, (validator) => ({
    name: validator.string().min(1, 'Name is required').max(255),

    email: validator
      .string()
      .min(1, 'Email address is required')
      .email('Email address is invalid'),

    password: validator
      .string()
      .min(8, 'Password must be at least 8 characters'),

    password_confirmation: validator
      .string()
      .min(1, 'Password must be confirmed')
      .refine((value) => value === data.password, 'Passwords do not match'),
  }));

  if (!input.success) {
    return http.json(
      {
        message: 'Invalid data provided.',
        errors: input.error.formErrors.fieldErrors,
      },
      { status: 422 }
    );
  }

  // prettier-ignore
  const emailExists = (await db.user.count({
    where: {
      email: input.data.email,
    },
  })) > 0;

  if (emailExists) {
    return http.json(
      {
        message: 'Unable to create user.',
        errors: {
          email: ['Email is already taken.'],
        },
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

  return http.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      created_at: user.createdAt,
      updated_at: user.updatedAt,
    },
  });
}
