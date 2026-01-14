import React, { useState } from "react";

interface SearchInputProps {
  placeholder: string;
  onSearch: (keyword: string) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({ placeholder, onSearch }) => {
  const [keyword, setKeyword] = useState("");

  const handleSearch = () => {
    onSearch(keyword.trim());
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder={placeholder}
        className="px-3 py-2 border border-gray-300 rounded-md w-64"
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
      />
      <button
        onClick={handleSearch}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        查询
      </button>
    </div>
  );
};

export default SearchInput;
