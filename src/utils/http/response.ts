import { NextResponse } from 'next/server';

// Polyfill for the serialization of prisma objects issue as detailed here: https://github.com/prisma/studio/issues/614
// @ts-ignore
BigInt.prototype.toJSON = function (): number {
  return Number(this);
};

export const unauthorized = (message = 'Unauthorized.') => {
  return NextResponse.json({ message, code: 401 }, { status: 401 });
};

export const forbidden = (message = 'Forbidden.') => {
  return NextResponse.json({ message, code: 403 }, { status: 403 });
};

export const inputError = (errors: any) => {
  return NextResponse.json(
    { message: 'Invalid data provided.', errors },
    { status: 422 }
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
