import * as React from 'react';

import { cx } from '@/utils';

interface Props extends React.ComponentPropsWithoutRef<'button'> {
  //
}

export default function Button({ className, children, ...props }: Props) {
  return (
    <button
      {...props}
      className={cx(
        'flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500',
        className
      )}
    >
      {children}
    </button>
  );
}
