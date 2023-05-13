import { NextRequest } from 'next/server';

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
    },
  });

  if (!item) return response.notFound();

  // Only the seller can publish the item.
  if (item.sellerId !== BigInt(userId ?? '')) return response.forbidden();

  // Only draft items can be published.
  if (item.status !== 'draft') {
    return response.forbidden('Only items in draft status can be published.');
  }

  // Set the item's `status` to published and set the `publishedAt` date to `now`.
  const updatedItem = await db.item.update({
    where: { id: parseInt(params.id, 10) },
    data: { status: 'published', publishedAt: new Date() },
    select: {
      id: true,
      sellerId: true,
      name: true,
      description: true,
      startingPrice: true,
      timeWindow: true,
      publishedAt: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return response.json(updatedItem);
}
