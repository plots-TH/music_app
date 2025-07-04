import React, { useEffect, useState } from "react";
import axios from "axios";
import PublicPlaylistCardList from "./publicPlaylistCardList";

//Route path="/publicPlaylists"
function ExplorePublic({ userToken, userId }) {
  const [publicPlaylists, setPublicPlaylists] = useState([]);
  const [playlistsLoaded, setPlaylistsLoaded] = useState(false); // state to track data loading status

  // flag to be used for clone success message in PublicPlaylistCard
  const [justClonedId, setJustClonedId] = useState(null);

  // initial fetch of public playlists
  useEffect(() => {
    console.log("fetching public playlists...");
    axios
      .get(
        `${
          import.meta.env.VITE_BACKEND_API_BASE_URL
        }/personalPlaylists/publicPlaylists`
      )
      .then((res) => {
        console.log("response from public playlist fetch request:", res.data);
        setPublicPlaylists(res.data.publicPlaylists);
        setPlaylistsLoaded(true); // update state after playlists data is loaded
      })
      .catch((err) => {
        console.error("Error fetching Public Playlists:", err);
      });
  }, []); // empty dependency array so useEffect is only called on component mount

  const handleClonePlaylist = (playlistId) => {
    console.log(
      "Inside handleClonePlaylist from ExplorePublic - ABOUT TO CLONE pl with ID:",
      { playlistId }
    );
    console.log("userToken inside ExplorePublic:", userToken);
    axios
      .post(
        `${import.meta.env.VITE_BACKEND_API_BASE_URL}/personalPlaylists/clone`,
        {
          playlistId,
        },
        { headers: { Authorization: `Bearer ${userToken}` } }
      )
      .then((res) => {
        console.log(
          " Inside handleClonePlaylist: Playlist successfully cloned and added to collection:",
          res.data
        );
        // set cloneSuccess to true for 3 seconds - this will be used to conditionally render the success message in ExplorePublic.jsx or PublicPlaylistCard.jsx
        setJustClonedId(playlistId);
        setTimeout(() => setJustClonedId(null), 3000);
      })
      .catch((err) => {
        console.error(
          "Inside handleClonePlaylist: Error cloning/adding playlist to collection:",
          err
        );
      });
  };

  return (
    <div>
      <h2>Explore Playlists Created by other Users:</h2>

      <PublicPlaylistCardList
        publicPlaylists={publicPlaylists}
        userToken={userToken}
        userId={userId}
        onClonePlaylist={handleClonePlaylist}
        justClonedId={justClonedId}
      />
    </div>
  );
}

export default ExplorePublic;
