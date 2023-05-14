import { SessionProvider } from 'next-auth/react';

export default function withSessionProvider<Props extends {}>(
  Component: React.FC<Props>
) {
  return function WrappedComponent(props: Props) {
    return (
      <SessionProvider>
        <Component {...props} />
      </SessionProvider>
    );
  };
}
