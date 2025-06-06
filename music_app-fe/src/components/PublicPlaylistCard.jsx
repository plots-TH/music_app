import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function PublicPlaylistCard({
  publicPlaylist,
  onClonePlaylist,
  userToken,
  justClonedId,
}) {
  return (
    <div className="personal-playlist-card">
      <h2>{publicPlaylist.title}</h2>

      {/* render the playlist creator's username */}
      <div>
        <p>playlist created by {publicPlaylist.creator}</p>
      </div>

      {publicPlaylist.description && <p>{publicPlaylist.description}</p>}

      {/* show 1st track cover. if 0 tracks, dont render image tag */}
      {publicPlaylist.tracks.length > 0 && (
        <img
          src={publicPlaylist.cover_url}
          alt={publicPlaylist.title}
          style={{ width: 120, height: 120, objectFit: "cover" }}
        />
      )}

      {/* add line break to temporarily position the copy playlist button below the cover img */}
      <br />
      {/* add ternary operator to conditionally hide this button if playlist belongs to user already. */}
      <button onClick={() => onClonePlaylist(publicPlaylist.id, userToken)}>
        Copy & Add to your collection
      </button>

      {/* show success message only when Id's match */}
      {publicPlaylist.id === justClonedId && (
        <div className="clone-success-message">
          <p>Playlist cloned successfully!</p>
        </div>
      )}

      <div>
        {publicPlaylist.tracks &&
          publicPlaylist.tracks.map((track) => (
            <div key={track.track_id}>
              <Link to={`/track/${track.track_id}`}>
                <strong>{track.track_title}</strong> by {track.track_artist}
              </Link>
            </div>
          ))}
      </div>
    </div>
  );
}

export default PublicPlaylistCard;
