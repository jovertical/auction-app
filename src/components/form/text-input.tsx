import * as React from 'react';

import { cx } from '@/utils';

interface Props extends React.ComponentPropsWithoutRef<'input'> {
  //
}

export default function TextInput({ className, ...props }: Props) {
  return (
    <input
      {...props}
      className={cx(
        'block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6',
        className
      )}
    />
  );
}
