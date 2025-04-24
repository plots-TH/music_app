import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";

// Route path="/playlist"
function SinglePlaylist() {
  const { state } = useLocation();
  const { playlist, addToPlaylistId, addToPlaylistTitle } = state || {}; // get the playlist passed through state from parent: CategoryPlaylistCard
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    // For Deezer, the endpoint to get playlist details (including tracks) is:
    // GET https://api.deezer.com/playlist/{playlist_id}
    // We proxy this request through our backend to avoid CORS issues:
    axios
      .get(
        `${import.meta.env.VITE_BACKEND_API_BASE_URL}/deezer/playlist/${
          playlist.id
        }`
      )
      .then((res) => {
        // Deezer returns tracks data inside res.data.tracks.data
        if (res.data && res.data.tracks && res.data.tracks.data) {
          setTracks(res.data.tracks.data);
        } else {
          console.error("No tracks data found in response:", res.data);
        }
      })
      .catch((err) => {
        console.error("Error fetching tracks:", err);
      });
  }, [playlist.id]);

  // For Deezer, each track has a 'preview' field for the 30-second clip.
  // Filter to only include tracks that have a preview.
  const tracksWithPreviews = tracks.filter((track) => track.preview);

  return (
    <div>
      <h2>{playlist.title || playlist.name}</h2>
      <ul className="track-list">
        {tracksWithPreviews.map((track) => (
          <li key={track.id}>
            <Link
              to={`/track/${track.id}`}
              state={{ track, addToPlaylistId, addToPlaylistTitle }}
            >
              {/* Deezer's album cover can be accessed via track.album.cover or cover_medium */}
              {track.album.cover_medium && (
                <img
                  src={track.album?.cover_medium || track.album?.cover}
                  alt={track.title}
                />
              )}
              <span>
                {track.title} - {track.artist?.name}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SinglePlaylist;
