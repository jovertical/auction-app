'use client';

import { Dialog, Transition } from '@headlessui/react';
import type { Item } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { Fragment, useRef, use } from 'react';

import Button from '@/components/button';
import { appChannel } from '@/event/channels/app.channel';
import * as api from '@/utils/api';

async function fetchItemById(id: Item['id']) {
  const item = await api.get<Item>(
    `/user/items/${id}`,
    {},
    {
      next: {
        revalidate: 60,
      },
    }
  );

  return item.ok ? item.data : null;
}

export default function Page({ params }: { params: { id: string } }) {
  const router = useRouter();

  const cancelButtonRef = useRef(null);

  const item = use(fetchItemById(BigInt(params.id)));

  const publish = async () => {
    if (!item) return;

    const response = await api.post(`/user/items/${item.id}/publish`);

    // prettier-ignore
    appChannel.emit('notification::displayed', {
      ...response.ok ? {
        title: 'Item published',
        message: 'The item is now available for bidding.',
        state: 'success',
      } : {
        title: 'Failed to publish item',
        message: response.error?.message ?? 'An unknown error occurred.',
        state: 'error',
      }
    });

    close();

    router.refresh();
  };

  const close = () => {
    router.back();
  };

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
                <div className="px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <div className="text-center">
                    <Dialog.Title
                      as="h3"
                      className="text-base font-semibold leading-6 text-white"
                    >
                      Publish Item
                    </Dialog.Title>

                    <div className="mt-2">
                      <p className="text-sm text-gray-300">
                        Make{' '}
                        <code className="text-red-600">
                          {item?.name ?? 'item'}
                        </code>{' '}
                        available for bidding in the live auction. Once
                        published, the item will be available for{' '}
                        <code className="text-red-600">
                          {item?.timeWindow ?? 0}
                        </code>{' '}
                        hour/s.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 sm:mt-6 bg-gray-800/10 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <Button
                    className="w-full sm:ml-3 sm:w-auto"
                    type="submit"
                    onClick={publish}
                  >
                    Publish
                  </Button>

                  <Button
                    className="w-full sm:w-auto"
                    color="secondary"
                    onClick={close}
                  >
                    Cancel
                  </Button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
