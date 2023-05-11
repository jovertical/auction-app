import { ExclamationTriangleIcon } from '@heroicons/react/20/solid';
import type { ComponentPropsWithoutRef } from 'react';

import { cx } from '@/utils';

interface Props extends ComponentPropsWithoutRef<'div'> {
  title: string;
  message: string;
}

export default function Alert({ title, message, className, ...props }: Props) {
  return (
    <div {...props} className={cx('rounded-md bg-gray-800 p-4', className)}>
      <div className="flex">
        <div className="flex-shrink-0">
          <ExclamationTriangleIcon
            className="h-6 w-6 text-red-600"
            aria-hidden="true"
          />
        </div>

        <div className="ml-3">
          <h3 className="font-medium text-red-600">{title}</h3>
          <div className="mt-2 text-sm text-gray-100">
            <p>{message}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
