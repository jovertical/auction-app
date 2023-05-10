import Link from 'next/link';

import Form from '@/components/auth/register/form';
import Logo from '@/components/logo';

export default async function Page() {
  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <Logo className="h-16 w-auto mx-auto" />

        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white">
          Create your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <Form />

        <p className="mt-10 text-center text-sm text-gray-400">
          Already a member?{' '}
          <Link
            href="/login"
            className="font-semibold leading-6 text-indigo-400 hover:text-indigo-300"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
