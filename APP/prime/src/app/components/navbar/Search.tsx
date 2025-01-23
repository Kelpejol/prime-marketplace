import { Search } from "lucide-react";

export default function SearchInput() {
  return (
    <div className="relative w-full">
   <input
        type="text"
        placeholder="Search"
        className="w-full h-12 lg:h-14 pl-4 pr-14 rounded-full border-2 shadow-md border-gray-300 focus:outline-none focus:border-rose-500 transition-colors"
      />
      <button
        type="submit"
        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-rose-500 rounded-full text-white hover:bg-rose-600 transition-colors"
      >
        <Search className="h-4 w-4" />
      </button>
    </div>
  );
}