import React, { useEffect, useState } from "react"; // useEffect will fetch playlist with provided ID found in URL, and useState will hold the playlist in a variable / display it when the variable updates
import { useParams, useLocation, Link } from "react-router-dom"; // useParams allows us to extract playlist ID from the url path
import CategoryPlaylistCardList from "./CategoryPlaylistCardList";
import axios from "axios";

function CategoryPlaylist() {
  const { id } = useParams();
  const location = useLocation();
  const categoryName = location.state?.name || id; // fallback to id if name not provided
  const accessToken = import.meta.env.VITE_SPOTIFY_TOKEN;
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    axios
      .get(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/v1/search?q=playlist:${encodeURIComponent(
          // use encodeURIComponent to properly format/insert category names into the URL
          categoryName
        )}&type=playlist&market=US`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )

      .then((res) => {
        // console.log("Full response data:", res.data);
        if (res.data.playlists && res.data.playlists.items) {
          const validPlaylists = res.data.playlists.items.filter(
            (item) => item !== null
          ); // if the playlist exists and contains .items, validPlaylists = all playlists filtered by those which contain .item
          setPlaylists(validPlaylists);
          // console.log(validPlaylists);
        } else {
          console.error("No playlists data found in response:", res.data);
        }
      })

      .catch((err) => {
        console.error("Error fetching playlists", err);
      });
  }, [categoryName]);
  return (
    // passes "playlists" to CategoryPlaylistCardList
    <div className="category-playlists-page">
      <h2>Playlists for: {categoryName}</h2>
      <CategoryPlaylistCardList playlists={playlists} />
    </div>
  );
}

export default CategoryPlaylist;
