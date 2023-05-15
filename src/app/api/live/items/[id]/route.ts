import { NextRequest } from 'next/server';

import { db } from '@/utils/db';
import * as response from '@/utils/http/response';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = request.headers.get('X-User-Id');

  const listingItem = await db.listingItem.findUnique({
    where: {
      id: parseInt(params.id, 10),
    },

    select: {
      id: true,

      item: {
        select: {
          name: true,
          description: true,
          startingPrice: true,
          timeWindow: true,
          publishedAt: true,
          createdAt: true,
          updatedAt: true,

          owner: {
            select: {
              id: true,
              name: true,
            },
          },
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

  if (!listingItem) return response.notFound();

  // The seller cannot view the item he's selling.
  if (listingItem.item.owner.id === BigInt(userId ?? '')) {
    return response.forbidden();
  }

  return response.json(listingItem);
}
