import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function PublicPlaylistCard({
  publicPlaylist,
  onClonePlaylist,
  userToken,
  userId,
  justClonedId,
}) {
  // local state for reflecting up-to-date  playlist like-count
  const [likes, setLikes] = useState(publicPlaylist.total_likes);
  // local state for toggling "like" button to "unlike" button
  const [hasLiked, setHasLiked] = useState(false);

  // state for public playlist tags
  const [allTags, setAllTags] = useState([]);
  const [activePubTags, setActivePubTags] = useState([]);

  // Fetch like-info (and any tags) on mount and whenever the playlist ID or user token changes
  useEffect(() => {
    const fetchLikeInfo = async () => {
      try {
        const [
          { data: likesRes },
          { data: allTagsRes },
          { data: activePubTagsRes },
        ] = await Promise.all([
          axios.get(
            `${import.meta.env.VITE_BACKEND_API_BASE_URL}/personalPlaylists/${
              publicPlaylist.id
            }/like`,
            { headers: { Authorization: `Bearer ${userToken}` } },
          ),
          // fetch all the tags
          axios.get(
            `${
              import.meta.env.VITE_BACKEND_API_BASE_URL
            }/personalPlaylists/tags`,
            { headers: { Authorization: `Bearer ${userToken}` } },
          ),
          // get active tags for the playlist
          axios.get(
            `${import.meta.env.VITE_BACKEND_API_BASE_URL}/personalPlaylists/${
              publicPlaylist.id
            }/tags`,
            { headers: { Authorization: `Bearer ${userToken}` } },
          ),
        ]);

        setLikes(likesRes.totalLikes || []);
        setHasLiked(likesRes.hasLiked);
        setAllTags(allTagsRes.tags || []);
        setActivePubTags(activePubTagsRes.activeTagsResult || []);
      } catch (err) {
        console.error("Error Fetching Like/tag Info on Mount:", err);
      }
    };

    fetchLikeInfo();
  }, [publicPlaylist.id, userToken]);

  // toggle handler: if already unliked -> like, else -> unlike
  const handleToggleLike = async () => {
    try {
      if (!hasLiked) {
        const addLikeResponse = await axios.post(
          `${import.meta.env.VITE_BACKEND_API_BASE_URL}/personalPlaylists/${
            publicPlaylist.id
          }/like`,
          {},
          { headers: { Authorization: `Bearer ${userToken}` } },
        );
        // setLikes to whatever the current value is + 1
        setLikes((prevLikes) => prevLikes + 1);
        setHasLiked(true);

        console.log("Master tag list:", allTags);
        console.log("active tags for public playlist:", activePubTags);
      } else {
        const removeLikeResponse = await axios.delete(
          `${import.meta.env.VITE_BACKEND_API_BASE_URL}/personalPlaylists/${
            publicPlaylist.id
          }/like`,
          { headers: { Authorization: `Bearer ${userToken}` } },
        );
        setLikes((prevLikes) => prevLikes - 1);
        setHasLiked(false);

        console.log("Master tag list:", allTags);
        console.log("active tags for public playlist:", activePubTags);
      }
    } catch (err) {
      console.error("Error Toggling Like:", err);
    }
  };
  const emptyHeart = "♡ ";

  return (
    <div className="relative flex h-full flex-col rounded-lg border bg-white p-4 shadow-sm dark:border-gray-500 dark:bg-gray-700">
      {/* Header */}
      <div className="mb-3 text-center">
        <h3 className="mt-6 text-xl font-extrabold dark:text-gray-200">
          {publicPlaylist.title}
        </h3>
        <p className="text-xs text-gray-600 dark:text-gray-400">
          Created by{" "}
          <span className="font-medium">{publicPlaylist.creator}</span>
        </p>
      </div>

      {/* Top-right like pill */}
      <div className="absolute right-3 top-3">
        <button
          onClick={handleToggleLike}
          aria-label={hasLiked ? "Unlike Playlist" : "Like this Playlist"}
          className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs shadow-sm dark:bg-gray-600 ${
            hasLiked
              ? "border-rose-200 bg-rose-50 dark:border-rose-200 dark:bg-rose-50"
              : "bg-white dark:border-gray-400"
          }`}
          title={hasLiked ? "Unlike" : "Like"}
        >
          <span>{likes || 0}</span>
          <span className={hasLiked ? "text-rose-500" : "text-gray-500"}>
            {hasLiked ? "♥" : "♡"}
          </span>
        </button>
      </div>

      {/* Middle: image + description + tracks */}
      <div className="flex-1">
        {publicPlaylist.tracks.length > 0 && publicPlaylist.cover_url && (
          <div className="mb-3 flex justify-center">
            <img
              className="mt-1 h-28 w-28 rounded object-cover ring-2 ring-orange-300 ring-offset-2"
              src={publicPlaylist.cover_url}
              alt={publicPlaylist.title}
            />
          </div>
        )}

        {/* Description bubble (matches Account cards) */}
        {publicPlaylist.description && (
          <div className="mb-3 flex justify-center">
            <span className="block max-w-[22rem] whitespace-pre-wrap break-words rounded border border-gray-200 bg-slate-100 px-3 py-1 text-center text-sm leading-normal text-gray-700 [overflow-wrap:anywhere] dark:border-gray-400 dark:bg-gray-800 dark:text-gray-400 sm:max-w-sm">
              {publicPlaylist.description}
            </span>
          </div>
        )}

        {/* Track list */}
        <div>
          {publicPlaylist.tracks.length > 0 ? (
            <div className="max-h-48 space-y-2 overflow-y-auto rounded-lg border p-2 dark:border-gray-500 dark:bg-gray-800">
              {publicPlaylist.tracks.map((track) => (
                <Link
                  key={track.track_id}
                  to={`/track/${track.track_id}`}
                  className="block rounded border p-2 text-center text-sm hover:bg-gray-50 dark:bg-gray-600 dark:hover:bg-gray-500"
                  aria-label={`${track.track_title} by ${track.track_artist}`}
                >
                  <span className="block font-semibold">
                    {track.track_title}
                  </span>
                  <span className="block text-gray-600">
                    by {track.track_artist}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center rounded-lg border p-2 dark:border-gray-500 dark:bg-gray-800">
              {" "}
              <span className="text-center text-slate-600 dark:text-slate-500">
                0 tracks added
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Footer actions */}
      <div className="mt-4 flex justify-center">
        <button
          className="inline-flex items-center rounded-md border bg-white px-3 py-2 text-sm font-medium shadow-sm hover:bg-gray-50 dark:bg-gray-400 dark:hover:bg-gray-300"
          onClick={() => onClonePlaylist(publicPlaylist.id, userToken)}
        >
          Copy &amp; Add to your collection
        </button>
      </div>

      {/* Clone success message */}
      {publicPlaylist.id === justClonedId && (
        <div className="mt-2 text-center text-sm text-green-600">
          Playlist cloned successfully!
        </div>
      )}
    </div>
  );
}

export default PublicPlaylistCard;
