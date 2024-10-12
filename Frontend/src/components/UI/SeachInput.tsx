import React, { useCallback } from "react";
import { GoSearch } from "react-icons/go";
import { IoMdClose } from "react-icons/io";

interface SearchInputProps {
  search: string;
  setSearch: (search: string) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({ search, setSearch }) => {
  const handleClear = useCallback(() => {
    setSearch("");
  }, []);

  return (
    <div className="relative w-64 dark:bg-[#363636] rounded-lg px-4 py-2 flex items-center gap-2">
      {!search && <GoSearch className={`text-2xl text-gray-500 `} />}

      <input
        type="search"
        id="Search"
        className="w-full bg-transparent text-base outline-none "
        placeholder="Search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {search && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 text-xl text-gray-500 hover:text-gray-400"
        >
          <IoMdClose />
        </button>
      )}
    </div>
  );
};

export default SearchInput;
