import ButtonLink from '@/components/button-link';
import CountdownTimer from '@/components/countdown-timer';
import ListSortMenu from '@/components/dashboard/live/list-sort-menu';
import { getUser } from '@/utils/auth';
import { date } from '@/utils/date';
import { db } from '@/utils/db';
import { currencyFormat } from '@/utils/number';

async function getItems() {
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

  return items;
}

export default async function Page() {
  const user = await getUser();

  const items = await getItems();

  return (
    <>
      <header className="flex items-center justify-between border-b border-white/5 px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
        <h1 className="text-base font-semibold leading-7 text-white">
          Live Auction
        </h1>

        <ListSortMenu />
      </header>

      <ul
        role="list"
        className="divide-y divide-white/5 px-4 py-4 sm:px-6 lg:px-8"
      >
        {items.map((item) => (
          <li key={item.id.toString()}>
            <div className="flex items-center justify-between gap-x-6 py-5">
              <div className="min-w-0 w-full sm:w-1/3">
                <div className="flex items-start gap-x-3">
                  <h2 className="min-w-0 text-sm font-semibold leading-6 text-white">
                    <a href="#" className="flex gap-x-2">
                      <span className="truncate">{item.name}</span>
                    </a>
                  </h2>
                </div>

                <div className="mt-1 flex items-center gap-x-2 text-xs leading-5 text-gray-500">
                  {item.publishedAt && (
                    <>
                      <p className="whitespace-nowrap">
                        Posted{' '}
                        <time
                          className="italic"
                          dateTime={item.publishedAt?.toString()}
                        >
                          {date(item.publishedAt).fromNow()}
                        </time>
                      </p>

                      <svg
                        viewBox="0 0 2 2"
                        className="h-0.5 w-0.5 fill-current"
                      >
                        <circle cx={1} cy={1} r={1} />
                      </svg>
                    </>
                  )}

                  <p className="truncate">
                    Being sold by{' '}
                    <strong className="text-white">{item.seller.name}</strong>
                  </p>
                </div>
              </div>

              <div className="w-full sm:w-1/3">
                <div className="flex items-start gap-x-3">
                  <h2 className="min-w-0 text-sm font-semibold leading-6 text-white">
                    <span className="flex gap-x-2">
                      <span className="whitespace-nowrap">
                        {currencyFormat(
                          item.bids.length === 0
                            ? item.startingPrice
                            : item.bids[0].amount
                        )}
                      </span>

                      {item.expiresAt && (
                        <>
                          <span className="text-gray-400">/</span>

                          <span className="whitespace-nowrap">
                            <CountdownTimer date={item.expiresAt} />
                          </span>
                        </>
                      )}
                    </span>
                  </h2>
                </div>

                <div className="mt-1">
                  {item.bids.length === 0 ? (
                    <p className="truncate text-sm leading-5 text-gray-500">
                      No bids yet
                    </p>
                  ) : (
                    <div className="flex items-center gap-x-2 text-xs leading-5 text-gray-500">
                      <p className="whitespace-nowrap">
                        Highest bid by{' '}
                        <strong className="text-white">
                          {item.bids[0].bidder.id === BigInt(user?.id ?? 0)
                            ? 'You'
                            : item.bids[0].bidder.name}
                        </strong>{' '}
                      </p>

                      <svg
                        viewBox="0 0 2 2"
                        className="h-0.5 w-0.5 fill-current"
                      >
                        <circle cx={1} cy={1} r={1} />
                      </svg>

                      <p className="whitespace-nowrap">
                        There are{' '}
                        <strong className="text-white">
                          {item.bids.length}
                        </strong>{' '}
                        bid/s so far
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-none items-center gap-x-4">
                <ButtonLink href={`/dashboard/live/${item.id}/bid`}>
                  Place Bid <span className="sr-only">, {item.name}</span>
                </ButtonLink>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
