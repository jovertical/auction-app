import { NextResponse } from 'next/server';

export const unauthorized = () => {
  return NextResponse.json(
    { message: 'Unauthorized.', code: 401 },
    { status: 401 }
  );
};
