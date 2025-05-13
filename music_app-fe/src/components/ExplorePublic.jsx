import React, { useEffect, useState } from "react";
import axios from "axios";

//Route path="/publicPlaylists"
function ExplorePublic() {
  const [publicPlaylists, setPublicPlaylists] = useState([]);

  useEffect(() => {
    console.log("fetching public playlists...");
    axios
      .get(
        `${
          import.meta.env.VITE_BACKEND_API_BASE_URL
        }/personalPlaylists/publicPlaylists`
      )
      .then((res) => {
        console.log(
          "response from public playlist fetch request:",
          res.data.publicPlaylists
        );
        setPublicPlaylists(res.data.publicPlaylists);
      })
      .catch((err) => {
        console.error("Error fetching Public Playlists:", err);
      });
  }, []); // empty dependency array so useEffect is only called on component mount

  return (
    <div>
      {publicPlaylists.map((playlist) => (
        <div key={playlist.id}>
          <h3>{playlist.title}</h3>
        </div>
      ))}
    </div>
  );
}

export default ExplorePublic;
