import React from 'react';

const FilterBar = () => {
  return (
    <div className="bg-white border-y border-neutral-200 px-4 py-4">
      <div className="max-w-screen-xl mx-auto flex flex-wrap gap-6 text-sm font-medium text-neutral-600 items-center">
        <span className="cursor-pointer hover:text-primary transition-colors">Repositories</span>
        <span className="text-neutral-300">|</span>
        <span className="cursor-pointer hover:text-primary transition-colors">Topics</span>
        <span className="text-neutral-300">|</span>
        <span className="cursor-pointer hover:text-primary transition-colors">Users</span>

        <div className="ml-auto cursor-pointer flex items-center gap-1 hover:text-primary transition-colors">
          Sort ▾
        </div>
      </div>
    </div>
  );
};

export default FilterBar;