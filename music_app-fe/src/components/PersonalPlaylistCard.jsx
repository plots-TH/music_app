import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function PersonalPlaylistCard({ personalPlaylist }) {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/");
  };

  return (
    <div className="category-playlist-card">
      <h3>{personalPlaylist.title}</h3>
      <div>
        {personalPlaylist.tracks &&
          personalPlaylist.tracks.map((track) => (
            <div key={track.track_id}>
              <Link to={`/track/${track.track_id}`}>{track.track_title}</Link>
            </div>
          ))}
      </div>
      <button onClick={handleClick}>Add to this playlist</button>
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
