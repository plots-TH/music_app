import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

// ----EDIT PERSONAL PLAYLIST MODAL COMPONENT BELOW --------------------------------------
function EditPersonalPlaylistModal({
  isModalOpen,
  onClose,
  personalPlaylist,
  children,
}) {
  if (!isModalOpen) {
    return null;
  }

  return (
    <div
      className="modal-overlay" // same overlay styling as in SingleSong
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        className="modal" // same inner modal styling as in SingleSong
        style={{
          background: "#fff",
          padding: "1rem",
          borderRadius: "4px",
          width: "90%",
          maxWidth: "400px",
        }}
      >
        <button onClick={onClose} style={{ float: "right" }}>
          Close
        </button>
        {children}
      </div>
    </div>
  );
}
// ----EDIT PERSONAL PLAYLIST MODAL COMPONENT^^^^-----------------------------------------------------------------------------
//
//

function PersonalPlaylistCard({
  personalPlaylist,
  userToken,
  onUpdateTitle,
  onRemoveTrack,
}) {
  // ----"ADD TO THIS PLAYLIST BUTTON" FUNCTIONS BELOW----------------------------------------------------------------------------
  const navigate = useNavigate(); // declare const navigate to use useNavigate for the "Add to this playlist" button
  const handleClick = () => {
    // function to redirect to the "Explore all music" page - used inside onClick for the "Add to this playlist" button
    navigate("/");
  };
  // ----"ADD TO THIS PLAYLIST BUTTON" FUNCTIONS^^^----------------------------------------------------------------------------

  //
  //
  //
  // ----EDIT PLAYLIST MODAL FUNCTIONS BELOW---------------------------------------------------------------------------------
  const [showModal, setShowModal] = useState(false); // use useState hook to manage modal visibility

  const openEditPlaylistModal = () => {
    setShowModal(true);
  }; // function to set modal visibility to "true" (show modal)

  const closeEditPlaylistModal = () => {
    setShowModal(false);
  }; // function to set modal visibility to "false" (hide modal)
  // ----EDIT PLAYLIST MODAL FUNCTIONS ^^^ -------------------------------------------------------------------------------------
  //
  //
  //

  // ---- EDIT PLAYLIST TITLE FORM FUNCTIONS BELOW --------------------------
  // the "edit playlist title" form starts off as hidden aka (false)
  const [showEditPlaylistTitleForm, setShowEditPlaylistTitleForm] =
    useState(false);

  // function used inside onClick for "edit title" button, to either show or hide the edit playlist title form
  const handleEditTitleClick = () => {
    setShowEditPlaylistTitleForm(!showEditPlaylistTitleForm);
  };

  // store the newly edited playlist title in a state variable
  const [editedPlaylistTitle, setEditedPlaylistTitle] = useState(
    personalPlaylist.title
  );

  // submit handler function used inside onSubmit for "submit" button on edit playlist title form
  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(editedPlaylistTitle);

    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_BACKEND_API_BASE_URL}/personalPlaylists/${
          personalPlaylist.id
        }`,
        { playlistTitle: editedPlaylistTitle }, // "playlistTitle" key name matches what server is expecting in req.body from PATCH /api/personalPlaylists/:playlistId in personalPlaylistRoutes.js
        { headers: { Authorization: `Bearer ${userToken}` } }
      );

      // Optimistic update: update the parent’s state in place so the entire page doesnt need to refresh to reflect the changes
      onUpdateTitle(personalPlaylist.id, editedPlaylistTitle);
      setShowModal(false);
    } catch (err) {
      console.error("Error updating playlist title:", err);
    }
  };

  // EVENT HANDLER: remove track from playlist button
  const handleClickRemoveTrack = async (trackId) => {
    console.log(personalPlaylist.title);
    try {
      // API CLIENT CALL
      const res = await axios.delete(
        `${import.meta.env.VITE_BACKEND_API_BASE_URL}/personalPlaylists/${
          personalPlaylist.id
        }/tracks/${trackId}`,
        { headers: { Authorization: `Bearer ${userToken}` } }
      );

      // log the response payload:
      console.log("DELETE response:", res.data);
      // Specifically log the deleted track object:
      console.log("Deleted track record:", res.data.deletedTrack);

      // update UI after backend confirms deletion with optimistic update
      onRemoveTrack(personalPlaylist.id, trackId);
    } catch (err) {
      console.error("Error removing track from playlist:", err);
    }
  };

  // ---- EDIT PLAYLIST TITLE FORM FUNCTIONS ^^^ --------------------------
  //
  //

  return (
    <div className="personal-playlist-card">
      <h2>{personalPlaylist.title}</h2>
      <div>
        {personalPlaylist.tracks &&
          personalPlaylist.tracks.map((track) => (
            <div key={track.track_id}>
              <Link to={`/track/${track.track_id}`}>
                <strong>{track.track_title}</strong> by {track.track_artist}
              </Link>
            </div>
          ))}
      </div>
      <div>
        <button onClick={handleClick}>Add to this Playlist</button>
        <button onClick={openEditPlaylistModal}>Edit Playlist</button>
        <EditPersonalPlaylistModal
          isModalOpen={showModal}
          onClose={closeEditPlaylistModal}
        >
          <div>
            <h2>
              Playlist Title: {personalPlaylist.title}
              <button onClick={handleEditTitleClick}>
                {showEditPlaylistTitleForm ? "Cancel" : "Edit Title"}
              </button>
            </h2>
            {showEditPlaylistTitleForm && (
              <form onSubmit={handleSubmit}>
                <label>
                  Playlist Title:
                  <input
                    type="text"
                    value={editedPlaylistTitle}
                    onChange={(e) => setEditedPlaylistTitle(e.target.value)}
                  />
                </label>
                <button type="submit">Submit</button>
              </form>
            )}

            {/* display track list here */}
            <h3>Playlist Tracks:</h3>
            <div style={{ textAlign: "left" }}>
              {personalPlaylist.tracks.map((track) => (
                <li key={track.track_id} className="track-non-link">
                  {track.track_title} by {track.track_artist}
                  <button
                    onClick={() => handleClickRemoveTrack(track.track_id)}
                  >
                    remove
                  </button>
                </li>
              ))}
            </div>
          </div>
          <p>This is the modal content. add buttons later</p>
        </EditPersonalPlaylistModal>
      </div>
    </div>
  );
}

export default PersonalPlaylistCard;

// import React from "react";
// import { Link } from "react-router-dom";

// function CategoryPlaylistCard({ playlist }) {
//   console.log("Playlist:", playlist);
//   return (
//     <Link
//       to="/playlist"
//       state={{ playlist }}
//       className="category-playlist-card"
//     >
//       <span>{playlist.title}</span>
//       {/* Use playlist.picture_medium or playlist.picture if available */}
//       <img
//         src={playlist.picture_medium || playlist.picture}
//         alt={playlist.title}
//       />
//     </Link>
//   );
// }

// export default CategoryPlaylistCard;
