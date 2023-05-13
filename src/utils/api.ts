type ErrorPayload = { message: string; [key: string]: any };

const send = async <Body>(path: string, options: RequestInit) => {
  try {
    const response = await fetch(`/api/${path}`, {
      ...options,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        ok: false,
        error: data as ErrorPayload,
      };
    }

    return {
      ok: true,
      data: data as Body,
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        ok: false,
        error: {
          message: error.message,
        },
      };
    }

    return {
      ok: false,
      error: {
        message: 'An unknown error occurred.',
      },
    };
  }
};

export const get = <Body>(
  path: string,
  query: Record<string, any> = {},
  options: Omit<RequestInit, 'method'> = {}
) => {
  return send<Body>(path + '?' + new URLSearchParams(query), {
    method: 'GET',
    ...options,
  });
};

export const post = <Body>(
  path: string,
  data?: Record<string, any>,
  options: Omit<RequestInit, 'method' | 'body'> = {}
) => {
  return send<Body>(path, {
    method: 'POST',
    body: JSON.stringify(data),
    ...options,
  });
};
