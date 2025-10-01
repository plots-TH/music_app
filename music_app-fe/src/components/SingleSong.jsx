import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

// Helper: Format duration (seconds to minutes:seconds)
function formatDuration(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${secs}`;
}

// place className="" as a function parameter so context specific styles such as screen size styles can be applied in the return/render
function AudioPreview({ previewUrl, className = "" }) {
  if (!previewUrl)
    return (
      <p className="text-sm italic text-slate-600 dark:text-slate-300">
        No preview available
      </p>
    );
  return (
    <audio
      className={`max-w-full rounded-full border bg-white text-slate-900 [color-scheme:light] dark:border-slate-600 dark:bg-neutral-800 dark:text-slate-100 dark:ring-slate-700 dark:[color-scheme:dark] md:w-72 ${className}`}
      controls
    >
      <source src={previewUrl} type="audio/mpeg" />
      Your browser does not support this audio preview feature.
    </audio>
  );
}

function AddToPersonalPlaylistModal({
  playlists,
  onClose,
  onAddTrack,
  onCreatePlaylist,
}) {
  return (
    <div
      className="modal-overlay fixed inset-0 z-[1000] flex items-center justify-center bg-black/60"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        className="modal w-[90%] max-w-[400px] rounded-lg border border-slate-200 bg-white p-4 shadow dark:border-slate-600 dark:bg-neutral-800"
        style={{
          background: "#fff",
          padding: "1rem",
          borderRadius: "4px",
          width: "90%",
          maxWidth: "400px",
        }}
      >
        <button
          onClick={onClose}
          style={{ float: "right" }}
          className="rounded-md border border-slate-300 bg-white px-3 py-1 text-sm font-medium hover:bg-slate-50 dark:border-slate-600 dark:bg-neutral-700 dark:text-slate-100 dark:hover:bg-neutral-600"
        >
          Close
        </button>
        <h3 className="mb-3 text-lg font-semibold text-slate-900 dark:text-slate-100">
          Add to Personal Playlist
        </h3>
        <button
          onClick={onCreatePlaylist}
          style={{ marginBottom: "1rem" }}
          className="mb-4 inline-flex w-full items-center justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
        >
          Create New Playlist + Add This Track
        </button>
        {playlists && playlists.length > 0 ? (
          <ul className="space-y-2">
            {playlists.map((pl) => (
              <li key={pl.id} style={{ marginBottom: "0.5rem" }}>
                <div className="flex items-center justify-between">
                  <span className="text-slate-800 dark:text-slate-100">
                    {pl.title}
                  </span>
                  <button
                    onClick={() => onAddTrack(pl.id, pl.title)}
                    className="rounded-md border border-slate-300 bg-white px-3 py-1 text-sm font-medium hover:bg-slate-50 dark:border-slate-600 dark:bg-neutral-700 dark:text-slate-100 dark:hover:bg-neutral-600"
                  >
                    Add to Playlist
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-slate-700 dark:text-slate-200">
            You don't have any personal playlists yet.
          </p>
        )}
      </div>
    </div>
  );
}

// Route path="/track/:id"
function SingleSong({ userToken }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const addToPlaylistId = location.state?.addToPlaylistId;
  const addToPlaylistTitle = location.state?.addToPlaylistTitle;

  const [track, setTrack] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [personalPlaylists, setPersonalPlaylists] = useState([]);
  const [loadingPlaylists, setLoadingPlaylists] = useState(false);

  const [successMessage, setSuccessMessage] = useState("");
  const [trackExistsMessage, setTrackExistsMessage] = useState("");

  // Always either do a direct add or open the modal
  const handleAddClick = async () => {
    if (addToPlaylistId) {
      try {
        await handleAddToPlaylist(addToPlaylistId);
        setSuccessMessage(
          `Track added to “${addToPlaylistTitle || "playlist"}”!`,
        );
        setTimeout(() => setSuccessMessage(""), 3000);
      } catch (err) {
        if (err.response?.status === 409) {
          setTrackExistsMessage(
            `This track already belongs to “${addToPlaylistTitle}”.`,
          );
          setTimeout(() => setTrackExistsMessage(""), 3000);
        } else {
          console.error("Error adding track:", err);
        }
      }
    } else {
      // if location.state is empty aka user did not click "add music"
      // button directly from a personal playlist - open the "choose playlist to add track modal"
      setShowModal(true);
    }
  };

  // Fetch track details
  useEffect(() => {
    if (id) {
      axios
        .get(`${import.meta.env.VITE_BACKEND_API_BASE_URL}/track/${id}`)
        .then((res) => {
          setTrack(res.data.track);
          setLoading(false);
          console.log("value of id:", id);
        })
        .catch((err) => {
          console.error("Error fetching full track data:", err);
          setError("Error fetching full track data.");
          setLoading(false);
        });
    }
  }, [id]);

  // useEffect(() => {
  //   if (userToken && id) {
  //     console.log("[SingleSong] user is logged in");
  //   } else {
  //     console.log("[SingleSong] No user Token!");
  //   }
  // }, []);

  // Build the "Add to personal playlist" button content (rendered directly)
  let addTrackToPPMessage = null;
  if (userToken && addToPlaylistId) {
    addTrackToPPMessage = (
      <button
        onClick={handleAddClick}
        className="inline-flex items-center rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-900 shadow-sm hover:bg-slate-50 dark:border-slate-600 dark:bg-neutral-700 dark:text-slate-100 dark:hover:bg-neutral-600"
      >
        Add track directly to your “{addToPlaylistTitle}” playlist
      </button>
    );
  } else if (userToken) {
    addTrackToPPMessage = (
      <button
        onClick={handleAddClick}
        className="inline-flex items-center rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-900 shadow-sm hover:bg-slate-50 dark:border-slate-600 dark:bg-neutral-700 dark:text-slate-100 dark:hover:bg-neutral-600"
      >
        Add track to a personal playlist
      </button>
    );
  }

  // capture the track ID in state so when the user logs in, they can be redirected to the single song page view
  const handleClickSignInToAddTrackToPlaylist = () => {
    navigate("/login", {
      state: {
        trackId: id,
      },
    });
  };

  // If show modal = true, fetch the list of personal playlists for the user
  useEffect(() => {
    if (showModal && userToken) {
      setLoadingPlaylists(true);
      // fetch personal playlists
      axios
        .get(`${import.meta.env.VITE_BACKEND_API_BASE_URL}/personalPlaylists`, {
          headers: { Authorization: `Bearer ${userToken}` },
        })
        .then((res) => {
          setPersonalPlaylists(res.data.personalPlaylists);
        })
        .catch((err) => {
          console.error("Error fetching personal playlists:", err);
          setError(
            "Could not load personal playlists. Please try again later.",
          );
        })
        .finally(() => setLoadingPlaylists(false));
    }
  }, [showModal, userToken]);

  const handleAddToPlaylist = async (playlistId) => {
    try {
      await axios.post(
        `${
          import.meta.env.VITE_BACKEND_API_BASE_URL
        }/personalPlaylists/${playlistId}/tracks`,
        {
          trackId: track.id,
          trackTitle: track.title,
          trackArtist: track.artist.name,
          trackCoverUrl: track.album.cover_medium,
        },
        { headers: { Authorization: `Bearer ${userToken}` } },
      );
      setShowModal(false);
    } catch (err) {
      throw err;
    }
  };

  const handleCreatePlaylistAndAddTrack = () => {
    const title = prompt("Enter a title for your new playlist:");
    if (title) {
      axios
        .post(
          `${import.meta.env.VITE_BACKEND_API_BASE_URL}/personalPlaylists`,
          { title },
          { headers: { Authorization: `Bearer ${userToken}` } },
        )
        .then((res) => {
          const newPlaylistId = res.data.personalPlaylist.id;
          handleAddToPlaylist(newPlaylistId);
        })
        .catch((err) => {
          console.error("Error creating new playlist:", err);
        });
    }
  };

  const handleAddFromModal = async (playlistId, playlistTitle) => {
    try {
      await handleAddToPlaylist(playlistId);
      setSuccessMessage(`Track added to “${playlistTitle}”!`);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      if (err.response?.status === 409) {
        setTrackExistsMessage(`This track is already in “${playlistTitle}”.`);
        setTimeout(() => setTrackExistsMessage(""), 3000);
      } else {
        console.error("Error adding track:", err);
      }
    }
  };

  if (loading)
    return (
      <p className="px-4 py-8 text-slate-700 dark:text-slate-200">
        Loading track details...
      </p>
    );
  if (error)
    return <p className="px-4 py-8 text-red-600 dark:text-red-400">{error}</p>;
  if (!track)
    return (
      <div className="px-4 py-8">
        <p className="text-slate-700 dark:text-slate-200">
          No track data available.
        </p>
        <p className="text-slate-700 dark:text-slate-200">
          Please go back and select a track.
        </p>
      </div>
    );

  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-8 text-slate-900 shadow-sm dark:border dark:border-slate-700 dark:bg-neutral-900 dark:text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-[2fr_1fr]">
        <h2 className="col-span-full text-2xl font-bold leading-tight tracking-tight text-slate-800 dark:text-slate-200 sm:text-3xl md:text-4xl lg:text-5xl">
          {track.title || track.track_title}{" "}
          <span className="text-slate-500 dark:text-slate-500">by</span>{" "}
          <span className="text-slate-500 dark:text-slate-500">
            {track.artist?.name || "Unknown Artist"}
          </span>
        </h2>

        {/* LEFT: Main card with image + actions + audio + meta */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-neutral-800 sm:p-6">
          {/* LEFT/RIGHT: image on the left; on the right, the add button directly above the audio */}
          <div className="flex flex-col items-start gap-4 md:flex-row">
            {track.album?.cover_medium && (
              <img
                className="mt-1 w-36 flex-none self-center rounded-lg ring-1 ring-indigo-500/20 ring-offset-2 ring-offset-white dark:ring-slate-700 dark:ring-offset-neutral-800 md:mt-0 md:w-[150px] md:self-start"
                src={track.album.cover_medium}
                width={150}
                alt="track image"
              />
            )}

            {/* RIGHT COLUMN: button(s) directly above audio */}
            <div className="flex w-full flex-col gap-3 md:mt-12">
              {
                addTrackToPPMessage /* already a <button> with onClick & styles */
              }
              {!userToken && (
                <button
                  className="inline-flex max-w-sm items-center justify-center rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50 dark:border-slate-600 dark:bg-neutral-700 dark:text-slate-100 dark:hover:bg-neutral-600"
                  onClick={handleClickSignInToAddTrackToPlaylist}
                >
                  Sign-in to add this track to your own playlist
                </button>
              )}
              <AudioPreview
                previewUrl={track.preview}
                className="origin-left"
              />
            </div>
          </div>

          {/* Track details */}
          <div className="mt-4 grid grid-cols-1 gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm dark:border-slate-700 dark:bg-neutral-900/50 sm:grid-cols-3">
            <p className="text-slate-700 dark:text-slate-200">
              <span className="font-semibold">Album:</span>{" "}
              {track.album?.title || "Unknown Album"}
            </p>
            <p className="text-slate-700 dark:text-slate-200">
              <span className="font-semibold">Duration:</span>{" "}
              {track.duration ? formatDuration(track.duration) : "N/A"}
            </p>
            <p className="text-slate-700 dark:text-slate-200">
              <span className="font-semibold">Rank:</span> {track.rank || "N/A"}
            </p>
          </div>
        </div>

        {/* RIGHT: Actions/links card */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-neutral-800 sm:p-6">
          <div className="space-y-3">
            {track.link ? (
              <a
                href={track.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-slate-300 bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-500 dark:border dark:border-slate-600 dark:bg-purple-600 dark:hover:bg-purple-500"
              >
                Listen on Deezer
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="h-5 w-5"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                  />
                </svg>
              </a>
            ) : (
              <p className="text-slate-700 dark:text-slate-200">
                Link not available
              </p>
            )}

            {track.album?.link ? (
              <a
                href={track.album.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-slate-300 bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-purple-500 dark:border-slate-600 dark:bg-purple-600 dark:text-slate-100 dark:hover:bg-purple-500"
              >
                Check out the album
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="h-5 w-5"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                  />
                </svg>
              </a>
            ) : (
              <span className="block text-slate-700 dark:text-slate-200">
                Album link not available
              </span>
            )}
          </div>
        </div>

        {/* Messages */}
        {successMessage && (
          <div className="col-span-full rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-800 dark:border-emerald-900/40 dark:bg-emerald-900/30 dark:text-emerald-200">
            {successMessage}
          </div>
        )}
        {trackExistsMessage && (
          <div className="col-span-full rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-amber-800 dark:border-amber-900/40 dark:bg-amber-900/30 dark:text-amber-200">
            {trackExistsMessage}
          </div>
        )}
      </div>

      {/* Modal */}
      {!addToPlaylistId && showModal && (
        <AddToPersonalPlaylistModal
          playlists={personalPlaylists}
          onClose={() => {
            setShowModal(false);
            setSuccessMessage("");
            setTrackExistsMessage("");
          }}
          onAddTrack={handleAddFromModal}
          onCreatePlaylist={handleCreatePlaylistAndAddTrack}
        />
      )}

      {/* Loading playlists indicator */}
      {loadingPlaylists && (
        <p className="mx-auto mt-4 max-w-6xl text-sm text-slate-600 dark:text-slate-300">
          Loading your playlists...
        </p>
      )}
    </div>
  );
}

export default SingleSong;
