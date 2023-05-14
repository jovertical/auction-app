import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: number;
      name: string;
      email: string;
      balance: number;
      created_at: string;
      updated_at: string;
    };
  }
}
