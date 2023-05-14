'use client';

import { SessionProvider } from 'next-auth/react';

export default function Layout(props: {
  children: React.ReactNode;
  slots: React.ReactNode;
}) {
  return (
    <SessionProvider>
      {props.children}
      {props.slots}
    </SessionProvider>
  );
}
