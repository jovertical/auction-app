import * as React from 'react';

interface Props extends React.ComponentPropsWithoutRef<'div'> {
  name: string;
  label: string;
  renderAddon?: () => React.ReactNode;
}

export default function Group({
  name,
  label,
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
    </div>
  );
}
