import React, { useEffect, useState } from "react";
import axios from "axios";
import PublicPlaylistCardList from "./publicPlaylistCardList";
import DropDownMenu from "./DropDownMenu";
import TagCardList from "./TagCardList";

//Route path="/publicPlaylists"
function ExplorePublic({ userToken, userId }) {
  const [publicPlaylists, setPublicPlaylists] = useState([]);
  const [playlistsLoaded, setPlaylistsLoaded] = useState(false); // state to track data loading status

  // state for tags
  const [allTags, setAllTags] = useState([]);
  const [tagsLoading, setTagsLoading] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);

  // flag to be used for clone success message in PublicPlaylistCard
  const [justClonedId, setJustClonedId] = useState(null);

  // initial fetch of public playlists
  useEffect(() => {
    console.log("fetching public playlists...");
    axios
      .get(
        `${
          import.meta.env.VITE_BACKEND_API_BASE_URL
        }/personalPlaylists/publicPlaylists`,
      )
      .then((res) => {
        console.log("response from public playlist fetch request:", res.data);
        setPublicPlaylists(res.data.publicPlaylists);
        setPlaylistsLoaded(true); // update state after playlists data is loaded
      })
      .catch((err) => {
        console.error("Error fetching Public Playlists:", err);
      });
  }, []); // empty dependency array so useEffect is only called on component mount

  // fetch master tag list
  useEffect(() => {
    if (!userToken) {
      return;
    }

    console.log("[ExplorePublic useEffect] fetching master tag list...");
    setTagsLoading(true);

    const loadTags = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_API_BASE_URL}/personalPlaylists/tags`,
          { headers: { Authorization: `Bearer ${userToken}` } },
        );

        console.log("[ExplorePublic] fetched master list tags:", res.data.tags);
        setAllTags(res.data.tags);
      } catch (err) {
        ("[ExplorePublic useEffect] error fetching master tag list:", err);
      } finally {
        setTagsLoading(false);
      }
    };
    loadTags();
  }, [userToken]);

  const handleToggleTagFilter = (tagId) => {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId],
    );
  };

  // Sort by likes button component:
  const [likesFilter, setLikesFilter] = useState(false);
  const toggleLikesFilter = () => {
    setLikesFilter(!likesFilter);
  };

  useEffect(() => {
    if (likesFilter === false) {
      return;
    } else if (likesFilter === true) {
      console.log("likesFilter is true");
    }
  });

  const filtered = selectedTags.length
    ? publicPlaylists.filter((pl) =>
        selectedTags.every((id) => pl.tags.some((t) => t.tag_id === id)),
      )
    : likesFilter === true
      ? publicPlaylists
          .filter((pl) => pl.total_likes > 0)
          .sort((a, b) => b.total_likes - a.total_likes)
      : publicPlaylists;

  const handleClonePlaylist = (playlistId) => {
    console.log("[ExplorePublic] ABOUT TO CLONE pl with ID:", { playlistId });
    console.log("[ExplorePublic] userToken:", userToken);
    axios
      .post(
        `${import.meta.env.VITE_BACKEND_API_BASE_URL}/personalPlaylists/clone`,
        {
          playlistId,
        },
        { headers: { Authorization: `Bearer ${userToken}` } },
      )
      .then((res) => {
        console.log(
          " Inside handleClonePlaylist: Playlist successfully cloned and added to collection:",
          res.data,
        );
        // set cloneSuccess to true for 3 seconds - this will be used to conditionally render the success message in ExplorePublic.jsx or PublicPlaylistCard.jsx
        setJustClonedId(playlistId);
        setTimeout(() => setJustClonedId(null), 3000);
      })
      .catch((err) => {
        console.error(
          "Inside handleClonePlaylist: Error cloning/adding playlist to collection:",
          err,
        );
      });
  };

  const clearTags = () => {
    setSelectedTags([]);
  };

  return (
    <div>
      <h2 className="mb-6 mt-10 text-center text-3xl font-semibold text-slate-700 dark:text-slate-200 sm:text-4xl">
        Explore Community-Created Playlists
      </h2>

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
      <div className="relative inline-block w-full align-middle sm:w-auto">
        {selectedTags.length > 0 ? (
          <button
            onClick={clearTags}
            className="inline-flex items-center rounded-md border bg-white px-3 py-2 text-sm font-medium shadow-sm hover:bg-gray-50"
          >
            Clear All Tags
          </button>
        ) : (
          <button
            onClick={toggleLikesFilter}
            className={`mt-4 inline-flex items-center rounded-md border ${likesFilter ? "bg-slate-600 text-white hover:bg-slate-500" : "bg-white hover:bg-gray-50"} px-3 py-2 text-sm font-medium shadow-sm hover:shadow-md dark:border-gray-500 dark:bg-gray-700 dark:text-slate-100 dark:hover:bg-gray-600`}
          >
            Sort by Likes
          </button>
        )}
      </div>

      <PublicPlaylistCardList
        publicPlaylists={filtered}
        userToken={userToken}
        userId={userId}
        onClonePlaylist={handleClonePlaylist}
        justClonedId={justClonedId}
      />
    </div>
  );
}

export default ExplorePublic;
