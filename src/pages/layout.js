import { SearchBar, Sidebar } from "../components"

export default function AdminLayout({ children, hidden }) {
  return (
      <div className="flex container gap-4">
        <Sidebar />
        <main className="w-full">
          <SearchBar hidden={hidden} />
          {children}
        </main>
      </div>
  );
}
