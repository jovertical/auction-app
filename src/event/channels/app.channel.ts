import type { Notification } from '@/event/data/notification';
import { eventBus } from '@/utils/event-bus';

// prettier-ignore
export const appChannel = eventBus<{
  'notification::displayed': (notification: Notification) => void;
  'notification::hidden': () => void;
}>();
