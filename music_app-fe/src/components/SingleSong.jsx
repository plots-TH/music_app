import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
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
          Create New Playlist + Add This Track
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

// Route path="/track/:id"
function SingleSong({ userToken }) {
  // Get the track id from the URL parameter.
  const { id } = useParams();
  const location = useLocation();
  const addToPlaylistId = location.state?.addToPlaylistId;
  const addToPlaylistTitle = location.state?.addToPlaylistTitle;

  const [track, setTrack] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for modal & personal playlists.
  const [showModal, setShowModal] = useState(false);
  const [personalPlaylists, setPersonalPlaylists] = useState([]);
  const [loadingPlaylists, setLoadingPlaylists] = useState(false);

  // state for add-to-personal-playlist success message
  const [successMessage, setSuccessMessage] = useState("");
  // incase track already exists inside the playlist we are attempting to add it to
  const [trackExistsMessage, setTrackExistsMessage] = useState("");

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

  // Fetch personal playlists if/when we need the modal.
  useEffect(() => {
    if (showModal && userToken) {
      console.log("useEffect showModal/userToken", showModal, userToken);
      setLoadingPlaylists(true);
      axios
        .get(`${import.meta.env.VITE_BACKEND_API_BASE_URL}/personalPlaylists`, {
          headers: { Authorization: `Bearer ${userToken}` },
        })
        .then((res) => {
          setPersonalPlaylists(res.data.personalPlaylists);
          console.log("Fetched playlists:", res.data.personalPlaylists);
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
        {
          trackId: track.id,
          trackTitle: track.title,
          trackArtist: track.artist.name,
          trackCoverUrl: track.album.cover_medium,
        },
        { headers: { Authorization: `Bearer ${userToken}` } }
      )
      .then((res) => {
        console.log("Track added to playlist:", res.data);
        setShowModal(false);
      })
      .catch((err) => {
        console.log("addTrack error status:", err.response?.status);
        if (err.response?.status === 409) {
          console.log("setting trackExistsMessage");
          setTrackExistsMessage(
            `This track is already part of “${addToPlaylistTitle}”.`
          );
        } else {
          console.error("Error adding track:", err);
        }
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

  // unified “Add” button handler
  const handleAddClick = async () => {
    if (userToken && !personalPlaylists.length) {
      // fetch personalPlaylists
      axios
        .get(`${import.meta.env.VITE_BACKEND_API_BASE_URL}/personalPlaylists`, {
          headers: { Authorization: `Bearer ${userToken}` },
        })
        .then((res) => {
          console.log(
            "Fetched playlists from handleAddClick:",
            res.data.personalPlaylists
          );

          // store the fetched playlists in a const
          const fetchedPlaylists = res.data.personalPlaylists;
          console.log(
            "Fetched IDs:",
            fetchedPlaylists.map((p) => p.id)
          );

          console.log(
            "state IDs:",
            personalPlaylists.map((p) => p.id)
          );

          if (addToPlaylistId) {
            // find the selected playlist
            console.log("Looking for id:", addToPlaylistId);
            console.log("Current playlists:", fetchedPlaylists);
            setPersonalPlaylists(fetchedPlaylists);
            const playlistToFind = fetchedPlaylists.find(
              (pl) => pl.id === addToPlaylistId
            );
            if (!playlistToFind) {
              console.warn("No playlist found for", addToPlaylistId);
              return;
            }
            console.log("Found playlist:", playlistToFind);
            // immediately exit function if track is already in the playlist (playlistToFind)
            if (playlistToFind.tracks.some((t) => t.track_id === track.id)) {
              setTrackExistsMessage(
                `This track is already part of "${addToPlaylistId}".`
              );
              setTimeout(() => setTrackExistsMessage(""), 3000);
              return;
            }
            try {
              // we already “remembered” which playlist they clicked
              handleAddToPlaylist(addToPlaylistId);

              // show success message after awaiting for the POST to finish from handleAddToPlaylist(addToPlaylistId);
              setSuccessMessage(`Track added to “${addToPlaylistTitle}”!`);

              // clear the success message after 3 seconds
              setTimeout(() => setSuccessMessage(""), 3000);
            } catch (err) {
              if (err.response?.status === 500) {
                setTrackExistsMessage(
                  `This track is already part of “${addToPlaylistTitle}”.`
                );
                setTimeout(() => setTrackExistsMessage(""), 3000);
              } else {
                console.error("Error adding track:", err);
              }
            }
          } else {
            // otherwise show them the modal choice
            setShowModal(true);
          }
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

      {successMessage && <div>{successMessage}</div>}
      {trackExistsMessage && (
        <div style={{ color: "orange" }}>{trackExistsMessage}</div>
      )}

      {/* single button that either adds immediately, or pops up the modal */}
      <button onClick={handleAddClick}>
        {addToPlaylistId
          ? `Add track directly to your “${addToPlaylistTitle}” playlist`
          : "Add track to a personal playlist"}
      </button>

      {/* only show the modal when we didn’t already get a playlistId */}
      {!addToPlaylistId && showModal && (
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
