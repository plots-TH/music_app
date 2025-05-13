import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

// ----CONFIRM DELETE MODAL COMPONENT--------------------------------------
function ConfirmDeleteModal({ isOpen, onConfirm, onCancel }) {
  if (!isOpen) return null;
  return (
    <div
      className="modal-overlay"
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
        zIndex: 1100,
      }}
    >
      <div
        className="modal"
        style={{
          background: "#fff",
          padding: "1rem",
          borderRadius: "4px",
          width: "80%",
          maxWidth: "350px",
          textAlign: "center",
        }}
      >
        <p>Are you sure you want to delete this playlist?</p>
        <div style={{ marginTop: "1rem" }}>
          <button onClick={onCancel}>Cancel</button>
          <button onClick={onConfirm} style={{ marginRight: "0.5rem" }}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
// ----CONFIRM DELETE MODAL COMPONENT^^^^-----------------------------------------------------------------------------

// ----EDIT PERSONAL PLAYLIST MODAL COMPONENT BELOW--------------------------------------
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
// ----EDIT PERSONAL PLAYLIST MODAL COMPONENT^^^^-----------------------------------------------------------------------------

function PersonalPlaylistCard({
  personalPlaylist,
  userToken,
  onUpdateTitle,
  onRemoveTrack,
  onDeletePlaylist,
  onEditDescription,
  onTogglePublic,
}) {
  // ----"ADD TO THIS PLAYLIST BUTTON" FUNCTIONS BELOW----------------------------------------------------------------------------
  const navigate = useNavigate(); // declare const navigate to use useNavigate for the "Add to this playlist" button
  const handleClickAddTrackToPlaylist = () => {
    // function to redirect to the "Explore all music" page - used inside onClick for the "Add to this playlist" button
    navigate("/", {
      state: {
        addToPlaylistId: personalPlaylist.id,
        addToPlaylistTitle: personalPlaylist.title,
      },
    }); // pass in the selected playlist's ID using React Router State
  };
  // ----"ADD TO THIS PLAYLIST BUTTON" FUNCTIONS^^^----------------------------------------------------------------------------

  // ----EDIT PLAYLIST MODAL FUNCTIONS BELOW---------------------------------------------------------------------------------
  const [showModal, setShowModal] = useState(false); // use useState hook to manage modal visibility
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); // manage delete confirm modal

  const openEditPlaylistModal = () => {
    setShowModal(true);
  }; // function to set modal visibility to "true" (show modal)

  const closeEditPlaylistModal = () => {
    setShowModal(false);
    setShowDeleteConfirm(false);
  }; // function to set modal visibility to "false" (hide modal)
  // ----EDIT PLAYLIST MODAL FUNCTIONS ^^^ -------------------------------------------------------------------------------------

  // ---- EDIT PLAYLIST TITLE FORM FUNCTIONS BELOW --------------------------
  const [showEditPlaylistTitleForm, setShowEditPlaylistTitleForm] =
    useState(false); // the "edit playlist title" form starts off as hidden aka (false)

  const handleEditTitleClick = () => {
    setShowEditPlaylistTitleForm(!showEditPlaylistTitleForm);
  }; // toggle edit title form

  const [editedPlaylistTitle, setEditedPlaylistTitle] = useState(
    personalPlaylist.title
  ); // store the newly edited playlist title

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(editedPlaylistTitle);

    try {
      await axios.patch(
        `${import.meta.env.VITE_BACKEND_API_BASE_URL}/personalPlaylists/${
          personalPlaylist.id
        }`,
        { playlistTitle: editedPlaylistTitle }, // matches what server expects
        { headers: { Authorization: `Bearer ${userToken}` } }
      );
      onUpdateTitle(personalPlaylist.id, editedPlaylistTitle); // optimistic UI
      closeEditPlaylistModal();
    } catch (err) {
      console.error("Error updating playlist title:", err);
    }
  };
  // ---- EDIT PLAYLIST TITLE FORM FUNCTIONS ^^^ --------------------------

  // ---- EVENT HANDLER: remove track from playlist button ------------------------------------------------------------------
  const handleClickRemoveTrack = async (trackId) => {
    console.log(personalPlaylist.title);
    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_BACKEND_API_BASE_URL}/personalPlaylists/${
          personalPlaylist.id
        }/tracks/${trackId}`,
        { headers: { Authorization: `Bearer ${userToken}` } }
      );
      console.log("DELETE response:", res.data); // log response
      console.log("Deleted track record:", res.data.deletedTrack);
      onRemoveTrack(personalPlaylist.id, trackId); // optimistic UI
    } catch (err) {
      console.error("Error removing track from playlist:", err);
    }
  };
  // ---- EVENT HANDLER ^^^ --------------------------------------------------------------------------------------------------

  // ---- DELETE PLAYLIST FUNCTIONS BELOW ------------------
  const handleClickDeletePlaylist = () => {
    setShowDeleteConfirm(true); // show confirmation
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_API_BASE_URL}/personalPlaylists/${
          personalPlaylist.id
        }`,
        { headers: { Authorization: `Bearer ${userToken}` } }
      );
      onDeletePlaylist(personalPlaylist.id); // optimistic UI
      closeEditPlaylistModal();
    } catch (err) {
      console.error("Error deleting playlist:", err);
    }
  };
  // ---- DELETE PLAYLIST FUNCTIONS ^^^ ------------------

  const [editedDescription, setEditedDescription] = useState(
    personalPlaylist.description || ""
  ); // store the newly edited playlist description - defaulted to empty string ""

  const handleSaveDescription = async () => {
    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_BACKEND_API_BASE_URL}/personalPlaylists/${
          personalPlaylist.id
        }/description`,
        { description: editedDescription }, // matches what server expects
        { headers: { Authorization: `Bearer ${userToken}` } }
      );
      onEditDescription(personalPlaylist.id, editedDescription);
      setShowModal(false);
    } catch (err) {
      console.error("Error saving description:", err);
    }
  };

  console.log(
    `Card render for ${personalPlaylist.id}, is_public =`,
    personalPlaylist.is_public
  );

  return (
    <div className="personal-playlist-card">
      <h2>{personalPlaylist.title}</h2>

      {/* render "This Playlist is Publicly Visible" when newValue of isPublic (from handleTogglePublic in Account.jsx ) = true */}
      {personalPlaylist.is_public && <p>This Playlist is Publicly Viewable</p>}

      {/* show 1st track cover. if 0 tracks, dont render image tag */}
      {personalPlaylist.tracks.length > 0 && (
        <img
          src={personalPlaylist.cover_url}
          alt={personalPlaylist.title}
          style={{ width: 120, height: 120, objectFit: "cover" }}
        />
      )}

      {personalPlaylist.description && (
        <p>{personalPlaylist.description}</p> // && shortcut to conditionally render playlist description. empty strings "" are falsey, so nothing renders
      )}

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
        <button onClick={handleClickAddTrackToPlaylist}>
          Add to this Playlist
        </button>
        <button onClick={openEditPlaylistModal}>Edit Playlist</button>
        <button onClick={() => onTogglePublic(personalPlaylist.id)}>
          {personalPlaylist.is_public ? "Set to Private" : "Publish Playlist"}
        </button>

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

            <h3>Playlist Description:</h3>
            <textarea
              rows={3}
              style={{ width: "100%", marginBottom: "0.5rem" }}
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
            ></textarea>
            <button onClick={handleSaveDescription}>Save Description</button>

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

            {/* Confirmation nested modal */}
            <ConfirmDeleteModal
              isOpen={showDeleteConfirm}
              onConfirm={handleConfirmDelete}
              onCancel={() => setShowDeleteConfirm(false)}
            />
          </div>
          <p>This is the modal content. add buttons later</p>
          <button onClick={handleClickDeletePlaylist} style={{ color: "red" }}>
            Delete Playlist
          </button>
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
