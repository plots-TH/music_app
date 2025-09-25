import React from "react";

const TagCard = ({ name, active, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center rounded-full border px-3 py-1 text-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
        active
          ? "aria-pressed border-brand-600 bg-brand-600 text-white shadow-sm hover:-translate-y-0.5"
          : "border-gray-300 bg-white text-gray-700 hover:-translate-y-0.5 hover:bg-gray-100"
      }`}
    >
      {name}
    </button>
  );
};

export default TagCard;
