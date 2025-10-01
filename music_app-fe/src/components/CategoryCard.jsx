import React from "react";
import { Link } from "react-router-dom";

function CategoryCard({ category, addToPlaylistId, addToPlaylistTitle }) {
  return (
    <Link
      to={`/category/${category.id}`}
      state={{ name: category.name, addToPlaylistId, addToPlaylistTitle }}
      className="group block rounded-lg border border-slate-200 bg-white p-3 shadow-sm transition hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-neutral-800"
    >
      <span className="mb-2 block truncate text-center text-sm font-medium text-slate-800 [overflow-wrap:anywhere] dark:text-slate-100">
        {category.name}
      </span>
      {/* For Deezer genres, use category.picture */}
      <img
        src={category.picture}
        alt={category.name}
        className="aspect-square w-full rounded-md border border-slate-200 object-cover dark:border-slate-600"
      />
    </Link>
  );
}

export default CategoryCard;
