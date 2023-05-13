'use client';

import { useState, useEffect } from 'react';

import Notification from '@/components/notification';
import type { Notification as NotificationPayload } from '@/event/data/notification';
import { appChannel } from '@/event/channels/app.channel';

export default function NotificationInterceptor() {
  const [notification, setNotification] = useState<NotificationPayload | null>(
    null
  );

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
      {...(notification ?? { title: '', message: '' })}
      onDismiss={() => setNotification(null)}
    />
  );
}
