import React from "react";

// console.log(personalPlaylists[1].tracks[0].track_title);

function PersonalPlaylistCard({ personalPlaylist }) {
  console.log(personalPlaylist.tracks?.[0]?.track_title);

  return (
    <div className="category-playlist-card">
      <span>{personalPlaylist.title}</span>
      <div>
        {personalPlaylist.tracks.map((track) => (
          <p>{track?.track_title}</p>
        ))}
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
