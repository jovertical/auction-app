'use client';

import { useSession } from 'next-auth/react';
import { useMemo } from 'react';

import withSessionProvider from '@/components/withSessionProvider';
import { cx, generateAvatarColor } from '@/utils';

const colors = {
  gray: 'bg-gray-600',
  red: 'bg-red-600',
  teal: 'bg-teal-600',
  pink: 'bg-pink-600',
};

function UserAvatar() {
  const { data } = useSession();

  const initials = useMemo(() => {
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
      <span
        className={cx(
          'inline-flex h-10 w-10 items-center justify-center rounded-full',
          colors[generateAvatarColor(initials ?? '')]
        )}
      >
        <span className="font-medium leading-none text-white">{initials}</span>
      </span>

      <span className="sr-only">Your profile</span>
      <span aria-hidden="true">{data.user.name}</span>
    </a>
  );
}

export default withSessionProvider(UserAvatar);
