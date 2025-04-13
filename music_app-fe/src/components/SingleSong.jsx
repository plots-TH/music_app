import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";

// -------------------- Helper function --------------------------
// Deezer returns duration in seconds, so format it as minutes:seconds.
function formatDuration(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${secs}`;
}
// ------------------ End Helper function -----------------------

// AudioPreview component for playing a 30-second preview.
function AudioPreview({ previewUrl }) {
  if (!previewUrl) {
    return <p>No preview available</p>;
  }
  return (
    <audio controls>
      <source src={previewUrl} type="audio/mpeg" />
      Your browser does not support this audio preview feature.
    </audio>
  );
}

// Modal component to display a pop-up for adding a track to a personal playlist.
function AddToPersonalPlaylistModal({
  playlists,
  onClose,
  onAddTrack,
  onCreatePlaylist,
}) {
  return (
    // You may add CSS for "modal-overlay" and "modal" to style the popup
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
          Create New Playlist
        </button>
        {playlists && playlists.length > 0 ? (
          <ul>
            {playlists.map((pl) => (
              <li key={pl.id} style={{ marginBottom: "0.5rem" }}>
                {pl.title}{" "}
                <button onClick={() => onAddTrack(pl.id)}>
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

function SingleSong({ userToken }) {
  const location = useLocation();
  const { track } = location.state;
  console.log("SingleSong track data:", track);

  // State for controlling the modal visibility, playlist data, and any errors.
  const [showModal, setShowModal] = useState(false);
  const [personalPlaylists, setPersonalPlaylists] = useState([]);
  const [loadingPlaylists, setLoadingPlaylists] = useState(false);
  const [error, setError] = useState(null);

  // When the modal opens, fetch the user's personal playlists from the backend.
  useEffect(() => {
    if (showModal && userToken) {
      setLoadingPlaylists(true);
      axios
        .get(`${import.meta.env.VITE_BACKEND_API_BASE_URL}/personalPlaylists`, {
          headers: { Authorization: `Bearer ${userToken}` },
        })
        .then((res) => {
          setPersonalPlaylists(res.data.personalPlaylists);
          setLoadingPlaylists(false);
        })
        .catch((err) => {
          console.error("Error fetching personal playlists:", err);
          setError(
            "Could not load personal playlists. Please try again later."
          );
          setLoadingPlaylists(false);
        });
    }
  }, [showModal, userToken]);

  // Function to add the current track to an existing personal playlist.
  const handleAddToPlaylist = (playlistId) => {
    axios
      .post(
        `${
          import.meta.env.VITE_BACKEND_API_BASE_URL
        }/personalPlaylists/${playlistId}/tracks`,
        { trackId: track.id, trackTitle: track.title },
        { headers: { Authorization: `Bearer ${userToken}` } }
      )
      .then((res) => {
        console.log("Track added to playlist:", res.data);
        setShowModal(false);
      })
      .catch((err) => {
        console.error("Error adding track to playlist:", err);
      });
  };

  // Function to create a new personal playlist and add the track to it.
  const handleCreatePlaylistAndAddTrack = () => {
    const title = prompt("Enter a title for your new playlist:");
    if (title) {
      axios
        .post(
          `${import.meta.env.VITE_BACKEND_API_BASE_URL}/personalPlaylists`,
          { title },
          { headers: { Authorization: `Bearer ${userToken}` } }
        )
        .then((res) => {
          console.log("Personal playlist created:", res.data);
          // After creation, add the track to the new playlist.
          const newPlaylistId = res.data.personalPlaylist.id;
          handleAddToPlaylist(newPlaylistId);
        })
        .catch((err) => {
          console.error("Error creating new playlist:", err);
        });
    }
  };

  return (
    <div>
      <h2>
        {track.title} by {track.artist?.name}
      </h2>
      <p>
        Album: {track.album?.title}
        {/* Deezer doesn't typically provide release_date */}
      </p>
      <h3>Rank: {track.rank}</h3>
      <h3>Duration: {formatDuration(track.duration)}</h3>
      <img src={track.album?.cover_medium} width={150} alt={track.title} />
      <br />
      <AudioPreview previewUrl={track.preview} />
      <br />
      <a href={track.link} target="_blank" rel="noopener noreferrer">
        Listen on Deezer
      </a>
      <br />
      {track.album?.link ? (
        <a href={track.album.link} target="_blank" rel="noopener noreferrer">
          Check out the album
        </a>
      ) : (
        <span>Album link not available</span>
      )}
      <br />
      <button onClick={() => setShowModal(true)}>
        Add to personal playlist
      </button>

      {showModal && (
        <AddToPersonalPlaylistModal
          playlists={personalPlaylists}
          onClose={() => setShowModal(false)}
          onAddTrack={handleAddToPlaylist}
          onCreatePlaylist={handleCreatePlaylistAndAddTrack}
        />
      )}

      {loadingPlaylists && <p>Loading your playlists...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default SingleSong;
