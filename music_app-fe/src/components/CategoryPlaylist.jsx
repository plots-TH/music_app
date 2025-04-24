import React, { useEffect, useState } from "react"; // useEffect will fetch playlists for the provided category from the URL, and useState will hold the playlist data for display.
import { useParams, useLocation } from "react-router-dom"; // useParams extracts the category ID from the URL; useLocation retrieves state passed from the parent component.
import CategoryPlaylistCardList from "./CategoryPlaylistCardList";
import axios from "axios";

// Route path="/category/:id"
function CategoryPlaylist() {
  const { id } = useParams();
  const { state } = useLocation(); // ← grab the router state once
  const categoryName = state?.name || `category ID: ${id}`; // fallback to id if name is not provided
  const addToPlaylistId = state?.addToPlaylistId; // ← and get your playlistId
  const addToPlaylistTitle = state?.addToPlaylistTitle;

  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    // Using our backend proxy endpoint to fetch playlists from Deezer.
    // The backend proxy should be set up to call Deezer's API and return the data.
    axios
      .get(
        `${
          import.meta.env.VITE_BACKEND_API_BASE_URL
        }/deezer/search/playlist?q=${encodeURIComponent(categoryName)}`
      )
      .then((res) => {
        // Deezer returns an object with playlists in res.data.data
        if (res.data && res.data.data) {
          setPlaylists(res.data.data);
        } else {
          console.error("No playlists data found in response:", res.data);
        }
      })
      .catch((err) => {
        console.error("Error fetching playlists", err);
      });
  }, [categoryName]);

  return (
    <div className="category-playlists-page">
      <h2>Playlists for: {categoryName}</h2>
      <CategoryPlaylistCardList
        playlists={playlists}
        addToPlaylistId={addToPlaylistId}
        addToPlaylistTitle={addToPlaylistTitle}
      />
    </div>
  );
}

export default CategoryPlaylist;
