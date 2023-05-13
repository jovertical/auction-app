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
    name: validator
      .string({ required_error: 'Please enter a name' })
      .min(1, 'Please enter a name')
      .max(255, 'Name can be no longer than 255 characters'),

    description: validator
      .string()
      .max(510, 'Description can be no longer than 510 characters'),

    startingPrice: validator.preprocess(
      (startingPrice) => parseInt(startingPrice as string, 10),
      validator
        .number({ invalid_type_error: 'Please enter a starting price' })
        .positive('Starting price must be at least 1')
    ),

    timeWindow: validator.preprocess(
      (timeWindow) => parseInt(timeWindow as string, 10),
      validator
        .number({ invalid_type_error: 'Please enter a valid time window' })
        .positive('Time window must be at least 1')
    ),
  }));

  if (!input.success) {
    return response.json(
      {
        message: 'Invalid data provided.',
        errors: input.error.formErrors.fieldErrors,
      },
      { status: 422 }
    );
  }

  const item = await db.item.create({
    data: {
      sellerId: user.id,
      name: input.data.name,
      description: input.data.description,
      startingPrice: input.data.startingPrice * 100,
      timeWindow: input.data.timeWindow,
    },
  });

  return response.json(item, { status: 201 });
}
