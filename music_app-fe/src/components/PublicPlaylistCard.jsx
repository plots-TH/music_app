import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function PublicPlaylistCard({
  publicPlaylist,
  onClonePlaylist,
  userToken,
  userId,
  justClonedId,
}) {
  // local state for reflecting up-to-date  playlist like-count
  const [likes, setLikes] = useState(publicPlaylist.total_likes);
  // local state for toggling "like" button to "unlike" button
  const [hasLiked, setHasLiked] = useState(false);

  // Fetch like-info on mount and whenever the playlist ID or user token changes
  useEffect(() => {
    const fetchLikeInfo = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BACKEND_API_BASE_URL}/personalPlaylists/${
            publicPlaylist.id
          }/like`,
          { headers: { Authorization: `Bearer ${userToken}` } }
        );
        setLikes(data.totalLikes);
        setHasLiked(data.hasLiked);
      } catch (err) {
        console.error("Error Fetching Like Info on Mount:", err);
      }
    };
    fetchLikeInfo();
  }, [publicPlaylist.id, userToken]);

  // toggle handler: if already unliked -> like, else -> unlike
  const handleToggleLike = async () => {
    try {
      if (!hasLiked) {
        const addLikeResponse = await axios.post(
          `${import.meta.env.VITE_BACKEND_API_BASE_URL}/personalPlaylists/${
            publicPlaylist.id
          }/like`,
          {},
          { headers: { Authorization: `Bearer ${userToken}` } }
        );
        // setLikes to whatever the current value is + 1
        setLikes((prevLikes) => prevLikes + 1);
        setHasLiked(true);
      } else {
        const removeLikeResponse = await axios.delete(
          `${import.meta.env.VITE_BACKEND_API_BASE_URL}/personalPlaylists/${
            publicPlaylist.id
          }/like`,
          { headers: { Authorization: `Bearer ${userToken}` } }
        );
        setLikes((prevLikes) => prevLikes - 1);
        setHasLiked(false);
      }
    } catch (err) {
      console.error("Error Toggling Like:", err);
    }
  };

  return (
    <div className="personal-playlist-card">
      <h2>{publicPlaylist.title}</h2>

      {/* render the playlist creator's username */}
      <div>
        <p>playlist created by {publicPlaylist.creator}</p>
      </div>

      {publicPlaylist.description && <p>{publicPlaylist.description}</p>}

      {/* show 1st track cover. if 0 tracks, dont render image tag */}
      {publicPlaylist.tracks.length > 0 && (
        <img
          src={publicPlaylist.cover_url}
          alt={publicPlaylist.title}
          style={{ width: 120, height: 120, objectFit: "cover" }}
        />
      )}

      {/* show "like" button and display total likes if any: */}
      <div className="like-button">
        <button
          onClick={handleToggleLike}
          aria-label={hasLiked ? "Unlike Playlist" : "Like this Playlist"}
          className="like-button"
        >
          {hasLiked ? "♥" : "♡"}
        </button>
      </div>
      {likes > 0 && <span className="playlist-likes">total likes:{likes}</span>}

      {/* add ternary operator to conditionally hide this button if playlist belongs to user already. */}
      <button onClick={() => onClonePlaylist(publicPlaylist.id, userToken)}>
        Copy & Add to your collection
      </button>

      {/* show success message only when Id's match */}
      {publicPlaylist.id === justClonedId && (
        <div className="clone-success-message">
          <p>Playlist cloned successfully!</p>
        </div>
      )}

      <div>
        {publicPlaylist.tracks &&
          publicPlaylist.tracks.map((track) => (
            <div key={track.track_id}>
              <Link to={`/track/${track.track_id}`}>
                <strong>{track.track_title}</strong> by {track.track_artist}
              </Link>
            </div>
          ))}
      </div>
    </div>
  );
}

export default PublicPlaylistCard;
