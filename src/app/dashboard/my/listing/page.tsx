import ListingsTable from '@/components/dashboard/my/listings/table';
import { getUser } from '@/utils/auth';
import { db } from '@/utils/db';

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
      <h2 className="px-4 text-base font-semibold leading-7 text-white sm:px-6 lg:px-8">
        Your Items For Sale
      </h2>

      <ListingsTable items={items} />
    </div>
  );
}
