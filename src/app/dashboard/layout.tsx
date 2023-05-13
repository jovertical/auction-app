import type { PropsWithChildren } from 'react';

import ActivityFeed from '@/components/dashboard/activity-feed';
import MobileNavigation from '@/components/dashboard/mobile-navigation';
import Navigation from '@/components/dashboard/navigation';
import SearchBar from '@/components/dashboard/search-bar';
import NotificationInterceptor from '@/components/notification-interceptor';

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div>
      <MobileNavigation />

      <Navigation />

      <div className="xl:pl-72">
        <SearchBar />

        <main className="lg:pr-96">{children}</main>

        <ActivityFeed />

        <NotificationInterceptor />
      </div>
    </div>
  );
}
