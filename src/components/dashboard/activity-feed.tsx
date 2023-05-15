'use client';

import Pusher from 'pusher-js';
import { useState, useCallback, useEffect } from 'react';

import UserAvatar from '@/components/user-avatar';
import * as api from '@/utils/api';
import { date } from '@/utils/date';

type Activity = {
  id: number;
  type: string;
  content: string;
  createdAt: string;
  updatedAt: string;

  user: {
    id: number;
    name: string;
  };
};

async function getActivities() {
  const activities = await api.get<Activity[]>('/live/activity');

  return activities.error ? [] : activities.data;
}

export default function ActivityFeed() {
  const [activities, setActivities] = useState<Activity[]>([]);

  const loadActivities = useCallback(async () => {
    const activities = await getActivities();

    setActivities(activities);
  }, []);

  useEffect(() => {
    loadActivities();

    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY ?? '', {
      cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER ?? '',
    });

    const liveChannel = pusher.subscribe('live');

    liveChannel.bind('activity:recorded', (activity: any) => {
      if (activity) {
        setActivities((prevActivities) => [activity, ...prevActivities]);
      }
    });

    return () => {
      pusher.disconnect();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <aside className="bg-black/10 lg:fixed lg:bottom-0 lg:right-0 lg:top-16 lg:w-96 lg:overflow-y-auto lg:border-l lg:border-white/5">
      <header className="flex items-center justify-between border-b border-white/5 px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
        <h2 className="text-base font-semibold leading-7 text-white">
          Activity feed
        </h2>

        <a
          href="#"
          className="text-sm font-semibold leading-6 text-indigo-400 hidden"
        >
          View all
        </a>
      </header>

      <ul role="list" className="divide-y divide-white/5">
        {activities.map((activity) => (
          <li key={activity.id} className="px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-x-3">
              <UserAvatar user={activity.user} />

              <h3 className="flex-auto truncate text-sm font-semibold leading-6 text-white">
                {activity.user.name}
              </h3>

              <time
                dateTime={date(activity.createdAt).toString()}
                className="flex-none text-xs text-gray-600"
              >
                {date(activity.createdAt).fromNow()}
              </time>
            </div>

            <p className="mt-3 text-sm text-gray-500">{activity.content}</p>
          </li>
        ))}
      </ul>
    </aside>
  );
}
