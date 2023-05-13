import { eventBus } from '@/utils/event-bus';

// prettier-ignore
export const appChannel = eventBus<{
  'notification::displayed': (notification: { title: string; message: string }) => void;
  'notification::hidden': () => void;
}>();
