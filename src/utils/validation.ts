import { z } from 'zod';

export const validate = <
  Data extends { [key: string]: any },
  Shape extends z.ZodRawShape
>(
  data: Data,
  callback: (schema: typeof z) => Shape
) => {
  const schema = z.object(callback(z));

  return schema.parse(data);
};
