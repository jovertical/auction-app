import './globals.css';

export const metadata = {
  title: 'Jitera Auctions',
  description: 'Auction app built with Next.js, Prisma & Postgres',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full bg-gray-900">
      <body className="h-full">{children}</body>
    </html>
  );
}
