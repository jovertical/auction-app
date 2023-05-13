import {
  HomeIcon,
  ScaleIcon,
  TicketIcon,
  Square3Stack3DIcon,
  Cog8ToothIcon,
} from '@heroicons/react/24/outline';

// prettier-ignore
export const links = [
  { name: 'Home', href: '/dashboard', icon: HomeIcon},
  { name: 'Market', href: '/dashboard/live', icon: ScaleIcon },
  { name: 'My Bids', href: '/dashboard/my/bids', icon: TicketIcon },
  { name: 'My Listings', href: '/dashboard/my/listing', icon: Square3Stack3DIcon },
  { name: 'Settings', href: '/dashboard/settings', icon: Cog8ToothIcon },
];
