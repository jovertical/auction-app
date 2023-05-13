'use client';

import { useState, useEffect } from 'react';

import Notification from '@/components/notification';
import { appChannel } from '@/event/channels/app.channel';

export default function NotificationInterceptor() {
  const [notification, setNotification] = useState<{
    title: string;
    message: string;
  } | null>(null);

  useEffect(() => {
    const removeNotificationDisplayedListener = appChannel.on(
      'notification::displayed',
      (newNotification) => {
        setNotification(newNotification);
      }
    );

    const removeNotificationHiddenListener = appChannel.on(
      'notification::hidden',
      () => {
        setNotification(null);
      }
    );

    return () => {
      removeNotificationDisplayedListener();
      removeNotificationHiddenListener();
    };
  }, []);

  return (
    <Notification
      show={!!notification}
      {...notification}
      onDismiss={() => appChannel.emit('notification::hidden')}
    />
  );
}
