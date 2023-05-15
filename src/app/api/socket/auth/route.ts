import { NextRequest } from 'next/server';

import * as response from '@/utils/http/response';
import { channels } from '@/utils/pusher';

export async function POST(request: NextRequest) {
  const formData = await request.formData();

  const channel = channels.authorizeChannel(
    formData.get('socket_id')?.toString() ?? '',
    formData.get('channel_name')?.toString() ?? ''
  );

  return response.json(channel);
}
