import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// ----Edit personal playlist modal component BELOW --------------------------------------
function EditPersonalPlaylistModal({ isModalOpen, onClose, children }) {
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
// ----Edit personal playlist modal component^^^^-----------------------------------------------------------------------------

function PersonalPlaylistCard({ personalPlaylist }) {
  // ----Add to this playlist button functions BELOW----------------------------------------------------------------------------
  const navigate = useNavigate(); // declare const navigate to use useNavigate for the "Add to this playlist" button
  const handleClick = () => {
    // function to redirect to the "Explore all music" page - onClick for the "Add to this playlist" button
    navigate("/");
  };
  // ----Add to this playlist button functions^^^----------------------------------------------------------------------------

  // ----Edit playlist modal functions BELOW---------------------------------------------------------------------------------
  const [showModal, setShowModal] = useState(false); // use useState hook to manage modal visibility

  const openEditPlaylistModal = () => {
    setShowModal(true);
  }; // function to set modal visibility to "true" (show modal)

  const closeEditPlaylistModal = () => {
    setShowModal(false);
  }; // function to set modal visibility to "false" (hide modal)
  // ----Edit playlist modal functions ^^^ -------------------------------------------------------------------------------------

  // ---- Edit Playlist title form functions below --------------------------
  const [showEditPlaylistTitleForm, setShowEditPlaylistTitleForm] =
    useState(false);

  const handleEditTitleClick = () => {
    setShowEditPlaylistTitleForm(!showEditPlaylistTitleForm);
  };

  const [editedPlaylistTitle, setEditedPlaylistTitle] = useState(
    personalPlaylist.title
  );

  // ---- Edit Playlist title form functions ^^^ --------------------------
  return (
    <div className="personal-playlist-card">
      <h3>{personalPlaylist.title}</h3>
      <div>
        {personalPlaylist.tracks &&
          personalPlaylist.tracks.map((track) => (
            <div key={track.track_id}>
              <Link to={`/track/${track.track_id}`}>
                {track.track_title} by {track.track_artist}
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
                {showEditPlaylistTitleForm ? "Cancel" : "Edit Playlist Title"}
              </button>
            </h2>
            {showEditPlaylistTitleForm && (
              <form>
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
