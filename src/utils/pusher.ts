import Channels from 'pusher';

const {
  PUSHER_APP_ID: appId = '',
  NEXT_PUBLIC_PUSHER_APP_KEY: key = '',
  PUSHER_APP_SECRET: secret = '',
  NEXT_PUBLIC_PUSHER_APP_CLUSTER: cluster = '',
} = process.env;

export const channels = new Channels({
  appId,
  key,
  secret,
  cluster,
});
