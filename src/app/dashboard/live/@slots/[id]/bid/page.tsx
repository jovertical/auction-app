'use client';

import { Dialog, Transition } from '@headlessui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Fragment, useRef, useState, memo, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import Button from '@/components/button';
import CountdownTimer from '@/components/countdown-timer';
import * as Form from '@/components/form';
import { appChannel } from '@/event/channels/app.channel';
import * as api from '@/utils/api';
import { date } from '@/utils/date';

type Item = {
  id: number;
  name: string;
  description: string;
  startingPrice: number;
  publishedAt: string | null;
  expiresAt: string | null;
  seller: { name: string };
  bids: {
    id: number;
    createdAt: string;

    bidder: {
      id: number;
      name: string;
    };

    transaction: {
      amount: number;
    };
  }[];
};

type FormValues = {
  bid: number;
};

export default function Page({ params }: { params: { id: string } }) {
  const [item, setItem] = useState<Item | null>(null);

  const router = useRouter();

  const cancelButtonRef = useRef(null);

  const { formState, register, handleSubmit, setError } = useForm<FormValues>({
    defaultValues: {
      bid: 0,
    },

    resolver: zodResolver(
      z.object({
        bid: z.preprocess(
          (bid) => parseInt(bid as string, 10),
          z
            .number({ invalid_type_error: 'Please enter a your bid' })
            .positive('Bids must be at least 1')
        ),
      })
    ),
  });

  const onSubmit = async (values: FormValues) => {
    if (!item) return;

    const response = await api.post(`/live/items/${item.id}/bid`, values);

    // prettier-ignore
    appChannel.emit('notification::displayed', {
      ...response.ok ? {
        title: 'Bid submitted',
        message: 'We will notify you if you are outbid or win the auction',
        state: 'success',
      } : {
        title: 'Bid failed',
        message: response.error?.message ?? 'Please try again later',
        state: 'error',
      }
    });

    if (!response.ok) {
      Object.entries(response.error?.errors ?? {}).forEach(([key, value]) => {
        setError(key as keyof FormValues, {
          type: 'manual',
          message: (value as string[])?.[0] ?? `${key} is invalid}`,
        });
      });

      return;
    }

    close();

    router.refresh();
  };

  const close = () => {
    router.back();
  };

  useEffect(() => {
    async function load() {
      if (!params.id) return;

      if (item) return;

      const newItem = await api.get<Item>(`/live/items/${params.id}`);

      if (!newItem.data) return;

      setItem(newItem.data);
    }

    load();
  }, [params, item]);

  if (!item) return null;

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

        <div className="fixed inset-0 z-50 overflow-y-auto">
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
                        Make a Bid
                      </Dialog.Title>

                      <div className="mt-2">
                        <p className="text-sm text-gray-300">
                          Make a bid for the item{' '}
                          <span className="font-semibold">{item.name}</span>.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6 p-4 sm:px-6">
                    <Form.Group
                      name="bid"
                      label="Your bid"
                      error={formState.errors.bid}
                    >
                      <Form.TextInput
                        name="bid"
                        register={register}
                        type="number"
                      />
                    </Form.Group>
                  </div>

                  {item.expiresAt && (
                    <div className="flex justify-center py-4 px-6 items-center">
                      <CountdownTimer date={date(item.expiresAt).toDate()} />
                    </div>
                  )}

                  <div className="mt-5 sm:mt-6 bg-gray-800/10 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <Button
                      type="submit"
                      className="w-full sm:ml-3 sm:w-auto"
                      disabled={Object.keys(formState.errors).length > 0}
                      loading={formState.isSubmitting}
                    >
                      Place Bid
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
