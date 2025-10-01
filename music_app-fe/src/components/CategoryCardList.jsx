import React from "react";
import { Link } from "react-router-dom";

function CategoryCardList({
  categories,
  addToPlaylistId,
  addToPlaylistTitle,
  loading,
}) {
  if (loading) {
    return (
      <div className="flex items-center justify-center rounded-lg border border-slate-200 bg-white p-8 text-slate-600 dark:border-slate-700 dark:bg-neutral-900 dark:text-slate-300">
        Loading Categories...
      </div>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-lg border border-slate-200 bg-white p-8 text-slate-600 dark:border-slate-700 dark:bg-neutral-900 dark:text-slate-300">
        No music categories found.
      </div>
    );
  }

  return (
    <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
      {categories.map((category) => {
        const imgSrc = category.picture_medium || category.picture || "";
        return (
          <li key={category.id}>
            <Link
              to={`/category/${category.id}`}
              state={{ addToPlaylistId, addToPlaylistTitle }}
              className="group block rounded-lg border border-slate-200 bg-white p-3 shadow-sm transition hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-500 dark:bg-gray-700"
              aria-label={`Browse ${category.name} playlists`}
            >
              <div className="aspect-square overflow-hidden rounded-md border border-slate-200 bg-slate-50 dark:border-slate-600 dark:bg-neutral-700">
                {imgSrc ? (
                  <img
                    src={imgSrc}
                    alt={category.name}
                    className="h-full w-full object-cover transition-transform duration-150 group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-slate-400 dark:text-slate-500">
                    No image
                  </div>
                )}
              </div>
              <span className="mt-2 block truncate text-center text-sm font-medium text-slate-800 [overflow-wrap:anywhere] dark:text-slate-100">
                {category.name}
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export default CategoryCardList;
