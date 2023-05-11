import * as React from 'react';

export default async function Layout({ children }: React.PropsWithChildren) {
  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      {children}
    </div>
  );
}
