import * as React from 'react';
import type { FieldError } from 'react-hook-form';

interface Props extends React.ComponentPropsWithoutRef<'div'> {
  name: string;
  label: string;
  error?: FieldError;
  renderAddon?: () => React.ReactNode;
  children: React.ReactElement;
}

export default function Group({
  name,
  label,
  error,
  renderAddon,
  children,
  ...props
}: Props) {
  return (
    <div {...props}>
      <div className="flex items-center justify-between">
        <label
          htmlFor={name}
          className="block text-sm font-medium leading-6 text-white"
        >
          {label}
        </label>

        {renderAddon && renderAddon()}
      </div>

      <div className="mt-2">{children}</div>

      {error && (
        <p className="mt-2 text-sm text-red-600" id={`${name}-error`}>
          {error.message}
        </p>
      )}
    </div>
  );
}
