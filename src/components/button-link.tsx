import Link from 'next/link';
import type { LinkProps } from 'next/link';

import { cx } from '@/utils';

interface Props extends LinkProps {
  className?: string;
  children: React.ReactNode;
}

export default function ButtonLink({ className, children, ...props }: Props) {
  return (
    <Link
      {...props}
      className={cx(
        'flex w-full items-center justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500',
        className
      )}
    >
      {children}
    </Link>
  );
}
