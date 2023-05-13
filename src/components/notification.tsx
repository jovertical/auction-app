'use client';

import { Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/20/solid';
import {
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';
import { Fragment, useEffect, useMemo } from 'react';

import type { Notification as NotificationPayload } from '@/event/data/notification';
import { cx } from '@/utils';

type Props = {
  show: boolean;
  onDismiss?: () => void;
} & NotificationPayload;

const icons = {
  info: InformationCircleIcon,
  success: CheckCircleIcon,
  warning: ExclamationTriangleIcon,
  error: XCircleIcon,
};

const iconColors = {
  info: 'text-blue-400',
  success: 'text-green-400',
  warning: 'text-yellow-400',
  error: 'text-red-400',
};

export default function Notification({
  title,
  message,
  state = 'info',
  show = false,
  onDismiss,
}: Props) {
  const Icon = useMemo(() => icons[state], [state]);

  useEffect(() => {
    if (!show) return;

    const timeout = setTimeout(() => {
      onDismiss?.();
    }, 3000);

    return () => {
      clearTimeout(timeout);
    };
  }, [show, onDismiss]);

  return (
    <>
      {/* Global notification live region, render this permanently at the end of the document */}
      <div
        aria-live="assertive"
        className="pointer-events-none fixed inset-0 z-50 flex items-end px-4 py-6 sm:items-start sm:p-6"
      >
        <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
          {/* Notification panel, dynamically insert this into the live region when it needs to be displayed */}
          <Transition
            show={show}
            as={Fragment}
            enter="transform ease-out duration-300 transition"
            enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
            enterTo="translate-y-0 opacity-100 sm:translate-x-0"
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-gray-800 shadow-lg ring-1 ring-gray-100 ring-opacity-5">
              <div className="p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <Icon
                      className={cx('h-6 w-6', iconColors[state])}
                      aria-hidden="true"
                    />
                  </div>

                  <div className="ml-3 w-0 flex-1 pt-0.5">
                    <p className="text-sm font-medium text-white">{title}</p>
                    <p className="mt-1 text-sm text-gray-300">{message}</p>
                  </div>

                  <div className="ml-4 flex flex-shrink-0">
                    <button
                      type="button"
                      className="inline-flex rounded-md bg-gray-800 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      onClick={onDismiss}
                    >
                      <span className="sr-only">Close</span>
                      <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </>
  );
}
