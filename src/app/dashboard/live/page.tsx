'use client';

import Pusher from 'pusher-js';
import { SessionContext } from 'next-auth/react';
import { useContext, useState, useMemo, useCallback, useEffect } from 'react';

import ButtonLink from '@/components/button-link';
import CountdownTimer from '@/components/countdown-timer';
import ListSortMenu from '@/components/dashboard/live/list-sort-menu';
import * as api from '@/utils/api';
import { date } from '@/utils/date';
import { currencyFormat } from '@/utils/number';

type ListingItem = {
  id: number;
  itemId: number;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;

  item: {
    id: number;
    name: string;
    description: string;
    startingPrice: number;
    timeWindow: number;
    status: string;
    publishedAt: string | null;
    createdAt: string;
    updatedAt: string;

    owner: {
      id: number;
      name: string;
    };
  };

  bids: {
    id: number;
    createdAt: string;

    bidder: {
      id: number;
      name: string;
    };

    transaction: {
      amount: number;
    };
  }[];
};

async function getItems(sort: string = 'closing-soon') {
  const items = await api.get<ListingItem[]>(`/live/items`, { sort });

  return items.error ? [] : items.data;
}

export default function Page({
  searchParams,
}: {
  searchParams: {
    sort: string;
  };
}) {
  const session = useContext(SessionContext);

  const [items, setItems] = useState<ListingItem[]>([]);
  const [itemsLoading, setItemsLoading] = useState(false);

  const user = useMemo(() => session?.data?.user, [session?.data]);

  const shallowUpdateItems = useCallback(
    (newItem: ListingItem) => {
      setItems((prevItems) => {
        return prevItems.map((item) => {
          return item.id === newItem.id ? newItem : item;
        });
      });
    },
    [setItems]
  );

  const loadItems = useCallback(
    async (sort?: string) => {
      if (itemsLoading) return;

      setItemsLoading(true);

      const items = await getItems(sort);

      setItems(items);
      setItemsLoading(false);
    },
    [itemsLoading]
  );

  useEffect(() => {
    loadItems();

    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY ?? '', {
      cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER ?? '',
    });

    const liveChannel = pusher.subscribe('live');

    liveChannel.bind('item:bid-posted', (updatedItem: any) => {
      if (updatedItem) {
        shallowUpdateItems(updatedItem.item);
      }
    });

    liveChannel.bind('item:expired', (data: any) => {
      if (data) {
        setItems((prevListingItems) => {
          return prevListingItems.filter(
            (listingItem) => listingItem.id !== data.id
          );
        });
      }
    });

    return () => {
      liveChannel.disconnect();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadItems(searchParams.sort);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.sort]);

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
        {itemsLoading ? (
          <>
            <li className="py-5">
              <div className="flex items-center justify-center">
                <p className="ml-3 text-sm font-medium text-white">
                  Loading items...
                </p>
              </div>
            </li>
          </>
        ) : items.length > 0 ? (
          <>
            {items.map((listingItem) => (
              <li key={listingItem.id.toString()}>
                <div className="flex items-center justify-between gap-x-6 py-5">
                  <div className="min-w-0 w-full sm:w-1/3">
                    <div className="flex items-start gap-x-3">
                      <h2 className="min-w-0 text-sm font-semibold leading-6 text-white">
                        <a href="#" className="flex gap-x-2">
                          <span className="truncate">
                            {listingItem.item.name}
                          </span>
                        </a>
                      </h2>
                    </div>

                    <div className="mt-1 flex items-center gap-x-2 text-xs leading-5 text-gray-500">
                      {listingItem.item.publishedAt && (
                        <>
                          <p className="whitespace-nowrap">
                            Posted{' '}
                            <time
                              className="italic"
                              dateTime={listingItem.item.publishedAt?.toString()}
                            >
                              {date(listingItem.item.publishedAt).fromNow()}
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
                        <strong className="text-white">
                          {listingItem.item.owner.name}
                        </strong>
                      </p>
                    </div>
                  </div>

                  <div className="w-full sm:w-1/3">
                    <div className="flex items-start gap-x-3">
                      <h2 className="min-w-0 text-sm font-semibold leading-6 text-white">
                        <span className="flex gap-x-2">
                          <span className="whitespace-nowrap">
                            {currencyFormat(
                              listingItem.bids.length === 0
                                ? listingItem.item.startingPrice
                                : listingItem.bids[0].transaction.amount
                            )}
                          </span>

                          {listingItem.expiresAt && (
                            <>
                              <span className="text-gray-400">/</span>

                              <span className="whitespace-nowrap">
                                <CountdownTimer
                                  date={date(listingItem.expiresAt).toDate()}
                                />
                              </span>
                            </>
                          )}
                        </span>
                      </h2>
                    </div>

                    <div className="mt-1">
                      {listingItem.bids.length === 0 ? (
                        <p className="truncate text-sm leading-5 text-gray-500">
                          No bids yet
                        </p>
                      ) : (
                        <div className="flex items-center gap-x-2 text-xs leading-5 text-gray-500">
                          <p className="whitespace-nowrap">
                            Highest bid by{' '}
                            <strong className="text-white">
                              {listingItem.bids[0].bidder.id === user?.id ?? 0
                                ? 'You'
                                : listingItem.bids[0].bidder.name}
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
                              {listingItem.bids.length}
                            </strong>{' '}
                            bid/s so far
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-none items-center gap-x-4">
                    <ButtonLink href={`/dashboard/live/${listingItem.id}/bid`}>
                      Place Bid{' '}
                      <span className="sr-only">, {listingItem.item.name}</span>
                    </ButtonLink>
                  </div>
                </div>
              </li>
            ))}
          </>
        ) : (
          <>
            <li className="py-5">
              <div className="flex items-center justify-center">
                <p className="ml-3 text-sm font-medium text-white">
                  No items found
                </p>
              </div>
            </li>
          </>
        )}
      </ul>
    </>
  );
}
