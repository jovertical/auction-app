'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import Logo from '@/components/logo';
import UserAvatar from '@/components/user-avatar';
import { links } from '@/config/navigation';
import { cx } from '@/utils';

function Navigation() {
  const pathname = usePathname();

  return (
    <div className="hidden xl:fixed xl:inset-y-0 xl:z-50 xl:flex xl:w-72 xl:flex-col">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-black/10 px-6 ring-1 ring-white/5">
        <div className="flex h-16 shrink-0 items-center">
          <Logo className="h-8 w-auto" />
        </div>

        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {links.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={cx(
                        item.href === pathname
                          ? 'bg-gray-800 text-white'
                          : 'text-gray-400 hover:text-white hover:bg-gray-800',
                        'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                      )}
                    >
                      <item.icon
                        className="h-6 w-6 shrink-0"
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>

            <li className="-mx-6 mt-auto">
              <UserAvatar />
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}

export default Navigation;
