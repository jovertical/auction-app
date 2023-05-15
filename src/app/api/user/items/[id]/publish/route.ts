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
      sellerId: true,
      status: true,
      timeWindow: true,
    },
  });

  if (!item) return response.notFound();

  // Only the seller can publish the item.
  if (item.sellerId !== BigInt(userId ?? '')) return response.forbidden();

  // Only draft items can be published.
  if (item.status !== 'DRAFT') {
    return response.forbidden('Only items in draft status can be published.');
  }

  // Set the item's `status` to PUBLISHED
  // Set the `publishedAt` date to `now`.
  // Set the `expiresAt` date to `now + timeWindow`.
  const updatedItem = await db.item.update({
    where: { id: parseInt(params.id, 10) },

    data: {
      status: 'PUBLISHED',
      publishedAt: date().toDate(),
      expiresAt: date().add(item.timeWindow, 'hours').toDate(),
    },

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
    },
  });

  return response.json(updatedItem);
}
