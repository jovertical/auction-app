'use client';

import { cx } from '@/utils';
import { useState, useMemo, useEffect } from 'react';

interface Props {
  date: Date;
  interval?: number;
}

export default function CountdownTimer({
  interval: timer = 3000,
  date,
}: Props) {
  const [countdown, setCountdown] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const expired = useMemo(() => {
    const now = new Date();

    return date.getTime() < now.getTime();
  }, [date]);

  const isWithinTheHour = useMemo(() => {
    const now = new Date();

    const diff = date.getTime() - now.getTime();

    return diff < 1000 * 60 * 60;
  }, [date]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();

      const diff = date.getTime() - now.getTime();

      const hours = Math.floor(diff / (1000 * 60 * 60));

      const minutes = Math.floor((diff / (1000 * 60)) % 60);

      const seconds = Math.floor((diff / 1000) % 60);

      setCountdown({
        hours,
        minutes,
        seconds,
      });
    }, timer);

    return () => {
      clearInterval(interval);
    };
  }, [date, timer]);

  if (expired) return null;

  return (
    <span className="whitespace-nowrap text-white">
      {expired ? (
        'Expired'
      ) : (
        <>
          Closes in{' '}
          <code
            className={cx(
              'text-sm font-semibold leading-6',
              isWithinTheHour ? 'text-red-500' : 'text-gray-200'
            )}
          >
            {isWithinTheHour ? '' : countdown.hours + ':'}
            {countdown.minutes}:{countdown.seconds}
          </code>
        </>
      )}
    </span>
  );
}
