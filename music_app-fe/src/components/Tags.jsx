import React, { useEffect, useState } from "react";
import axios from "axios";
import TagCardList from "./TagCardList";

function Tags() {
  // fetch all tags on mount
  const [allTags, setAllTags] = useState([]);

  useEffect(() => {
    const fetchAllTags = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_API_BASE_URL}/personalPlaylists/tags`
        );
        console.log("[Tags useEffect] full response.data:", res.data.tags);

        setAllTags(res.data.tags || []);
      } catch (err) {
        console.error("Error Fetching tags", err);
      }
    };
    fetchAllTags();
  }, []);
  return (
    <div>
      <TagCardList allTags={allTags} />
    </div>
  );
}

export default Tags;

// fetch all tags on mount
// const [allTags, setAllTags] = useState([]);
// useEffect(() => {
//   const fetchAllTags = async () => {
//     try {
//       const { data } = await axios.get(`
//             ${import.meta.env.VITE_BACKEND_API_BASE_URL}/personalPlaylists/tags
//             `);
//       setAllTags(data);
//     } catch (err) {
//       console.error("Error Fetching tags", err);
//     }
//   };
//   fetchAllTags();
// }, []);
