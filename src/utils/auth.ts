import { cookies } from 'next/headers';

/**
 * Pulls the `jwt` token from the `next-auth.session-token` cookie and
 * fetches the user from the `/api/auth/session` endpoint
 */
export const getUser = async () => {
  const cookiesStore = cookies();

  const prefix = process.env.NODE_ENV === 'production' ? '__Secure-' : '';

  const token = cookiesStore.get(prefix + 'next-auth.session-token');

  if (!token) return null;

  const response = await fetch(`${process.env.NEXTAUTH_URL}/api/auth/session`, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Cookie: `${prefix}next-auth.session-token=${token.value}`,
    },
  });

  if (!response.ok) return null;

  const data = await response.json();

  if (!data?.user) return null;

  return data.user as {
    id: number;
    name: string;
    email: string;
    created_at: string;
    updated_at: string;
  };
};
