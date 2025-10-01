import React from "react";
import CategoryPlaylistCard from "./CategoryPlaylistCard";

function CategoryPlaylistCardList({
  playlists,
  addToPlaylistId,
  addToPlaylistTitle,
  onUpdateDescription,
}) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
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
