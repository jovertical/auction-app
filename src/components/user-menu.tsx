'use client';

import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import Link from 'next/link';
import { SessionContext, signOut } from 'next-auth/react';
import { useContext, useMemo, Fragment } from 'react';

import withSessionProvider from '@/components/with-session-provider';
import { cx, generateAvatarColor } from '@/utils';

const navigation = [
  { name: 'Your profile', href: '#' },
  { name: 'Deposit', href: '#' },
];

const colors = {
  gray: 'bg-gray-600',
  red: 'bg-red-600',
  teal: 'bg-teal-600',
  pink: 'bg-pink-600',
};

function UserMenu() {
  const session = useContext(SessionContext);

  const user = useMemo(() => session?.data?.user, [session?.data]);

  const initials = useMemo(() => {
    if (!user) {
      return null;
    }

    const [first, last] = (user.name ?? '').split(' ');

    if (!last) return first?.[0] + first?.[1];

    return `${first[0]}${last[0]}`;
  }, [user]);

  if (!user) return null;

  return (
    <Menu as="div" className="relative">
      <Menu.Button className="-m-1.5 flex items-center p-1.5">
        <span className="sr-only">Open user menu</span>

        <span
          className={cx(
            'inline-flex h-10 w-10 items-center justify-center rounded-full',
            colors[generateAvatarColor(initials ?? '')]
          )}
        >
          <span className="font-medium leading-none text-white">
            {initials}
          </span>
        </span>

        <span className="hidden lg:flex lg:items-center">
          <span
            className="ml-4 text-sm font-semibold leading-6 text-white"
            aria-hidden="true"
          >
            {user.name}
          </span>

          <ChevronDownIcon
            className="ml-2 h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </span>
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
          {navigation.map((item) => (
            <Menu.Item key={item.name}>
              {({ active }) => (
                <Link
                  href={item.href}
                  className={cx(
                    active ? 'bg-gray-50' : '',
                    'block px-3 py-1 text-sm leading-6 text-gray-900'
                  )}
                >
                  {item.name}
                </Link>
              )}
            </Menu.Item>
          ))}

          <Menu.Item as="button" onClick={() => signOut()}>
            <span className="block px-3 py-1 text-sm leading-6 text-gray-900">
              Sign Out
            </span>
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}

export default withSessionProvider(UserMenu);
