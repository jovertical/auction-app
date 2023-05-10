'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';

import * as api from '@/utils/api';

type FormValues = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
};

export default function Form() {
  const { register, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
    },
  });

  const onSubmit = React.useCallback(async (values: FormValues) => {
    const data = await api.post('/auth/registered-user', values);

    console.log(data);
  }, []);

  return (
    <form className="space-y-6" method="POST" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium leading-6 text-white"
        >
          Name
        </label>

        <div className="mt-2">
          <input
            id="name"
            {...register('name')}
            type="text"
            required
            className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium leading-6 text-white"
        >
          Email address
        </label>

        <div className="mt-2">
          <input
            id="email"
            {...register('email')}
            type="email"
            autoComplete="email"
            required
            className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium leading-6 text-white"
        >
          Password
        </label>

        <div className="mt-2">
          <input
            id="password"
            {...register('password')}
            type="password"
            autoComplete="current-password"
            required
            className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="password_confirmation"
          className="block text-sm font-medium leading-6 text-white"
        >
          Repeat Password
        </label>

        <div className="mt-2">
          <input
            id="password_confirmation"
            {...register('password_confirmation')}
            type="password"
            autoComplete="current-password"
            required
            className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
          />
        </div>
      </div>

      <div>
        <button
          type="submit"
          className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
        >
          Sign up
        </button>
      </div>
    </form>
  );
}
