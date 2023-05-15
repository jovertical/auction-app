'use client';

import { Menu, Transition } from '@headlessui/react';
import { ChevronUpDownIcon } from '@heroicons/react/20/solid';
import Link from 'next/link';
import { Fragment } from 'react';

import { cx } from '@/utils';

const options = [
  { name: 'Closing Soon', value: 'closing-soon' },
  { name: 'Lowest Price First', value: 'lowest-price-first' },
  { name: 'Highest Price First', value: 'highest-price-first' },
];

export default function ListSortMenu() {
  return (
    <Menu as="div" className="relative">
      <Menu.Button className="flex items-center gap-x-1 text-sm font-medium leading-6 text-white">
        Sort by
        <ChevronUpDownIcon
          className="h-5 w-5 text-gray-500"
          aria-hidden="true"
        />
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
        <Menu.Items className="absolute right-0 z-10 mt-2.5 w-40 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
          {options.map((option) => (
            <Menu.Item key={option.value}>
              {({ active }) => (
                <Link
                  href={`/dashboard/live?sort=${option.value}`}
                  className={cx(
                    active ? 'bg-gray-50' : '',
                    'block px-3 py-1 text-sm leading-6 text-gray-900'
                  )}
                >
                  {option.name}
                </Link>
              )}
            </Menu.Item>
          ))}
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
