import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import TagCardList from "./TagCardList";

// small accessible toggle switch (Tailwind-only)
const ToggleSwitch = ({ checked, onChange, label = "Publish playlist" }) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
        checked ? "bg-green-500" : "bg-gray-300"
      }`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
};

// ---- CONFIRM DELETE MODAL COMPONENT ----
function ConfirmDeleteModal({ isOpen, onConfirm, onCancel }) {
  if (!isOpen) return null;
  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/60" />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-sm rounded-lg bg-white p-4 text-center shadow-lg">
          <p>Are you sure you want to delete this playlist?</p>
          <div className="mt-4 flex justify-center gap-3">
            <button className="rounded border px-3 py-1" onClick={onCancel}>
              Cancel
            </button>
            <button
              className="rounded border bg-red-500 px-3 py-1 text-white"
              onClick={onConfirm}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
// ---- CONFIRM DELETE MODAL COMPONENT ^^^

// ---- EDIT PERSONAL PLAYLIST MODAL COMPONENT ----
function EditPersonalPlaylistModal({ isModalOpen, onClose, children }) {
  if (!isModalOpen) return null;
  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/60" />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-lg bg-white p-4 shadow-lg">
          <div className="flex justify-end">
            <button
              className="inline-flex items-center rounded-md border bg-white px-3 py-1 text-sm shadow-sm hover:bg-gray-50"
              onClick={onClose}
            >
              Close
            </button>
          </div>
          <div className="mt-2">{children}</div>
        </div>
      </div>
    </>
  );
}
// ---- EDIT PERSONAL PLAYLIST MODAL COMPONENT ^^^

// ---- EDIT PLAYLIST TAGS MODAL ----
const EditPlaylistTagsModal = ({
  isTagModalOpen,
  onClose,
  children,
  playlistTitle,
}) => {
  if (!isTagModalOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/60" />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-72 rounded-lg border bg-slate-100 p-3 shadow-lg">
          <div className="mb-2">
            <span>
              Toggle tags for{" "}
              <span className="font-semibold">{playlistTitle}</span>
            </span>
          </div>
          <div className="max-h-64 space-y-2 overflow-y-auto">{children}</div>
          <div className="mt-2 text-right">
            <button
              className="inline-flex items-center rounded-md border bg-white px-3 py-1 text-sm shadow-sm hover:bg-gray-50"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
// ---- EDIT PLAYLIST TAGS MODAL ^^^ ----

function PersonalPlaylistCard({
  personalPlaylist,
  userToken,
  onUpdateTitle,
  onRemoveTrack,
  onDeletePlaylist,
  onEditDescription,
  onTogglePublic,
}) {
  const navigate = useNavigate();

  // ADD MUSIC navigation
  const handleClickAddTrackToPlaylist = () => {
    navigate("/", {
      state: {
        addToPlaylistId: personalPlaylist.id,
        addToPlaylistTitle: personalPlaylist.title,
      },
    });
  };

  // Tags modal state
  const [showTagModal, setShowTagModal] = useState(false);
  const [allTags, setAllTags] = useState([]);
  const [activeTags, setActiveTags] = useState([]);
  const [tagsLoading, setTagsLoading] = useState(false);

  const openEditPlaylistTagsModal = () => setShowTagModal(true);
  const closeEditPlaylistTagsModal = () => {
    setShowTagModal(false);
    setAllTags([]);
    setActiveTags([]);
  };

  useEffect(() => {
    if (!showTagModal) return;
    setTagsLoading(true);
    const loadTags = async () => {
      try {
        const [{ data: allTagsRes }, { data: activeTagsRes }] =
          await Promise.all([
            axios.get(
              `${import.meta.env.VITE_BACKEND_API_BASE_URL}/personalPlaylists/tags`,
              { headers: { Authorization: `Bearer ${userToken}` } },
            ),
            axios.get(
              `${import.meta.env.VITE_BACKEND_API_BASE_URL}/personalPlaylists/${personalPlaylist.id}/tags`,
              { headers: { Authorization: `Bearer ${userToken}` } },
            ),
          ]);
        setAllTags(allTagsRes.tags || []);
        setActiveTags(activeTagsRes.activeTagsResult || []);
      } catch (err) {
        console.error("Error loading tags for modal:", err);
      } finally {
        setTagsLoading(false);
      }
    };
    loadTags();
  }, [showTagModal, personalPlaylist.id, userToken]);

  const handleToggleTag = async (tagId) => {
    try {
      const isActive = activeTags.some((tag) => tag.tag_id === tagId);
      if (isActive) {
        await axios.delete(
          `${import.meta.env.VITE_BACKEND_API_BASE_URL}/personalPlaylists/${personalPlaylist.id}/tags`,
          {
            headers: { Authorization: `Bearer ${userToken}` },
            data: { tagId },
          },
        );
        setActiveTags((prev) => prev.filter((t) => t.tag_id !== tagId));
      } else {
        await axios.post(
          `${import.meta.env.VITE_BACKEND_API_BASE_URL}/personalPlaylists/${personalPlaylist.id}/tags`,
          { tagId },
          { headers: { Authorization: `Bearer ${userToken}` } },
        );
        setActiveTags((prev) => [...prev, { tag_id: tagId }]);
      }
    } catch (err) {
      console.error("Error deactivating/activating tag from playlist:", err);
    }
  };

  // Edit playlist modal
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const openEditPlaylistModal = () => setShowModal(true);
  const closeEditPlaylistModal = () => {
    setShowModal(false);
    setShowDeleteConfirm(false);
  };

  // Edit title form
  const [showEditPlaylistTitleForm, setShowEditPlaylistTitleForm] =
    useState(false);
  const handleEditTitleClick = () => setShowEditPlaylistTitleForm((s) => !s);
  const [editedPlaylistTitle, setEditedPlaylistTitle] = useState(
    personalPlaylist.title,
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.patch(
        `${import.meta.env.VITE_BACKEND_API_BASE_URL}/personalPlaylists/${personalPlaylist.id}`,
        { playlistTitle: editedPlaylistTitle },
        { headers: { Authorization: `Bearer ${userToken}` } },
      );
      onUpdateTitle(personalPlaylist.id, editedPlaylistTitle);
      closeEditPlaylistModal();
    } catch (err) {
      console.error("Error updating playlist title:", err);
    }
  };

  // Remove track
  const handleClickRemoveTrack = async (trackId) => {
    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_BACKEND_API_BASE_URL}/personalPlaylists/${personalPlaylist.id}/tracks/${trackId}`,
        { headers: { Authorization: `Bearer ${userToken}` } },
      );
      onRemoveTrack(personalPlaylist.id, trackId);
    } catch (err) {
      console.error("Error removing track from playlist:", err);
    }
  };

  // Delete playlist
  const handleClickDeletePlaylist = () => setShowDeleteConfirm(true);
  const handleConfirmDelete = async () => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_API_BASE_URL}/personalPlaylists/${personalPlaylist.id}`,
        { headers: { Authorization: `Bearer ${userToken}` } },
      );
      onDeletePlaylist(personalPlaylist.id);
      closeEditPlaylistModal();
    } catch (err) {
      console.error("Error deleting playlist:", err);
    }
  };

  // Description
  const [editedDescription, setEditedDescription] = useState(
    personalPlaylist.description || "",
  );
  const handleSaveDescription = async () => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_BACKEND_API_BASE_URL}/personalPlaylists/${personalPlaylist.id}/description`,
        { description: editedDescription },
        { headers: { Authorization: `Bearer ${userToken}` } },
      );
      onEditDescription(personalPlaylist.id, editedDescription);
      setShowModal(false);
    } catch (err) {
      console.error("Error saving description:", err);
    }
  };

  // Render
  return (
    <div className="relative flex h-full flex-col rounded-lg border bg-white p-4 shadow-sm dark:border-gray-500 dark:bg-gray-700">
      {/* Header */}
      <div className="mb-3 text-center">
        <h3 className="text-xl font-extrabold dark:text-gray-200">
          {personalPlaylist.title}
        </h3>
      </div>

      {/* top-right publish switch (only render if playlist has tracks) */}
      {personalPlaylist.tracks.length > 0 && (
        // fix publish toggle switch positioning at each breakpoint so it doesnt block pl title
        <div className="mb-2 flex flex-col items-center space-y-1">
          <ToggleSwitch
            checked={!!personalPlaylist.is_public}
            onChange={() => onTogglePublic(personalPlaylist.id)}
            label={`Toggle public for ${personalPlaylist.title}`}
          />
          <span className="select-none whitespace-nowrap text-xs text-gray-600 dark:text-gray-200">
            {personalPlaylist.is_public ? "Public" : "Private"}
          </span>
        </div>
      )}

      {/* Middle: image + description + track list */}
      <div className="flex-1">
        {personalPlaylist.tracks.length > 0 && personalPlaylist.cover_url && (
          <div className="mb-3 flex justify-center">
            <img
              src={personalPlaylist.cover_url}
              alt={personalPlaylist.title}
              className="mt-1 h-28 w-28 rounded object-cover ring-2 ring-orange-300 ring-offset-2"
            />
          </div>
        )}

        {/* show description inline under title if exists */}
        {personalPlaylist.description && (
          <div className="mb-3 flex justify-center">
            <span className="block max-w-[22rem] whitespace-pre-wrap break-words rounded border border-gray-200 bg-slate-100 px-3 py-1 text-center text-sm leading-normal text-gray-700 [overflow-wrap:anywhere] dark:border-gray-400 dark:bg-gray-800 dark:text-gray-400 sm:max-w-sm">
              {personalPlaylist.description}
            </span>
          </div>
        )}

        {/* list of track links */}
        <div className="max-h-48 space-y-2 overflow-y-auto rounded-lg border bg-slate-100 p-2 scrollbar-thin scrollbar-track-slate-100 hover:scrollbar-thumb-indigo-500 dark:border-gray-500 dark:bg-gray-800 dark:scrollbar-track-gray-400 dark:scrollbar-thumb-gray-600 dark:hover:scrollbar-thumb-slate-400">
          {personalPlaylist.tracks.length ? (
            personalPlaylist.tracks.map((track) => (
              <Link
                key={track.track_id}
                to={`/track/${track.track_id}`}
                className="block rounded border bg-white p-2 text-center text-sm hover:bg-gray-50 dark:border-slate-500 dark:bg-gray-600 dark:hover:bg-gray-500"
                aria-label={`${track.track_title} by ${track.track_artist}`}
              >
                <span className="block font-semibold dark:text-slate-300">
                  {track.track_title}
                </span>
                <span className="block text-gray-600 dark:text-slate-300">
                  by {track.track_artist}
                </span>
              </Link>
            ))
          ) : (
            <span className="block text-center text-sm text-gray-500">
              Add music to this playlist!
            </span>
          )}
        </div>
      </div>

      {/* Footer: action buttons (Add/Manage/Edit) */}
      <div className="mt-4">
        <div className="flex flex-wrap justify-center gap-2">
          <button
            className="inline-flex items-center rounded-md border bg-white px-3 py-2 text-sm shadow-sm hover:bg-gray-50 hover:shadow-md dark:bg-gray-400 dark:hover:bg-gray-300"
            onClick={handleClickAddTrackToPlaylist}
          >
            Add music
          </button>

          <button
            className="inline-flex items-center rounded-md border bg-white px-3 py-2 text-sm shadow-sm hover:bg-gray-50 hover:shadow-md dark:bg-gray-400 dark:hover:bg-gray-300"
            onClick={openEditPlaylistTagsModal}
          >
            Manage Tags
          </button>

          <button
            className="inline-flex items-center rounded-md border bg-white px-3 py-2 text-sm shadow-sm hover:bg-gray-50 hover:shadow-md dark:bg-gray-400 dark:hover:bg-gray-300"
            onClick={openEditPlaylistModal}
          >
            Edit Playlist
          </button>
        </div>
      </div>

      {/* Tags modal */}
      <EditPlaylistTagsModal
        isTagModalOpen={showTagModal}
        onClose={closeEditPlaylistTagsModal}
        playlistTitle={personalPlaylist.title}
      >
        {tagsLoading ? (
          <p>Loading tags...</p>
        ) : (
          <TagCardList
            key={personalPlaylist.id}
            allTags={allTags}
            activeTags={activeTags}
            onToggleTag={handleToggleTag}
          />
        )}
      </EditPlaylistTagsModal>

      {/* Edit playlist modal */}
      <EditPersonalPlaylistModal
        isModalOpen={showModal}
        onClose={closeEditPlaylistModal}
      >
        <div>
          <h2 className="mb-2">
            Playlist Title: {personalPlaylist.title}
            <button
              className="ml-3 inline-flex items-center rounded-md border bg-white px-3 py-1 text-sm shadow-sm hover:bg-gray-50"
              onClick={handleEditTitleClick}
            >
              {showEditPlaylistTitleForm ? "Cancel" : "Edit Title"}
            </button>
          </h2>

          {showEditPlaylistTitleForm && (
            <form onSubmit={handleSubmit} className="mb-3">
              <label className="mb-2 block">
                Playlist Title:
                <input
                  type="text"
                  className="mt-1 block w-full rounded border px-2 py-1"
                  value={editedPlaylistTitle}
                  onChange={(e) => setEditedPlaylistTitle(e.target.value)}
                />
              </label>
              <button type="submit" className="rounded border px-3 py-1">
                Submit
              </button>
            </form>
          )}

          <h3 className="mt-2">Playlist Description:</h3>
          <textarea
            rows={3}
            className="mb-2 block w-full rounded border px-2 py-1"
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
          />

          <div className="flex gap-2">
            <button
              className="inline-flex items-center rounded-md border bg-white px-3 py-2 text-sm shadow-sm hover:bg-gray-50"
              onClick={handleSaveDescription}
            >
              Save Description
            </button>
            <button
              className="inline-flex items-center rounded-md border bg-red-50 px-3 py-2 text-sm shadow-sm hover:bg-red-100"
              onClick={handleClickDeletePlaylist}
            >
              Delete Playlist
            </button>
          </div>

          <h3 className="mt-4">
            {personalPlaylist.tracks.length ? "Playlist Tracks:" : ""}
          </h3>
          <div style={{ textAlign: "left" }}>
            {personalPlaylist.tracks.map((track) => (
              <li key={track.track_id} className="track-non-link py-1">
                {track.track_title} by {track.track_artist}
                <button
                  className="ml-3 text-sm text-red-600"
                  onClick={() => handleClickRemoveTrack(track.track_id)}
                >
                  remove
                </button>
              </li>
            ))}
          </div>
        </div>
      </EditPersonalPlaylistModal>

      {/* Confirm delete modal nested */}
      <ConfirmDeleteModal
        isOpen={showDeleteConfirm}
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </div>
  );
}

export default PersonalPlaylistCard;
