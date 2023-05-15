import { getUser } from '@/utils/auth';
import { db } from '@/utils/db';
import * as response from '@/utils/http/response';

export async function GET() {
  const activities = await db.activity.findMany({
    orderBy: {
      createdAt: 'desc',
    },

    select: {
      id: true,
      userId: true,
      type: true,
      content: true,
      createdAt: true,

      user: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return response.json(activities);
}
