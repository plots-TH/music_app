import React from "react";
import CategoryPlaylistCard from "./CategoryPlaylistCard";

function CategoryPlaylistCardList({ playlists, addToPlaylistId }) {
  return (
    <div className="category-playlist-card-list">
      {playlists.map((playlist) => (
        <CategoryPlaylistCard
          key={playlist.id}
          playlist={playlist}
          addToPlaylistId={addToPlaylistId}
        />
      ))}
    </div>
  );
}

export default CategoryPlaylistCardList;
