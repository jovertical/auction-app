import { ComponentPropsWithoutRef } from 'react';

export default function Logo(props: ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M4.14556 4L15.6001 15.5377C16.1418 16.0833 16.1394 16.9686 15.5949 17.5111L4.03847 29.0303L0 24.8783L7.31415 17.5111C7.85376 16.9675 7.85376 16.0865 7.31415 15.5429L0 8.17567L4.14556 4Z"
        fill="#2563eb"
      />

      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M16.1924 4L27.647 15.5377C28.1886 16.0833 28.1862 16.9686 27.6418 17.5111L16.0853 29.0303L12.0469 24.8783L19.361 17.5111C19.9006 16.9675 19.9006 16.0865 19.361 15.5429L12.0469 8.17567L16.1924 4Z"
        fill="#93c5fd"
      />
    </svg>
  );
}
