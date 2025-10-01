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
        }`,
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
      <h2 className="mb-6 mt-6 text-center text-xl font-semibold text-slate-800 dark:text-slate-200 sm:text-2xl">
        {playlist.title || playlist.name}
      </h2>
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-neutral-900 sm:p-6">
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {tracksWithPreviews.map((track) => (
            <li key={track.id}>
              <Link
                to={`/track/${track.id}`}
                state={{ track, addToPlaylistId, addToPlaylistTitle }}
                className="group block rounded-lg border border-slate-200 bg-white p-3 shadow-sm transition hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-500 dark:bg-gray-700"
                aria-label={`${track.title} by ${track.artist?.name}`}
              >
                {/* Deezer's album cover can be accessed via track.album.cover or cover_medium */}
                {track.album.cover_medium && (
                  <img
                    src={track.album?.cover_medium || track.album?.cover}
                    alt={track.title}
                    className="aspect-square w-full rounded-md border border-slate-200 object-cover dark:border-slate-600"
                    loading="lazy"
                  />
                )}
                <span className="mb-2 block truncate text-center text-sm font-medium text-slate-800 [overflow-wrap:anywhere] dark:text-slate-100">
                  {track.title} - {track.artist?.name}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default SinglePlaylist;
