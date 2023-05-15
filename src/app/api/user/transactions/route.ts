import { NextRequest } from 'next/server';

import { getUser } from '@/utils/auth';
import { db } from '@/utils/db';
import * as response from '@/utils/http/response';
import { validate } from '@/utils/validation';

export async function POST(request: NextRequest) {
  const user = await getUser();

  if (!user) return response.unauthorized();

  const data = await request.json();

  const input = validate(data, (validator) => ({
    amount: validator.preprocess(
      (amount) => parseInt(amount as string, 10),
      validator
        .number({ invalid_type_error: 'Please enter the amount' })
        .positive('Amount must be at least 1')
    ),
  }));

  if (!input.success) {
    return response.inputError(input.error.formErrors.fieldErrors);
  }

  const transaction = await db.transaction.create({
    data: {
      userId: user.id,
      amount: input.data.amount * 100,
      type: 'CREDIT',
      description: 'Deposit',
    },
  });

  return response.json(transaction, { status: 201 });
}
