import React, { useEffect, useState } from "react";
import axios from "axios";
import CategoryCardList from "./CategoryCardList";
import { useLocation } from "react-router-dom"; // needed to pass the selected playlist's ID (to add a track to)
//  on to each component involved in the flow. the ID is stored in memory, inside React-Router's location state, which lives inside the JavaScript location object
// need to thread that router‐state through each component until you get to the <Link> that actually navigates to the song page

// VITE_API_BASE_URL should now point to Deezer's API in your .env file:
// e.g., VITE_API_BASE_URL=https://api.deezer.com

//Route path="/"
function Songs() {
  const [songCategories, setSongCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const { state } = useLocation();
  const addToPlaylistId = state?.addToPlaylistId;
  const addToPlaylistTitle = state?.addToPlaylistTitle;

  useEffect(() => {
    setLoading(true);
    // Using Deezer's endpoint to fetch genres (which we'll use as categories)
    axios
      .get(`${import.meta.env.VITE_BACKEND_API_BASE_URL}/deezer/genre`)
      .then((res) => {
        // Deezer returns an object with a "data" property that holds the genres
        setSongCategories(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching genres:", err);
      });
  }, []); // empty dependency array so this is only called on component mount

  return (
    <div className="mx-auto max-w-6xl sm:px-6 lg:px-8">
      <p className="mb-6 mt-10 text-center text-3xl font-semibold text-slate-700 dark:text-slate-200 sm:text-4xl">
        Select a category to begin exploring playlists!
      </p>

      {/* Outer card container to match Account page look & colors */}
      <div className="rounded-lg border border-slate-200 bg-slate-100 p-4 shadow-sm dark:border-slate-700 dark:bg-neutral-900 sm:p-6">
        {/* Category list renders inside; keep component API the same */}
        <CategoryCardList
          categories={songCategories}
          addToPlaylistId={addToPlaylistId}
          addToPlaylistTitle={addToPlaylistTitle}
          loading={loading}
        />
      </div>
    </div>
  );
}

export default Songs;
