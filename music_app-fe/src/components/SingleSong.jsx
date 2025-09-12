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
    return <p className="text-sm italic text-gray-600">No preview available</p>;
  return (
    <audio className={`max-w-full rounded-full shadow ${className}`} controls>
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
      className="modal-overlay"
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
        className="modal"
        style={{
          background: "#fff",
          padding: "1rem",
          borderRadius: "4px",
          width: "90%",
          maxWidth: "400px",
        }}
      >
        <button onClick={onClose} style={{ float: "right" }}>
          Close
        </button>
        <h3>Add to Personal Playlist</h3>
        <button onClick={onCreatePlaylist} style={{ marginBottom: "1rem" }}>
          Create New Playlist + Add This Track
        </button>
        {playlists && playlists.length > 0 ? (
          <ul>
            {playlists.map((pl) => (
              <li key={pl.id} style={{ marginBottom: "0.5rem" }}>
                {pl.title}{" "}
                <button onClick={() => onAddTrack(pl.id, pl.title)}>
                  Add to Playlist
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>You don't have any personal playlists yet.</p>
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

  let addTrackToPPMessage;
  if (userToken && addToPlaylistId) {
    addTrackToPPMessage = `Add track directly to your “${addToPlaylistTitle}” playlist`;
  } else if (userToken && !addToPlaylistId) {
    addTrackToPPMessage = "Add track to a personal playlist";
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

  if (loading) return <p>Loading track details...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!track)
    return (
      <div>
        <p>No track data available.</p>
        <p>Please go back and select a track.</p>
      </div>
    );

  return (
    <div className="mt-14 grid grid-cols-1 gap-4 border border-black md:grid-cols-[2fr_1fr]">
      <h2 className="col-span-2 text-7xl">
        {track.title || track.track_title} by{" "}
        {track.artist?.name || "Unknown Artist"}
      </h2>
      <div className="bg-blue-200 p-4">
        <div className="flex flex-col items-start gap-4 md:flex-row">
          {track.album?.cover_medium && (
            <img
              className="mt-3 flex-none rounded-lg ring-2 ring-orange-300 ring-offset-2 md:w-[150px] lg:max-w-full"
              src={track.album.cover_medium}
              width={150}
              alt="track image"
            />
          )}
          <AudioPreview
            className="md:mt-28 md:self-auto"
            previewUrl={track.preview}
          />
        </div>
        <div className="mt-2 rounded-lg border border-black">
          <p className="">Album: {track.album?.title || "Unknown Album"}</p>
          <h3>Rank: {track.rank || "N/A"}</h3>
          <h3>
            Duration: {track.duration ? formatDuration(track.duration) : "N/A"}
          </h3>
        </div>
      </div>

      <div className="bg-green-200 p-4">
        <div className="border border-black">
          {track.link ? (
            <a
              href={track.link}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              Listen on Deezer
            </a>
          ) : (
            <p>Link not available</p>
          )}
          <br />
          {track.album?.link ? (
            <a
              href={track.album.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              Check out the album
            </a>
          ) : (
            <span>Album link not available</span>
          )}
        </div>
      </div>

      <br />

      {successMessage && <div>{successMessage}</div>}
      {trackExistsMessage && (
        <div style={{ color: "orange" }}>{trackExistsMessage}</div>
      )}

      <button onClick={handleAddClick}>
        {/* if they are NOT logged in, ask them to log in first */}
        {addTrackToPPMessage}
      </button>
      <button onClick={handleClickSignInToAddTrackToPlaylist}>
        {!userToken ? `Sign-in to add this track to your own playlist` : ``}
      </button>

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

      {loadingPlaylists && <p>Loading your playlists...</p>}
    </div>
  );
}

export default SingleSong;
