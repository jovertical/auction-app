import { NextRequest } from 'next/server';
import * as Ably from 'ably/promises';

import * as response from '@/utils/http/response';

export async function GET(request: NextRequest) {
  if (!process.env.ABLY_API_KEY) {
    return response.unauthorized('Missing Ably API Key');
  }

  const client = new Ably.Rest(process.env.ABLY_API_KEY);

  const token = await client.auth.createTokenRequest({
    clientId: 'NO_CLIENT_ID',
  });

  return response.json(token);
}
