import { cx, generateAvatarColor } from '@/utils';
import { useMemo } from 'react';

interface Props {
  user: {
    name: string;
    [key: string]: any;
  };
}

const colors = {
  gray: 'bg-gray-600',
  red: 'bg-red-600',
  teal: 'bg-teal-600',
  pink: 'bg-pink-600',
};

export default function UserAvatar({ user }: Props) {
  const initials = useMemo(() => {
    if (!user) {
      return null;
    }

    const [first, last] = (user.name ?? '').split(' ');

    if (!last) return first?.[0] + first?.[1];

    return `${first[0]}${last[0]}`;
  }, [user]);

  return (
    <span
      className={cx(
        'inline-flex h-10 w-10 items-center justify-center rounded-full',
        colors[generateAvatarColor(initials ?? '')]
      )}
    >
      <span className="font-medium leading-none text-white">{initials}</span>
    </span>
  );
}
