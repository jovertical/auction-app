'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useState, useMemo, useEffect } from 'react';
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
  const params = useSearchParams();

  const router = useRouter();

  const { formState, setValue, register, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      email: '',
      password: '',
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

  const fromRegistration = useMemo(() => {
    return params?.get('newUser') === '1' && params.get('email');
  }, [params]);

  const onSubmit = async (values: FormValues) => {
    const response = await signIn('credentials', {
      email: values.email,
      password: values.password,
      callbackUrl: `${window.location.origin}/dashboard/live`,
      redirect: false,
    });

    if (!response) return;

    if (response.error) {
      setError(response.error);

      return;
    }

    setError(null);

    if (response.url) {
      router.push(response.url);
    }
  };

  useEffect(() => {
    if (fromRegistration) {
      setValue('email', params?.get('email') ?? '');
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromRegistration, params]);

  return (
    <>
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <Link href="/">
          <Logo className="h-16 w-auto mx-auto" />
        </Link>

        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        {formattedError && (
          <Alert state="error" className="mb-4" {...formattedError} />
        )}

        {fromRegistration && (
          <Alert
            state="success"
            className="mb-4"
            title="Registration successful"
            message="You can now sign in with your new account."
          />
        )}

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
            />
          </Form.Group>

          <div>
            <Button
              className="w-full"
              type="submit"
              loading={formState.isSubmitting}
            >
              {formState.isSubmitting ? 'Signing in...' : 'Sign in'}
            </Button>
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
