import { getUser } from '@/utils/auth';
import { db } from '@/utils/db';
import * as response from '@/utils/http/response';

export async function GET() {
  const user = await getUser();

  const items = await db.listingItem.findMany({
    where: {
      soldAt: null,

      expiresAt: {
        gt: new Date(),
      },

      item: {
        userId: {
          not: user?.id,
        },
      },
    },

    select: {
      id: true,
      itemId: true,
      expiresAt: true,
      createdAt: true,
      updatedAt: true,

      item: {
        select: {
          id: true,
          name: true,
          description: true,
          startingPrice: true,
          timeWindow: true,
          status: true,
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

  return response.json(items);
}
