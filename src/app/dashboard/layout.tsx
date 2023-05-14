import ActivityFeed from '@/components/dashboard/activity-feed';
import Header from '@/components/dashboard/header';
import MobileNavigation from '@/components/dashboard/mobile-navigation';
import Navigation from '@/components/dashboard/navigation';
import NotificationInterceptor from '@/components/notification-interceptor';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <MobileNavigation />

      <Navigation />

      <div className="xl:pl-72">
        <Header />

        <main className="lg:pr-96">{children}</main>

        <ActivityFeed />

        <NotificationInterceptor />
      </div>
    </div>
  );
}
