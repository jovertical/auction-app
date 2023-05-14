import { NextRequest } from 'next/server';
import { decode } from 'next-auth/jwt';

import { rescueAsync } from '@/utils';
import { db } from '@/utils/db';
import { compareHash } from '@/utils/hashing';
import * as response from '@/utils/http/response';
import { validate } from '@/utils/validation';

export async function GET(request: NextRequest) {
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

  const user = await db.user.findUnique({
    where: {
      id: parseInt(decodedToken.sub),
    },

    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) return response.unauthorized();

  const transactionBreakdown = await db.transaction.groupBy({
    by: ['type'],

    where: {
      userId: user.id,
    },

    _sum: {
      amount: true,
    },
  });

  const balance = transactionBreakdown.reduce((carry, item) => {
    if (item.type === 'CREDIT') {
      return carry + (item._sum.amount ?? 0);
    }

    return carry - (item._sum.amount ?? 0);
  }, 0);

  return response.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      balance,
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
    return response.inputError(input.error.formErrors.fieldErrors);
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
    return response.unauthorized();
  }

  return response.json({ id: user.id });
}
