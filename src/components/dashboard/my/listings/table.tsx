import startCase from 'lodash.startcase';

import { cx } from '@/utils';
import { Item } from '@prisma/client';
import { date } from '@/utils/date';

const statuses = {
  published: 'text-green-400 bg-green-400/10',
  draft: 'text-yellow-400 bg-yellow-400/10',
};

interface Props {
  items: Item[];
}

export default function ListingsTable({ items }: Props) {
  return (
    <table className="mt-6 w-full whitespace-nowrap text-left">
      <colgroup>
        <col className="w-full sm:w-4/12" />
        <col className="lg:w-4/12" />
        <col className="lg:w-2/12" />
        <col className="lg:w-1/12" />
        <col className="lg:w-1/12" />
      </colgroup>

      <thead className="border-b border-white/10 text-sm leading-6 text-white">
        <tr>
          <th
            scope="col"
            className="py-2 pl-4 pr-8 font-semibold sm:pl-6 lg:pl-8"
          >
            Item
          </th>

          <th
            scope="col"
            className="hidden py-2 pl-0 pr-8 font-semibold sm:table-cell"
          >
            Bids
          </th>

          <th
            scope="col"
            className="py-2 pl-0 pr-4 text-right font-semibold sm:pr-8 sm:text-left lg:pr-20"
          >
            Status
          </th>

          <th
            scope="col"
            className="hidden py-2 pl-0 pr-8 font-semibold md:table-cell lg:pr-20"
          >
            Time Window
          </th>

          <th
            scope="col"
            className="hidden py-2 pl-0 pr-4 text-right font-semibold sm:table-cell sm:pr-6 lg:pr-8"
          >
            Published
          </th>

          <th
            scope="col"
            className="hidden py-2 pl-0 pr-4 text-right font-semibold sm:table-cell sm:pr-6 lg:pr-8"
          >
            Created
          </th>
        </tr>
      </thead>

      <tbody className="divide-y divide-white/5">
        {items.map((item) => (
          <tr key={item.id.toString()}>
            <td className="py-4 pl-4 pr-8 sm:pl-6 lg:pl-8">
              <div className="flex items-center gap-x-4">
                {/* <img
                  src={item.user.imageUrl}
                  alt=""
                  className="h-8 w-8 rounded-full bg-gray-800"
                /> */}

                <div className="truncate text-sm font-medium leading-6 text-white">
                  {item.name}
                </div>
              </div>
            </td>

            <td className="hidden py-4 pl-0 pr-4 sm:table-cell sm:pr-8">
              <div className="flex gap-x-3">
                <div className="font-mono text-sm leading-6 text-gray-400">
                  {0}
                </div>
              </div>
            </td>

            <td className="py-4 pl-0 pr-4 text-sm leading-6 sm:pr-8 lg:pr-20">
              <div className="flex items-center justify-end gap-x-2 sm:justify-start">
                <time
                  className="text-gray-400 sm:hidden"
                  dateTime={item.createdAt.toString()}
                >
                  {item.createdAt.toDateString()}
                </time>

                <div
                  className={cx(
                    // @ts-ignore
                    statuses[item.status],
                    'flex-none rounded-full p-1'
                  )}
                >
                  <div className="h-1.5 w-1.5 rounded-full bg-current" />
                </div>

                <div className="hidden text-white sm:block">
                  {startCase(item.status)}
                </div>
              </div>
            </td>

            <td className="hidden py-4 pl-0 pr-8 text-sm leading-6 text-gray-400 md:table-cell lg:pr-20">
              {item.timeWindow + ' hours'}
            </td>

            <td className="hidden py-4 pl-0 pr-4 text-right text-sm leading-6 text-gray-400 sm:table-cell sm:pr-6 lg:pr-8">
              {item.publishedAt && (
                <time dateTime={item.publishedAt.toString()}>
                  {date(item.publishedAt).fromNow()}
                </time>
              )}
            </td>

            <td className="hidden py-4 pl-0 pr-4 text-right text-sm leading-6 text-gray-400 sm:table-cell sm:pr-6 lg:pr-8">
              <time dateTime={item.createdAt.toString()}>
                {date(item.createdAt).format('MMM D, YYYY h:mm A')}
              </time>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
