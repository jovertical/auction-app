import { NextRequest } from 'next/server';

import { getUser } from '@/utils/auth';
import { db } from '@/utils/db';
import * as response from '@/utils/http/response';

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;

  const sort = params.get('sort') ?? 'closing-soon';

  const user = await getUser();

  const sortMap = {
    'closing-soon': {
      expiresAt: 'asc',
    },

    'highest-price-first': {
      item: {
        startingPrice: 'desc',
      },
    },

    'lowest-price-first': {
      item: {
        startingPrice: 'asc',
      },
    },
  };

  // prettier-ignore
  const sortOption = sortMap[sort as keyof typeof sortMap] ?? sortMap['closing-soon'];

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

    // @ts-ignore
    orderBy: sortOption,

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
