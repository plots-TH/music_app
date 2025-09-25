import React, { useEffect, useState } from "react";
import axios from "axios";
import TagCardList from "./TagCardList";

function DropDownMenu({ children }) {
  // state for menu visibility
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropDown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      <button
        className="mx-auto mb-2 mt-4 inline-flex items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-900 shadow-sm hover:bg-slate-50 dark:border-slate-600 dark:bg-neutral-700 dark:text-slate-100 dark:hover:bg-neutral-600"
        onClick={toggleDropDown}
      >
        Filter by Tags
      </button>
      {isOpen && (
        // Tailwind styling for the tag filter modal
        <div className="absolute z-10 mt-2 w-72 rounded-lg border bg-slate-100 p-3 shadow-lg">
          <div className="max-h-64 space-x-2 space-y-2 overflow-y-auto">
            <span className="underline underline-offset-8">
              Filter playlists by toggling tags
            </span>
            {children}
          </div>
        </div>
      )}
    </div>
  );
}

export default DropDownMenu;
