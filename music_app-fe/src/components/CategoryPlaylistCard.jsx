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
      className="category-playlist-card"
    >
      <span>{playlist.title}</span>
      {/* Use playlist.picture_medium or playlist.picture if available */}

      <img
        src={playlist.picture_medium || playlist.picture}
        alt={playlist.title}
      />
    </Link>
  );
}

export default CategoryPlaylistCard;
