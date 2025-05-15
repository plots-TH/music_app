import React from "react";
import PublicPlaylistCard from "./publicPlaylistCard";

function PublicPlaylistCardList({ publicPlaylists }) {
  console.log(
    "displayed public playlists - logging from inside card list:",
    publicPlaylists
  );
  return (
    <div className="category-playlist-card-list">
      {publicPlaylists.map((publicPlaylist) => (
        <PublicPlaylistCard
          key={publicPlaylist.id}
          publicPlaylist={publicPlaylist}
        />
      ))}
    </div>
  );
}

export default PublicPlaylistCardList;
