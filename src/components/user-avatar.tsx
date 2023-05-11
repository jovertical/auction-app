'use client';

import { useSession } from 'next-auth/react';
import * as React from 'react';

interface Props {
  //
}

export default function UserAvatar(props: Props) {
  const { data } = useSession();

  const initials = React.useMemo(() => {
    if (!data?.user) {
      return null;
    }

    const [first, last] = (data.user?.name ?? '').split(' ');

    if (!last) return first?.[0] + first?.[1];

    return `${first[0]}${last[0]}`;
  }, [data?.user]);

  if (!data?.user) {
    return null;
  }

  return (
    <a
      href="#"
      className="flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-white hover:bg-gray-800"
    >
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gray-500">
        <span className="font-medium leading-none text-white">{initials}</span>
      </span>

      <span className="sr-only">Your profile</span>
      <span aria-hidden="true">{data.user.name}</span>
    </a>
  );
}
