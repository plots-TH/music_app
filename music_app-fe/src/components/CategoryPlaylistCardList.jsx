// displays the list of playlist cards belonging to the selected music category.
import React from "react";
import CategoryPlaylistCard from "./CategoryPlaylistCard";

function CategoryPlaylistCardList({ playlists }) {
  // receives "playlists" array from parent: CategoryPlaylist
  // maps through "playlists". For each playlist, display a CategoryPlayListCard
  return (
    <div className="category-playlist-card-list">
      {playlists.map((playlist) => (
        <CategoryPlaylistCard key={playlist.id} playlist={playlist} /> // passes playlist object to CategoryPlaylistCard
      ))}
    </div>
  );
}

export default CategoryPlaylistCardList;
