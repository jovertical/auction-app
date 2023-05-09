import ListSortMenu from '@/components/dashboard/home/list-sort-menu';

export default function ListHeader() {
  return (
    <header className="flex items-center justify-between border-b border-white/5 px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
      <h1 className="text-base font-semibold leading-7 text-white">Listings</h1>

      <ListSortMenu />
    </header>
  );
}
