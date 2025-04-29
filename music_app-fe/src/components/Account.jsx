import React, { useEffect, useState } from "react";
import axios from "axios";
import PersonalPlaylistCardList from "./PersonalPlaylistCardList";

// Route path="/account"
function Account({ userToken }) {
  const [personalPlaylists, setPersonalPlaylists] = useState([]);
  const [displayedPlaylists, setDisplayedPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch personal playlists for the logged-in user
  const fetchPlaylists = () => {
    if (userToken) {
      setLoading(true);
      axios
        .get(`${import.meta.env.VITE_BACKEND_API_BASE_URL}/personalPlaylists`, {
          headers: { Authorization: `Bearer ${userToken}` },
        })
        .then((res) => {
          // Assume the response format is { personalPlaylists: [...] }
          console.log("GET /personalPlaylists response:", res.data);
          setPersonalPlaylists(res.data.personalPlaylists);
          setDisplayedPlaylists(res.data.personalPlaylists);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching personal playlists:", err);
          setError("Could not load your playlists. Please try again later.");
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  };

  // On component mount or when userToken changes, fetch playlists
  useEffect(() => {
    fetchPlaylists();
  }, [userToken]);

  // Handler for creating a new playlist
  const handleCreatePlaylist = () => {
    const title = prompt("Enter a title for your new playlist:");
    if (title) {
      axios
        .post(
          `${import.meta.env.VITE_BACKEND_API_BASE_URL}/personalPlaylists`,
          { title },
          { headers: { Authorization: `Bearer ${userToken}` } }
        )
        .then((res) => {
          console.log("New personal playlist created:", res.data);
          // After a successful creation, refetch playlists to update the list
          fetchPlaylists();
        })
        .catch((err) => {
          console.error("Error creating new playlist:", err);
        });
    }
  };

  // when a playlist's title is updated, instead of refreshing the whole page to "fetch" the updated title, this handler reflects that update in-place
  const handleUpdateTitle = (playlistId, newTitle) => {
    setPersonalPlaylists((prev) =>
      prev.map((playlist) =>
        playlist.id === playlistId ? { ...playlist, title: newTitle } : playlist
      )
    );

    setDisplayedPlaylists((prev) =>
      prev.map((playlist) =>
        playlist.id === playlistId ? { ...playlist, title: newTitle } : playlist
      )
    );
  };

  // this callback function will be passed down to personalPlaylistCard so children can update the list in-place optimistically, avoiding a page refresh
  const handleRemoveTrack = (playlistId, trackId) => {
    setPersonalPlaylists((prev) =>
      prev.map((playlist) =>
        playlist.id !== playlistId
          ? playlist
          : {
              ...playlist,
              tracks: playlist.tracks.filter(
                (track) => track.track_id !== trackId
              ),
            }
      )
    );

    setDisplayedPlaylists((prev) =>
      prev.map((playlist) =>
        playlist.id !== playlistId
          ? playlist
          : {
              ...playlist,
              tracks: playlist.tracks.filter(
                (track) => track.track_id !== trackId
              ),
            }
      )
    );
  };

  // callback function for deleting an entire personal playlist
  const handleDeletePlaylist = (playlistId) => {
    setPersonalPlaylists((prev) =>
      // SET the personalPlaylists state variable to a new version that consists ONLY of playlists that do NOT match the playlist ID of the passed in parameter(playlistId)
      prev.filter((playlist) => playlist.id !== playlistId)
    );

    setDisplayedPlaylists((prev) =>
      prev.filter((playlist) => playlist.id !== playlistId)
    );
  };

  // handler function "function expression" to filter displayed playlist titles based on the value within searchbar input field:
  const handlePersonalPlaylistSearch = (event) => {
    const searchInput = event.target.value.toLowerCase();
    const searchResults = personalPlaylists.filter((playlist) =>
      playlist.title.toLowerCase().includes(searchInput)
    );
    setDisplayedPlaylists(searchResults);
  };

  // handler to update a playlist's description in-place:
  const handleUpdateDescription = (playlistId, description) => {
    setPersonalPlaylists((prev) =>
      prev.map((playlist) =>
        playlist.id === playlistId ? { ...playlist, description } : playlist
      )
    );

    setDisplayedPlaylists((prev) =>
      prev.map((playlist) =>
        playlist.id === playlistId ? { ...playlist, description } : playlist
      )
    );
  };

  return (
    <div>
      <h2>My Personal Playlists:</h2>
      <div>
        Search your playlists:{" "}
        <input type="text" onChange={handlePersonalPlaylistSearch} />
      </div>
      <button onClick={handleCreatePlaylist}>Create New Playlist</button>
      {loading && <p>Loading your playlists...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {displayedPlaylists && displayedPlaylists.length > 0 ? (
        <PersonalPlaylistCardList
          personalPlaylists={displayedPlaylists}
          userToken={userToken}
          onUpdateTitle={handleUpdateTitle}
          onRemoveTrack={handleRemoveTrack}
          onDeletePlaylist={handleDeletePlaylist}
          onEditDescription={handleUpdateDescription}
        />
      ) : (
        <p>You don't have any personal playlists yet.</p>
      )}
    </div>
  );
}

export default Account;
