import ButtonLink from '@/components/button-link';
import { getUser } from '@/utils/auth';

export default async function Page() {
  const user = await getUser();

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="max-w-sm px-3">
        <div className="text-center">
          <h1 className="text-white text-4xl font-medium">
            Welcome to{' '}
            <span className="text-indigo-500 italic font-bold">
              Jitera Auctions!
            </span>
          </h1>

          <p className="mt-4 text-gray-300 font-medium text-lg font-mono">
            Looking for great deals? Find them here! Start bidding on your
            favorite items and get them at incredible prices.
          </p>
        </div>

        <div className="mx-auto w-36 mt-6">
          {user ? (
            <ButtonLink href="/dashboard/live">Go to Dashboard</ButtonLink>
          ) : (
            <ButtonLink href="/auth/register">Get Started</ButtonLink>
          )}
        </div>
      </div>
    </div>
  );
}
