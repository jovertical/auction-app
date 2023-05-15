import { NextRequest } from 'next/server';

import { UserService } from '@/services/user.service';
import { getUser } from '@/utils/auth';
import { date } from '@/utils/date';
import { db } from '@/utils/db';
import { channels } from '@/utils/pusher';
import * as response from '@/utils/http/response';
import { currencyFormat } from '@/utils/number';
import { validate } from '@/utils/validation';

const findItem = async (id: number) => {
  const item = await db.item.findUnique({
    where: { id },
    select: {
      id: true,
      sellerId: true,
      name: true,
      description: true,
      status: true,
      startingPrice: true,
      publishedAt: true,
      expiresAt: true,

      seller: {
        select: {
          name: true,
        },
      },

      bids: {
        orderBy: {
          transaction: {
            amount: 'desc',
          },
        },

        select: {
          id: true,
          createdAt: true,

          bidder: {
            select: {
              id: true,
              name: true,
            },
          },

          transaction: {
            select: {
              amount: true,
            },
          },
        },
      },
    },
  });

  return item;
};

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getUser();

  if (!user) return response.unauthorized();

  const userService = new UserService({ ...user, id: BigInt(user.id) });

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

  const itemId = parseInt(params.id, 10);

  const item = await findItem(itemId);

  if (!item) return response.notFound();

  // The seller cannot bid on the item they are selling.
  if (item.sellerId === BigInt(user.id)) {
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
      : item.bids.reduce((highest, bid) => Math.max(highest, bid.transaction.amount), 0) + 100;

  // The bid must be at least the minimum price/bid.
  if (minimumPrice > input.data.bid * 100) {
    return response.inputError({
      bid: [`You must bid at least ${currencyFormat(minimumPrice)}`],
    });
  }

  // Ensure that the user has enough balance to make the bid.
  if (user.balance < input.data.bid * 100) {
    return response.inputError({
      bid: ['You do not have enough balance to make this bid.'],
    });
  }

  const bid = await db.$transaction(async (tx) => {
    const balance = await userService.getBalance();

    // Before we create the `DEBIT` transaction, we need to ensure that the
    // user has enough balance to make the bid.
    if (balance < input.data.bid * 100) {
      throw new Error('Insufficient balance');
    }

    // Sum the total amount of bids that the user has made on this item.
    // Then create a `CREDIT` transaction to refund the user's previous bids.
    const previousBids = await tx.bid.findMany({
      where: {
        bidderId: user.id,
        itemId: item.id,
      },

      select: {
        transaction: {
          select: {
            amount: true,
          },
        },
      },
    });

    // Sum the total amount of the user's previous bids.
    const previousBidTotal = previousBids.reduce(
      (total, bid) => total + bid.transaction.amount,
      0
    );

    // It's possible that the user has not made any bids on this item yet.
    // In that case, we don't need to create a `CREDIT` transaction.
    if (previousBidTotal > 0) {
      await tx.transaction.create({
        data: {
          userId: user.id,
          amount: previousBidTotal,
          type: 'CREDIT',
        },
      });
    }

    // Now that we know the user has enough balance, we can create the `DEBIT`
    // transaction to deduct the bid amount from the user's balance.
    const transaction = await tx.transaction.create({
      data: {
        userId: user.id,
        amount: input.data.bid * 100,
        type: 'DEBIT',
      },
    });

    // Finally, we can create the bid.
    const bid = await tx.bid.create({
      data: {
        itemId: parseInt(params.id, 10),
        bidderId: user.id,
        transactionId: transaction.id,
      },

      include: {
        bidder: true,
        transaction: true,
      },
    });

    return bid;
  });

  const updatedItem = await findItem(itemId);

  // Trigger a `bid-posted` event on the `live` channel.
  channels.trigger('live', 'item:bid-posted', {
    bid,
    item: updatedItem,
  });

  return response.json(bid);
}
