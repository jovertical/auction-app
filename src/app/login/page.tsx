'use client';

import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';

import Button from '@/components/button';
import * as Form from '@/components/form';
import Logo from '@/components/logo';

type FormValues = {
  email: string;
  password: string;
};

export default async function Page() {
  const { register, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: FormValues) => {
    await signIn('credentials', {
      email: values.email,
      password: values.password,
      callbackUrl: 'http://localhost:3000/dashboard',
    });
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <Logo className="h-16 w-auto mx-auto" />

        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form
          className="space-y-6"
          method="POST"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Form.Group name="email" label="Email address">
            <Form.TextInput
              id="email"
              {...register('email')}
              type="email"
              autoComplete="email"
              required
            />
          </Form.Group>

          <Form.Group
            name="password"
            label="Password"
            renderAddon={() => (
              <div className="text-sm">
                <a
                  href="#"
                  className="font-semibold text-indigo-400 hover:text-indigo-300"
                >
                  Forgot password?
                </a>
              </div>
            )}
          >
            <Form.TextInput
              id="password"
              {...register('password')}
              type="password"
              autoComplete="current-password"
              required
            />
          </Form.Group>

          <div>
            <Button type="submit">Sign in</Button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm text-gray-400">
          Not a member?{' '}
          <Link
            href="/register"
            className="font-semibold leading-6 text-indigo-400 hover:text-indigo-300"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
