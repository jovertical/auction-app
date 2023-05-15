import { Inngest } from 'inngest';
import type { EventPayload } from 'inngest';
import { serve } from 'inngest/next';

import { sleep } from '@/utils';
import { date } from '@/utils/date';
import { db } from '@/utils/db';
import { channels } from '@/utils/pusher';

const inngest = new Inngest({
  name: 'Jitera Auctions',
  eventKey: process.env.INNGEST_EVENT_KEY,
});

const prepareLiveItemExpired = inngest.createFunction(
  { name: 'Prepare live item expired' },
  { cron: '*/1 * * * *' },
  async ({ step }) => {
    await db.$connect();

    // Get all items that are `PUBLISHED` and have expired
    const items = await db.item.findMany({
      where: {
        status: 'PUBLISHED',
        expiresAt: {
          gte: new Date(),
        },
      },

      select: {
        id: true,
        sellerId: true,
        name: true,
        expiresAt: true,
      },
    });

    // Create an event for each item
    const events = items.map<EventPayload>((item) => ({
      name: 'app/live.item.expired',
      data: {
        __date: date().toDate(),
        item: {
          id: item.id,
          sellerId: item.sellerId,
          name: item.name,
          expiresAt: item.expiresAt,
        },
      },
    }));

    await db.$disconnect();

    await step.sendEvent(events);
  }
);

const liveItemExpired = inngest.createFunction(
  { name: 'Live item expired' },
  { event: 'app/live.item.expired' },
  async ({ event }) => {
    // Since the `item.expiresAt` might not be accurate
    // We'll add an artificial delay by negating the event.data.__date
    // This will ensure that the event is processed after the item has expired
    // This is a hacky solution, but it works for now
    const delay = -date(event.data.__date).diff(
      date(event.data.item.expiresAt),
      'seconds'
    );

    await sleep(delay * 1000);

    await db.$connect();

    db.$transaction(async () => {
      const highestBid = await db.bid.findFirst({
        where: {
          itemId: event.data.item.id,
        },

        orderBy: {
          transaction: {
            amount: 'desc',
          },
        },

        select: {
          id: true,

          bidder: {
            select: {
              id: true,
            },
          },

          transaction: {
            select: {
              id: true,
              amount: true,
            },
          },
        },
      });

      if (!highestBid) {
        return;
      }
    });

    await db.$disconnect();

    // Trigger the event
    channels.trigger('live', 'item:expired', event.data.item);
  }
);

const handler = serve(inngest, [prepareLiveItemExpired, liveItemExpired]);

export { handler as GET, handler as POST, handler as PUT };
