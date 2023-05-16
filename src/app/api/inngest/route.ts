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
            userId: true,
            name: true,
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
        listingItem: {
          id: listingItem.id.toString(),
          item: {
            id: listingItem.item.id.toString(),
            userId: listingItem.item.userId.toString(),
            name: listingItem.item.name,
          },
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
      date(event.data.listingItem.expiresAt),
      'seconds'
    );

    await sleep(delay * 1000);

    await db.$connect();

    await db.$transaction(async (tx) => {
      const highestBid = await tx.bid.findFirst({
        where: {
          listingItemId: event.data.listingItem.id,
        },

        orderBy: {
          transaction: {
            amount: 'desc',
          },
        },

        select: {
          id: true,
          bidderId: true,

          transaction: {
            select: {
              id: true,
              amount: true,
            },
          },
        },
      });

      // If there's no bid, then we don't need to do anything
      if (!highestBid) {
        return;
      }

      // Mark the item as `SOLD`
      await tx.item.update({
        where: {
          id: event.data.listingItem.item.id,
        },

        data: {
          status: 'SOLD',
        },
      });

      // Assign the bidder as the winner
      await tx.listingItem.update({
        where: {
          id: event.data.listingItem.id,
        },

        data: {
          soldAt: new Date(),
          soldTo: highestBid.bidderId,
        },
      });

      // Credit the seller
      await tx.transaction.create({
        data: {
          userId: event.data.listingItem.item.userId,
          amount: highestBid.transaction.amount,
          type: 'CREDIT',
          description: `Sold ${event.data.listingItem.item.name}`,
        },
      });

      // Credit the bidders who lost...
      const losingBids = await tx.bid.findMany({
        where: {
          listingItemId: event.data.listingItem.id,
          bidderId: {
            not: highestBid.bidderId,
          },
        },

        select: {
          bidder: {
            select: {
              id: true,
            },
          },

          transaction: {
            select: {
              amount: true,
            },
          },
        },
      });

      if (losingBids.length > 0) {
        await Promise.all(
          losingBids.map(async (bid) => {
            await tx.transaction.create({
              data: {
                userId: bid.bidder.id,
                amount: bid.transaction.amount,
                type: 'CREDIT',
                description: `Lost ${event.data.listingItem.item.name}`,
              },
            });
          })
        );
      }
    });

    await db.$disconnect();

    // Trigger the event
    channels.trigger('live', 'item:expired', event.data.listingItem);
  }
);

const handler = serve(inngest, [prepareLiveItemExpired, liveItemExpired]);

export { handler as GET, handler as POST, handler as PUT };
