'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';

import Alert from '@/components/alert';
import Button from '@/components/button';
import * as Form from '@/components/form';
import Logo from '@/components/logo';
import { match } from '@/utils/object';

type FormValues = {
  email: string;
  password: string;
};

export default function Page() {
  const router = useRouter();

  const { register, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      email: 'john@example.com',
      password: 'password',
    },
  });

  const [error, setError] = useState<string | null>(null);

  const formattedError = useMemo<{ title: string; message: string }>(() => {
    if (!error) return null;

    return match(error as any, {
      CredentialsSignin: {
        title: 'Invalid credentials',
        message:
          'The email or password you entered is incorrect. Please try again.',
      },

      DEFAULT: {
        title: 'Ooops!',
        message: 'An unknown error occurred. Please try again',
      },
    });
  }, [error]);

  const onSubmit = async (values: FormValues) => {
    const response = await signIn('credentials', {
      email: values.email,
      password: values.password,
      callbackUrl: `${window.location.origin}/dashboard`,
      redirect: false,
    });

    if (!response) return;

    if (response.error) {
      setError(response.error);

      return;
    }

    if (response.url) {
      router.push(response.url);
    }
  };

  return (
    <>
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <Logo className="h-16 w-auto mx-auto" />

        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        {formattedError && <Alert className="mb-4" {...formattedError} />}

        <form
          className="space-y-6"
          method="POST"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Form.Group name="email" label="Email address">
            <Form.TextInput
              name="email"
              register={register}
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
              name="password"
              register={register}
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
            href="/auth/register"
            className="font-semibold leading-6 text-indigo-400 hover:text-indigo-300"
          >
            Sign up
          </Link>
        </p>
      </div>
    </>
  );
}
