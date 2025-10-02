import React, { useEffect, useState } from "react"; // useEffect will fetch playlists for the provided category from the URL, and useState will hold the playlist data for display.
import { useParams, useLocation } from "react-router-dom"; // useParams extracts the category ID from the URL; useLocation retrieves state passed from the parent component.
import CategoryPlaylistCardList from "./CategoryPlaylistCardList";
import axios from "axios";

// Route path="/category/:id"
function CategoryPlaylist() {
  const { id } = useParams();
  const { state } = useLocation(); // ← grab the router state once
  const [categoryName, setCategoryName] = useState(state?.name || null); // resolve to a real name
  const addToPlaylistId = state?.addToPlaylistId; // ← and get your playlistId
  const addToPlaylistTitle = state?.addToPlaylistTitle;

  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);

  // If name wasn't passed in router state, fetch it from the genre list by id.
  useEffect(() => {
    if (categoryName) return; // already have it
    axios
      .get(`${import.meta.env.VITE_BACKEND_API_BASE_URL}/deezer/genre`)
      .then((res) => {
        const list = res.data?.data || [];
        const match = list.find((g) => String(g.id) === String(id));
        setCategoryName(match?.name || `Genre ${id}`);
      })
      .catch(() => setCategoryName(`Genre ${id}`));
  }, [categoryName, id]);

  // Once we have a categoryName, search playlists for it.
  useEffect(() => {
    if (!categoryName) return;
    setLoading(true);
    axios
      .get(
        `${
          import.meta.env.VITE_BACKEND_API_BASE_URL
        }/deezer/search/playlist?q=${encodeURIComponent(categoryName)}`,
      )
      .then((res) => {
        setPlaylists(res.data?.data || []);
      })
      .catch((err) => {
        console.error("Error fetching playlists", err);
        setPlaylists([]);
      })
      .finally(() => setLoading(false));
  }, [categoryName]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <h2 className="mb-6 mt-10 text-center text-3xl font-semibold text-slate-700 dark:text-slate-200 sm:text-4xl">
        Playlists for: {categoryName || `category ID: ${id}`}
      </h2>
      <div className="rounded-lg border border-slate-200 bg-slate-100 p-4 shadow-sm dark:border-slate-700 dark:bg-neutral-900 sm:p-6">
        {loading ? (
          <p className="text-center text-slate-600 dark:text-slate-300">
            Loading playlists…
          </p>
        ) : playlists.length > 0 ? (
          <CategoryPlaylistCardList
            playlists={playlists}
            addToPlaylistId={addToPlaylistId}
            addToPlaylistTitle={addToPlaylistTitle}
          />
        ) : (
          <p className="text-center text-slate-600 dark:text-slate-300">
            No playlists found for “{categoryName}”.
          </p>
        )}
      </div>
    </div>
  );
}

export default CategoryPlaylist;
