import { NextRequest } from 'next/server';

import { date } from '@/utils/date';
import { db } from '@/utils/db';
import * as response from '@/utils/http/response';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = request.headers.get('X-User-Id');

  const item = await db.item.findUnique({
    where: { id: parseInt(params.id, 10) },
    select: {
      id: true,
      userId: true,
      status: true,
      timeWindow: true,
    },
  });

  if (!item) return response.notFound();

  // Only the owner can publish the item.
  if (item.userId !== BigInt(userId ?? '')) return response.forbidden();

  // Only draft items can be published.
  if (item.status !== 'DRAFT') {
    return response.forbidden('Only items in draft status can be published.');
  }

  // Set the item's `status` to PUBLISHED
  // Set the `publishedAt` date to `now`.
  // Set the `expiresAt` date to `now + timeWindow`.
  const updatedItem = await db.$transaction(async (tx) => {
    const updatedItem = await db.item.update({
      where: { id: parseInt(params.id, 10) },

      data: {
        status: 'PUBLISHED',
        publishedAt: date().toDate(),
      },

      select: {
        id: true,
        userId: true,
        name: true,
        description: true,
        startingPrice: true,
        timeWindow: true,
        publishedAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Create a new listing item.
    await db.listingItem.create({
      data: {
        item: {
          connect: {
            id: updatedItem.id,
          },
        },

        expiresAt: date().add(item.timeWindow, 'hours').toDate(),
      },

      select: {
        id: true,
      },
    });

    return updatedItem;
  });

  return response.json(updatedItem);
}
