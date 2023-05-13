import { NextRequest } from 'next/server';

import { date } from '@/utils/date';
import { db } from '@/utils/db';
import * as response from '@/utils/http/response';
import { currencyFormat } from '@/utils/number';
import { validate } from '@/utils/validation';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = request.headers.get('X-User-Id');

  const data = await request.json();

  const input = validate(data, (validator) => ({
    bid: validator.preprocess(
      (bid) => parseInt(bid as string, 10),
      validator
        .number({ invalid_type_error: 'Please enter a your bid' })
        .positive('Bids must be at least 1')
    ),
  }));

  if (!input.success) {
    return response.inputError(input.error.formErrors.fieldErrors);
  }

  const item = await db.item.findUnique({
    where: { id: parseInt(params.id, 10) },
    select: {
      id: true,
      sellerId: true,
      status: true,
      startingPrice: true,
      expiresAt: true,
      bids: {
        select: {
          amount: true,
        },
      },
    },
  });

  if (!item) return response.notFound();

  // The seller cannot bid on the item they are selling.
  if (item.sellerId === BigInt(userId ?? '')) {
    return response.forbidden('You cannot bid on your own listing.');
  }

  // Only published items can be bid on.
  if (item.status !== 'published') {
    return response.forbidden(
      'This item is not published yet. Please try again later.'
    );
  }

  // Only items that have not expired can be bid on.
  if (item.expiresAt && item.expiresAt < date().toDate()) {
    return response.forbidden('This item has expired.');
  }

  // If the item has no bids, the starting price is the minimum bid.
  // Otherwise, the minimum bid is the highest bid + 100 cents.
  // prettier-ignore
  const minimumPrice = item.bids.length === 0
      ? item.startingPrice
      : item.bids.reduce((highest, bid) => Math.max(highest, bid.amount), 0) + 100;

  if (minimumPrice > input.data.bid * 100) {
    return response.inputError({
      bid: [`You must bid at least ${currencyFormat(minimumPrice)}`],
    });
  }

  const bid = await db.bid.create({
    data: {
      itemId: parseInt(params.id, 10),
      bidderId: BigInt(userId ?? ''),
      amount: input.data.bid * 100,
    },
  });

  return response.json(bid);
}
