import React from "react";
import CategoryPlaylistCard from "./CategoryPlaylistCard";

function CategoryPlaylistCardList({
  playlists,
  addToPlaylistId,
  addToPlaylistTitle,
}) {
  return (
    <div className="category-playlist-card-list">
      {playlists.map((playlist) => (
        <CategoryPlaylistCard
          key={playlist.id}
          playlist={playlist}
          addToPlaylistId={addToPlaylistId}
          addToPlaylistTitle={addToPlaylistTitle}
        />
      ))}
    </div>
  );
}

export default CategoryPlaylistCardList;
