import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

// Helper: Format duration (seconds to minutes:seconds)
function formatDuration(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${secs}`;
}

function AudioPreview({ previewUrl }) {
  if (!previewUrl) return <p>No preview available</p>;
  return (
    <audio controls>
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
  // Get the track id from the URL parameter.
  const { id } = useParams();

  const [track, setTrack] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for modal & personal playlists.
  const [showModal, setShowModal] = useState(false);
  const [personalPlaylists, setPersonalPlaylists] = useState([]);
  const [loadingPlaylists, setLoadingPlaylists] = useState(false);

  // Always fetch the full track details when the component mounts.
  useEffect(() => {
    if (id) {
      axios
        .get(`${import.meta.env.VITE_BACKEND_API_BASE_URL}/track/${id}`)
        .then((res) => {
          setTrack(res.data.track);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching full track data:", err);
          setError("Error fetching full track data.");
          setLoading(false);
        });
    }
  }, [id]);

  // Fetch personal playlists when the modal opens.
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

  // Function to add the current track to a personal playlist.
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
          const newPlaylistId = res.data.personalPlaylist.id;
          handleAddToPlaylist(newPlaylistId);
        })
        .catch((err) => {
          console.error("Error creating new playlist:", err);
        });
    }
  };

  if (loading) {
    return <p>Loading track details...</p>;
  }
  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }
  if (!track) {
    return (
      <div>
        <p>No track data available.</p>
        <p>Please go back and select a track.</p>
      </div>
    );
  }

  return (
    <div>
      <h2>
        {track.title || track.track_title} by{" "}
        {track.artist?.name || "Unknown Artist"}
      </h2>
      <p>Album: {track.album?.title || "Unknown Album"}</p>
      <h3>Rank: {track.rank || "N/A"}</h3>
      <h3>
        Duration: {track.duration ? formatDuration(track.duration) : "N/A"}
      </h3>
      {track.album?.cover_medium && (
        <img
          src={track.album.cover_medium}
          width={150}
          alt={track.track_title}
        />
      )}
      <br />
      <AudioPreview previewUrl={track.preview} />
      <br />
      {track.link ? (
        <a href={track.link} target="_blank" rel="noopener noreferrer">
          Listen on Deezer
        </a>
      ) : (
        <p>Link not available</p>
      )}
      <br />
      {track.album?.link ? (
        <a href={track.album.link} target="_blank" rel="noopener noreferrer">
          Check out the album
        </a>
      ) : (
        <span>Album link not available</span>
      )}
      <br />
      {/* The Add to personal playlist button */}
      <button onClick={() => setShowModal(true)}>
        Add track to personal playlist
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
    </div>
  );
}

export default SingleSong;
