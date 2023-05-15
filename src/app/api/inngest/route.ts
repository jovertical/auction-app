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

    // Get all listing that are have expired
    const listingItems = await db.listingItem.findMany({
      where: {
        expiresAt: {
          gte: new Date(),
        },
      },

      select: {
        id: true,

        item: {
          select: {
            id: true,
            name: true,
            userId: true,
          },
        },

        expiresAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Create an event for each item
    const events = listingItems.map<EventPayload>((listingItem) => ({
      name: 'app/live.item.expired',
      data: {
        __date: date().toDate(),
        item: {
          id: listingItem.item.id,
          owner: listingItem.item.userId,
          name: listingItem.item.name,
          expiresAt: listingItem.expiresAt,
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

    // TODO

    await db.$disconnect();

    // Trigger the event
    channels.trigger('live', 'item:expired', event.data.item);
  }
);

const handler = serve(inngest, [prepareLiveItemExpired, liveItemExpired]);

export { handler as GET, handler as POST, handler as PUT };
