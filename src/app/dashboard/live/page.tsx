import Item from '@/components/dashboard/live/item';
import ListSortMenu from '@/components/dashboard/live/list-sort-menu';
import { getUser } from '@/utils/auth';
import { db } from '@/utils/db';

async function getItems() {
  const user = await getUser();

  const items = await db.item.findMany({
    where: {
      status: 'published',

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
    },
  });

  return items;
}

export default async function Page() {
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
            <Item item={item} />
          </li>
        ))}
      </ul>
    </>
  );
}
