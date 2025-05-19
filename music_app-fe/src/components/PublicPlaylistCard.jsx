import React from "react";
import { Link, useNavigate } from "react-router-dom";

function PublicPlaylistCard({ publicPlaylist }) {
  return (
    <div className="personal-playlist-card">
      <h2>{publicPlaylist.title}</h2>

      {/* show 1st track cover. if 0 tracks, dont render image tag */}
      {publicPlaylist.tracks.length > 0 && (
        <img
          src={publicPlaylist.cover_url}
          alt={publicPlaylist.title}
          style={{ width: 120, height: 120, objectFit: "cover" }}
        />
      )}

      {publicPlaylist.description && <p>{publicPlaylist.description}</p>}

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
