import { getUser } from '@/utils/auth';
import { db } from '@/utils/db';
import * as response from '@/utils/http/response';

export async function GET() {
  const user = await getUser();

  const items = await db.item.findMany({
    where: {
      status: 'published',

      expiresAt: {
        gt: new Date(),
      },

      sellerId: {
        not: user?.id,
      },
    },

    include: {
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

  return response.json(items);
}
