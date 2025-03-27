import React, { useEffect, useState } from "react"; // useEffect will fetch playlist with provided ID, and useState will hold the playlist in a variable and display it when the variable updates
import { useParams, useLocation } from "react-router-dom"; // useParams allows us to extract playlist ID from the url path
import axios from "axios";

function CategoryPlaylist() {
  const { id } = useParams();
  const location = useLocation();
  const categoryName = location.state?.name || id; // fallback to id if name not provided
  const accessToken =
    "BQCoEroDGyNbIlyN6u3G75orT2bs7MS5-1qrOu6ghik8zPRFB0MsgIv72CG3zHvAlFQVHG9uIf8mv31TUyeFR459_LAZH2LDoBDtVUKB9VZWYLBv9-MOf_nAi4hPYkuOmdcNIPMYhBA";
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    axios
      .get(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/v1/search?q=playlist:${encodeURIComponent(
          categoryName
        )}&type=playlist&market=US`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .then((res) => {
        console.log("Full response data:", res.data);
        if (res.data.playlists && res.data.playlists.items) {
          const validPlaylists = res.data.playlists.items.filter(
            (item) => item !== null
          );
          setPlaylists(validPlaylists);
          console.log(validPlaylists);
        } else {
          console.error("No playlists data found in response:", res.data);
        }
      })

      .catch((err) => {
        console.error("Error fetching playlists", err);
      });
  }, [categoryName]);
  return (
    <div>
      <h2>Playlists for: {categoryName}</h2>
      {playlists.map((playlist) => (
        <div key={playlist.id}>
          <h3>{playlist.name}</h3>
          <img src={playlist.images[0]?.url} alt={playlist.name} width={200} />
        </div>
      ))}
    </div>
  );
}

export default CategoryPlaylist;
