import React from "react";

const TagCard = ({ name }) => {
  return <span className="tag-card">{name}</span>;
};

export default TagCard;

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
