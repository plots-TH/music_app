import React from "react";

function PublicPlaylistCard({ publicPlaylist }) {
  return (
    <div className="personal-playlist-card">
      <h2>{publicPlaylist.title}</h2>

      {/* show 1st track cover. if 0 tracks, dont render image tag */}
      {publicPlaylist.cover_url && (
        <img
          src={publicPlaylist.cover_url}
          alt={publicPlaylist.title}
          style={{ width: 120, height: 120, objectFit: "cover" }}
        />
      )}

      {publicPlaylist.description && <p>{publicPlaylist.description}</p>}
    </div>
  );
}

export default PublicPlaylistCard;
