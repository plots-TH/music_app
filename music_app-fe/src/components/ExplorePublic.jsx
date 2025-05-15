import React, { useEffect, useState } from "react";
import axios from "axios";
import PublicPlaylistCardList from "./publicPlaylistCardList";

//Route path="/publicPlaylists"
function ExplorePublic() {
  const [publicPlaylists, setPublicPlaylists] = useState([]);
  const [displayedPublicPlaylists, setDisplayedPublicPlaylists] = useState([]);

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
        setDisplayedPublicPlaylists(res.data.publicPlaylists);
      })
      .catch((err) => {
        console.error("Error fetching Public Playlists:", err);
      });
  }, []); // empty dependency array so useEffect is only called on component mount

  return (
    // <div>
    //   <h2>Explore Playlists Created by other Users:</h2>
    //   {publicPlaylists.map((playlist) => (
    //     <div key={playlist.id}>
    //       {/* swap this out with a card later */}
    //       <h3>{playlist.title}</h3>
    //     </div>
    //   ))}
    // </div>
    <div>
      <h2>Explore Playlists Created by other Users:</h2>

      <PublicPlaylistCardList publicPlaylists={displayedPublicPlaylists} />
    </div>
  );
}

export default ExplorePublic;
