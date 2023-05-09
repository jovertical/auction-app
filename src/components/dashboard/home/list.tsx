import { cx } from '@/utils';
import * as React from 'react';

const items = [
  {
    id: 1,
    name: "Rolex GMT-Master 'Pepsi' Oyster 126710BLRO",
    price: '$8,000',
    href: '#',
    createdBy: 'Leslie Alexander',
    closing: '02:05:17',
    closingTime: '2023-03-17T00:00Z',
  },

  {
    id: 2,
    name: 'Rolex GMT-Master II Root Beer 126711CHNR 2022 Complete',
    price: '$10,000',
    href: '#',
    createdBy: 'Jeffrey Clark',
    closing: '00:09:32',
    closingTime: '2023-05-05T00:00Z',
  },
];

export default function List() {
  return (
    <ul
      role="list"
      className="divide-y divide-white/5 px-4 py-4 sm:px-6 lg:px-8"
    >
      {items.map((item) => (
        <li
          key={item.id}
          className="flex items-center justify-between gap-x-6 py-5"
        >
          <div className="min-w-0">
            <div className="flex items-start gap-x-3">
              <p className="text-sm font-semibold leading-6 text-white">
                {item.name}
              </p>
            </div>

            <div className="mt-1 flex items-center gap-x-2 text-xs leading-5 text-gray-500">
              <p className="whitespace-nowrap">
                Closing in{' '}
                <time dateTime={item.closingTime}>{item.closing}</time>
              </p>

              <svg viewBox="0 0 2 2" className="h-0.5 w-0.5 fill-current">
                <circle cx={1} cy={1} r={1} />
              </svg>

              <p className="truncate">Posted by {item.createdBy}</p>
            </div>
          </div>

          <div className="flex flex-none items-center gap-x-4">
            <a
              href={item.href}
              className="hidden rounded-md bg-indigo-500 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-indigo-400 hover:bg-indigo-600 sm:block"
            >
              Place Bid <span className="sr-only">, {item.name}</span>
            </a>
          </div>
        </li>
      ))}
    </ul>
  );
}
