import React from "react";
import CategoryPlaylistCard from "./CategoryPlaylistCard";

function CategoryPlaylistCardList({
  playlists,
  addToPlaylistId,
  addToPlaylistTitle,
  onUpdateDescription,
}) {
  return (
    <div className="category-playlist-card-list">
      {playlists.map((playlist) => (
        <CategoryPlaylistCard
          key={playlist.id}
          playlist={playlist}
          addToPlaylistId={addToPlaylistId}
          addToPlaylistTitle={addToPlaylistTitle}
          onUpdateDescription={onUpdateDescription}
        />
      ))}
    </div>
  );
}

export default CategoryPlaylistCardList;
