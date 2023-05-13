import ButtonLink from '@/components/button-link';
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
              <ListingsTable items={items} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
