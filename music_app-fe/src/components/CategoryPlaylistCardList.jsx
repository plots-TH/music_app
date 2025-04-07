import React from "react";
import CategoryPlaylistCard from "./CategoryPlaylistCard";

function CategoryPlaylistCardList({ playlists }) {
  return (
    <div className="category-playlist-card-list">
      {playlists.map((playlist) => (
        <CategoryPlaylistCard key={playlist.id} playlist={playlist} />
      ))}
    </div>
  );
}

export default CategoryPlaylistCardList;
