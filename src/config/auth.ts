import type { AuthOptions } from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import CredentialsProvider from 'next-auth/providers/credentials';

import { db } from '@/utils/db';

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(db),

  secret: process.env.NEXTAUTH_SECRET,

  providers: [
    CredentialsProvider({
      name: 'Credentials',

      // The credentials is used to generate a suitable form on the sign in page.
      // prettier-ignore
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'john@example.com' },
        password: { label: 'Password', type: 'password' },
      },

      async authorize(credentials, request) {
        const response = await fetch(
          `${process.env.NEXTAUTH_URL}/api/auth/session`,
          {
            method: 'POST',
            body: JSON.stringify(credentials),
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
          }
        );

        const user = await response.json();

        if (!response.ok || !user) {
          return null;
        }

        return user;
      },
    }),
  ],

  pages: {
    signIn: '/auth/login',
  },
};
