import React, { useEffect, useState } from "react";
import axios from "axios";
import CategoryCardList from "./CategoryCardList";
import { useLocation } from "react-router-dom"; // needed to pass the selected playlist's ID (to add a track to)
//  on to each component involved in the flow. the ID is stored in memory, inside React-Router's location state, which lives inside the JavaScript location object
// need to thread that router‐state through each component until you get to the <Link> that actually navigates to the song page

// VITE_API_BASE_URL should now point to Deezer's API in your .env file:
// e.g., VITE_API_BASE_URL=https://api.deezer.com

function Songs() {
  const [songCategories, setSongCategories] = useState([]);

  const { state } = useLocation();
  const addToPlaylistId = state?.addToPlaylistId;

  useEffect(() => {
    // Using Deezer's endpoint to fetch genres (which we'll use as categories)
    axios
      .get(`${import.meta.env.VITE_BACKEND_API_BASE_URL}/deezer/genre`)
      .then((res) => {
        // Deezer returns an object with a "data" property that holds the genres
        setSongCategories(res.data.data);
      })
      .catch((err) => {
        console.error("Error fetching genres:", err);
      });
  }, []); // empty dependency array so this is only called on component mount

  return (
    <div className="song-category-page">
      <CategoryCardList
        categories={songCategories}
        addToPlaylistId={addToPlaylistId}
      />
    </div>
  );
}

export default Songs;
