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

  if (!item) return response.notFound();

  // Only the seller can view the item.
  if (item.userId !== BigInt(userId ?? '')) return response.forbidden();

  return response.json(item);
}
