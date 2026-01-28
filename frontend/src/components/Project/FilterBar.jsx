import React from 'react';
import { Search } from 'lucide-react';

const FilterBar = ({ filters, setFilters }) => {
  const handleSearchChange = (e) => {
    setFilters((prev) => ({ ...prev, search: e.target.value }));
  };

  const handleSortChange = (e) => {
    setFilters((prev) => ({ ...prev, sort: e.target.value }));
  };

  const handleTagChange = (tag) => {
    setFilters((prev) => ({ ...prev, tag: tag === 'All' ? '' : tag }));
  };

  const tags = ['All', 'Web', 'Android', 'AI/ML', 'Blockchain'];

  return (
    <div className="bg-white border-y border-neutral-200 px-4 py-4 sticky top-[73px] z-40 shadow-sm">
      <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row gap-4 items-center justify-between">

        {/* Search Bar */}
        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-5 h-5 text-neutral-400" />
          </div>
          <input
            type="text"
            className="bg-neutral-50 border border-neutral-300 text-neutral-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full pl-10 p-2.5 transition-shadow outline-none"
            placeholder="Search projects..."
            value={filters.search}
            onChange={handleSearchChange}
          />
        </div>

        {/* Filters & Sort */}
        <div className="flex flex-wrap gap-4 items-center w-full md:w-auto">
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
            {tags.map(tag => (
              <button
                key={tag}
                onClick={() => handleTagChange(tag)}
                className={`px-3 py-1.5 text-sm font-medium rounded-full transition-colors whitespace-nowrap ${(filters.tag === tag || (tag === 'All' && !filters.tag))
                    ? 'bg-primary text-white'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  }`}
              >
                {tag}
              </button>
            ))}
          </div>

          <div className="h-6 w-px bg-neutral-300 hidden md:block"></div>

          <select
            onChange={handleSortChange}
            className="bg-white border border-neutral-300 text-neutral-700 text-sm rounded-lg focus:ring-primary focus:border-primary p-2.5 outline-none cursor-pointer"
          >
            <option value="">Sort by: Newest</option>
            <option value="oldest">Oldest</option>
            <option value="price_low">Price: Low to High</option>
            <option value="price_high">Price: High to Low</option>
            <option value="stars">Most Stars</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;