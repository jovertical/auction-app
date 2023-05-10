const send = async (path: string, options: RequestInit) => {
  try {
    const response = await fetch(`/api/${path}`, {
      ...options,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error('Something went wrong.');
    }

    const data = await response.json();

    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    }
  }
};

export const get = <T>(
  path: string,
  query: Record<string, any> = {},
  options: Omit<RequestInit, 'method'> = {}
) => {
  return send(path + '?' + new URLSearchParams(query), {
    method: 'GET',
    ...options,
  });
};

export const post = (
  path: string,
  data: Record<string, any>,
  options: Omit<RequestInit, 'method' | 'body'> = {}
) => {
  return send(path, {
    method: 'POST',
    body: JSON.stringify(data),
    ...options,
  });
};
