import startCase from 'lodash.startcase';
import Link from 'next/link';

import ButtonLink from '@/components/button-link';
import { cx } from '@/utils';
import { getUser } from '@/utils/auth';
import { date } from '@/utils/date';
import { db } from '@/utils/db';

const statuses = {
  published: 'text-green-400 bg-green-400/10',
  draft: 'text-yellow-400 bg-yellow-400/10',
};

async function getUserItems(userId: number) {
  const items = await db.item.findMany({
    where: {
      sellerId: userId,
    },
  });

  return items;
}

export default async function Page() {
  const user = await getUser();

  if (!user) return null;

  const items = await getUserItems(user.id);

  return (
    <div className="bg-gray-900 py-10">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold leading-6 text-white">
              Your Items For Sale
            </h1>

            <p className="mt-2 text-sm text-gray-300">
              A list of all items you have listed for sale. Once published, the
              item will be available for bidding in the marketplace.
            </p>
          </div>

          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <ButtonLink href="/dashboard/my/listing/create">
              Add item
            </ButtonLink>
          </div>
        </div>

        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <table className="mt-6 w-full whitespace-nowrap text-left">
                <colgroup>
                  <col className="w-full sm:w-4/12" />
                  <col className="lg:w-1/12" />
                  <col className="lg:w-1/12" />
                  <col className="lg:w-1/12" />
                  <col className="lg:w-2/12" />
                  <col className="lg:w-2/12" />
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
                      className="hidden py-2 pl-0 pr-4 font-semibold sm:table-cell sm:pr-6 lg:pr-8"
                    >
                      Published
                    </th>

                    <th
                      scope="col"
                      className="hidden py-2 pl-0 pr-4 font-semibold sm:table-cell sm:pr-6 lg:pr-8"
                    >
                      Created
                    </th>

                    <th
                      scope="col"
                      className="relative py-3.5 pl-3 pr-4 sm:pr-0"
                    >
                      <span className="sr-only">Publish</span>
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

                      <td className="hidden py-4 pl-0 text-sm leading-6 text-gray-400 sm:table-cell">
                        {item.publishedAt && (
                          <time dateTime={item.publishedAt.toString()}>
                            {date(item.publishedAt).fromNow()}
                          </time>
                        )}
                      </td>

                      <td className="hidden py-4 pl-0 text-sm leading-6 text-gray-400 sm:table-cell">
                        <time dateTime={item.createdAt.toString()}>
                          {date(item.createdAt).format('MMM D, YYYY h:mm A')}
                        </time>
                      </td>

                      <td className="hidden py-4 pl-0 pr-4 text-right text-sm leading-6 text-indigo-500 hover:text-indigo-600 font-semibold uppercase sm:table-cell sm:pr-6 lg:pr-8">
                        {item.status === 'draft' && (
                          <Link
                            href={`/dashboard/my/listing/${item.id}/publish`}
                          >
                            Publish
                          </Link>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
