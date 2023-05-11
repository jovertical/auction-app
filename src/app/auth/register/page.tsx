'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';

import Button from '@/components/button';
import * as Form from '@/components/form';
import Logo from '@/components/logo';
import * as api from '@/utils/api';

type FormValues = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
};

export default async function Page() {
  const { register, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
    },
  });

  const onSubmit = async (values: FormValues) => {
    const data = await api.post('/auth/registered-user', values);

    console.log(data);
  };

  return (
    <>
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <Logo className="h-16 w-auto mx-auto" />

        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white">
          Create your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form
          className="space-y-6"
          method="POST"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Form.Group name="name" label="Name">
            <Form.TextInput
              name="name"
              register={register}
              type="text"
              required
            />
          </Form.Group>

          <Form.Group name="email" label="Email address">
            <Form.TextInput
              name="email"
              register={register}
              type="email"
              autoComplete="email"
              required
            />
          </Form.Group>

          <Form.Group name="password" label="Password">
            <Form.TextInput
              name="password"
              register={register}
              type="password"
              autoComplete="current-password"
              required
            />
          </Form.Group>

          <Form.Group name="password_confirmation" label="Repeat Password">
            <Form.TextInput
              name="password_confirmation"
              register={register}
              type="password"
              autoComplete="current-password"
              required
            />
          </Form.Group>

          <div>
            <Button type="submit">Sign up</Button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm text-gray-400">
          Already a member?{' '}
          <Link
            href="/auth/login"
            className="font-semibold leading-6 text-indigo-400 hover:text-indigo-300"
          >
            Sign in
          </Link>
        </p>
      </div>
    </>
  );
}
