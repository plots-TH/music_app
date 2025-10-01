import React from "react";
import { Link } from "react-router-dom";

function CategoryPlaylistCard({
  playlist,
  addToPlaylistId,
  addToPlaylistTitle,
}) {
  console.log(
    "Playlist:",
    playlist,
    "AddToPlaylistId:",
    addToPlaylistId,
    "AddToPlaylistTitle:",
    addToPlaylistTitle,
  );
  return (
    <Link
      to="/playlist"
      state={{ playlist, addToPlaylistId, addToPlaylistTitle }}
      className="group block rounded-lg border border-slate-200 bg-white p-3 shadow-sm transition hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-500 dark:bg-gray-700"
    >
      <span className="mb-2 block truncate text-center text-sm font-medium text-slate-800 [overflow-wrap:anywhere] dark:text-slate-100">
        {playlist.title}
      </span>
      {/* Use playlist.picture_medium or playlist.picture if available */}
      <img
        src={playlist.picture_medium || playlist.picture}
        alt={playlist.title}
        className="aspect-square w-full rounded-md border border-slate-200 object-cover dark:border-slate-600"
      />
    </Link>
  );
}

export default CategoryPlaylistCard;
