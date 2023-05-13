'use client';

import { Dialog, Transition } from '@headlessui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Item } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { Fragment, useRef } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import Button from '@/components/button';
import * as Form from '@/components/form';
import { appChannel } from '@/event/channels/app.channel';
import * as api from '@/utils/api';

type FormValues = Pick<
  Item,
  'name' | 'description' | 'startingPrice' | 'timeWindow'
>;

export default function Page() {
  const router = useRouter();

  const { formState, register, handleSubmit, setError } = useForm<FormValues>({
    defaultValues: {
      name: '',
      description: '',
      startingPrice: 1,
      timeWindow: 1,
    },

    resolver: zodResolver(
      z.object({
        name: z
          .string({ required_error: 'Please enter a name' })
          .min(1, 'Please enter a name')
          .max(255, 'Name can be no longer than 255 characters'),

        description: z
          .string()
          .max(510, 'Description can be no longer than 510 characters'),

        startingPrice: z.preprocess(
          (timeWindow) => parseInt(timeWindow as string, 10),
          z
            .number({ invalid_type_error: 'Please enter a starting price' })
            .positive('Starting price must be at least 1')
        ),

        timeWindow: z.preprocess(
          (timeWindow) => parseInt(timeWindow as string, 10),
          z
            .number({ invalid_type_error: 'Please enter a valid time window' })
            .positive('Time window must be at least 1')
        ),
      })
    ),
  });

  const cancelButtonRef = useRef(null);

  const onSubmit = async (values: FormValues) => {
    const response = await api.post('/user/items', values);

    if (!response.ok) {
      Object.entries(response.error?.errors ?? {}).forEach(([key, value]) => {
        setError(key as keyof FormValues, {
          type: 'manual',
          message: (value as string[])?.[0] ?? `${key} is invalid}`,
        });
      });

      return;
    }

    appChannel.emit('notification::displayed', {
      title: 'Item created',
      message: `Don't forget to publish your item!`,
      state: 'success',
    });

    close();

    router.refresh();
  };

  const close = () => {
    router.back();
  };

  return (
    <Transition.Root show as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={close}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 z-0 bg-white/10  transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-gray-900 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                    <div className="text-center">
                      <Dialog.Title
                        as="h3"
                        className="text-base font-semibold leading-6 text-white"
                      >
                        New Item
                      </Dialog.Title>

                      <div className="mt-2">
                        <p className="text-sm text-gray-300">
                          Create a new item in a draft state. Publishing this
                          will make the item available for sale.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6 p-4 sm:px-6">
                    <Form.Group
                      name="name"
                      label="Name"
                      error={formState.errors.name}
                    >
                      <Form.TextInput
                        name="name"
                        register={register}
                        type="text"
                      />
                    </Form.Group>

                    <Form.Group
                      name="description"
                      label="Description"
                      error={formState.errors.description}
                    >
                      <Form.Textarea name="description" register={register} />
                    </Form.Group>

                    <Form.Group
                      name="startingPrice"
                      label="Starting Price"
                      error={formState.errors.startingPrice}
                    >
                      <Form.TextInput
                        name="startingPrice"
                        register={register}
                        type="number"
                      />
                    </Form.Group>

                    <Form.Group
                      name="timeWindow"
                      label="Time Window"
                      error={formState.errors.timeWindow}
                    >
                      <Form.TextInput
                        name="timeWindow"
                        register={register}
                        type="number"
                      />
                    </Form.Group>
                  </div>

                  <div className="mt-5 sm:mt-6 bg-gray-800/10 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <Button
                      className="w-full sm:ml-3 sm:w-auto"
                      type="submit"
                      loading={formState.isSubmitting}
                      disabled={Object.keys(formState.errors).length > 0}
                    >
                      Create
                    </Button>

                    <Button
                      className="w-full sm:w-auto"
                      color="secondary"
                      onClick={close}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
