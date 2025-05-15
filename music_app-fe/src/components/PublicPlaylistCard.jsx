import React from "react";

function PublicPlaylistCard({ publicPlaylist }) {
  return (
    <div className="personal-playlist-card">
      <h2>{publicPlaylist.title}</h2>
    </div>
  );
}

export default PublicPlaylistCard;
