import { NextRequest } from 'next/server';

import { db } from '@/utils/db';
import * as response from '@/utils/http/response';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = request.headers.get('X-User-Id');

  const item = await db.item.findUnique({
    where: { id: parseInt(params.id, 10) },
    select: {
      id: true,
      sellerId: true,
      name: true,
      description: true,
      startingPrice: true,
      timeWindow: true,
      publishedAt: true,
      expiresAt: true,
      createdAt: true,
      updatedAt: true,

      seller: {
        select: {
          name: true,
        },
      },

      bids: {
        orderBy: {
          amount: 'desc',
        },

        select: {
          amount: true,
          createdAt: true,
          bidder: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });

  if (!item) return response.notFound();

  // The seller cannot view the item he's selling.
  if (item.sellerId === BigInt(userId ?? '')) return response.forbidden();

  return response.json(item);
}
