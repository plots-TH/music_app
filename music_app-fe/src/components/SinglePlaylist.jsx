import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";

function SinglePlaylist() {
  const location = useLocation();
  const { playlist } = location.state; // get the playlist passed through state from parent: CategoryPlaylistCard
  const [tracks, setTracks] = useState([]);
  const accessToken = import.meta.env.VITE_SPOTIFY_TOKEN;

  useEffect(() => {
    axios(
      `${import.meta.env.VITE_API_BASE_URL}/v1/playlists/${playlist.id}/tracks`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )
      .then((res) => {
        setTracks(res.data.items);
      })
      .catch((err) => {
        console.error("Error fetching tracks:", err);
      });
  }, [playlist.id, accessToken]);

  return (
    <div>
      <h2>{playlist.name}</h2>
      <ul className="track-list">
        {tracks.map(({ track }) => (
          <li key={track.id}>
            <Link to={`/track/${track.id}`} state={{ track }}>
              <img src={track.album.images[0]?.url} alt={track.name} />
              <span>
                {track.name} - {track.artists.map((a) => a.name).join(", ")}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SinglePlaylist;
