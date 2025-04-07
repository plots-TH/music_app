import React, { useEffect, useState } from "react";
import axios from "axios";
import CategoryCardList from "./CategoryCardList";

// VITE_API_BASE_URL should now point to Deezer's API in your .env file:
// e.g., VITE_API_BASE_URL=https://api.deezer.com

function Songs() {
  const [songCategories, setSongCategories] = useState([]);

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
      <CategoryCardList categories={songCategories} />
    </div>
  );
}

export default Songs;
