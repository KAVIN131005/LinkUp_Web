import { useState } from "react";
import { Search, X } from "lucide-react";

export default function MessageSearchBar({ channelId, onSearch, onClose }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim() && channelId) {
      // Simulate search - Stream Chat handles this client-side
      onSearch?.(value);
    }
  };

  return (
    <div className="bg-white p-3 border-b border-gray-200 sticky top-0 z-10">
      <div className="flex gap-2 items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="🔍 Search messages..."
            value={query}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setResults([]);
            }}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {results.length > 0 && (
        <div className="mt-3 max-h-40 overflow-y-auto">
          <p className="text-xs text-gray-500 mb-2">Found {results.length} results</p>
          {results.map((msg, idx) => (
            <div
              key={idx}
              className="p-2 bg-gray-50 rounded mb-1 text-sm hover:bg-gray-100 cursor-pointer"
            >
              <p className="font-semibold text-xs text-gray-600">{msg.sender}</p>
              <p className="text-xs text-gray-700 truncate">{msg.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
