import React from "react";
import { Link } from "react-router-dom";

function CategoryPlaylistCard({ playlist }) {
  // receives a playlist from parent: CategoryPlaylistCardList
  console.log("Playlist:", playlist);
  return (
    <Link
      to="/playlist"
      state={{ playlist }}
      className="category-playlist-card"
    >
      <span>{playlist.name}</span>
      <img src={playlist.images[0].url} alt={playlist.name} />
    </Link>
  );
}

export default CategoryPlaylistCard;
