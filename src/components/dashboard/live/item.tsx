import type { User, Item as ItemModel } from '@prisma/client';

import ButtonLink from '@/components/button-link';
import CountdownTimer from '@/components/countdown-timer';
import { date } from '@/utils/date';

export default function Item({
  item,
}: {
  item: ItemModel & { seller: Pick<User, 'name'> };
}) {
  return (
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

              <svg viewBox="0 0 2 2" className="h-0.5 w-0.5 fill-current">
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
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                }).format(item.startingPrice / 100)}
              </span>

              <span className="text-gray-400">/</span>

              {/* prettier-ignore */}
              <span className="whitespace-nowrap">
                <CountdownTimer
                  date={
                    date(item.publishedAt)
                      .add(item.timeWindow, 'hours')
                      .toDate()
                    } 
                />
              </span>
            </span>
          </h2>
        </div>

        <div className="mt-1 flex items-center gap-x-2 text-xs leading-5 text-gray-500">
          <p className="truncate">No bids yet</p>
        </div>
      </div>

      <div className="flex flex-none items-center gap-x-4">
        <ButtonLink href={`/dashboard/live/${item.id}/bid`}>
          Place Bid <span className="sr-only">, {item.name}</span>
        </ButtonLink>
      </div>
    </div>
  );
}
