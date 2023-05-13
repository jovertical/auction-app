import { NextResponse } from 'next/server';

// Polyfill for the serialization of prisma objects issue as detailed here: https://github.com/prisma/studio/issues/614
// @ts-ignore
BigInt.prototype.toJSON = function (): number {
  return Number(this);
};

export const unauthorized = () => {
  return NextResponse.json(
    { message: 'Unauthorized.', code: 401 },
    { status: 401 }
  );
};

export const notFound = () => {
  return NextResponse.json(
    { message: 'Not found.', code: 404 },
    { status: 404 }
  );
};

export const json = (data: any, options?: ResponseInit) => {
  return NextResponse.json(data, options);
};
