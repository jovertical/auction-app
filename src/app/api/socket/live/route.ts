import { NextRequest, NextResponse } from 'next/server';
import Channels from 'pusher';

import * as response from '@/utils/http/response';

const {
  PUSHER_APP_ID: appId = '',
  NEXT_PUBLIC_PUSHER_APP_KEY: key = '',
  PUSHER_APP_SECRET: secret = '',
  NEXT_PUBLIC_PUSHER_APP_CLUSTER: cluster = '',
} = process.env;

const channels = new Channels({
  appId,
  key,
  secret,
  cluster,
});

export async function POST(request: NextRequest) {
  // const data = await request.json();

  await channels.trigger('live', 'item:expired', {
    test: 'b',
  });

  return response.json({ ok: true });
}
