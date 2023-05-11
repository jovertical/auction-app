import { getServerSession } from 'next-auth';
import * as React from 'react';

import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export default async function Layout({ children }: React.PropsWithChildren) {
  const session = await getServerSession(authOptions);

  console.log(session);

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      {children}
    </div>
  );
}
