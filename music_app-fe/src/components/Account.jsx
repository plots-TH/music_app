import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import PersonalPlaylistCardList from "./PersonalPlaylistCardList";
import DropDownMenu from "./DropDownMenu";
import TagCardList from "./TagCardList";

// Route path="/account"
function Account({ userToken }) {
  const [personalPlaylists, setPersonalPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // state for tags
  const [allTags, setAllTags] = useState([]);
  const [tagsLoading, setTagsLoading] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);

  // state variable for personalPlaylist searchbar (used in handlePersonalPlaylistSearch)
  const [searchInput, setSearchInput] = useState("");

  // Function to fetch personal playlists for the logged-in user
  const fetchPlaylists = () => {
    if (userToken) {
      setLoading(true);
      axios
        .get(`${import.meta.env.VITE_BACKEND_API_BASE_URL}/personalPlaylists`, {
          headers: { Authorization: `Bearer ${userToken}` },
        })
        .then((res) => {
          // EDIT THIS RESPONSE TO CONTAIN TAGS
          console.log(
            "[fetchPlaylists] GET /personalPlaylists response:",
            res.data,
          );
          setPersonalPlaylists(res.data.personalPlaylists);
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

  // fetch master tag list
  useEffect(() => {
    if (!userToken) {
      return;
    }

    console.log("[Account.jsx useEffect] fetching master tag list...");
    setTagsLoading(true);

    const loadTags = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_API_BASE_URL}/personalPlaylists/tags`,
          { headers: { Authorization: `Bearer ${userToken}` } },
        );

        console.log("[Account.jsx] fetched tags-master-list:", res.data.tags);
        setAllTags(res.data.tags);
      } catch (err) {
        console.error("[Account.jsx] error fetching master tag list:", err);
      } finally {
        setTagsLoading(false);
      }
    };
    loadTags();
  }, [userToken]);

  // Handler for creating a new playlist
  const handleCreatePlaylist = () => {
    const title = prompt("Enter a title for your new playlist:");
    if (title) {
      axios
        .post(
          `${import.meta.env.VITE_BACKEND_API_BASE_URL}/personalPlaylists`,
          { title },
          { headers: { Authorization: `Bearer ${userToken}` } },
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
        playlist.id === playlistId
          ? { ...playlist, title: newTitle }
          : playlist,
      ),
    );
  };

  // this callback function will be passed down to personalPlaylistCard so children can update the list in-place optimistically, avoiding a page refresh
  const handleRemoveTrack = (playlistId, trackId) => {
    setPersonalPlaylists((prev) =>
      prev.map((playlist) => {
        if (playlist.id !== playlistId) return playlist;

        const newTracks = playlist.tracks.filter(
          (track) => track.track_id !== trackId,
        );

        // Create a new playlist object by copying all existing fields (...playlist),
        // then overwrite `tracks` with the filtered list (`newTracks`)
        // and set `cover_url` to the first track’s cover_url (or null if there are no tracks)
        return {
          ...playlist,
          tracks: newTracks,
          cover_url: newTracks.length > 0 ? newTracks[0].track_cover_url : null,
        };
      }),
    );

    setPersonalPlaylists((prev) =>
      prev.map((playlist) => {
        if (playlist.id !== playlistId) return playlist;

        const newTracks = playlist.tracks.filter(
          (track) => track.track_id !== trackId,
        );

        return {
          ...playlist,
          tracks: newTracks,
          cover_url: newTracks.length > 0 ? newTracks[0].track_cover_url : null,
        };
      }),
    );
  };

  // callback function for deleting an entire personal playlist
  const handleDeletePlaylist = (playlistId) => {
    setPersonalPlaylists((prev) =>
      // SET the personalPlaylists state variable to a new version that consists ONLY of playlists that do NOT match the playlist ID of the passed in parameter(playlistId)
      prev.filter((playlist) => playlist.id !== playlistId),
    );
  };

  // handler to update a playlist's description in-place:
  const handleUpdateDescription = (playlistId, description) => {
    setPersonalPlaylists((prev) =>
      prev.map((playlist) =>
        playlist.id === playlistId ? { ...playlist, description } : playlist,
      ),
    );
  };

  const handleTogglePublic = async (playlistId) => {
    console.log("toggle called for:", playlistId);
    const playlist = personalPlaylists.find((pl) => pl.id === playlistId);
    console.log("found playlist:", playlistId);

    const newValue = !playlist.is_public;
    console.log("new is_public value aka newValue will be:", newValue);

    setPersonalPlaylists((prev) =>
      prev.map((playlist) =>
        playlist.id === playlistId
          ? { ...playlist, is_public: newValue }
          : playlist,
      ),
    );

    //console.log("toggling from", isPublic, "=>", !isPublic);
    //const newPublicValue = !isPublic;
    //console.log("about to PATCH /publish, body:", { newPublicValue });
    //setIsPublic(newPublicValue);
    // fire off PATCH here:
    try {
      const res = await axios.patch(
        `${
          import.meta.env.VITE_BACKEND_API_BASE_URL
        }/personalPlaylists/${playlistId}/publish`,
        { isPublic: newValue },
        { headers: { Authorization: `Bearer ${userToken}` } },
      );
      console.log("handleTogglePublic PATCH response:", res);
      console.log("playlist's isPublic value:", newValue);
    } catch (err) {
      console.error(
        "error updating playlist public status (handleTogglePublic PATCH request):",
        err,
      );
    }
  };

  useEffect(() => {
    console.log(
      "playlists now:",
      personalPlaylists.map((p) => ({ id: p.id, isPublic: p.is_public })),
    );
  }, [personalPlaylists]);

  const retrievedUsername = localStorage.getItem("username");

  // handler function "function expression" to filter displayed playlist titles based on the value within searchbar input field:
  const handlePersonalPlaylistSearch = (event) => {
    const input = event.target.value.toLowerCase();
    setSearchInput(input);
  };

  const handleToggleTagFilter = (tagId) => {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId],
    );
  };

  // combine search input and tag filter so both can be used simultaneously
  const filteredPlaylists = useMemo(() => {
    let results = personalPlaylists;

    // text search
    const input = searchInput.trim().toLowerCase();
    if (input) {
      results = results.filter((pl) => pl.title.toLowerCase().includes(input));
    }

    // tag filter (match ALL selected)
    if (selectedTags.length) {
      results = results.filter((pl) =>
        selectedTags.every((tagId) => pl.tags?.some((t) => t.tag_id === tagId)),
      );
    }

    return results;
  }, [personalPlaylists, searchInput, selectedTags]);

  return (
    <div>
      <h2 className="mb-4 text-center">
        {retrievedUsername ? (
          <span className="dark:text-slate-100">
            Welcome{" "}
            {
              <span className="font-semibold text-yellow-600 dark:text-yellow-600">
                {retrievedUsername}
              </span>
            }
            ! View and manage your playlists below.
          </span>
        ) : (
          `View and manage your playlists below`
        )}
      </h2>
      {/* always show the searchbar if the user has at least 1 personal playlist */}
      <div>
        {personalPlaylists.length > 0 && (
          <div className="flex justify-center">
            <input
              type="text"
              onChange={handlePersonalPlaylistSearch}
              placeholder="Search your playlists..."
              aria-label="Search your playlists"
              className="w-full max-w-xs rounded-full border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-500 dark:bg-neutral-700 dark:text-slate-100"
            />
          </div>
        )}
      </div>

      {/* create a playlist button */}
      <div className="m-3 flex justify-center">
        {" "}
        <button
          className="text-md inline-flex items-center rounded-md border bg-white px-3 py-2 font-medium shadow-sm hover:bg-gray-50 dark:border-slate-600 dark:bg-yellow-600 dark:text-slate-100 dark:hover:bg-amber-500"
          onClick={handleCreatePlaylist}
        >
          Create New Playlist
        </button>
      </div>

      <DropDownMenu>
        {tagsLoading ? (
          <p>Loading tags...</p>
        ) : (
          <TagCardList
            allTags={allTags}
            activeTags={selectedTags.map((id) => ({ tag_id: id }))}
            onToggleTag={handleToggleTagFilter}
          />
        )}
      </DropDownMenu>

      {loading && <p>Loading your playlists...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* If 0 personal playlists exist, show "no playlists yet" message. If displayedPlaylists.length > 0, show them  */}
      {personalPlaylists.length === 0 ? (
        <p>You have not created any personal playlists yet.</p>
      ) : filteredPlaylists.length > 0 ? (
        <PersonalPlaylistCardList
          personalPlaylists={filteredPlaylists}
          userToken={userToken}
          onUpdateTitle={handleUpdateTitle}
          onRemoveTrack={handleRemoveTrack}
          onDeletePlaylist={handleDeletePlaylist}
          onEditDescription={handleUpdateDescription}
          onTogglePublic={handleTogglePublic}
        />
      ) : (
        <p>No playlists match “{searchInput}”.</p>
      )}
    </div>
  );
}

export default Account;
