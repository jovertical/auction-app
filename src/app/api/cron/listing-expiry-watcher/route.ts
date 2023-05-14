import { NextRequest } from 'next/server';

import * as http from '@/utils/http/response';

function handler(req: NextRequest) {
  return http.notFound();
}

export { handler as GET, handler as POST };
