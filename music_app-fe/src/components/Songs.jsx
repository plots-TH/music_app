import React, { useEffect, useState } from "react"; // useEffect to make the api call
import axios from "axios"; // useState to store results of the api call and display them from the state variable
import CategoryCardList from "./CategoryCardList";

// VITE_API_BASE_URL=https://api.spotify.com

function Songs() {
  // must update access token every hour
  const accessToken =
    "BQCoEroDGyNbIlyN6u3G75orT2bs7MS5-1qrOu6ghik8zPRFB0MsgIv72CG3zHvAlFQVHG9uIf8mv31TUyeFR459_LAZH2LDoBDtVUKB9VZWYLBv9-MOf_nAi4hPYkuOmdcNIPMYhBA";

  const [songCategories, setSongCategories] = useState([]);

  useEffect(() => {
    axios(
      `${import.meta.env.VITE_API_BASE_URL}/v1/browse/categories?country=US`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )
      .then((res) => {
        setSongCategories(res.data.categories.items);
      })
      .catch((err) => {
        console.error("Error response:", err.response);
        console.log("Token used:", accessToken);
      });
  }, []); // empty dependancy array so this is only called when component mounts
  return (
    <div className="song-category-page">
      <CategoryCardList categories={songCategories} />
    </div>
  );
}

export default Songs;

// this is where I want to display all the songs
